"use client";

import { trackSocialLinkClick } from "@/lib/analytics";

interface TrackedPostLinkProps {
  href: string;
  platform?: string | null;
  postTitle?: string | null;
  children: React.ReactNode;
  className?: string;
}

/**
 * A thin client wrapper around an <a> tag for Top Posts carousel items.
 * Fires a GA4 social_link_click event when the user clicks through to a
 * social media post (Instagram reel, YouTube, etc.).
 */
export function TrackedPostLink({
  href,
  platform,
  postTitle,
  children,
  className,
}: TrackedPostLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackSocialLinkClick({
          platform: platform?.toLowerCase() ?? "unknown",
          link_location: "top_posts_carousel",
          destination_url: href,
        })
      }
    >
      {children}
    </a>
  );
}
