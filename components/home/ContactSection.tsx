import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { FadeUp } from "@/components/ui/Motion";
import { SocialIcon, formatSocialUrl } from "@/components/ui/SocialIcon";
import type { SiteSettings, SocialLink } from "@/sanity/types";
import { Mail, MapPin } from "lucide-react";

export async function ContactSection() {
  const settings = await client.fetch<SiteSettings | null>(
    siteSettingsQuery,
    {},
    { next: { tags: ["settings"] } }
  );

  // Derive contact details from socialHandles
  const emailHandle = settings?.socialHandles?.find(
    (s: SocialLink) => s.platform?.toLowerCase() === "email"
  );

  return (
    <Section id="contact" bgClass="bg-brand-vanilla">
      <Container>
        <SectionHeading eyebrow="Get in touch" title="Contact" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* ── Contact details ─────────────────────────────────────────── */}
          <FadeUp className="lg:col-span-2 space-y-8">
            <div>
              <p className="font-serif text-xl text-brand-ink/80 leading-relaxed mb-6">
                Whether you&apos;re a brand looking to collaborate, a fellow reader,
                or a publisher — I&apos;d love to hear from you.
              </p>
              <p className="text-brand-ink/60 text-sm leading-relaxed">
                I typically respond within 2–3 business days.
              </p>
            </div>

            <div className="space-y-4">
              {emailHandle && (
                <a
                  href={formatSocialUrl(emailHandle.url, "Email")}
                  className="flex items-center gap-3 text-sm text-brand-ink/70 hover:text-brand-crimson transition-colors group"
                >
                  <Mail className="w-4 h-4 text-brand-terracotta shrink-0" />
                  <span>{emailHandle.handle || emailHandle.url.replace("mailto:", "")}</span>
                </a>
              )}
              {settings?.socialHandles
                ?.filter((s: SocialLink) => s.platform?.toLowerCase() !== "email" && Boolean(s.url || s.handle))
                .map((s: SocialLink, i: number) => (
                  <a
                    key={i}
                    href={formatSocialUrl(s.url, s.platform)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-brand-ink/70 hover:text-brand-crimson transition-colors"
                  >
                    <SocialIcon platform={s.platform} className="w-4 h-4 text-brand-terracotta shrink-0" />
                    <span>
                      {s.platform}
                      {s.handle && (
                        <span className="text-brand-ink/40 ml-1">({s.handle})</span>
                      )}
                    </span>
                  </a>
                ))}
              <div className="flex items-center gap-3 text-sm text-brand-ink/50">
                <MapPin className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span>India</span>
              </div>
            </div>

            {/* Small editorial divider quote */}
            <blockquote className="border-l-2 border-brand-terracotta pl-4 mt-8">
              <p className="font-serif italic text-brand-ink/60 text-sm leading-relaxed">
                &ldquo;A reader lives a thousand lives before she dies. The person who
                never reads lives only one.&rdquo;
              </p>
              <footer className="text-xs text-brand-ink/40 mt-2">— George R.R. Martin</footer>
            </blockquote>
          </FadeUp>

          {/* ── Form ────────────────────────────────────────────────────── */}
          <FadeUp delay={0.1} className="lg:col-span-3">
            <ContactForm />
          </FadeUp>
        </div>
      </Container>
    </Section>
  );
}
