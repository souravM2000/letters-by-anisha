"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

interface CarouselProps {
  children: React.ReactNode;
  itemCount: number;
  className?: string;
  showArrows?: boolean;
}

export function Carousel({
  children,
  itemCount,
  className = "",
  showArrows = true,
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(itemCount > 1);
  const reduced = useReducedMotion();

  // Update active dot and arrow visibility on scroll
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    const items = el.children;
    if (items.length === 0) return;

    const containerCenter = scrollLeft + clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(items).forEach((child, idx) => {
      const htmlChild = child as HTMLElement;
      const childCenter = htmlChild.offsetLeft + htmlChild.offsetWidth / 2;
      const dist = Math.abs(childCenter - containerCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollToIndex = (index: number) => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.children;
    if (index >= 0 && index < items.length) {
      const targetChild = items[index] as HTMLElement;
      if (targetChild) {
        const isMobile = window.innerWidth < 768;
        const left = isMobile
          ? targetChild.offsetLeft - (el.clientWidth - targetChild.offsetWidth) / 2
          : targetChild.offsetLeft;

        el.scrollTo({
          left: Math.max(0, left),
          behavior: "smooth",
        });
      }
    }
  };

  const scrollPrev = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth * 0.75, behavior: "smooth" });
  };

  const scrollNext = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.75, behavior: "smooth" });
  };

  if (itemCount <= 0) return null;

  return (
    <div className="relative group/carousel w-full">
      {/* Scrollable Container with staggered motion */}
      {reduced ? (
        <div
          ref={containerRef}
          className={`flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-5 md:gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide ${className}`}
        >
          {children}
        </div>
      ) : (
        <motion.div
          ref={containerRef}
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className={`flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-5 md:gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide ${className}`}
        >
          {children}
        </motion.div>
      )}

      {/* Navigation Arrows (Desktop / Tablet) */}
      {showArrows && itemCount > 1 && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canScrollLeft}
            aria-label="Previous item"
            className={`hidden md:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-brand-cream text-brand-ink shadow-md border border-brand-ink/10 backdrop-blur-xs transition-all duration-300 hover:scale-110 hover:bg-brand-crimson hover:text-brand-cream disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
              canScrollLeft ? "opacity-90 hover:opacity-100" : "opacity-0"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollRight}
            aria-label="Next item"
            className={`hidden md:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-brand-cream text-brand-ink shadow-md border border-brand-ink/10 backdrop-blur-xs transition-all duration-300 hover:scale-110 hover:bg-brand-crimson hover:text-brand-cream disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
              canScrollRight ? "opacity-90 hover:opacity-100" : "opacity-0"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {itemCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-1">
          {Array.from({ length: itemCount }).map((_, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to item ${idx + 1}`}
                className={`transition-colors duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/50 cursor-pointer w-2.5 h-2.5 ${
                  isActive
                    ? "bg-brand-ink/80 shadow-xs"
                    : "bg-brand-ink/20 hover:bg-brand-ink/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CarouselItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={fadeUpVariants}>
      {children}
    </motion.div>
  );
}
