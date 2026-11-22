import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero } from "@/components/blocks/InnerHero";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { InitialsTile } from "@/components/ui/InitialsTile";
import { leaders } from "@/lib/content/leadership";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "The team that runs Kwontified — operators who have run marketplace businesses inside Amazon, as brand owners and as agency operators.",
  alternates: { canonical: "/about/leadership" },
};

export default function LeadershipPage() {
  return (
    <>
      <InnerHero
        eyebrow="About · Leadership"
        title="The team that runs Kwontified."
        intro="Each member of the team has run marketplace businesses firsthand — inside Amazon, as a brand owner or as an agency operator."
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Leadership" }]}
        imageId="leadership12-hero"
      />

      <section className="bg-cream-50">
        <div className="container-kw space-y-6 py-20">
          {leaders.map((l) => (
            <div
              key={l.slug}
              className="grid gap-8 rounded-2xl bg-white p-8 shadow-card md:grid-cols-[0.4fr_1fr] md:items-start"
            >
              <InitialsTile name={l.name} className="max-w-[200px]" />
              <div>
                <h2 className="h-display text-2xl text-navy-900">{l.name}</h2>
                <p className="mt-1 text-sm font-medium text-gold-700">{l.role}</p>
                <p className="mt-4 text-body leading-relaxed text-ink-muted">{l.bio}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {l.topics.map((t) => (
                    <span key={t} className="rounded-full border border-sand-300 px-3 py-1 text-xs text-ink-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <Link href={`/about/leadership/${l.slug}`} className="learn-more mt-5">
                  Full bio and commentary →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PromoBanner imageId="promo-about" />
    </>
  );
}
