"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <Container className="text-center py-32">
          <span className="font-handwritten text-5xl text-brand-terracotta/40 block mb-4">
            Something went wrong
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-brand-crimson mb-4">
            Unexpected Error
          </h1>
          <p className="text-brand-ink/60 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            An error occurred while loading this page. Please try again, or return
            to the home page.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <pre className="text-left text-xs bg-red-50 border border-red-200 text-red-700 p-4 mb-8 max-w-lg mx-auto overflow-auto rounded-sm">
              {error.message}
            </pre>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-8 py-3 bg-brand-ink text-brand-cream text-sm uppercase tracking-widest font-medium hover:bg-brand-crimson transition-all"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-8 py-3 border border-brand-ink text-brand-ink text-sm uppercase tracking-widest font-medium hover:bg-brand-ink hover:text-brand-cream transition-all"
            >
              Go Home
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
