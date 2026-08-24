import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { client } from "@/sanity/lib/client";
import { writingPiecesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { ArrowUpRight } from "lucide-react";
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
        <SectionHeading eyebrow="Essays & Musings" title="Writing" />

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
        )}
      </Container>
    </Section>
  );
}
