"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink, ShoppingCart, BookOpen } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { StarRating } from "@/components/ui/StarRating";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { urlFor } from "@/sanity/lib/image";
import type { BookReview } from "@/sanity/types";

interface BookReviewCardProps {
  review: BookReview;
}

export function BookReviewCard({ review }: BookReviewCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasFullReview = Boolean(review.fullReview && review.fullReview.length > 0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close modal on Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="group w-full bg-brand-cream editorial-border overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 rounded-lg h-full">
        {/* Book Cover Display (Clicking opens review popup) */}
        <div
          onClick={openModal}
          className="py-4 px-4 bg-brand-ink/[0.02] flex items-center justify-center border-b border-brand-ink/10 cursor-pointer"
          title="Click to view full review"
        >
          <div className="relative w-20 sm:w-24 aspect-[2/3] shadow-md rounded-sm overflow-hidden bg-brand-vanilla">
            {review.coverImage ? (
              <Image
                src={urlFor(review.coverImage).width(300).height(450).url()}
                alt={`Cover of ${review.bookTitle}`}
                fill
                sizes="100px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-serif text-brand-ink/20 text-xs italic">
                  No cover
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 text-center">
          <div onClick={openModal} className="cursor-pointer">
            <h3 className="font-serif text-base text-brand-ink mb-0.5 group-hover:text-brand-crimson transition-colors line-clamp-1 font-medium">
              {review.bookTitle}
            </h3>
            <p className="text-xs text-brand-ink/60 mb-2 italic">
              by {review.author}
            </p>

            {/* Rating */}
            {review.rating != null && (
              <div className="flex justify-center mb-2">
                <StarRating rating={review.rating} />
              </div>
            )}

            {/* Genre tags */}
            {review.genre && review.genre.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mb-2">
                {review.genre.map((g: string) => (
                  <span
                    key={g}
                    className="text-[10px] px-2 py-0.5 bg-brand-terracotta/10 text-brand-terracotta rounded-sm uppercase tracking-wider font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Excerpt */}
            {review.reviewExcerpt && (
              <p className="text-xs text-brand-ink/70 leading-relaxed line-clamp-2 mb-2">
                {review.reviewExcerpt}
              </p>
            )}
          </div>

          {/* Read review trigger if full review is available */}
          {hasFullReview && (
            <button
              type="button"
              onClick={openModal}
              className="text-xs text-brand-crimson hover:text-brand-terracotta font-medium flex items-center justify-center gap-1 mb-2 cursor-pointer transition-colors mx-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Full Review</span>
            </button>
          )}

          {/* Action Buttons: Buy Link & Instagram Link */}
          {(review.affiliateLink || review.associatedReelUrl) && (
            <div className="mt-auto pt-2.5 border-t border-brand-ink/10 flex flex-wrap items-center justify-center gap-2">
              {review.affiliateLink && (
                <a
                  href={review.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-crimson text-brand-cream hover:bg-brand-terracotta transition-colors text-xs font-medium"
                  title="Buy Link"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Buy Link</span>
                </a>
              )}

              {review.associatedReelUrl && (
                <a
                  href={review.associatedReelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-brand-cream transition-colors text-xs font-medium"
                  title="Watch on Instagram"
                >
                  <SocialIcon platform="instagram" className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Review Animated Popup Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
              >
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-brand-ink/60 backdrop-blur-xs cursor-pointer"
                  aria-hidden="true"
                />

                {/* Modal Dialog Card */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`review-modal-title-${review._id}`}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-2xl bg-brand-cream border border-brand-crimson/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10 mx-auto my-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header Bar */}
                  <div className="relative flex items-center justify-center px-6 py-4 border-b border-brand-ink/10 bg-brand-vanilla">
                    <span className="font-handwritten text-2xl text-brand-terracotta">
                      Book Review
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-brand-ink/70 hover:text-brand-crimson hover:bg-brand-ink/5 transition-colors cursor-pointer"
                      aria-label="Close review"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Body (Scrollable) */}
                  <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                  {/* Book Header info */}
                  <div className="flex flex-col gap-5 items-center text-center">
                    {/* Book Cover */}
                    <div className="relative w-32 sm:w-40 aspect-[2/3] shrink-0 shadow-lg rounded-md overflow-hidden bg-brand-vanilla border border-brand-ink/10 mx-auto">
                      {review.coverImage ? (
                        <Image
                          src={urlFor(review.coverImage).width(400).height(600).url()}
                          alt={`Cover of ${review.bookTitle}`}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-serif text-brand-ink/20 text-xs italic">
                            No cover
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta details */}
                    <div className="flex-1 space-y-2.5 w-full max-w-md mx-auto">
                      <h2
                        id={`review-modal-title-${review._id}`}
                        className="font-serif text-2xl sm:text-3xl text-brand-crimson font-medium leading-tight"
                      >
                        {review.bookTitle}
                      </h2>
                      <p className="text-sm sm:text-base text-brand-ink/70 italic">
                        by {review.author}
                      </p>

                      {review.rating != null && (
                        <div className="flex justify-center">
                          <StarRating rating={review.rating} />
                        </div>
                      )}

                      {review.genre && review.genre.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                          {review.genre.map((g: string) => (
                            <span
                              key={g}
                              className="text-xs px-2.5 py-0.5 bg-brand-terracotta/10 text-brand-terracotta rounded-full uppercase tracking-wider font-medium"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                    {/* Excerpt callout */}
                    {review.reviewExcerpt && (
                      <div className="p-4 rounded-xl bg-brand-terracotta/5 border-t-3 border-b-3 border-brand-crimson/20 italic text-brand-ink/80 text-sm sm:text-base leading-relaxed text-center">
                        &ldquo;{review.reviewExcerpt}&rdquo;
                      </div>
                    )}

                    {/* Full Review Content */}
                    {hasFullReview ? (
                      <div className="space-y-3 pt-2">
                        <h4 className="font-serif text-lg text-brand-crimson font-medium text-center">
                          Full Review
                        </h4>
                        <div className="prose prose-brand text-brand-ink/90 leading-relaxed font-sans max-w-none text-sm sm:text-base text-left">
                          <PortableText value={review.fullReview!} />
                        </div>
                      </div>
                    ) : !review.reviewExcerpt ? (
                      <p className="text-brand-ink/50 text-sm italic text-center">
                        No review text provided yet.
                      </p>
                    ) : null}
                  </div>

                  {/* Modal Footer / Action Bar */}
                  <div className="px-6 py-5 bg-brand-vanilla border-t border-brand-ink/10 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {review.affiliateLink && (
                        <a
                          href={review.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-crimson text-brand-cream hover:bg-brand-terracotta transition-colors text-sm font-medium shadow-xs"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Buy Link</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      )}

                      {review.associatedReelUrl && (
                        <a
                          href={review.associatedReelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2 rounded-full border border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-brand-cream transition-colors text-sm font-medium"
                        >
                          <SocialIcon platform="instagram" className="w-4 h-4" />
                          <span>Watch on Instagram</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2 rounded-full border border-brand-ink/20 text-brand-ink/70 hover:text-brand-ink hover:bg-brand-ink/5 transition-colors text-sm font-medium cursor-pointer"
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
