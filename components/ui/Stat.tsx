import { cn } from "@/lib/cn";

export function Stat({
  value,
  label,
  sub,
  tone = "dark",
  className,
}: {
  value: string;
  label: string;
  sub?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <div
        className={cn(
          "h-display text-4xl md:text-5xl",
          tone === "dark" ? "text-white" : "text-brand-600",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-2 text-sm font-medium",
          tone === "dark" ? "text-white/90" : "text-ink",
        )}
      >
        {label}
      </div>
      {sub && (
        <p
          className={cn(
            "mt-1 text-sm leading-snug",
            tone === "dark" ? "text-white/55" : "text-muted",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
