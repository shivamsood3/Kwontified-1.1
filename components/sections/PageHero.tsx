import Link from "next/link";
import { Button } from "@/components/site/Button";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  cta,
  secondaryCta,
  children,
  align = "split",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  cta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** optional right-column content (stat panel, figure) */
  children?: React.ReactNode;
  align?: "split" | "center";
}) {
  const centered = align === "center" || !children;
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="hero-texture absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 120% at 80% -10%, rgba(43,148,219,0.28), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "container-kw relative grid gap-12 py-16 md:py-20",
          children ? "lg:grid-cols-2 lg:items-center" : "",
        )}
      >
        <div className={cn(centered && !children ? "max-w-3xl" : "")}>
          {crumbs && (
            <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/50">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-white/70">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span className="text-white/30">/</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <p className="eyebrow-light">{eyebrow}</p>}
          <h1 className="h-display mt-3 text-4xl leading-[1.05] md:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {intro}
            </p>
          )}
          {(cta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {cta && (
                <Button href={cta.href} variant="light" size="lg">
                  {cta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="outline-light" size="lg">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>
        {children && <div className="relative">{children}</div>}
      </div>
    </section>
  );
}
