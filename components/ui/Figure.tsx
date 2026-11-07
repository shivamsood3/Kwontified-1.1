import Image from "next/image";
import { cn } from "@/lib/cn";

type Ratio = "16/9" | "4/3" | "3/2" | "1/1" | "3/4" | "21/9";

const ratioClass: Record<Ratio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "21/9": "aspect-[21/9]",
};

/**
 * Figure is the single imagery slot used across the site.
 * Pass `src` to render real photography (next/image). With no `src`
 * it renders a branded, labelled placeholder so every image slot is
 * visible and swappable without touching layout.
 */
export function Figure({
  src,
  alt = "",
  ratio = "4/3",
  label,
  tone = "light",
  className,
  rounded = "rounded-xl",
  priority,
}: {
  src?: string;
  alt?: string;
  ratio?: Ratio;
  label?: string;
  tone?: "light" | "dark" | "brand";
  className?: string;
  rounded?: string;
  priority?: boolean;
}) {
  const toneClass =
    tone === "dark"
      ? "bg-ink-800 text-white/70"
      : tone === "brand"
        ? "bg-gradient-to-br from-brand-600 to-brand-800 text-white/80"
        : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        ratioClass[ratio],
        rounded,
        !src && toneClass,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className="opacity-70"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="8.5" cy="9.5" r="1.8" />
            <path d="M21 16l-5-5L5 20" />
          </svg>
          {label && (
            <span className="max-w-[80%] text-xs font-medium leading-snug opacity-80">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
