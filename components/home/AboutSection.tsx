import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { sanityFetch } from "@/sanity/lib/live";
import { aboutQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { FileDown } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { SocialIcon, formatSocialUrl } from "@/components/ui/SocialIcon";
import type { About, SiteSettings, SocialLink } from "@/sanity/types";

export async function AboutSection() {
  const [{ data: about }, { data: settings }] = await Promise.all([
    sanityFetch({ query: aboutQuery }),
    sanityFetch({ query: siteSettingsQuery })
  ]);
  
  const aboutData = about as About | null;
  const settingsData = settings as SiteSettings | null;
  const socialHandles = settingsData?.socialHandles?.filter((s) => Boolean(s.url || s.handle)) || [];

  return (
    <Section id="about" bgClass="bg-brand-cream" className="pt-28 md:pt-32 pb-8 md:pb-12">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Framed Image */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            {settingsData?.profileImage ? (
              <div className="relative aspect-[4/5] w-full border border-brand-terracotta p-2 bg-brand-cream">
                <div className="relative w-full h-full">
                  <Image
                    src={urlFor(settingsData.profileImage).width(800).url()}
                    alt={settingsData?.name || "Anisha"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            ) : (
              <div className="aspect-[4/5] bg-brand-vanilla border border-brand-terracotta flex items-center justify-center p-2">
                <span className="text-brand-ink/40 font-handwritten text-2xl">Image coming soon</span>
              </div>
            )}
          </div>

          {/* Right Column: About Text & Connect */}
          <div className="flex flex-col pt-4 lg:pt-8">
            <span className="font-handwritten text-3xl md:text-4xl text-brand-terracotta mb-2 block">
              Meet the author
            </span>
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-brand-crimson font-medium mb-8">
              About
            </h2>

            {!aboutData ? (
               <p className="text-brand-ink/40">Story coming soon</p>
            ) : (
              <>
                {aboutData.intro && (
                  <div className="prose prose-lg prose-brand text-brand-ink/90 leading-relaxed mb-12">
                    <PortableText value={aboutData.intro} />
                  </div>
                )}
              </>
            )}

            {/* Let's Connect Section */}
            <div>
              <h3 className="font-serif text-3xl text-brand-crimson mb-6">
                Let&apos;s Connect
              </h3>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-wrap gap-3">
                  {socialHandles.map((social: SocialLink, i: number) => {
                    const href = formatSocialUrl(social.url, social.platform);
                    const isEmail = social.platform?.toLowerCase().includes("email");
                    
                    return (
                      <a
                        key={i}
                        href={href}
                        target={isEmail ? undefined : "_blank"}
                        rel={isEmail ? undefined : "noopener noreferrer"}
                        className="w-10 h-10 rounded-full bg-brand-terracotta text-brand-cream hover:bg-brand-crimson transition-colors flex items-center justify-center"
                        title={social.platform}
                      >
                        <SocialIcon platform={social.platform} className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>

                {(settingsData as any)?.resumeUrl && (
                  <a
                    href={(settingsData as any).resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-brand-terracotta text-brand-crimson hover:bg-brand-terracotta hover:text-brand-cream transition-all text-sm font-medium"
                  >
                    <span>Download Portfolio (PDF)</span>
                    <FileDown className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

