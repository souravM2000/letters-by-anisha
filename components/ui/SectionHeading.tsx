import { FadeUp } from "@/components/ui/Motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  animated?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  animated = true,
}: SectionHeadingProps) {
  const content = (
    <div
      className={`mb-8 md:mb-10 flex flex-col ${
        align === "center" ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {eyebrow && (
        <span className="font-handwritten text-2xl text-brand-terracotta mb-1 inline-block">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-crimson font-medium">
        {title}
      </h2>
      <div
        className={`h-0.5 w-14 bg-brand-terracotta mt-4 ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );

  if (!animated) return content;

  return <FadeUp>{content}</FadeUp>;
}
