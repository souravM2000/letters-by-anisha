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
        fill="currentColor"
        className={className}
      >
        <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0" />
      </svg>
    );
  }

  if (p.includes("thread")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
      >
        <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
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

  if (p.includes("substack")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
      >
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    );
  }

  if (p.includes("pinterest")) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
      >
        <path d="M12 0a12 12 0 0 0-4.37 23.18c-.02-.95.04-2.1.25-3l1.52-6.43s-.38-.76-.38-1.88c0-1.76 1.02-3.08 2.29-3.08 1.08 0 1.6 0.81 1.6 1.78 0 1.09-.69 2.71-1.05 4.22-.3 1.27.63 2.3 1.88 2.3 2.26 0 3.79-2.9 3.79-6.34 0-2.61-1.76-4.56-4.94-4.56-3.6 0-5.85 2.68-5.85 5.68 0 1.03.3 1.76.78 2.33.22.26.25.37.17.68-.06.24-.2.82-.26 1.06-.09.33-.29.45-.66.31-2.07-.84-3.03-3.1-3.03-5.63 0-4.17 3.52-9.18 10.51-9.18 5.6 0 9.28 4.05 9.28 8.41 0 5.76-3.21 10.06-7.94 10.06-1.59 0-3.08-.86-3.6-1.83l-.98 3.91c-.34 1.3-1.2 2.62-1.92 3.52A11.98 11.98 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
      </svg>
    );
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
