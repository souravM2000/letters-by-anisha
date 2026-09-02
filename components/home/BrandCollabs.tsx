import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { client } from "@/sanity/lib/client";
import { brandCollabsQuery } from "@/sanity/lib/queries";
import type { BrandCollab } from "@/sanity/types";
import { BrandCollabsClient } from "@/components/home/BrandCollabsClient";

import { enrichBrandCollabsWithMetaImages } from "@/lib/ogImage";

export async function BrandCollabs() {
  const rawCollabs = await client.fetch<BrandCollab[] | null>(
    brandCollabsQuery,
    {},
    { next: { tags: ["collabs"] } }
  );

  const collabs = await enrichBrandCollabsWithMetaImages(rawCollabs ?? []);


  return (
    <Section id="collabs" bgClass="bg-brand-vanilla">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <span className="font-handwritten text-2xl text-brand-terracotta mb-1 inline-block">
            Partnerships
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-crimson font-medium">
            Brand Collabs
          </h2>
          <div className="h-0.5 w-14 bg-brand-terracotta mx-auto mt-3 mb-3" />
          <p className="text-xs sm:text-sm text-brand-ink/60 italic">
            Select any brand to explore project stories, campaign details, and highlights.
          </p>
        </div>

        {!collabs || collabs.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
              Collaborations coming soon
            </p>
            <p className="text-brand-ink/40 text-sm">
              Looking forward to working with amazing brands.
            </p>
          </div>
        ) : (
          <BrandCollabsClient collabs={collabs} />
        )}
      </Container>
    </Section>
  );
}

