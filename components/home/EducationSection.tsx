import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { client } from "@/sanity/lib/client";
import { aboutQuery } from "@/sanity/lib/queries";
import { GraduationCap, Sparkles } from "lucide-react";
import type { About, EducationItem, SkillCategory } from "@/sanity/types";
import { FadeUp } from "@/components/ui/Motion";

export async function EducationSection() {
  const aboutData = await client.fetch<About | null>(
    aboutQuery,
    {},
    { next: { tags: ["about"] } }
  );

  const hasEducation = (aboutData?.education?.length ?? 0) > 0;
  const hasSkills = (aboutData?.skills?.length ?? 0) > 0;

  if (!hasEducation && !hasSkills) {
    return null;
  }

  return (
    <Section id="education" bgClass="bg-brand-cream">
      <Container>
        <SectionHeading eyebrow="Background & Expertise" title="Education & Skills" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Education Column */}
          {hasEducation && (
            <FadeUp className="flex flex-col">
              <h3 className="font-serif text-2xl text-brand-crimson mb-6 flex items-center gap-2.5 pb-3 border-b border-brand-ink/10 font-medium">
                <GraduationCap className="w-5 h-5 text-brand-terracotta" />
                <span>Academic Journey</span>
              </h3>

              <div className="space-y-6">
                {[...(aboutData?.education ?? [])]
                  .sort((a, b) => (b.passingYear ?? 0) - (a.passingYear ?? 0))
                  .map((edu: EducationItem, i: number) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      i !== 0 ? "pt-5 border-t border-brand-ink/10" : ""
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1 gap-4">
                      <h4 className="text-brand-ink font-semibold text-base leading-snug">
                        {edu.degree}
                      </h4>
                      {edu.year && (
                        <span className="text-xs text-brand-terracotta font-mono font-medium shrink-0 uppercase tracking-wider bg-brand-terracotta/10 px-2.5 py-0.5 rounded-full">
                          {edu.year}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-brand-ink/70 mt-0.5">
                      {edu.institution}
                    </p>
                    {edu.scoreLabel && (
                      <p className="text-xs mt-1.5 text-brand-terracotta font-medium">
                        {edu.scoreLabel}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </FadeUp>
          )}

          {/* Skills Column */}
          {hasSkills && (
            <FadeUp delay={0.1} className="flex flex-col">
              <h3 className="font-serif text-2xl text-brand-crimson mb-6 flex items-center gap-2.5 pb-3 border-b border-brand-ink/10 font-medium">
                <Sparkles className="w-5 h-5 text-brand-terracotta" />
                <span>Skills & Competencies</span>
              </h3>

              <div className="space-y-6">
                {aboutData?.skills?.map((group: SkillCategory, i: number) => (
                  <div
                    key={i}
                    className={`${
                      i !== 0 ? "pt-5 border-t border-brand-ink/10" : ""
                    }`}
                  >
                    <h4 className="text-xs uppercase tracking-[0.15em] text-brand-terracotta mb-3 font-semibold">
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items?.map((skill: string, sIdx: number) => (
                        <span
                          key={sIdx}
                          className="text-xs bg-brand-terracotta/5 border border-brand-terracotta/15 text-brand-ink/80 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          )}
        </div>
      </Container>
    </Section>
  );
}
