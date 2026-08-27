"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Feather, Calendar } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { WritingPiece } from "@/sanity/types";

const ALL = "All";

const CATEGORY_COLORS: Record<string, string> = {
  "Book Review": "bg-brand-crimson/10 text-brand-crimson border-brand-crimson/20",
  Essay: "bg-amber-100/80 text-amber-900 border-amber-300/40",
  "Short Story": "bg-emerald-100/80 text-emerald-900 border-emerald-300/40",
  Opinion: "bg-violet-100/80 text-violet-900 border-violet-300/40",
};

interface WritingClientProps {
  pieces: WritingPiece[];
}

export function WritingClient({ pieces }: WritingClientProps) {
  // Derive sorted unique category list
  const categories = useMemo(() => {
    const seen = new Set<string>();
    pieces.forEach((p) => {
      if (p.category && p.category.trim()) {
        seen.add(p.category.trim());
      }
    });
    return [ALL, ...Array.from(seen).sort()];
  }, [pieces]);

  const [activeCategory, setActiveCategory] = useState(ALL);

  const filtered = useMemo(() => {
    if (activeCategory === ALL) return pieces;
    return pieces.filter((p) => p.category?.trim() === activeCategory);
  }, [pieces, activeCategory]);

  if (!pieces.length) {
    return (
      <div className="text-center py-24">
        <Feather className="w-12 h-12 text-brand-terracotta/40 mx-auto mb-4" />
        <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
          New pieces in progress
        </p>
        <p className="text-brand-ink/40 text-sm">
          Essays, stories, and opinions — coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2.5 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer border ${
                activeCategory === cat
                  ? "bg-brand-crimson text-brand-cream border-brand-crimson shadow-sm"
                  : "bg-transparent text-brand-ink/70 border-brand-ink/20 hover:border-brand-crimson hover:text-brand-crimson"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((piece) => {
            const formattedDate = piece.publishedDate
              ? new Date(piece.publishedDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : null;

            return (
              <motion.div
                key={piece._id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                <a
                  href={piece.externalUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full flex flex-col items-start gap-4 p-5 sm:p-6 bg-brand-vanilla editorial-border hover:shadow-lg transition-all duration-300 rounded-xl h-full relative overflow-hidden"
                >
                  {/* Optional cover image */}
                  {piece.coverImage && (
                    <div className="relative w-full aspect-[16/9] shrink-0 rounded-lg overflow-hidden border border-brand-ink/10 bg-brand-cream shadow-xs">
                      <Image
                        src={urlFor(piece.coverImage).width(600).height(338).url()}
                        alt={piece.title ?? "Article cover"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="flex flex-col flex-1 min-w-0 w-full">
                    {/* Meta info: Category badge + Date */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      {piece.category && (
                        <span
                          className={`inline-block text-[10px] sm:text-xs uppercase tracking-widest px-2.5 py-0.5 rounded-sm font-medium border ${
                            CATEGORY_COLORS[piece.category] ||
                            "bg-brand-ink/5 text-brand-ink/60 border-brand-ink/10"
                          }`}
                        >
                          {piece.category}
                        </span>
                      )}

                      {formattedDate && (
                        <span className="flex items-center gap-1 text-[11px] text-brand-ink/40">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl text-brand-ink group-hover:text-brand-crimson transition-colors mb-2 font-medium leading-snug">
                      {piece.title}
                    </h3>

                    {piece.excerpt && (
                      <p className="text-xs sm:text-sm text-brand-ink/65 leading-relaxed line-clamp-3 mb-4">
                        {piece.excerpt}
                      </p>
                    )}

                    <div className="pt-3 border-t border-brand-ink/10 w-full mt-auto flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-terracotta group-hover:text-brand-crimson transition-colors">
                        <span>Read on WordPress</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-serif text-lg text-brand-ink/60 mb-1">
            No pieces found in &ldquo;{activeCategory}&rdquo;
          </p>
          <p className="text-sm text-brand-ink/40">
            Try choosing another category or selecting &ldquo;All&rdquo;.
          </p>
        </div>
      )}
    </div>
  );
}
