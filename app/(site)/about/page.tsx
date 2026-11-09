import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Figure } from "@/components/ui/Figure";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kwontified is built by marketplace operators — people who have managed marketplace businesses firsthand across platforms, countries and stages of growth.",
  alternates: { canonical: "/about" },
};

const related = [
  { kicker: "Company", title: "Careers at Kwontified", href: "/about/careers" },
  { kicker: "Work", title: "Case studies with figures", href: "/work" },
  { kicker: "Perspectives", title: "What we’re seeing in the market", href: "/perspectives" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built by marketplace operators."
        intro="Every member of our leadership team has managed marketplace businesses firsthand — across platforms, countries and stages of growth."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        cta={{ href: "/about/leadership", label: "Meet the leadership" }}
        secondaryCta={{ href: "/about/careers", label: "See open roles" }}
      >
        <Figure src="/stock/about-hero.jpg" alt="The Kwontified team at work" ratio="4/3" priority />
      </PageHero>

      {/* Three offices */}
      <section className="bg-ink text-white">
        <div className="container-kw py-16">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <h2 className="h-display text-3xl text-white">Three offices, one team.</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {site.offices.map((o) => (
                <div key={o.label}>
                  <h3 className="h-display text-xl text-white">{o.label}</h3>
                  {o.note && (
                    <p className="text-xs text-brand-300">
                      {o.note}
                    </p>
                  )}
                  <div className="mt-2 text-sm leading-relaxed text-white/60">
                    {o.lines.map((l) => (
                      <span key={l} className="block">{l}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6">
            <Link href="/about/leadership" className="link-underline text-brand-300 hover:text-white">
              Full leadership bios →
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.title} href={r.href} className="group">
                <p className="text-xs font-normal text-muted">
                  {r.kicker}
                </p>
                <h3 className="h-display mt-2 text-lg text-ink group-hover:text-brand-700">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
