import { defineQuery } from "next-sanity";

// ─── Site Settings (reused by Hero, Footer, Metrics) ────────────────────────
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    name,
    tagline,
    bio,
    profileImage,
    socialHandles,
    metrics,
    "resumeUrl": resumeFile.asset->url,
    seo
  }
`);

// ─── Metrics (subset of siteSettings) ───────────────────────────────────────
export const metricsQuery = defineQuery(`
  *[_type == "siteSettings"][0].metrics {
    followers,
    avgEngagementRate,
    avgReach,
    monthlyViews,
    lastUpdated
  }
`);

// ─── Featured Posts / Reels ─────────────────────────────────────────────────
// Prefer featured, fall back to most recent
export const featuredPostsQuery = defineQuery(`
  *[_type == "post" && featured == true] | order(publishedDate desc) [0...6] {
    _id,
    title,
    platform,
    embedUrl,
    thumbnail,
    caption,
    publishedDate,
    featured
  }
`);

export const recentPostsQuery = defineQuery(`
  *[_type == "post"] | order(publishedDate desc) [0...6] {
    _id,
    title,
    platform,
    embedUrl,
    thumbnail,
    caption,
    publishedDate,
    featured
  }
`);

// ─── Book Reviews ───────────────────────────────────────────────────────────
export const bookReviewsQuery = defineQuery(`
  *[_type == "bookReview"] | order(publishedDate desc) {
    _id,
    bookTitle,
    author,
    slug,
    coverImage,
    rating,
    genre,
    reviewExcerpt,
    affiliateLink,
    associatedReelUrl,
    publishedDate,
    featured
  }
`);

// ─── Brand Collaborations ───────────────────────────────────────────────────
export const brandCollabsQuery = defineQuery(`
  *[_type == "brandCollab"] | order(date desc) {
    _id,
    brandName,
    brandLogo,
    collabType,
    description,
    testimonialQuote,
    testimonialAuthor,
    resultsOrMetrics,
    projectUrl,
    date
  }
`);

// ─── Writing Pieces ─────────────────────────────────────────────────────────
export const writingPiecesQuery = defineQuery(`
  *[_type == "writingPiece"] | order(publishedDate desc) {
    _id,
    title,
    category,
    externalUrl,
    excerpt,
    coverImage,
    publishedDate,
    featured
  }
`);

// ─── About (singleton) ─────────────────────────────────────────────────────
export const aboutQuery = defineQuery(`
  *[_type == "about"][0] {
    intro,
    "education": education[] {
      institution,
      degree,
      year,
      passingYear,
      scoreLabel
    },
    skills
  }
`);
