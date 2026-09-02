/**
 * Extracts Open Graph (og:image), Twitter Card, product images, or meta icons from external URLs.
 * Uses social crawler user agents (Twitterbot / WhatsApp) first so WordPress, Instagram,
 * and other platforms deliver Open Graph meta tags without bot challenges, with standard
 * browser fallback for brand/e-commerce sites.
 * Cached with Next.js fetch cache (revalidate) for fast and reliable SSR.
 */
export async function getOpenGraphImage(url?: string | null): Promise<string | null> {
  if (!url || typeof url !== "string") return null;

  try {
    const trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return null;
    }

    // Fast-path: if the URL already directly points to an image file
    const urlWithoutQuery = trimmed.split("?")[0].toLowerCase();
    if (/\.(?:png|jpe?g|webp|gif|svg)$/i.test(urlWithoutQuery)) {
      return cleanAndResolveUrl(trimmed, trimmed);
    }

    // Try 1: Social bot User-Agent (bypasses challenges on Instagram, WordPress, etc.)
    let html = await fetchHtmlWithUa(trimmed, "Twitterbot/1.0");
    if (html?.startsWith("__DIRECT_IMAGE__:")) {
      return cleanAndResolveUrl(html.replace("__DIRECT_IMAGE__:", ""), trimmed);
    }
    let image = extractImageFromHtml(html, trimmed);
    if (image) return image;

    // Try 2: Standard desktop browser User-Agent (for brand & e-commerce stores that filter bots)
    html = await fetchHtmlWithUa(
      trimmed,
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    if (html?.startsWith("__DIRECT_IMAGE__:")) {
      return cleanAndResolveUrl(html.replace("__DIRECT_IMAGE__:", ""), trimmed);
    }
    image = extractImageFromHtml(html, trimmed);
    if (image) return image;

    return null;
  } catch (err) {
    // Fail silently in production to avoid crashing page rendering
    if (process.env.NODE_ENV === "development") {
      console.warn(`[getOpenGraphImage] Non-fatal error resolving meta image for ${url}:`, err);
    }
    return null;
  }
}

async function fetchHtmlWithUa(url: string, userAgent: string): Promise<string | null> {
  const controller = new AbortController();
  // 4 second timeout per attempt to protect SSR response times
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache response for 24 hours
      headers: {
        "User-Agent": userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8,*/*;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) return null;

    const contentType = (res.headers.get("content-type") || "").toLowerCase();

    // If the server directly returned an image
    if (contentType.includes("image/")) {
      return `__DIRECT_IMAGE__:${res.url || url}`;
    }

    // Skip non-HTML / non-text binaries (PDFs, large media streams, etc.)
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml") &&
      !contentType.includes("text/xml") &&
      !contentType.includes("application/xml")
    ) {
      return null;
    }

    // Guard against excessively large HTML payloads (> 3MB)
    const contentLength = Number(res.headers.get("content-length"));
    if (contentLength && contentLength > 3 * 1024 * 1024) {
      return null;
    }

    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractImageFromHtml(html: string | null, baseUrl: string): string | null {
  if (!html || typeof html !== "string") return null;

  // 1. Scan <meta> tags in the HTML
  const metaRegex = /<meta\s+([^>]+)>/gi;
  let match: RegExpExecArray | null;
  let ogImage: string | null = null;
  let twitterImage: string | null = null;
  let itempropImage: string | null = null;
  let otherImage: string | null = null;

  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = match[1];

    const contentMatch = attrs.match(/content=["']([^"']+)["']/i);
    const content = contentMatch?.[1]?.trim();
    if (!content) continue;

    // Highest priority: og:image or og:image:url or og:image:secure_url
    if (/(?:property|name)=["']og:image(?::url|:secure_url)?["']/i.test(attrs) && !ogImage) {
      ogImage = content;
    }

    // Twitter image
    if (/(?:property|name)=["']twitter:image(?::src)?["']/i.test(attrs) && !twitterImage) {
      twitterImage = content;
    }

    // Itemprop image (common on Amazon, Barnes & Noble, e-commerce)
    if (/(?:itemprop|name)=["']image["']/i.test(attrs) && !itempropImage) {
      itempropImage = content;
    }

    // Other product / media images
    if (
      /(?:property|name)=["'](?:product:image|thumbnail|jetpack-featured-media)["']/i.test(attrs) &&
      !otherImage
    ) {
      otherImage = content;
    }
  }

  // Check candidates in priority order
  const candidates = [ogImage, twitterImage, itempropImage, otherImage].filter(Boolean) as string[];
  for (const candidate of candidates) {
    const resolved = cleanAndResolveUrl(candidate, baseUrl);
    if (resolved) return resolved;
  }

  // 2. <link rel="image_src" ...> or <link itemprop="image" ...> or brand apple-touch-icon
  const linkMatches = [
    html.match(/<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i),
    html.match(/<link[^>]*itemprop=["']image["'][^>]*href=["']([^"']+)["']/i),
    html.match(/<link[^>]*rel=["'](?:apple-touch-icon|icon)["'][^>]*href=["']([^"']+)["']/i),
  ];

  for (const lm of linkMatches) {
    if (lm?.[1]) {
      const resolved = cleanAndResolveUrl(lm[1], baseUrl);
      if (resolved) return resolved;
    }
  }

  // 3. JSON-LD structured data (Product / Article schema)
  try {
    const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let jm: RegExpExecArray | null;
    while ((jm = jsonLdRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(jm[1]);
        const img =
          parsed.image ||
          parsed.thumbnailUrl ||
          parsed["@graph"]?.find?.((item: any) => item.image)?.image;

        if (typeof img === "string") {
          const resolved = cleanAndResolveUrl(img, baseUrl);
          if (resolved) return resolved;
        }
        if (Array.isArray(img) && typeof img[0] === "string") {
          const resolved = cleanAndResolveUrl(img[0], baseUrl);
          if (resolved) return resolved;
        }
        if (img && typeof img.url === "string") {
          const resolved = cleanAndResolveUrl(img.url, baseUrl);
          if (resolved) return resolved;
        }
      } catch {}
    }
  } catch {}

  return null;
}

function cleanAndResolveUrl(rawUrl: string, baseUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;

  try {
    const unescaped = rawUrl
      .replace(/&amp;/g, "&")
      .replace(/&#038;/g, "&")
      .replace(/&#38;/g, "&")
      .trim();

    if (
      !unescaped ||
      unescaped.startsWith("javascript:") ||
      unescaped.startsWith("data:") ||
      unescaped.startsWith("blob:")
    ) {
      return null;
    }

    const resolved = new URL(unescaped, baseUrl).href;
    if (!resolved.startsWith("http://") && !resolved.startsWith("https://")) {
      return null;
    }

    return resolved;
  } catch {
    return null;
  }
}

// ─── Section Enrichment Helpers ─────────────────────────────────────────────

export async function enrichWritingPiecesWithMetaImages<
  T extends { coverImage?: any; externalUrl?: string | null; metaImage?: string | null }
>(pieces: T[]): Promise<(T & { metaImage?: string | null })[]> {
  if (!Array.isArray(pieces) || pieces.length === 0) return [];

  return Promise.all(
    pieces.map(async (piece) => {
      try {
        if (piece.coverImage) return piece;

        if (piece.externalUrl) {
          const metaImage = await getOpenGraphImage(piece.externalUrl);
          return {
            ...piece,
            metaImage: metaImage || null,
          };
        }

        return piece;
      } catch {
        return piece;
      }
    })
  );
}

export async function enrichPostsWithMetaImages<
  T extends { thumbnail?: any; embedUrl?: string | null; metaImage?: string | null }
>(posts: T[]): Promise<(T & { metaImage?: string | null })[]> {
  if (!Array.isArray(posts) || posts.length === 0) return [];

  return Promise.all(
    posts.map(async (post) => {
      try {
        if (post.thumbnail) return post;

        if (post.embedUrl) {
          const metaImage = await getOpenGraphImage(post.embedUrl);
          return {
            ...post,
            metaImage: metaImage || null,
          };
        }

        return post;
      } catch {
        return post;
      }
    })
  );
}

export async function enrichBrandCollabsWithMetaImages<
  T extends { brandLogo?: any; brandUrl?: string | null; metaImage?: string | null }
>(collabs: T[]): Promise<(T & { metaImage?: string | null })[]> {
  if (!Array.isArray(collabs) || collabs.length === 0) return [];

  return Promise.all(
    collabs.map(async (collab) => {
      try {
        if (collab.brandLogo) return collab;

        if (collab.brandUrl) {
          const metaImage = await getOpenGraphImage(collab.brandUrl);
          return {
            ...collab,
            metaImage: metaImage || null,
          };
        }

        return collab;
      } catch {
        return collab;
      }
    })
  );
}

export async function enrichBookReviewsWithMetaImages<
  T extends { coverImage?: any; affiliateLink?: string | null; metaImage?: string | null }
>(reviews: T[]): Promise<(T & { metaImage?: string | null })[]> {
  if (!Array.isArray(reviews) || reviews.length === 0) return [];

  return Promise.all(
    reviews.map(async (review) => {
      try {
        if (review.coverImage) return review;

        if (review.affiliateLink) {
          const metaImage = await getOpenGraphImage(review.affiliateLink);
          return {
            ...review,
            metaImage: metaImage || null,
          };
        }

        return review;
      } catch {
        return review;
      }
    })
  );
}

export async function enrichShelfPicksWithMetaImages<
  T extends { image?: any; buyLink?: string | null; metaImage?: string | null }
>(picks: T[]): Promise<(T & { metaImage?: string | null })[]> {
  if (!Array.isArray(picks) || picks.length === 0) return [];

  return Promise.all(
    picks.map(async (pick) => {
      try {
        if (pick.image) return pick;

        if (pick.buyLink) {
          const metaImage = await getOpenGraphImage(pick.buyLink);
          return {
            ...pick,
            metaImage: metaImage || null,
          };
        }

        return pick;
      } catch {
        return pick;
      }
    })
  );
}
