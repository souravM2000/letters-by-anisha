/**
 * Extracts Open Graph (og:image) or Twitter Card meta images from external URLs.
 * Uses social crawler user agents (Twitterbot / WhatsApp / Slack) so WordPress and
 * other platforms deliver Open Graph meta tags without JS challenges.
 * Cached with Next.js fetch cache (revalidate) for fast and reliable SSR.
 */
export async function getOpenGraphImage(url?: string | null): Promise<string | null> {
  if (!url || typeof url !== "string") return null;

  try {
    const trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(trimmed, {
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache response for 24 hours
      headers: {
        "User-Agent": "Twitterbot/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const html = await res.text();

    let ogImage: string | null = null;
    let twitterImage: string | null = null;
    let jetpackImage: string | null = null;

    // Scan all <meta> tags in the HTML
    const metaRegex = /<meta\s+([^>]+)>/gi;
    let match: RegExpExecArray | null;

    while ((match = metaRegex.exec(html)) !== null) {
      const attrs = match[1];

      // Extract content attribute value
      const contentMatch = attrs.match(/content=["']([^"']+)["']/i);
      const content = contentMatch?.[1]?.trim();
      if (!content) continue;

      // 1. og:image or og:image:url or og:image:secure_url (ignore width, height, alt, etc.)
      if (/(?:property|name)=["']og:image(?::url|:secure_url)?["']/i.test(attrs)) {
        ogImage = content;
        break; // Priority #1
      }

      // 2. twitter:image or twitter:image:src
      if (/(?:property|name)=["']twitter:image(?::src)?["']/i.test(attrs) && !twitterImage) {
        twitterImage = content;
      }

      // 3. jetpack-featured-media
      if (/(?:property|name)=["']jetpack-featured-media["']/i.test(attrs) && !jetpackImage) {
        jetpackImage = content;
      }
    }

    const candidate = ogImage || twitterImage || jetpackImage;
    if (candidate) {
      return cleanAndResolveUrl(candidate, trimmed);
    }

    // Fallback: <link rel="image_src" href="...">
    const linkMatch = html.match(/<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i);
    if (linkMatch?.[1]) {
      return cleanAndResolveUrl(linkMatch[1], trimmed);
    }

    return null;
  } catch (err) {
    console.error("Error in getOpenGraphImage:", err);
    return null;
  }
}

function cleanAndResolveUrl(rawUrl: string, baseUrl: string): string {
  try {
    const unescaped = rawUrl.replace(/&amp;/g, "&").replace(/&#038;/g, "&").trim();
    return new URL(unescaped, baseUrl).href;
  } catch {
    return rawUrl;
  }
}

export async function enrichWritingPiecesWithMetaImages<
  T extends { coverImage?: any; externalUrl?: string | null; metaImage?: string | null }
>(pieces: T[]): Promise<(T & { metaImage?: string | null })[]> {
  if (!pieces || pieces.length === 0) return [];

  return Promise.all(
    pieces.map(async (piece) => {
      // If Sanity coverImage is already uploaded, use it directly
      if (piece.coverImage) {
        return piece;
      }

      // If no coverImage, fetch the meta og:image from the externalUrl
      if (piece.externalUrl) {
        const metaImage = await getOpenGraphImage(piece.externalUrl);
        return {
          ...piece,
          metaImage,
        };
      }

      return piece;
    })
  );
}
