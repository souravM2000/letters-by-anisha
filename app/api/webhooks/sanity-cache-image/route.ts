import { NextResponse } from 'next/server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

import { sanityWriteClient } from '@/sanity/lib/writeClient'
import { extractImageFromHtml, cleanAndResolveUrl } from '@/lib/ogImage'

// ── Types ────────────────────────────────────────────────────────────────────

interface WebhookPayload {
  _id: string
  _type: string
  // post
  embedUrl?: string | null
  thumbnail?: { asset?: { _ref?: string } } | null
  // writingPiece & bookReview
  externalUrl?: string | null
  coverImage?: { asset?: { _ref?: string } } | null
  // brandCollab
  brandUrl?: string | null
  collabUrl?: string | null
  projectUrl?: string | null
  brandLogo?: { asset?: { _ref?: string } } | null
  // shelfPick
  buyLink?: string | null
  relatedVideoUrl?: string | null
  image?: { asset?: { _ref?: string } } | null
  // bookReview
  affiliateLink?: string | null
  associatedReelUrl?: string | null
}

interface TypeConfig {
  label: string
  imageField: string
  filePrefix: string
  getUrl: (payload: WebhookPayload) => string | null | undefined
  hasImage: (payload: WebhookPayload) => boolean
}

/**
 * Mapping of Sanity document `_type` to its URL resolver and image field config.
 */
const TYPE_CONFIGS: Record<string, TypeConfig> = {
  post: {
    label: 'Post',
    imageField: 'thumbnail',
    filePrefix: 'thumbnail-post',
    getUrl: (p) => p.embedUrl,
    hasImage: (p) => Boolean(p.thumbnail?.asset?._ref),
  },
  writingPiece: {
    label: 'Writing Piece',
    imageField: 'coverImage',
    filePrefix: 'cover-writing',
    getUrl: (p) => p.externalUrl,
    hasImage: (p) => Boolean(p.coverImage?.asset?._ref),
  },
  brandCollab: {
    label: 'Brand Collaboration',
    imageField: 'brandLogo',
    filePrefix: 'logo-brand',
    getUrl: (p) => p.brandUrl || p.collabUrl || p.projectUrl,
    hasImage: (p) => Boolean(p.brandLogo?.asset?._ref),
  },
  shelfPick: {
    label: 'Shop My Pick',
    imageField: 'image',
    filePrefix: 'image-shelf',
    getUrl: (p) => p.buyLink || p.relatedVideoUrl,
    hasImage: (p) => Boolean(p.image?.asset?._ref),
  },
  bookReview: {
    label: 'Book Review',
    imageField: 'coverImage',
    filePrefix: 'cover-review',
    getUrl: (p) => p.affiliateLink || p.associatedReelUrl,
    hasImage: (p) => Boolean(p.coverImage?.asset?._ref),
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Crawls a single URL with a specific User-Agent and extracts an image URL.
 */
async function crawlUrlWithUa(
  url: string,
  userAgent: string,
  signal: AbortSignal
): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal,
      headers: {
        'User-Agent': userAgent,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8,*/*;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    })

    if (!res.ok) return null

    const contentType = res.headers.get('content-type') ?? ''

    // If the server directly returned an image
    if (contentType.includes('image/')) return res.url || url

    if (
      !contentType.includes('text/html') &&
      !contentType.includes('application/xhtml') &&
      !contentType.includes('text/xml') &&
      !contentType.includes('application/xml')
    ) {
      return null
    }

    const html = await res.text()
    return extractImageFromHtml(html, url)
  } catch {
    return null
  }
}

/**
 * Fetches the og:image / product image / brand icon from `url`.
 * 1. Fast-paths direct image URLs (.jpg, .png, etc.)
 * 2. Attempts crawl with `facebookexternalhit` (bypasses Instagram/WordPress challenges)
 * 3. Falls back to standard desktop browser UA (for brand & e-commerce sites that block social bots)
 * Uses a 30-second AbortController timeout.
 */
async function fetchOgImageUrl(url: string): Promise<string | null> {
  const trimmed = url.trim()
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return null
  }

  // Fast-path: directly points to an image file
  const urlWithoutQuery = trimmed.split('?')[0].toLowerCase()
  if (/\.(?:png|jpe?g|webp|gif|svg)$/i.test(urlWithoutQuery)) {
    return cleanAndResolveUrl(trimmed, trimmed)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  try {
    // Try 1: facebookexternalhit (standard social crawler)
    let imageUrl = await crawlUrlWithUa(
      trimmed,
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      controller.signal
    )
    if (imageUrl) return imageUrl

    // Try 2: Desktop browser UA fallback (brand stores, Amazon, Shopify, etc.)
    imageUrl = await crawlUrlWithUa(
      trimmed,
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      controller.signal
    )
    if (imageUrl) return imageUrl

    return null
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      console.error(`[sanity-cache-image] Crawl timed out (30s) for ${trimmed}`)
    } else {
      console.error(
        `[sanity-cache-image] Crawl error for ${trimmed}:`,
        err instanceof Error ? err.message : err
      )
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Downloads the raw image bytes from `imageUrl`.
 * Tries a standard desktop browser User-Agent first (avoids 403s on WordPress/e-commerce CDNs),
 * falling back to a social crawler UA if needed.
 * Uses a 30-second AbortController timeout.
 * Returns { buffer, contentType } or null on failure.
 */
async function downloadImageBuffer(
  imageUrl: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000)

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  ]

  try {
    for (const userAgent of userAgents) {
      try {
        const res = await fetch(imageUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': userAgent,
            Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          },
          cache: 'no-store',
        })

        if (res.ok) {
          const contentType =
            res.headers.get('content-type')?.split(';')[0]?.trim() ?? 'image/jpeg'
          const arrayBuffer = await res.arrayBuffer()
          return { buffer: Buffer.from(arrayBuffer), contentType }
        }

        console.warn(
          `[sanity-cache-image] Image download returned ${res.status} with UA "${userAgent.slice(0, 30)}..." for ${imageUrl}`
        )
      } catch (innerErr) {
        if ((innerErr as Error).name === 'AbortError') throw innerErr
      }
    }

    console.error(
      `[sanity-cache-image] Image download failed after trying all UAs for ${imageUrl}`
    )
    return null
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      console.error(
        `[sanity-cache-image] Image download timed out (30s) for ${imageUrl}`
      )
    } else {
      console.error(
        `[sanity-cache-image] Image download error:`,
        err instanceof Error ? err.message : err
      )
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }
}

// ── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // ─── 1. Validate env ────────────────────────────────────────────────────────
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[sanity-cache-image] SANITY_WEBHOOK_SECRET is not set.')
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    )
  }

  // ─── 2. Verify webhook signature ────────────────────────────────────────────
  const body = await req.text()
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? ''

  const valid = await isValidSignature(body, signature, secret)
  if (!valid) {
    console.warn('[sanity-cache-image] Invalid webhook signature.')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // ─── 3. Parse payload ───────────────────────────────────────────────────────
  let payload: WebhookPayload
  try {
    payload = JSON.parse(body) as WebhookPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const { _id: docId, _type: docType } = payload

  // ─── 4. Guard: ignore drafts ────────────────────────────────────────────────
  if (docId.startsWith('drafts.')) {
    return NextResponse.json(
      { skipped: true, reason: 'Draft document' },
      { status: 200 }
    )
  }

  // ─── 5. Guard: check supported document type ────────────────────────────────
  const config = TYPE_CONFIGS[docType]
  if (!config) {
    return NextResponse.json(
      { skipped: true, reason: `Unsupported type: ${docType}` },
      { status: 200 }
    )
  }

  // ─── 6. Guard: loop prevention — image already exists ───────────────────────
  if (config.hasImage(payload)) {
    return NextResponse.json(
      { skipped: true, reason: `${config.imageField} already set` },
      { status: 200 }
    )
  }

  // ─── 7. Guard: target URL must be present ───────────────────────────────────
  const targetUrl = config.getUrl(payload)
  if (!targetUrl) {
    return NextResponse.json(
      { skipped: true, reason: `No target URL found for ${docType}` },
      { status: 200 }
    )
  }

  // ─── 8. Crawl og:image from target URL ──────────────────────────────────────
  const ogImageUrl = await fetchOgImageUrl(targetUrl)
  if (!ogImageUrl) {
    console.warn(
      `[sanity-cache-image] Could not extract og:image from ${targetUrl} for ${docType} (${docId})`
    )
    return NextResponse.json(
      { error: `Failed to extract og:image from URL for ${docType}` },
      { status: 502 }
    )
  }

  // ─── 9. Download image buffer ───────────────────────────────────────────────
  const imageData = await downloadImageBuffer(ogImageUrl)
  if (!imageData) {
    return NextResponse.json(
      { error: 'Failed to download og:image' },
      { status: 502 }
    )
  }

  const { buffer: imageBuffer, contentType } = imageData

  // Derive file extension from content-type
  const extMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
  }
  const ext = extMap[contentType] ?? 'jpg'
  const filename = `${config.filePrefix}-${docId.replace(/[^a-zA-Z0-9-]/g, '_')}.${ext}`

  // ─── 10. Upload to Sanity Asset CDN ─────────────────────────────────────────
  let uploadedAsset: { _id: string }
  try {
    uploadedAsset = await sanityWriteClient.assets.upload(
      'image',
      imageBuffer,
      { filename, contentType }
    )
  } catch (err) {
    console.error(
      `[sanity-cache-image] Failed to upload image to Sanity for ${docId}:`,
      err instanceof Error ? err.message : err
    )
    return NextResponse.json(
      { error: 'Failed to upload image to Sanity' },
      { status: 500 }
    )
  }

  // ─── 11. Patch the document with the new image reference ───────────────────
  try {
    await sanityWriteClient
      .patch(docId)
      .set({
        [config.imageField]: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedAsset._id,
          },
        },
      })
      .commit()

    console.log(
      `[sanity-cache-image] ✓ Cached image for "${docType}" (${docId}) into "${config.imageField}" → ${uploadedAsset._id}`
    )
  } catch (err) {
    console.error(
      `[sanity-cache-image] Failed to patch document ${docId}:`,
      err instanceof Error ? err.message : err
    )
    return NextResponse.json(
      { error: 'Failed to patch document' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      docId,
      docType,
      field: config.imageField,
      assetId: uploadedAsset._id,
    },
    { status: 200 }
  )
}

