"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "../ui/Container";

const NAV_LINKS = [
  { name: "Reviews", href: "#reviews" },
  { name: "Writing", href: "#writing" },
  { name: "Collabs", href: "#collabs" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
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
            <Link
              key={link.name}
              href={link.href}
              className="text-brand-ink/80 hover:text-brand-crimson transition-colors font-medium text-sm tracking-wide uppercase"
            >
              {link.name}
            </Link>
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
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-ink/90 hover:text-brand-crimson transition-colors text-lg font-medium uppercase tracking-wide py-2 border-b border-brand-ink/5"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
