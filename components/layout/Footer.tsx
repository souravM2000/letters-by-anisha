import Link from "next/link";
import { Container } from "../ui/Container";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { SocialIcon, formatSocialUrl } from "../ui/SocialIcon";
import type { SiteSettings, SocialLink } from "@/sanity/types";

export async function Footer() {
  const settings = await client.fetch<SiteSettings | null>(
    siteSettingsQuery,
    {},
    { next: { tags: ["settings"] } }
  );
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-ink text-brand-cream py-16 mt-20">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
          
          <div className="text-center md:text-left">
            <h3 className="font-serif text-3xl mb-3 text-brand-vanilla">
              {settings?.name || "Letters by Anisha"}
            </h3>
            <p className="font-handwritten text-xl text-brand-terracotta/90 max-w-xs">
              {settings?.tagline || "Exploring words and worlds."}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center space-x-4">
              {settings?.socialHandles
                ?.filter((social: SocialLink) => Boolean(social.url || social.handle))
                .map((social: SocialLink, i: number) => {
                  const href = formatSocialUrl(social.url, social.platform);
                  const isEmail = social.platform?.toLowerCase().includes("email");

                  return (
                    <a
                      key={i}
                      href={href}
                      target={isEmail ? undefined : "_blank"}
                      rel={isEmail ? undefined : "noopener noreferrer"}
                      className="text-brand-cream/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                      aria-label={social.platform}
                      title={social.platform}
                    >
                      <SocialIcon platform={social.platform} className="w-5 h-5" />
                    </a>
                  );
                })}
            </div>
            
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              <Link href="/#about" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">About</Link>
              <Link href="/#social" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Social</Link>
              <Link href="/#posts" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Top Posts</Link>
              <Link href="/#collabs" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Collabs</Link>
              <Link href="/#reviews" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Reviews</Link>
              <Link href="/#writing" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Writing</Link>
              <Link href="/shelf" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Shop My Picks</Link>
              <Link href="/#contact" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Contact</Link>
            </nav>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-brand-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-cream/50 text-sm">
          <p>© {currentYear} {settings?.name || "Letters by Anisha"}. All rights reserved.</p>
          <p className="font-serif italic">Curated with intent.</p>
        </div>
      </Container>
    </footer>
  );
}
