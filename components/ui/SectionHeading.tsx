import Link from "next/link";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  link,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        link && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn(align === "center" ? "max-w-2xl" : "max-w-3xl")}>
        {eyebrow && (
          <p className={tone === "dark" ? "eyebrow-light" : "eyebrow"}>{eyebrow}</p>
        )}
        <h2
          className={cn(
            "h-display mt-2 text-3xl md:text-4xl",
            tone === "dark" ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
        {intro && (
          <p
            className={cn(
              "mt-4 text-[1.0625rem] leading-relaxed",
              tone === "dark" ? "text-white/70" : "text-muted",
            )}
          >
            {intro}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={cn(
            "link-underline shrink-0 text-sm",
            tone === "dark" && "text-brand-300 hover:text-white",
          )}
        >
          {link.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      )}
    </div>
  );
}
