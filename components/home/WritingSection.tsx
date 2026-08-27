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

const CATEGORY_COLORS: Record<string, string> = {
  "Book Review": "bg-brand-crimson/10 text-brand-crimson",
  Essay: "bg-amber-100 text-amber-800",
  "Short Story": "bg-emerald-100 text-emerald-800",
  Opinion: "bg-violet-100 text-violet-800",
};

export async function WritingSection() {
  const pieces = await client.fetch<WritingPiece[] | null>(
    writingPiecesQuery,
    {},
    { next: { tags: ["writing"] } }
  );

  return (
    <Section id="writing" bgClass="bg-brand-vanilla">
      <Container>
        {/* Section Header with Top-Right Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <span className="font-handwritten text-2xl text-brand-terracotta mb-1 inline-block">
              Essays & Musings
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-crimson font-medium">
              Writing
            </h2>
            <div className="h-0.5 w-14 bg-brand-terracotta mt-3" />
          </div>

          <Link
            href="/writing"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-brand-crimson/70 hover:text-brand-crimson transition-colors duration-200 group cursor-pointer pb-0.5 border-b border-brand-crimson/30 hover:border-brand-crimson"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
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
              {pieces.map((piece) => (
                <CarouselItem key={piece._id} className="w-[85vw] sm:w-[350px] lg:w-[400px] shrink-0 snap-center md:snap-start h-auto flex">
                <a
                  key={piece._id}
                  href={piece.externalUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full flex flex-col items-start gap-4 p-4 sm:p-5 bg-brand-vanilla editorial-border hover:shadow-md transition-all duration-300 rounded-lg h-full"
                >
                  {/* Optional cover image (Compact) */}
                  {piece.coverImage && (
                    <div className="relative w-full aspect-[2/1] sm:aspect-[16/9] shrink-0 rounded-lg overflow-hidden border border-brand-ink/10 bg-brand-cream shadow-xs">
                      <Image
                        src={urlFor(piece.coverImage).width(400).height(225).url()}
                        alt={piece.title ?? "Article cover"}
                        fill
                        sizes="(max-width: 640px) 100vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Text body */}
                  <div className="flex flex-col flex-1 min-w-0">
                    {/* Category badge */}
                    {piece.category && (
                      <span
                        className={`inline-block w-fit text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-sm mb-2 font-medium ${
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
              ))}
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


