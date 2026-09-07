"use client";

import { SocialIcon, formatSocialUrl } from "@/components/ui/SocialIcon";
import { trackSocialLinkClick } from "@/lib/analytics";
import type { SocialLink } from "@/sanity/types";

interface SocialLinksProps {
  socialHandles: SocialLink[];
  /** Identifies where in the UI these links live, e.g. "footer", "about_section" */
  location: string;
  className?: string;
  iconClassName?: string;
}

/**
 * A thin client component that renders social icon links with GA4 tracking.
 * This exists solely so that Footer and AboutSection (Server Components) can
 * keep their data-fetching logic server-side while still firing client events.
 */
export function TrackedSocialLinks({
  socialHandles,
  location,
  className = "text-brand-cream/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full",
  iconClassName = "w-5 h-5",
}: SocialLinksProps) {
  return (
    <>
      {socialHandles
        .filter((social: SocialLink) => Boolean(social.url || social.handle))
        .map((social: SocialLink, i: number) => {
          const href = formatSocialUrl(social.url, social.platform);
          const isEmail = social.platform?.toLowerCase().includes("email");
          const platform = social.platform?.toLowerCase() ?? "unknown";

          return (
            <a
              key={i}
              href={href}
              target={isEmail ? undefined : "_blank"}
              rel={isEmail ? undefined : "noopener noreferrer"}
              className={className}
              aria-label={social.platform}
              title={social.platform}
              onClick={() =>
                trackSocialLinkClick({
                  platform,
                  link_location: location,
                  destination_url: href,
                })
              }
            >
              <SocialIcon platform={social.platform} className={iconClassName} />
            </a>
          );
        })}
    </>
  );
}
