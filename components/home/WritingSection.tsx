import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sanityFetch } from "@/sanity/lib/live";
import { writingPiecesQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { ArrowUpRight } from "lucide-react";
import type { WritingPiece } from "@/sanity/types";

const CATEGORY_COLORS: Record<string, string> = {
  "Book Review": "bg-brand-crimson/10 text-brand-crimson",
  Essay: "bg-amber-100 text-amber-800",
  "Short Story": "bg-emerald-100 text-emerald-800",
  Opinion: "bg-violet-100 text-violet-800",
};

export async function WritingSection() {
  const { data } = await sanityFetch({ query: writingPiecesQuery });
  const pieces = data as WritingPiece[] | null;

  return (
    <Section id="writing" bgClass="bg-brand-cream">
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
          <div className="space-y-6">
            {pieces.map((piece) => (
              <a
                key={piece._id}
                href={piece.externalUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row gap-6 p-6 bg-brand-vanilla editorial-border hover:shadow-md transition-all duration-300"
              >
                {/* Optional cover image */}
                {piece.coverImage && (
                  <div className="relative w-full md:w-40 aspect-[3/2] md:aspect-[3/4] shrink-0 overflow-hidden">
                    <Image
                      src={urlFor(piece.coverImage).width(320).height(420).url()}
                      alt={piece.title ?? "Article cover"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Text body */}
                <div className="flex flex-col flex-1 justify-center">
                  {/* Category badge */}
                  {piece.category && (
                    <span
                      className={`inline-block w-fit text-xs uppercase tracking-widest px-3 py-1 rounded-sm mb-3 ${
                        CATEGORY_COLORS[piece.category] || "bg-brand-ink/5 text-brand-ink/60"
                      }`}
                    >
                      {piece.category}
                    </span>
                  )}

                  <h3 className="font-serif text-xl md:text-2xl text-brand-ink group-hover:text-brand-crimson transition-colors mb-2">
                    {piece.title}
                  </h3>

                  {piece.excerpt && (
                    <p className="text-sm text-brand-ink/60 leading-relaxed line-clamp-2 mb-4">
                      {piece.excerpt}
                    </p>
                  )}

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-terracotta group-hover:text-brand-crimson transition-colors mt-auto">
                    Read on WordPress
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
