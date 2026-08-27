"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { BookReview } from "@/sanity/types";
import { BookReviewCard } from "@/components/home/BookReviewCard";

const ALL = "All";

interface BookReviewsClientProps {
  reviews: BookReview[];
}

export function BookReviewsClient({ reviews }: BookReviewsClientProps) {
  // Derive sorted unique genre list
  const genres = useMemo(() => {
    const seen = new Set<string>();
    reviews.forEach((r) => {
      if (Array.isArray(r.genre)) {
        r.genre.forEach((g) => {
          if (g && typeof g === "string" && g.trim()) {
            seen.add(g.trim());
          }
        });
      }
    });
    return [ALL, ...Array.from(seen).sort()];
  }, [reviews]);

  const [activeGenre, setActiveGenre] = useState(ALL);

  const filtered = useMemo(() => {
    if (activeGenre === ALL) return reviews;
    return reviews.filter(
      (r) => Array.isArray(r.genre) && r.genre.some((g) => g.trim() === activeGenre)
    );
  }, [reviews, activeGenre]);

  if (!reviews.length) {
    return (
      <div className="text-center py-24">
        <BookOpen className="w-12 h-12 text-brand-terracotta/40 mx-auto mb-4" />
        <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
          Reviews are on their way
        </p>
        <p className="text-brand-ink/40 text-sm">
          The bookshelf is being curated. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Category / Genre Filter Tabs */}
      {genres.length > 1 && (
        <div className="flex flex-wrap gap-2.5 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                activeGenre === genre
                  ? "bg-brand-crimson text-brand-cream border-brand-crimson shadow-sm"
                  : "bg-transparent text-brand-ink/70 border-brand-ink/20 hover:border-brand-crimson hover:text-brand-crimson"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((review) => (
            <motion.div
              key={review._id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex"
            >
              <BookReviewCard review={review} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-serif text-lg text-brand-ink/60 mb-1">
            No reviews found in &ldquo;{activeGenre}&rdquo;
          </p>
          <p className="text-sm text-brand-ink/40">
            Try choosing another category or selecting &ldquo;All&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
