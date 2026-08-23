import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { MetricsBar } from "@/components/home/MetricsBar";
import { TopPosts } from "@/components/home/TopPosts";
import { BookReviews } from "@/components/home/BookReviews";
import { WritingSection } from "@/components/home/WritingSection";
import { BrandCollabs } from "@/components/home/BrandCollabs";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";

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
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}

