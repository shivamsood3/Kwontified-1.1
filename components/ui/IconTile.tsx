import type { Icon } from "@/lib/icons";
import { cn } from "@/lib/cn";

/**
 * §2.4 — icon tile (rounded).
 * light: sand-200 bg + navy icon. dark: navy-800 bg + gold icon.
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
        "inline-flex shrink-0 items-center justify-center rounded-lg",
        box,
        tone === "dark" ? "bg-navy-800 text-gold-500" : "bg-sand-200 text-navy-900",
        className,
      )}
    >
      <IconCmp size={iconSize} weight="light" />
    </span>
  );
}
