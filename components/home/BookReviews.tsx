import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { sanityFetch } from "@/sanity/lib/live";
import { bookReviewsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { BookReview } from "@/sanity/types";

export async function BookReviews() {
  const { data } = await sanityFetch({ query: bookReviewsQuery });
  const reviews = data as BookReview[] | null;

  return (
    <Section id="reviews" bgClass="bg-brand-vanilla">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => {
              const href = review.affiliateLink || review.associatedReelUrl || null;
              const Wrapper = href ? "a" : "div";
              const linkProps = href
                ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
                : {};

              return (
                <Wrapper
                  key={review._id}
                  {...linkProps}
                  className="group bg-brand-cream editorial-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-brand-ink/5">
                    {review.coverImage ? (
                      <Image
                        src={urlFor(review.coverImage).width(400).height(600).url()}
                        alt={`Cover of ${review.bookTitle}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-brand-ink/20 text-lg italic">
                          No cover
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif text-xl text-brand-ink mb-1 group-hover:text-brand-crimson transition-colors line-clamp-2">
                      {review.bookTitle}
                    </h3>
                    <p className="text-sm text-brand-ink/60 mb-3 italic">
                      by {review.author}
                    </p>

                    {/* Rating */}
                    {review.rating != null && (
                      <StarRating rating={review.rating} className="mb-3" />
                    )}

                    {/* Genre tags */}
                    {review.genre && review.genre.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {review.genre.map((g: string) => (
                          <span
                            key={g}
                            className="text-xs px-2 py-0.5 bg-brand-terracotta/10 text-brand-terracotta rounded-sm uppercase tracking-wider"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Excerpt */}
                    <p className="text-sm text-brand-ink/70 leading-relaxed line-clamp-3 mt-auto">
                      {review.reviewExcerpt}
                    </p>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </Container>
    </Section>
  );
}
