import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/site/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import type { Crumb } from "@/components/sections/PageHero";

/**
 * v1.2 inner hero (interim breadth skin) — solid navy band with white copy on
 * the left and an image on the right. An optional marketplace logo sits bottom-right.
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
  logo?: React.ReactNode;
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
              <h1 className="h-display mt-4 text-[clamp(38px,4.4vw,60px)] leading-[1.05] text-white">{title}</h1>
              {intro && <p className="mt-6 max-w-lg text-lead text-white/80">{intro}</p>}
              {(primary || secondary) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {primary && <Button href={primary.href} variant="primary" size="lg">{primary.label}</Button>}
                  {secondary && <Button href={secondary.href} variant="outline-light" size="lg">{secondary.label}</Button>}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative hidden min-h-[360px] md:block">
          <Img id={rightId || leftId} priority sizes="50vw" position="center" />
          {logo && <div className="absolute bottom-10 right-10 flex h-10 items-center" aria-hidden="true">{logo}</div>}
        </div>
      </div>
    </section>
  );
}
