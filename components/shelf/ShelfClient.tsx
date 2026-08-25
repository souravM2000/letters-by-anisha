"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ExternalLink, Sparkles, Package } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import type { ShelfPick } from "@/sanity/types";

const ALL = "All";

interface ShelfClientProps {
  picks: ShelfPick[];
}

export function ShelfClient({ picks }: ShelfClientProps) {
  // Derive sorted category list
  const categories = useMemo(() => {
    const seen = new Set<string>();
    picks.forEach((p) => {
      if (p.category) seen.add(p.category);
    });
    return [ALL, ...Array.from(seen).sort()];
  }, [picks]);

  const [activeCategory, setActiveCategory] = useState(ALL);

  const filtered = useMemo(
    () =>
      activeCategory === ALL
        ? picks
        : picks.filter((p) => p.category === activeCategory),
    [picks, activeCategory]
  );

  if (!picks.length) {
    return (
      <div className="text-center py-24">
        <Package className="w-12 h-12 text-brand-terracotta/40 mx-auto mb-4" />
        <p className="font-handwritten text-3xl text-brand-terracotta/60 mb-2">
          Curation in progress…
        </p>
        <p className="text-brand-ink/40 text-sm">
          The shelf is being stocked. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
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

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((pick) => (
            <motion.div
              key={pick._id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShelfCard pick={pick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-brand-ink/40 py-10 text-sm italic">
          No picks in this category yet.
        </p>
      )}
    </div>
  );
}

// ─── Individual Card ──────────────────────────────────────────────────────────

function ShelfCard({ pick }: { pick: ShelfPick }) {
  return (
    <div className="group relative flex flex-col bg-brand-cream editorial-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
      {/* Featured badge */}
      {pick.featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-crimson text-brand-cream text-[10px] font-semibold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-2.5 h-2.5" />
          Pick
        </div>
      )}

      {/* Image area */}
      <div className="relative aspect-square w-full bg-brand-vanilla overflow-hidden">
        {pick.image ? (
          <Image
            src={urlFor(pick.image).width(600).height(600).url()}
            alt={pick.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-14 h-14 text-brand-ink/15" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Category tag */}
        <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-terracotta/80">
          {pick.category}
        </span>

        {/* Name */}
        <h3 className="font-serif text-base text-brand-ink font-medium leading-snug line-clamp-2 group-hover:text-brand-crimson transition-colors">
          {pick.name}
        </h3>

        {/* Description */}
        {pick.description && (
          <p className="text-xs text-brand-ink/65 leading-relaxed line-clamp-3 flex-1">
            {pick.description}
          </p>
        )}

        {/* Action buttons */}
        {(pick.buyLink || pick.relatedVideoUrl) ? (
          <div className="mt-3 flex flex-col gap-1.5">
            {pick.buyLink && (
              <a
                href={pick.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-brand-crimson text-brand-cream text-xs font-semibold hover:bg-brand-terracotta transition-colors shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buy</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
            {pick.relatedVideoUrl && (
              <a
                href={pick.relatedVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-brand-crimson/40 text-brand-crimson text-xs font-medium hover:bg-brand-crimson/5 transition-colors"
              >
                <VideoIcon />
                <span>Watch Video</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-brand-ink/15 text-brand-ink/40 text-xs font-medium cursor-default select-none">
            Link coming soon
          </div>
        )}
      </div>
    </div>
  );
}

function VideoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
