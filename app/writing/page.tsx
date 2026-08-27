import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { client } from "@/sanity/lib/client";
import { writingPiecesQuery } from "@/sanity/lib/queries";
import type { WritingPiece } from "@/sanity/types";
import { WritingClient } from "@/components/writing/WritingClient";

export const metadata: Metadata = {
  title: "Writing & Essays",
  description:
    "Essays, musings, short stories, and literary criticism by Anisha — exploring words, themes, and perspectives.",
};

export default async function WritingPage() {
  const pieces = await client.fetch<WritingPiece[]>(
    writingPiecesQuery,
    {},
    { next: { tags: ["writing"] } }
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-20 bg-brand-cream">
        <Container>
          {/* Page hero */}
          <div className="text-center mb-12">
            <span className="font-handwritten text-3xl text-brand-terracotta block mb-2">
              essays & musings
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-brand-crimson font-medium tracking-tight mb-4">
              Writing & Essays
            </h1>
            <p className="text-brand-ink/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Long-form thoughts, analytical reviews, creative pieces, and reflections on literature,
              culture, and storytelling.
            </p>
            <div className="mt-6 w-12 h-0.5 bg-brand-crimson mx-auto rounded-full" />
          </div>

          {/* Client SPA — filter + cards */}
          <WritingClient pieces={pieces ?? []} />
        </Container>
      </main>

      <Footer />
    </>
  );
}
