"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container } from "../ui/Container";

const NAV_LINKS = [
  { name: "About", href: "/#about" },
  { name: "Top Posts", href: "/#posts" },
  { name: "Collabs", href: "/#collabs" },
  { name: "Reviews", href: "/reviews" },
  { name: "Writing", href: "/writing" },
  { name: "Shop My Picks", href: "/shelf", highlight: true },
];

export interface NavbarClientProps {
  name?: string;
  tagline?: string;
}

export function NavbarClient({
  name = "Letters by Anisha",
  tagline = "Exploring words and worlds.",
}: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    // Hash link on the home page
    if (href.startsWith("/#")) {
      e.preventDefault();
      const hash = href.slice(1); // -> "#about"
      if (pathname === "/") {
        // Already on home — smooth scroll
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", hash);
        }
      } else {
        // Navigate to home then let browser handle hash
        router.push(href);
      }
    } else {
      // Pure path links (/reviews, /writing, /shelf)
      e.preventDefault();
      router.push(href);
    }
  };

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-brand-vanilla shadow-sm py-3 editorial-border border-b border-t-0 border-x-0"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <Container className="flex items-center justify-between">
        {/* Brand Name & Tagline */}
        <Link
          href="/"
          onClick={handleBrandClick}
          className="group flex flex-col items-start focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta/40 rounded-sm"
          aria-label={`${name} - ${tagline}`}
        >
          <span className="font-serif text-xl sm:text-2xl tracking-wide text-brand-crimson font-medium leading-tight group-hover:text-brand-terracotta transition-colors duration-200">
            {name}
          </span>
          {tagline && (
            <span className="font-handwritten text-base sm:text-lg md:text-xl text-brand-terracotta/90 -mt-0.5 tracking-wide leading-tight group-hover:text-brand-crimson transition-colors duration-200">
              {tagline}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) =>
            link.highlight ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-brand-crimson hover:text-brand-terracotta transition-colors font-semibold text-sm tracking-wide uppercase cursor-pointer"
              >
                {link.name}
              </a>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-brand-ink/80 hover:text-brand-crimson transition-colors font-medium text-sm tracking-wide uppercase cursor-pointer"
              >
                {link.name}
              </a>
            )
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-brand-ink p-2 -mr-2 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-brand-vanilla border-b editorial-border shadow-lg p-6 flex flex-col space-y-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`transition-colors text-lg font-medium uppercase tracking-wide py-2 border-b border-brand-ink/5 cursor-pointer ${
                link.highlight
                  ? "text-brand-crimson font-semibold"
                  : "text-brand-ink/90 hover:text-brand-crimson"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
