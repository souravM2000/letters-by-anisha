import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { client } from "@/sanity/lib/client";
import { aboutQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { FileDown, Sparkles } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { SocialIcon, formatSocialUrl } from "@/components/ui/SocialIcon";
import type { About, SiteSettings, SocialLink } from "@/sanity/types";

export async function AboutSection() {
  const [aboutData, settingsData] = await Promise.all([
    client.fetch<About | null>(aboutQuery, {}, { next: { tags: ["about"] } }),
    client.fetch<SiteSettings | null>(siteSettingsQuery, {}, { next: { tags: ["settings"] } }),
  ]);
  
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
              Meet the Creator
            </span>
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-brand-crimson font-medium mb-8">
              About
            </h2>

            {!aboutData ? (
               <p className="text-brand-ink/40">Story coming soon</p>
            ) : (
              <>
                {aboutData.intro && (() => {
                  const fontClassMap: Record<string, string> = {
                    sans: 'font-sans',
                    serif: 'font-serif',
                    handwritten: 'font-handwritten',
                    cormorant: 'font-cormorant',
                    lora: 'font-lora',
                    'dm-serif': 'font-dm-serif',
                    montserrat: 'font-montserrat',
                    'eb-garamond': 'font-eb-garamond',
                  };
                  const sizeClassMap: Record<string, string> = {
                    xs: 'text-xs',
                    sm: 'text-sm',
                    base: 'text-base',
                    lg: 'text-lg',
                    xl: 'text-xl',
                    '2xl': 'text-2xl',
                  };
                  const introFontClass = fontClassMap[aboutData.introFont ?? 'sans'] ?? 'font-sans';
                  const introSizeClass = sizeClassMap[aboutData.introFontSize ?? 'base'] ?? 'text-base';
                  return (
                    <div className={`prose prose-brand text-brand-ink/90 leading-relaxed mb-12 ${introFontClass} ${introSizeClass}`}>
                      <PortableText value={aboutData.intro} />
                    </div>
                  );
                })()}
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

                <div className="flex flex-col gap-2.5">
                  {settingsData?.resumeUrl && (
                    <a
                      href={settingsData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-brand-cream transition-all text-sm font-medium"
                    >
                      <span>Download Portfolio (PDF)</span>
                      <FileDown className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href="https://anisha-ghosh-portfolio.my.canva.site"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-brand-crimson text-brand-cream hover:bg-brand-terracotta transition-all text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Creative Portfolio (Canva)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

