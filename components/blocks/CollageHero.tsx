import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import type { Crumb } from "@/components/sections/PageHero";

/**
 * v1.2 inner hero (interim breadth skin) — solid navy band with white
 * breadcrumb/eyebrow/title/intro on the left and a single image on the right.
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
    <section className="relative w-full overflow-hidden bg-navy-900">
      {crumbs && crumbs.length > 0 && (
        <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
      )}
      <div className="grid md:grid-cols-2">
        <div className="flex items-center py-16 md:py-24">
          <div className="container-kw md:pr-0">
            <div className="max-w-xl">
              {crumbs && crumbs.length > 0 && (
                <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-white/55">
                  {crumbs.map((c, i) => (
                    <span key={c.label} className="flex items-center gap-2">
                      {c.href ? (
                        <Link href={c.href} className="hover:text-white">{c.label}</Link>
                      ) : (
                        <span className="text-white/80">{c.label}</span>
                      )}
                      {i < crumbs.length - 1 && <span className="text-white/30">/</span>}
                    </span>
                  ))}
                </nav>
              )}
              {eyebrow && <p className="eyebrow-light">{eyebrow}</p>}
              <h1 className="h-display mt-4 text-[clamp(38px,4.6vw,66px)] leading-[1.04] text-white">{title}</h1>
              {intro && <p className="mt-6 max-w-lg text-lead text-white/80">{intro}</p>}
            </div>
          </div>
        </div>
        <div className="relative hidden min-h-[340px] md:block">
          <Img id={ids[0]} priority sizes="50vw" position="center" />
        </div>
      </div>
    </section>
  );
}
