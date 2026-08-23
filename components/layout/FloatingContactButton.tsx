"use client";

import { Mail } from "lucide-react";

export function FloatingContactButton() {
  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "#contact");
    }
  };

  return (
    <a
      href="#contact"
      onClick={handleScrollToContact}
      aria-label="Navigate to Contact Section"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-brand-crimson hover:bg-brand-terracotta text-brand-cream pl-3.5 pr-4 py-3 rounded-full shadow-lg hover:shadow-2xl border border-brand-cream/20 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
    >
      <span className="relative flex items-center justify-center">
        <Mail className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cream opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cream"></span>
        </span>
      </span>
      <span className="font-sans text-xs uppercase tracking-widest font-semibold">
        Contact
      </span>
    </a>
  );
}

