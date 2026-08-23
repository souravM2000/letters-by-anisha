import Link from "next/link";
import { Container } from "../ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { Mail, Globe, Music } from "lucide-react";
import type { SiteSettings, SocialLink } from "@/sanity/types";

// Inline SVGs for brand icons removed from Lucide
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.1 8.4 2 10.2 2 12s.1 3.6.5 4.9a4 4 0 0 0 2.8 2.8c1.3.4 4 .5 6.7.5s5.4-.1 6.7-.5a4 4 0 0 0 2.8-2.8c.4-1.3.5-3.1.5-4.9s-.1-3.6-.5-4.9a4 4 0 0 0-2.8-2.8C17.4 4.1 14.7 4 12 4s-5.4.1-6.7.5a4 4 0 0 0-2.8 2.8z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

// Map platform strings to icons
const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <InstagramIcon className={className} />;
    case "linkedin":
      return <LinkedinIcon className={className} />;
    case "youtube":
      return <YoutubeIcon className={className} />;
    case "email":
      return <Mail className={className} />;
    case "wordpress":
      return <Globe className={className} />;
    case "tiktok":
      return <Music className={className} />; // Close enough for standard lucide icons
    default:
      return <Globe className={className} />;
  }
};

export async function Footer() {
  const { data } = await sanityFetch({ query: siteSettingsQuery });
  const settings = data as SiteSettings | null;
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
            <div className="flex items-center space-x-6">
              {settings?.socialHandles?.map((social: SocialLink, i: number) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-cream/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  aria-label={social.platform}
                >
                  <PlatformIcon platform={social.platform} className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            <nav className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              <Link href="#reviews" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Reviews</Link>
              <Link href="#writing" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Writing</Link>
              <Link href="#collabs" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">Collabs</Link>
              <Link href="#about" className="text-sm uppercase tracking-wider hover:text-brand-terracotta transition-colors">About</Link>
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
