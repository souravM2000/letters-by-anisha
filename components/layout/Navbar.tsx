import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/types";
import { NavbarClient, type NavbarClientProps } from "./NavbarClient";

export interface NavbarProps {
  name?: string;
  tagline?: string;
}

export async function Navbar(props: NavbarProps = {}) {
  let settings: SiteSettings | null = null;

  if (!props.name || !props.tagline) {
    try {
      settings = await client.fetch<SiteSettings | null>(
        siteSettingsQuery,
        {},
        { next: { tags: ["settings"] } }
      );
    } catch {
      // Graceful fallback to default brand texts if fetch fails
    }
  }

  const name = props.name || settings?.name || "Letters by Anisha";
  const tagline = props.tagline || settings?.tagline || "Exploring words and worlds.";

  return <NavbarClient name={name} tagline={tagline} />;
}

export { NavbarClient };
export type { NavbarClientProps };
