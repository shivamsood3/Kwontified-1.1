import { marketplaceLogos } from "@/lib/content/marketplaceLogos";
import { cn } from "@/lib/cn";

/**
 * §5.4 — a marketplace brand mark. `tone="brand"` uses the official colour (on
 * white tiles); `tone="white"` renders it white (hero and DeviceFrame top bar).
 * Height is set by the parent via `className` (e.g. "h-10"); width is auto.
 */
export function MarketplaceLogo({
  slug,
  tone = "brand",
  className,
}: {
  slug: string;
  tone?: "brand" | "white";
  className?: string;
}) {
  const logo = marketplaceLogos[slug];
  if (!logo) return null;
  const color = tone === "white" ? "#ffffff" : logo.color;

  if (logo.d && logo.viewBox) {
    return (
      <svg
        viewBox={logo.viewBox}
        role="img"
        aria-label={logo.label}
        className={cn("w-auto", className)}
      >
        <title>{logo.label}</title>
        <path d={logo.d} fill={color} />
      </svg>
    );
  }
  // Wordmark fallback (Mercado Libre, Temu) until an official SVG is supplied.
  return (
    <span
      aria-label={logo.label}
      className={cn("inline-flex items-center font-semibold tracking-tight", className)}
      style={{ color, fontSize: "1em", lineHeight: 1 }}
    >
      {logo.wordmark}
    </span>
  );
}
