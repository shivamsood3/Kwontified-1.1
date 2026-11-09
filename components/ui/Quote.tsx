import { ui } from "@/lib/icons";
import { cn } from "@/lib/cn";

/** §4.11 — quote glyph + quote at h2 scale (weight 400) + attribution. */
export function Quote({
  children,
  name,
  title,
  company,
  tone = "light",
  align = "center",
}: {
  children: React.ReactNode;
  name?: string;
  title?: string;
  company?: string;
  tone?: "light" | "dark";
  align?: "center" | "left";
}) {
  const dark = tone === "dark";
  return (
    <figure className={cn(align === "center" && "mx-auto max-w-3xl text-center")}>
      <ui.Quote
        size={40}
        weight="fill"
        className={cn("text-brand-600", align === "center" && "mx-auto")}
        aria-hidden="true"
      />
      <blockquote
        className={cn(
          "h-display mt-4 text-h2",
          dark ? "text-white" : "text-ink",
        )}
      >
        {children}
      </blockquote>
      {(name || title || company) && (
        <figcaption
          className={cn("mt-6 text-small", dark ? "text-white/70" : "text-muted")}
        >
          {name && <span className="font-medium text-ink">{name}</span>}
          {name && (title || company) && " · "}
          {[title, company].filter(Boolean).join(", ")}
        </figcaption>
      )}
    </figure>
  );
}
