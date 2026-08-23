import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sanityFetch } from "@/sanity/lib/live";
import { featuredPostsQuery, recentPostsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Post } from "@/sanity/types";
import { StaggerGrid, StaggerItem } from "@/components/ui/Motion";

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="absolute top-3 left-3 z-20 bg-brand-ink/80 text-brand-cream text-xs uppercase tracking-widest px-3 py-1 rounded-sm backdrop-blur-sm">
      {platform}
    </span>
  );
}

export async function TopPosts() {
  // Try featured first, fall back to most recent
  const { data: featuredData } = await sanityFetch({ query: featuredPostsQuery });
  let posts = featuredData as Post[] | null;
  if (!posts || posts.length === 0) {
    const { data: recentData } = await sanityFetch({ query: recentPostsQuery });
    posts = recentData as Post[] | null;
  }

  return (
    <Section id="posts" bgClass="bg-brand-cream">
      <Container>
        <SectionHeading eyebrow="Featured" title="Top Posts" />

        {!posts || posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
              More content coming soon
            </p>
            <p className="text-brand-ink/40 text-sm">
              Check back for featured posts and reels.
            </p>
          </div>
        ) : (
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <StaggerItem key={post._id}>
              <a
                key={post._id}
                href={post.embedUrl ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block editorial-border bg-brand-vanilla overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  {post.platform && (
                    <PlatformBadge platform={post.platform} />
                  )}
                  {post.thumbnail ? (
                    <Image
                      src={urlFor(post.thumbnail).width(600).height(750).url()}
                      alt={post.title ?? "Post thumbnail"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-brand-ink/5 flex items-center justify-center">
                      <span className="font-serif text-brand-ink/20 text-lg italic">
                        No thumbnail
                      </span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-brand-crimson/0 group-hover:bg-brand-crimson/10 transition-colors duration-300" />
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-serif text-lg text-brand-ink mb-2 line-clamp-2 group-hover:text-brand-crimson transition-colors">
                    {post.title}
                  </h3>
                  {post.caption && (
                    <p className="text-sm text-brand-ink/60 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                  )}
                </div>
              </a>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </Container>
    </Section>
  );
}
