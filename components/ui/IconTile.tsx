import type { Icon } from "@/lib/icons";
import { cn } from "@/lib/cn";

/**
 * §4.3 — square icon tile.
 * light: blue-100 bg + blue-600 icon. dark: ink-800 bg + blue-300 icon.
 * md = 48px tile / 24px icon. lg = 64px tile / 32px icon.
 */
export function IconTile({
  icon: IconCmp,
  size = "md",
  tone = "light",
  className,
}: {
  icon: Icon;
  size?: "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
}) {
  const box = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const iconSize = size === "lg" ? 32 : 24;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        box,
        tone === "dark" ? "bg-ink-800 text-brand-300" : "bg-brand-100 text-brand-600",
        className,
      )}
    >
      <IconCmp size={iconSize} weight="light" />
    </span>
  );
}
