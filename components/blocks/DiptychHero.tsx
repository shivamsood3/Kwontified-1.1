import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/site/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import type { Crumb } from "@/components/sections/PageHero";

/**
 * §5.0-2 (2-tile) — capability / channel / contact hero. Two tiles, 560px.
 * Left gradient with the copy; an optional marketplace logo sits bottom-right.
 */
export function DiptychHero({
  crumbs,
  eyebrow,
  title,
  intro,
  leftId,
  rightId,
  primary,
  secondary,
  logo,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  leftId: string;
  rightId: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  /** white marketplace logo, placed bottom-right of the hero */
  logo?: React.ReactNode;
}) {
  return (
    <section className="relative w-full border-b border-gold-500 bg-navy-900">
      {crumbs && crumbs.length > 0 && (
        <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
      )}
      <div className="relative h-[460px] md:h-[560px]">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
          <div className="relative">
            <Img id={leftId} priority sizes="(max-width: 768px) 100vw, 50vw" position="center" />
          </div>
          <div className="relative hidden md:block">
            <Img id={rightId} sizes="50vw" position="center" />
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(14,26,48,.9) 0%, rgba(14,26,48,.62) 45%, rgba(14,26,48,.2) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container-kw">
            <div className="max-w-xl">
              {crumbs && crumbs.length > 0 && (
                <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/55">
                  {crumbs.map((c, i) => (
                    <span key={c.label} className="flex items-center gap-2">
                      {c.href ? (
                        <Link href={c.href} className="hover:text-white">
                          {c.label}
                        </Link>
                      ) : (
                        <span className="text-white/75">{c.label}</span>
                      )}
                      {i < crumbs.length - 1 && <span className="text-white/30">/</span>}
                    </span>
                  ))}
                </nav>
              )}
              {eyebrow && <p className="eyebrow-light">{eyebrow}</p>}
              <h1 className="h-display mt-4 text-[clamp(32px,4.2vw,50px)] leading-[1.05] text-white">
                {title}
              </h1>
              {intro && <p className="mt-5 max-w-lg text-lead text-white/80">{intro}</p>}
              {(primary || secondary) && (
                <div className="mt-7 flex flex-wrap gap-3">
                  {primary && (
                    <Button href={primary.href} variant="primary" size="lg">
                      {primary.label}
                    </Button>
                  )}
                  {secondary && (
                    <Button href={secondary.href} variant="outline-light" size="lg">
                      {secondary.label}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {logo && (
          <div className="absolute bottom-16 right-16 hidden h-12 items-center md:flex" aria-hidden="true">
            {logo}
          </div>
        )}
      </div>
    </section>
  );
}
