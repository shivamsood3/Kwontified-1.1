import Link from "next/link";
import { ui } from "@/lib/icons";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

/** §4.13 — breadcrumbs. */
export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-caption">
      {items.map((c, i) => (
        <span key={c.label} className="flex items-center gap-2">
          {c.href ? (
            <Link
              href={c.href}
              className={cn(dark ? "text-white/50 hover:text-white" : "text-muted hover:text-ink")}
            >
              {c.label}
            </Link>
          ) : (
            <span className={cn(dark ? "text-white/80" : "text-ink")}>{c.label}</span>
          )}
          {i < items.length - 1 && (
            <span className={cn(dark ? "text-white/30" : "text-ink-300")}>/</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** §4.13 — skip link (keyboard). */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>
  );
}

/** §4.13 — back to top. */
export function BackToTop() {
  return (
    <a
      href="#top"
      className="inline-flex items-center gap-1.5 text-caption text-muted transition hover:text-ink"
    >
      <ui.ArrowUpRight size={16} weight="light" />
      Back to top
    </a>
  );
}
