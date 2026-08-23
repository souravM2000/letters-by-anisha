import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sanityFetch } from "@/sanity/lib/live";
import { aboutQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { GraduationCap, Sparkles } from "lucide-react";
import type { About, EducationItem, SkillCategory } from "@/sanity/types";

export async function AboutSection() {
  const { data } = await sanityFetch({ query: aboutQuery });
  const about = data as About | null;

  return (
    <Section id="about" bgClass="bg-brand-cream">
      <Container>
        <SectionHeading eyebrow="Meet the author" title="About" />

        {!about ? (
          <div className="text-center py-16">
            <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
              Story coming soon
            </p>
            <p className="text-brand-ink/40 text-sm">
              Getting to know the person behind the pages.
            </p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">

            {/* ── Intro ─────────────────────────────────────────────────── */}
            {about.intro && (
              <div className="max-w-3xl mx-auto prose prose-lg prose-brand text-brand-ink/80 leading-relaxed">
                <PortableText value={about.intro} />
              </div>
            )}

            {/* ── Education Timeline ────────────────────────────────────── */}
            {about.education && about.education.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <GraduationCap className="w-5 h-5 text-brand-terracotta" />
                  <h3 className="font-serif text-2xl text-brand-crimson">Education</h3>
                </div>
                <div className="relative pl-8 border-l-2 border-brand-terracotta/30 space-y-8">
                  {about.education.map((edu: EducationItem, i: number) => (
                    <div key={i} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[2.35rem] top-1.5 w-3 h-3 rounded-full bg-brand-terracotta border-2 border-brand-cream" />

                      <div className="bg-brand-vanilla editorial-border p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                          <h4 className="font-serif text-lg text-brand-ink font-medium">
                            {edu.degree}
                          </h4>
                          {edu.year && (
                            <span className="text-xs uppercase tracking-widest text-brand-ink/40 shrink-0">
                              {edu.year}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-brand-ink/60 italic">
                          {edu.institution}
                        </p>
                        {edu.scoreLabel && (
                          <p className="text-xs mt-2 text-brand-terracotta font-medium">
                            {edu.scoreLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Skills ────────────────────────────────────────────────── */}
            {about.skills && about.skills.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="w-5 h-5 text-brand-terracotta" />
                  <h3 className="font-serif text-2xl text-brand-crimson">Skills</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {about.skills.map((group: SkillCategory, i: number) => (
                    <div key={i} className="bg-brand-vanilla editorial-border p-5">
                      <h4 className="text-xs uppercase tracking-[0.2em] text-brand-terracotta font-medium mb-4">
                        {group.category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items?.map((item: string, j: number) => (
                          <span
                            key={j}
                            className="text-sm px-3 py-1 bg-brand-cream text-brand-ink/70 editorial-border"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </Container>
    </Section>
  );
}
