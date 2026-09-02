import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { client } from "@/sanity/lib/client";
import { bookReviewsQuery } from "@/sanity/lib/queries";
import type { BookReview } from "@/sanity/types";
import { BookReviewsClient } from "@/components/reviews/BookReviewsClient";

import { enrichBookReviewsWithMetaImages } from "@/lib/ogImage";

export const metadata: Metadata = {
  title: "Book Reviews",
  description:
    "Explore in-depth book reviews, ratings, and curated recommendations by Anisha across fiction, non-fiction, dark academia, and more.",
};

export default async function ReviewsPage() {
  const rawReviews = await client.fetch<BookReview[]>(
    bookReviewsQuery,
    {},
    { next: { tags: ["reviews"] } }
  );

  const reviews = await enrichBookReviewsWithMetaImages(rawReviews ?? []);


  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-20 bg-brand-cream">
        <Container>
          {/* Page hero */}
          <div className="text-center mb-12">
            <span className="font-handwritten text-3xl text-brand-terracotta block mb-2">
              from my library
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-brand-crimson font-medium tracking-tight mb-4">
              Book Reviews
            </h1>
            <p className="text-brand-ink/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Honest thoughts, detailed reflections, and curated ratings on stories that moved,
              challenged, and stayed with me long after the final chapter.
            </p>
            <div className="mt-6 w-12 h-0.5 bg-brand-crimson mx-auto rounded-full" />
          </div>

          {/* Client SPA — filter + cards */}
          <BookReviewsClient reviews={reviews ?? []} />
        </Container>
      </main>

      <Footer />
    </>
  );
}
