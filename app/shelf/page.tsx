import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { client } from "@/sanity/lib/client";
import { shelfPicksQuery } from "@/sanity/lib/queries";
import type { ShelfPick } from "@/sanity/types";
import { ShelfClient } from "@/components/shelf/ShelfClient";

export const metadata: Metadata = {
  title: "Shop My Picks",
  description:
    "Anisha's curated shelf — books, stationery, reading accessories, and studio essentials she loves and recommends.",
};

export default async function ShelfPage() {
  const picks = await client.fetch<ShelfPick[]>(
    shelfPicksQuery,
    {},
    { next: { tags: ["shelf"] } }
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-20 bg-brand-cream">
        <Container>
          {/* Page hero */}
          <div className="text-center mb-12">
            <span className="font-handwritten text-3xl text-brand-terracotta block mb-2">
              curated with love
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-brand-crimson font-medium tracking-tight mb-4">
              Shop My Picks
            </h1>
            <p className="text-brand-ink/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Everything I reach for — books I keep on my nightstand, the pens I swear by,
              candles that set the reading mood, and the desk things that make it all worthwhile.
            </p>
            <div className="mt-6 w-12 h-0.5 bg-brand-crimson mx-auto rounded-full" />
          </div>

          {/* Client SPA — filter + cards */}
          <ShelfClient picks={picks ?? []} />
        </Container>
      </main>

      <Footer />
    </>
  );
}
