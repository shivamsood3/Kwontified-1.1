import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/site/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import type { Crumb } from "@/components/sections/PageHero";

/**
 * v1.2 inner-page hero — a full-bleed bright photo with a calm light-left area,
 * breadcrumb + H1 + intro + CTA set in navy over the left of the image.
 */
export function InnerHero({
  crumbs,
  eyebrow,
  title,
  intro,
  imageId,
  cta,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: string;
  intro?: string;
  imageId: string;
  cta?: { href: string; label: string };
}) {
  return (
    <section className="relative w-full overflow-hidden bg-cream-100">
      {crumbs && crumbs.length > 0 && (
        <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} />
      )}
      <div className="absolute inset-0">
        <Img id={imageId} priority sizes="100vw" position="center right" />
        {/* light gradient so navy text stays legible over the left */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, #F8F6F1 0%, #F8F6F1e6 30%, #F8F6F1a6 44%, #F8F6F133 60%, transparent 74%)" }}
          aria-hidden="true"
        />
      </div>
      <div className="container-kw relative flex min-h-[520px] items-center py-16 md:min-h-[600px]">
        <div className="max-w-xl">
          {crumbs && crumbs.length > 0 && (
            <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex items-center gap-2">
                  {c.href ? (
                    <Link href={c.href} className="underline decoration-ink-faint/50 underline-offset-2 hover:text-navy-900">{c.label}</Link>
                  ) : (
                    <span className="text-navy-900">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span className="text-ink-faint">/</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="h-display mt-4 text-[clamp(38px,4.6vw,68px)] leading-[1.04] text-navy-900">{title}</h1>
          {intro && <p className="mt-6 max-w-lg text-lead text-ink">{intro}</p>}
          {cta && (
            <div className="mt-8">
              <Button href={cta.href} variant="navy" size="lg">{cta.label}</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
