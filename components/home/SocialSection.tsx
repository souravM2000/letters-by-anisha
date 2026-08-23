import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FadeUp } from "@/components/ui/Motion";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/types";

function formatMetric(n: number | null | undefined): string | null {
  if (n == null || n === 0) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

function formatDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export async function SocialSection() {
  const settings = await client.fetch<SiteSettings | null>(
    siteSettingsQuery,
    {},
    { next: { tags: ["settings"] } }
  );
  const metrics = settings?.metrics;

  const stats = [
    { label: "Followers", value: formatMetric(metrics?.followers) },
    {
      label: "Avg. Engagement",
      value: metrics?.avgEngagementRate != null ? `${metrics.avgEngagementRate.toFixed(1)}%` : null,
    },
    { label: "Avg. Reach", value: formatMetric(metrics?.avgReach) },
    { label: "Monthly Views", value: formatMetric(metrics?.monthlyViews) },
  ].filter((s) => s.value != null);

  const lastUpdated = formatDate(metrics?.lastUpdated);

  if (stats.length === 0) return null;

  return (
    <Section id="reach" bgClass="bg-brand-vanilla" className="py-6 md:py-8">
      <Container>
        <FadeUp className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-brand-cream border border-brand-terracotta/20 rounded-2xl p-6 md:p-10 shadow-sm">
          <div className="md:w-1/3">
            <h3 className="font-serif text-2xl md:text-3xl text-brand-crimson mb-2">
              Audience Reach
            </h3>
            <p className="text-sm text-brand-ink/60 leading-relaxed">
              A snapshot of my community engagement and content performance across all platforms.
            </p>
            {lastUpdated && (
              <p className="text-xs text-brand-ink/40 mt-6 uppercase tracking-widest font-medium">
                Updated {lastUpdated}
              </p>
            )}
          </div>
          
          <div className="md:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
             {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col border-l border-brand-ink/10 pl-4 lg:pl-6">
                  <span className="font-serif text-3xl md:text-4xl text-brand-crimson font-medium mb-1 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs uppercase tracking-[0.1em] text-brand-ink/50 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
          </div>
        </FadeUp>
      </Container>
    </Section>
  );
}
