/**
 * Hand-written types matching the Sanity schemas.
 * These will be replaced by auto-generated types from `sanity typegen generate`
 * once the typegen pipeline is set up. For now, they provide type safety
 * for the GROQ query results used across the site.
 */

import type { PortableTextBlock, Image as SanityImage } from "sanity";

// ── Shared primitives ───────────────────────────────────────────────────────

export interface SanitySlug {
  _type: "slug";
  current: string;
}

// ── Site Settings ───────────────────────────────────────────────────────────

export interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
}

export interface SiteMetrics {
  followers?: number | null;
  avgEngagementRate?: number | null;
  avgReach?: number | null;
  monthlyViews?: number | null;
  lastUpdated?: string | null;
}

export interface SeoFields {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: SanityImage | null;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  bio?: PortableTextBlock[] | null;
  profileImage?: SanityImage | null;
  socialHandles?: SocialLink[] | null;
  metrics?: SiteMetrics | null;
  resumeUrl?: string | null;
  seo?: SeoFields | null;
}

// ── About ───────────────────────────────────────────────────────────────────

export interface EducationItem {
  institution: string;
  degree: string;
  year?: string;
  passingYear?: number | null;
  scoreLabel?: string;
}

export interface SkillCategory {
  category: string;
  items?: string[];
}

export interface About {
  intro?: PortableTextBlock[] | null;
  introFont?: 'sans' | 'serif' | 'handwritten' | 'cormorant' | 'lora' | 'dm-serif' | 'montserrat' | 'eb-garamond' | null;
  introFontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | null;
  education?: EducationItem[] | null;
  skills?: SkillCategory[] | null;
}

// ── Book Review ─────────────────────────────────────────────────────────────

export interface BookReview {
  _id: string;
  bookTitle: string;
  author: string;
  slug: SanitySlug;
  coverImage?: SanityImage | null;
  rating: number;
  genre?: string[] | null;
  reviewExcerpt: string;
  fullReview?: PortableTextBlock[] | null;
  affiliateLink?: string | null;
  associatedReelUrl?: string | null;
  publishedDate: string;
  featured?: boolean;
}

// ── Post (Social Reels / Top Posts) ─────────────────────────────────────────

export interface Post {
  _id: string;
  title: string;
  platform: string;
  embedUrl: string;
  thumbnail?: SanityImage | null;
  caption?: string | null;
  publishedDate: string;
  featured?: boolean;
}

// ── Brand Collab ────────────────────────────────────────────────────────────

export interface BrandCollab {
  _id: string;
  brandName: string;
  brandLogo?: SanityImage | null;
  collabType?: string | null;
  description?: PortableTextBlock[] | null;
  testimonialQuote?: string | null;
  testimonialAuthor?: string | null;
  resultsOrMetrics?: string | null;
  projectUrl?: string | null;
  date: string;
}

// ── Writing Piece ───────────────────────────────────────────────────────────

export interface WritingPiece {
  _id: string;
  title: string;
  category: string;
  externalUrl: string;
  excerpt: string;
  coverImage?: SanityImage | null;
  publishedDate: string;
  featured?: boolean;
}

// ── Shelf & Studio Pick ─────────────────────────────────────────────────────

export interface ShelfPick {
  _id: string;
  name: string;
  category: string;
  image?: SanityImage | null;
  description?: string | null;
  buyLink?: string | null;
  relatedVideoUrl?: string | null;
  featured?: boolean;
}

