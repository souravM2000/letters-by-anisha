import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  bgClass?: string; // e.g., 'bg-brand-vanilla' or 'bg-brand-cream'
}

export function Section({ id, children, className = "", bgClass = "" }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-32 ${bgClass} ${className}`}>
      {children}
    </section>
  );
}
