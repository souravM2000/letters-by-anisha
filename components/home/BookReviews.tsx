import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";
import { client } from "@/sanity/lib/client";
import { bookReviewsQuery } from "@/sanity/lib/queries";
import type { BookReview } from "@/sanity/types";
import { BookReviewCard } from "@/components/home/BookReviewCard";

import { enrichBookReviewsWithMetaImages } from "@/lib/ogImage";

export async function BookReviews() {
  const rawReviews = await client.fetch<BookReview[] | null>(
    bookReviewsQuery,
    {},
    { next: { tags: ["reviews"] } }
  );

  const reviews = await enrichBookReviewsWithMetaImages(rawReviews ?? []);


  return (
    <Section id="reviews" bgClass="bg-brand-cream">
      <Container>
        {/* Section Header with Top-Right Action */}
        <div className="relative mb-8 md:mb-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-handwritten text-2xl text-brand-terracotta mb-1 inline-block">
              Latest Reads
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-crimson font-medium">
              Book Reviews
            </h2>
            <div className="h-0.5 w-14 bg-brand-terracotta mx-auto mt-3" />
          </div>

          <div className="hidden sm:block absolute right-0 bottom-0.5">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-brand-crimson/70 hover:text-brand-crimson transition-colors duration-200 group cursor-pointer pb-0.5 border-b border-brand-crimson/30 hover:border-brand-crimson"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {!reviews || reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
              Reviews are on their way
            </p>
            <p className="text-brand-ink/40 text-sm">
              The bookshelf is being curated. Check back soon.
            </p>
          </div>
        ) : (
          <>
            <Carousel itemCount={reviews.length}>
              {reviews.map((review) => (
                <CarouselItem
                  key={review._id}
                  className="w-[85vw] sm:w-[320px] lg:w-[360px] shrink-0 snap-center md:snap-start h-auto flex"
                >
                  <BookReviewCard review={review} />
                </CarouselItem>
              ))}
            </Carousel>

            {/* Mobile-only Bottom Centered View All Button */}
            <div className="mt-8 flex justify-center sm:hidden">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2 px-7 py-2.5 bg-brand-crimson text-brand-cream text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-brand-terracotta transition-colors duration-200 group cursor-pointer shadow-sm"
              >
                <span>View All Reviews</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}


