"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "../ui/Container";

const NAV_LINKS = [
  { name: "About", href: "#about" },
  { name: "Reach", href: "#reach" },
  { name: "Top Posts", href: "#posts" },
  { name: "Collabs", href: "#collabs" },
  { name: "Reviews", href: "#reviews" },
  { name: "Writing", href: "#writing" },
  { name: "Education", href: "#education" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-vanilla shadow-sm py-4 editorial-border border-b border-t-0 border-x-0"
          : "bg-transparent py-6"
      }`}
    >
      <Container className="flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-2xl tracking-wide text-brand-crimson font-medium"
        >
          Letters by Anisha
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-brand-ink/80 hover:text-brand-crimson transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-brand-ink p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-brand-vanilla border-b editorial-border shadow-lg p-6 flex flex-col space-y-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-brand-ink/90 hover:text-brand-crimson transition-colors text-lg font-medium uppercase tracking-wide py-2 border-b border-brand-ink/5 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
