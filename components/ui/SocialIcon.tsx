import React from "react";
import { Mail, Globe, BookOpen, Music, Radio } from "lucide-react";

interface SocialIconProps {
  platform: string;
  className?: string;
}

export function SocialIcon({ platform, className = "w-5 h-5" }: SocialIconProps) {
  const p = platform?.toLowerCase().trim() || "";

  if (p.includes("instagram")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }

  if (p.includes("linkedin")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }

  if (p.includes("youtube")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M2.5 7.1C2.1 8.4 2 10.2 2 12s.1 3.6.5 4.9a4 4 0 0 0 2.8 2.8c1.3.4 4 .5 6.7.5s5.4-.1 6.7-.5a4 4 0 0 0 2.8-2.8c.4-1.3.5-3.1.5-4.9s-.1-3.6-.5-4.9a4 4 0 0 0-2.8-2.8C17.4 4.1 14.7 4 12 4s-5.4.1-6.7.5a4 4 0 0 0-2.8 2.8z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    );
  }

  if (p.includes("wordpress")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M3.5 12.5l5.5 10 3.5-9" />
        <path d="M18.5 7.5l-4.5 11" />
        <path d="M7 6.5h3.5" />
      </svg>
    );
  }

  if (p.includes("thread")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M19 12a7 7 0 1 0-7 7c2.5 0 4.5-1.2 5.5-3" />
        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
      </svg>
    );
  }

  if (p.includes("twitter") || p === "x") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 4l11.733 16h4.267l-11.733-16z" />
        <path d="M4 20l6.768-6.768m3.464-3.464l5.768-5.768" />
      </svg>
    );
  }

  if (p.includes("tiktok")) {
    return <Music className={className} />;
  }

  if (p.includes("goodread") || p.includes("book")) {
    return <BookOpen className={className} />;
  }

  if (p.includes("spotify") || p.includes("podcast")) {
    return <Radio className={className} />;
  }

  if (p.includes("email") || p.includes("mail")) {
    return <Mail className={className} />;
  }

  return <Globe className={className} />;
}

export function formatSocialUrl(url: string, platform?: string): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:")) {
    return trimmed;
  }
  if (platform?.toLowerCase().includes("email") || trimmed.includes("@") && !trimmed.includes("/")) {
    return `mailto:${trimmed}`;
  }
  return `https://${trimmed}`;
}
