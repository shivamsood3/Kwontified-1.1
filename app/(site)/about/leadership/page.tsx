import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Figure } from "@/components/ui/Figure";
import { leaders } from "@/lib/content/leadership";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "The team that runs Kwontified — operators who have run marketplace businesses inside Amazon, as brand owners and as agency operators.",
};

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="About · Leadership"
        title="The team that runs Kwontified."
        intro="Each member of the team has run marketplace businesses firsthand — inside Amazon, as a brand owner or as an agency operator."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Leadership" },
        ]}
      />

      <section className="bg-white">
        <div className="container-kw space-y-8 py-16">
          {leaders.map((l) => (
            <div
              key={l.slug}
              className="grid gap-8 rounded-2xl border border-line bg-paper p-8 md:grid-cols-[0.5fr_1fr] md:items-start"
            >
              <Figure ratio="1/1" src={l.image} alt={l.name} rounded="rounded-xl" />
              <div>
                <h2 className="h-display text-2xl text-ink">{l.name}</h2>
                <p className="mt-1 text-sm font-medium text-brand-600">{l.role}</p>
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600">
                  {l.bio}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {l.topics.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-white px-3 py-1 text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/about/leadership/${l.slug}`}
                  className="link-underline mt-5 text-sm"
                >
                  Full bio and commentary →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
