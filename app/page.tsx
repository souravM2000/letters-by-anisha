import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { MetricsBar } from "@/components/home/MetricsBar";
import { TopPosts } from "@/components/home/TopPosts";
import { BookReviews } from "@/components/home/BookReviews";
import { WritingSection } from "@/components/home/WritingSection";
import { BrandCollabs } from "@/components/home/BrandCollabs";
import { AboutSection } from "@/components/home/AboutSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col min-h-screen w-full">
        <Hero />
        <MetricsBar />
        <TopPosts />
        <BookReviews />
        <WritingSection />
        <BrandCollabs />
        <AboutSection />

        {/* Contact placeholder — will be built in Prompt 4 */}
        <Section id="contact" bgClass="bg-brand-vanilla">
          <Container>
            <SectionHeading eyebrow="Get in touch" title="Contact" />
            <div className="text-center py-16">
              <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
                Contact form coming soon
              </p>
              <p className="text-brand-ink/40 text-sm">
                Reach out for collaborations, commissions, or just to chat about books.
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
