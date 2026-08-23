"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <Container className="text-center py-32">
          <span className="font-handwritten text-8xl text-brand-terracotta/30 block mb-4 leading-none">
            404
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-crimson mb-4">
            Page Not Found
          </h1>
          <p className="text-brand-ink/60 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have wandered off into the stacks.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 border border-brand-ink text-brand-ink text-sm uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-cream transition-all"
          >
            Back to the Home Page
          </Link>
        </Container>
      </main>
    </div>
  );
}
