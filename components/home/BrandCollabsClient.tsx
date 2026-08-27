"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, Globe, Calendar, Sparkles, Quote, TrendingUp } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import type { BrandCollab } from "@/sanity/types";

const COLLAB_TYPE_LABEL: Record<string, string> = {
  "Sponsored Post": "Sponsored Post",
  Reel: "Instagram Reel",
  "Blog Feature": "Blog Feature",
  "Long-term Partnership": "Brand Partnership",
};

function formatCollabDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface BrandCollabsClientProps {
  collabs: BrandCollab[];
}

export function BrandCollabsClient({ collabs }: BrandCollabsClientProps) {
  const [selectedCollab, setSelectedCollab] = useState<BrandCollab | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    if (!selectedCollab) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCollab(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCollab]);

  const activeCollabUrl = selectedCollab?.collabUrl || selectedCollab?.projectUrl;
  const activeBrandUrl = selectedCollab?.brandUrl;
  const formattedDate = formatCollabDate(selectedCollab?.date);

  return (
    <>
      {/* Round Logos Grid / List */}
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto py-4">
        {collabs.map((collab) => (
          <button
            key={collab._id}
            type="button"
            onClick={() => setSelectedCollab(collab)}
            className="group flex flex-col items-center focus:outline-hidden cursor-pointer"
            aria-label={`View collaboration details for ${collab.brandName}`}
          >
            {/* Round Logo Container */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-brand-ink/10 bg-white p-3 shadow-xs group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:border-brand-crimson/50 group-focus-visible:ring-2 group-focus-visible:ring-brand-crimson flex items-center justify-center overflow-hidden">
              {collab.brandLogo ? (
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src={urlFor(collab.brandLogo).width(200).height(200).url()}
                    alt={`${collab.brandName} logo`}
                    fill
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                    className="object-contain p-1 rounded-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <span className="font-serif text-lg sm:text-xl font-medium text-brand-crimson">
                  {collab.brandName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Brand Name Label */}
            <span className="mt-2.5 text-xs sm:text-sm font-serif font-medium text-brand-ink/80 group-hover:text-brand-crimson transition-colors text-center max-w-[110px] sm:max-w-[130px] truncate">
              {collab.brandName}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Detail Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedCollab && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setSelectedCollab(null)}
                  className="fixed inset-0 bg-brand-ink/60 backdrop-blur-xs cursor-pointer"
                  aria-hidden="true"
                />

                {/* Modal Card */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`collab-modal-title-${selectedCollab._id}`}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-xl bg-brand-cream border border-brand-crimson/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 mx-auto my-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="relative px-6 py-5 border-b border-brand-ink/10 bg-brand-vanilla flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-terracotta" />
                      <span className="font-handwritten text-2xl text-brand-terracotta">
                        Brand Collaboration
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCollab(null)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-brand-ink/70 hover:text-brand-crimson hover:bg-brand-ink/5 transition-colors cursor-pointer"
                      aria-label="Close collaboration details"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                    {/* Brand Banner & Identity */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                      {/* Round Logo */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-full border-2 border-brand-crimson/20 bg-white p-2.5 shadow-md overflow-hidden flex items-center justify-center">
                        {selectedCollab.brandLogo ? (
                          <Image
                            src={urlFor(selectedCollab.brandLogo).width(200).height(200).url()}
                            alt={`${selectedCollab.brandName} logo`}
                            fill
                            sizes="96px"
                            className="object-contain p-1 rounded-full"
                          />
                        ) : (
                          <span className="font-serif text-2xl font-semibold text-brand-crimson">
                            {selectedCollab.brandName.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Brand Info */}
                      <div className="flex-1 space-y-2">
                        <h2
                          id={`collab-modal-title-${selectedCollab._id}`}
                          className="font-serif text-2xl sm:text-3xl text-brand-crimson font-medium leading-tight"
                        >
                          {selectedCollab.brandName}
                        </h2>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                          {/* Date */}
                          {formattedDate && (
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-brand-ink/5 text-brand-ink/70 rounded-full font-medium">
                              <Calendar className="w-3.5 h-3.5 text-brand-terracotta" />
                              <span>{formattedDate}</span>
                            </span>
                          )}

                          {/* Collab Type */}
                          {selectedCollab.collabType && (
                            <span className="text-xs px-2.5 py-1 bg-brand-terracotta/10 text-brand-terracotta rounded-full uppercase tracking-wider font-medium">
                              {COLLAB_TYPE_LABEL[selectedCollab.collabType] || selectedCollab.collabType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedCollab.description && (
                      <div className="space-y-2">
                        <h3 className="font-serif text-sm uppercase tracking-wider text-brand-ink/50 font-semibold">
                          About the Collaboration
                        </h3>
                        <div className="prose prose-brand text-brand-ink/80 text-sm sm:text-base leading-relaxed max-w-none">
                          <PortableText value={selectedCollab.description} />
                        </div>
                      </div>
                    )}

                    {/* Results / Metrics */}
                    {selectedCollab.resultsOrMetrics && (
                      <div className="p-4 rounded-xl bg-brand-terracotta/5 border border-brand-terracotta/20 flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs uppercase tracking-wider font-semibold text-brand-terracotta block mb-0.5">
                            Results & Impact
                          </span>
                          <p className="text-sm font-medium text-brand-ink/85">
                            {selectedCollab.resultsOrMetrics}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Testimonial Quote */}
                    {selectedCollab.testimonialQuote && (
                      <blockquote className="p-4 rounded-xl bg-brand-vanilla border-l-4 border-l-brand-crimson space-y-2">
                        <div className="flex items-start gap-2">
                          <Quote className="w-4 h-4 text-brand-crimson shrink-0 mt-1 opacity-70" />
                          <p className="font-serif italic text-brand-ink/85 text-sm sm:text-base leading-relaxed">
                            &ldquo;{selectedCollab.testimonialQuote}&rdquo;
                          </p>
                        </div>
                        {selectedCollab.testimonialAuthor && (
                          <footer className="text-xs text-brand-ink/50 text-right pr-2">
                            — {selectedCollab.testimonialAuthor}
                          </footer>
                        )}
                      </blockquote>
                    )}
                  </div>

                  {/* Modal Footer Links */}
                  <div className="px-6 py-4 bg-brand-vanilla border-t border-brand-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto">
                      {/* Collab / Campaign Link */}
                      {activeCollabUrl && (
                        <a
                          href={activeCollabUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-crimson text-brand-cream hover:bg-brand-terracotta transition-colors text-xs sm:text-sm font-medium shadow-xs"
                        >
                          <span>View Collaboration</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Brand Official Website */}
                      {activeBrandUrl && (
                        <a
                          href={activeBrandUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-brand-cream transition-colors text-xs sm:text-sm font-medium"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Brand Website</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCollab(null)}
                      className="px-5 py-2 rounded-full border border-brand-ink/20 text-brand-ink/70 hover:text-brand-ink hover:bg-brand-ink/5 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
