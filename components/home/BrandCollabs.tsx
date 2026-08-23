import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { client } from "@/sanity/lib/client";
import { brandCollabsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { ArrowUpRight } from "lucide-react";
import type { BrandCollab } from "@/sanity/types";
import { StaggerGrid, StaggerItem, FadeIn } from "@/components/ui/Motion";

const COLLAB_TYPE_LABEL: Record<string, string> = {
  "Sponsored Post": "Sponsored",
  Reel: "Reel",
  "Blog Feature": "Blog",
  "Long-term Partnership": "Partnership",
};

export async function BrandCollabs() {
  const collabs = await client.fetch<BrandCollab[] | null>(
    brandCollabsQuery,
    {},
    { next: { tags: ["collabs"] } }
  );

  // Separate collabs with logos for the logo strip
  const collabsWithLogos = collabs?.filter((c) => c.brandLogo) || [];

  return (
    <Section id="collabs" bgClass="bg-brand-vanilla">
      <Container>
        <SectionHeading eyebrow="Partnerships" title="Brand Collabs" />

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
          <>
            {/* Logo strip */}
            {collabsWithLogos.length > 0 && (
              <FadeIn className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-10 pb-10 border-b border-brand-ink/10">
                {collabsWithLogos.map((c) => (
                  <div
                    key={c._id}
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border border-brand-ink/10 bg-white p-2.5 shadow-sm overflow-hidden flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105"
                    title={c.brandName}
                  >
                    <Image
                      src={urlFor(c.brandLogo!).width(200).url()}
                      alt={`${c.brandName} logo`}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-contain p-1.5 rounded-full"
                    />
                  </div>
                ))}
              </FadeIn>
            )}

            {/* Collab cards */}
            <StaggerGrid className="space-y-6">
              {collabs.map((collab) => (
                <StaggerItem key={collab._id}>
                <div
                  key={collab._id}
                  className="bg-brand-cream editorial-border p-6 md:p-8 rounded-xl"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Logo (Round) */}
                    {collab.brandLogo && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full border border-brand-ink/10 p-2 bg-white shadow-sm overflow-hidden flex items-center justify-center">
                        <Image
                          src={urlFor(collab.brandLogo).width(120).url()}
                          alt={`${collab.brandName} logo`}
                          fill
                          sizes="64px"
                          className="object-contain p-1 rounded-full"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      {/* Header row */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="font-serif text-xl md:text-2xl text-brand-ink">
                          {collab.brandName}
                        </h3>
                        {collab.collabType && (
                          <span className="text-xs uppercase tracking-widest bg-brand-terracotta/10 text-brand-terracotta px-3 py-1 rounded-sm">
                            {COLLAB_TYPE_LABEL[collab.collabType] || collab.collabType}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {collab.description && (
                        <div className="text-sm text-brand-ink/70 leading-relaxed prose prose-sm max-w-none mb-4">
                          <PortableText value={collab.description} />
                        </div>
                      )}

                      {/* Results */}
                      {collab.resultsOrMetrics && (
                        <p className="text-sm text-brand-ink/60 mb-4">
                          <span className="uppercase tracking-wider text-xs text-brand-ink/40 mr-2">
                            Results:
                          </span>
                          {collab.resultsOrMetrics}
                        </p>
                      )}

                      {/* Project link */}
                      {collab.projectUrl && (
                        <a
                          href={collab.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-terracotta hover:text-brand-crimson transition-colors"
                        >
                          View project
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Testimonial pull-quote */}
                  {collab.testimonialQuote && (
                    <blockquote className="mt-6 pt-6 border-t border-brand-ink/10 pl-6 border-l-2 border-l-brand-terracotta">
                      <p className="font-serif text-lg italic text-brand-ink/80 leading-relaxed">
                        &ldquo;{collab.testimonialQuote}&rdquo;
                      </p>
                      {collab.testimonialAuthor && (
                        <footer className="mt-2 text-sm text-brand-ink/50">
                          — {collab.testimonialAuthor}
                        </footer>
                      )}
                    </blockquote>
                  )}
                </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </>
        )}
      </Container>
    </Section>
  );
}
