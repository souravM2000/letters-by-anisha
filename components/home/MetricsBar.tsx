import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { client } from "@/sanity/lib/client";
import { metricsQuery } from "@/sanity/lib/queries";
import type { SiteMetrics } from "@/sanity/types";

function formatNumber(n: number | null | undefined): string | null {
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

interface StatChipProps {
  label: string;
  value: string;
  suffix?: string;
}

function StatChip({ label, value, suffix }: StatChipProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-4 md:px-10">
      <span className="font-serif text-4xl md:text-5xl text-brand-crimson font-medium tracking-tight">
        {value}
        {suffix && (
          <span className="text-2xl md:text-3xl text-brand-terracotta ml-0.5">
            {suffix}
          </span>
        )}
      </span>
      <span className="text-xs uppercase tracking-[0.2em] text-brand-ink/60 font-medium">
        {label}
      </span>
    </div>
  );
}

export async function MetricsBar() {
  const metrics = await client.fetch<SiteMetrics | null>(
    metricsQuery,
    {},
    { next: { tags: ["settings"] } }
  );

  if (!metrics) return null;

  const stats: { label: string; value: string | null; suffix?: string }[] = [
    { label: "Followers", value: formatNumber(metrics.followers) },
    {
      label: "Avg. Engagement",
      value: metrics.avgEngagementRate != null ? metrics.avgEngagementRate.toFixed(1) : null,
      suffix: "%",
    },
    { label: "Avg. Reach", value: formatNumber(metrics.avgReach) },
    { label: "Monthly Views", value: formatNumber(metrics.monthlyViews) },
  ].filter((s) => s.value != null);

  if (stats.length === 0) return null;

  const lastUpdated = formatDate(metrics.lastUpdated);

  return (
    <section
      id="metrics"
      className="py-16 md:py-24 bg-brand-vanilla border-y editorial-border"
    >
      <Container>
        <SectionHeading eyebrow="By the numbers" title="Metrics" />

        <div className="flex flex-wrap justify-center divide-x divide-brand-ink/10">
          {stats.map((stat) => (
            <StatChip
              key={stat.label}
              label={stat.label}
              value={stat.value!}
              suffix={stat.suffix}
            />
          ))}
        </div>

        {lastUpdated && (
          <p className="text-center text-brand-ink/40 text-xs mt-8 uppercase tracking-widest">
            Last updated {lastUpdated}
          </p>
        )}
      </Container>
    </section>
  );
}
