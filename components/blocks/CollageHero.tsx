import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import type { Crumb } from "@/components/sections/PageHero";

/**
 * §5.0-2 — inner-page hero. Full-bleed row of 3–4 portrait (3:4) tiles with no
 * gaps; left gradient; breadcrumb, eyebrow, H1 and intro in white on the left.
 * Mobile shows the first tile only.
 */
export function CollageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  ids,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  ids: string[];
}) {
  return (
    <section className="relative w-full border-b border-gold-500 bg-navy-900">
      {crumbs && crumbs.length > 0 && (
        <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
      )}
      <div className="relative h-[480px] md:h-[540px]">
        {/* Tiles */}
        <div className="absolute inset-0 flex">
          {ids.map((id, i) => (
            <div
              key={id}
              className={i === 0 ? "relative block flex-1" : "relative hidden flex-1 md:block"}
            >
              <Img
                id={id}
                priority={i === 0}
                sizes={`(max-width: 768px) 100vw, ${Math.round(100 / ids.length)}vw`}
                position="center"
              />
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(14,26,48,.88) 0%, rgba(14,26,48,.6) 45%, rgba(14,26,48,.15) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container-kw">
            <div className="max-w-2xl">
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
              <h1 className="h-display mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.05] text-white">
                {title}
              </h1>
              {intro && <p className="mt-5 max-w-xl text-lead text-white/80">{intro}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
