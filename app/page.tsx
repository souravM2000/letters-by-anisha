import { Navbar, Footer, FloatingContactButton } from "@/components/layout";
import { AboutSection } from "@/components/home/AboutSection";
import { SocialSection } from "@/components/home/SocialSection";
import { TopPosts } from "@/components/home/TopPosts";
import { BrandCollabs } from "@/components/home/BrandCollabs";
import { BookReviews } from "@/components/home/BookReviews";
import { WritingSection } from "@/components/home/WritingSection";
import { EducationSection } from "@/components/home/EducationSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col min-h-screen w-full">
        <AboutSection />
        <SocialSection />
        <TopPosts />
        <BrandCollabs />
        <BookReviews />
        <WritingSection />
        <EducationSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingContactButton />
    </>
  );
}

