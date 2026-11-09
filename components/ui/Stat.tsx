import { cn } from "@/lib/cn";

/** §4.4 — big number + label. */
export function Stat({
  value,
  label,
  sub,
  tone = "dark",
  size = "md",
  className,
}: {
  value: string;
  label: string;
  sub?: string;
  tone?: "dark" | "light";
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <div
        className={cn(
          "h-display",
          size === "lg" ? "text-stat" : "text-[clamp(36px,3.4vw,48px)] leading-none",
          tone === "dark" ? "text-brand-300" : "text-brand-600",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-2 text-caption font-medium",
          tone === "dark" ? "text-white/90" : "text-ink",
        )}
      >
        {label}
      </div>
      {sub && (
        <p
          className={cn(
            "mt-1 text-small leading-snug",
            tone === "dark" ? "text-white/55" : "text-muted",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
