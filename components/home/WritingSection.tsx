import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { client } from "@/sanity/lib/client";
import { writingPiecesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { WritingPiece } from "@/sanity/types";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";

import { enrichWritingPiecesWithMetaImages } from "@/lib/ogImage";

const CATEGORY_COLORS: Record<string, string> = {
  "Book Review": "bg-brand-crimson/10 text-brand-crimson",
  Essay: "bg-amber-100 text-amber-800",
  "Short Story": "bg-emerald-100 text-emerald-800",
  Opinion: "bg-violet-100 text-violet-800",
};

export async function WritingSection() {
  const rawPieces = await client.fetch<WritingPiece[] | null>(
    writingPiecesQuery,
    {},
    { next: { tags: ["writing"] } }
  );

  // Enrich pieces with external Open Graph meta image if coverImage not explicitly provided
  const pieces = await enrichWritingPiecesWithMetaImages(rawPieces ?? []);

  return (
    <Section id="writing" bgClass="bg-brand-vanilla">
      <Container>
        {/* Section Header with Top-Right Action */}
        <div className="relative mb-8 md:mb-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-handwritten text-2xl text-brand-terracotta mb-1 inline-block">
              Essays & Musings
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-crimson font-medium">
              Writing
            </h2>
            <div className="h-0.5 w-14 bg-brand-terracotta mx-auto mt-3" />
          </div>

          <div className="hidden sm:block absolute right-0 bottom-0.5">
            <Link
              href="/writing"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-brand-crimson/70 hover:text-brand-crimson transition-colors duration-200 group cursor-pointer pb-0.5 border-b border-brand-crimson/30 hover:border-brand-crimson"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {!pieces || pieces.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
              New pieces in progress
            </p>
            <p className="text-brand-ink/40 text-sm">
              Essays, stories, and opinions — coming soon.
            </p>
          </div>
        ) : (
          <>
            <Carousel itemCount={pieces.length}>
              {pieces.map((piece) => {
                const imageUrl = piece.coverImage
                  ? urlFor(piece.coverImage).width(500).height(312).url()
                  : piece.metaImage ?? null;

                return (
                  <CarouselItem key={piece._id} className="w-[85vw] sm:w-[320px] lg:w-[360px] shrink-0 snap-center md:snap-start h-auto flex">
                  <a
                    href={piece.externalUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col w-full h-full editorial-border bg-brand-cream overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-lg"
                  >
                    {/* Cover Image / Meta Image (Compact) */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-ink/5">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={piece.title ?? "Article cover"}
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized={Boolean(piece.metaImage && !piece.coverImage)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-terracotta/10">
                          <span className="font-serif text-brand-terracotta/40 text-xs italic">
                            Letters by Anisha
                          </span>
                        </div>
                      )}
                    </div>


                  {/* Body (Compact) */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    {piece.category && (
                      <span
                        className={`self-start text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-medium mb-2 ${
                          CATEGORY_COLORS[piece.category] || "bg-brand-ink/5 text-brand-ink/60"
                        }`}
                      >
                        {piece.category}
                      </span>
                    )}

                    <h3 className="font-serif text-base sm:text-lg md:text-xl text-brand-ink group-hover:text-brand-crimson transition-colors mb-1.5 font-medium line-clamp-2">
                      {piece.title}
                    </h3>

                    {piece.excerpt && (
                      <p className="text-xs sm:text-sm text-brand-ink/60 leading-relaxed line-clamp-2 mb-3">
                        {piece.excerpt}
                      </p>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-brand-terracotta group-hover:text-brand-crimson transition-colors mt-auto">
                      Read on WordPress
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </CarouselItem>
            );
          })}
            </Carousel>

            {/* Mobile-only Bottom Centered View All Button */}
            <div className="mt-8 flex justify-center sm:hidden">
              <Link
                href="/writing"
                className="inline-flex items-center gap-2 px-7 py-2.5 bg-brand-crimson text-brand-cream text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-brand-terracotta transition-colors duration-200 group cursor-pointer shadow-sm"
              >
                <span>View All Writing</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}
