import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/types";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lettersbyanisha.com";
const DEFAULT_TITLE = "Letters by Anisha";
const DEFAULT_DESC =
  "Bookstagram creator, book reviewer, and English Literature postgrad. Exploring stories, one page at a time.";

export async function generateMetadata(): Promise<Metadata> {
  // Use the plain client (not sanityFetch) so metadata can be cached independently
  const settings = await client
    .fetch<SiteSettings | null>(siteSettingsQuery)
    .catch(() => null);

  const seo = settings?.seo;
  const title = seo?.metaTitle || settings?.name || DEFAULT_TITLE;
  const description = seo?.metaDescription || settings?.tagline || DEFAULT_DESC;

  let ogImageUrl: string | undefined;
  if (seo?.ogImage) {
    ogImageUrl = urlFor(seo.ogImage).width(1200).height(630).url();
  }

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: `%s | ${DEFAULT_TITLE}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      siteName: DEFAULT_TITLE,
      title,
      description,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: BASE_URL,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakartaSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-brand-cream text-brand-ink selection:bg-brand-terracotta selection:text-white">
        {children}
      </body>
    </html>
  );
}
