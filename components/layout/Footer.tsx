import Link from "next/link";
import { Container } from "../ui/Container";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { TrackedSocialLinks } from "../ui/TrackedSocialLinks";
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
              <TrackedSocialLinks
                socialHandles={settings?.socialHandles?.filter((s: SocialLink) => Boolean(s.url || s.handle)) ?? []}
                location="footer"
              />
            </div>
            
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              <Link href="/#about" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">About</Link>
              <Link href="/#social" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Social</Link>
              <Link href="/#posts" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Top Posts</Link>
              <Link href="/#collabs" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Collabs</Link>
              <Link href="/reviews" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Reviews</Link>
              <Link href="/writing" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Writing</Link>
              <Link href="/shelf" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Shop My Picks</Link>
              <Link href="/#contact" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Contact</Link>
            </nav>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-brand-cream/10 flex flex-col md:flex-row justify-between items-center gap-4 text-brand-cream/50 text-sm">
          <p>© {currentYear} {settings?.name || "Letters by Anisha"}. All rights reserved.</p>
          <p className="font-serif italic">A reader&apos;s retreat.</p>
        </div>
      </Container>
    </footer>
  );
}
