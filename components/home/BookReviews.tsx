import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { StaggerGrid, StaggerItem } from "@/components/ui/Motion";
import { client } from "@/sanity/lib/client";
import { bookReviewsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { BookReview } from "@/sanity/types";

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
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => {
              const href = review.affiliateLink || review.associatedReelUrl || null;
              const Wrapper = href ? "a" : "div";
              const linkProps = href
                ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
                : {};

              return (
                <StaggerItem key={review._id}>
                <Wrapper
                  key={review._id}
                  {...linkProps}
                  className="group bg-brand-cream editorial-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 rounded-lg h-full"
                >
                  {/* Compact Book Cover Display */}
                  <div className="py-5 px-4 bg-brand-ink/[0.02] flex items-center justify-center border-b border-brand-ink/10">
                    <div className="relative w-24 sm:w-28 aspect-[2/3] shadow-md rounded-sm overflow-hidden bg-brand-vanilla">
                      {review.coverImage ? (
                        <Image
                          src={urlFor(review.coverImage).width(300).height(450).url()}
                          alt={`Cover of ${review.bookTitle}`}
                          fill
                          sizes="120px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-serif text-brand-ink/20 text-xs italic">
                            No cover
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-serif text-lg text-brand-ink mb-1 group-hover:text-brand-crimson transition-colors line-clamp-1 font-medium">
                      {review.bookTitle}
                    </h3>
                    <p className="text-xs text-brand-ink/60 mb-2.5 italic">
                      by {review.author}
                    </p>

                    {/* Rating */}
                    {review.rating != null && (
                      <StarRating rating={review.rating} className="mb-2.5" />
                    )}

                    {/* Genre tags */}
                    {review.genre && review.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {review.genre.map((g: string) => (
                          <span
                            key={g}
                            className="text-[10px] px-2 py-0.5 bg-brand-terracotta/10 text-brand-terracotta rounded-sm uppercase tracking-wider font-medium"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-brand-ink/70 leading-relaxed line-clamp-2 mt-auto">
                      {review.reviewExcerpt}
                    </p>
                  </div>
                </Wrapper>
              </StaggerItem>
              );
            })}
          </StaggerGrid>
        )}
      </Container>
    </Section>
  );
}
