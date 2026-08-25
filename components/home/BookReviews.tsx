import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";
import { client } from "@/sanity/lib/client";
import { bookReviewsQuery } from "@/sanity/lib/queries";
import type { BookReview } from "@/sanity/types";
import { BookReviewCard } from "@/components/home/BookReviewCard";

export async function BookReviews() {
  const reviews = await client.fetch<BookReview[] | null>(
    bookReviewsQuery,
    {},
    { next: { tags: ["reviews"] } }
  );

  return (
    <Section id="reviews" bgClass="bg-brand-cream">
      <Container>
        <SectionHeading eyebrow="Latest Reads" title="Book Reviews" />

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
        )}
      </Container>
    </Section>
  );
}
