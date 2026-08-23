import Image from "next/image";
import Link from "next/link";
import { Container } from "../ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/types";

export async function Hero() {
  const { data } = await sanityFetch({ query: siteSettingsQuery });
  const settings = data as SiteSettings | null;

  if (!settings) {
    return null;
  }

  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-paper-grain">
      <Container className="relative z-10 flex flex-col items-center text-center">
        
        {/* Masthead Label */}
        <span className="font-handwritten text-3xl md:text-4xl text-brand-terracotta mb-6 block transform -rotate-2">
          Hello, I&apos;m
        </span>

        {/* Display Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight text-brand-crimson font-medium mb-6">
          {settings.name || "Letters by Anisha"}
        </h1>

        {/* Subhead / Tagline */}
        <p className="text-xl md:text-2xl text-brand-ink/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          {settings.tagline || "Exploring words and worlds."}
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-20">
          <Link
            href="#reviews"
            className="group relative px-8 py-3 font-medium uppercase tracking-widest text-sm text-brand-crimson transition-all"
          >
            <span className="relative z-10">View Reviews</span>
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-crimson transition-all group-hover:h-full group-hover:bg-brand-crimson/5"></span>
          </Link>
          
          <Link
            href="#contact"
            className="px-8 py-3 font-medium uppercase tracking-widest text-sm text-brand-ink border border-brand-ink hover:bg-brand-ink hover:text-brand-cream transition-all rounded-sm"
          >
            Get In Touch
          </Link>
        </div>

        {/* Portrait Image (if available) */}
        {settings.profileImage && (
          <div className="relative w-full max-w-sm md:max-w-md aspect-[3/4] mx-auto group">
            <div className="absolute inset-0 translate-x-4 translate-y-4 border border-brand-terracotta/30 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <Image
              src={urlFor(settings.profileImage).width(800).url()}
              alt={settings.name || "Anisha"}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 editorial-border shadow-xl"
              priority
            />
          </div>
        )}

      </Container>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-vanilla to-transparent opacity-50 pointer-events-none" />
    </section>
  );
}
