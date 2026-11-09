import Link from "next/link";
import { PageHero, type Crumb } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { ExecFaq } from "@/components/sections/ExecFaq";
import { Button } from "@/components/site/Button";
import { capabilities } from "@/lib/nav";
import type { ChannelProblem } from "@/lib/content/channels";

export function ChannelTemplate({
  eyebrow = "Channel",
  name,
  h1,
  intro,
  metric,
  reviewLabel,
  crumbs,
  accountTypes,
  problems,
  showCapabilities = true,
  related,
}: {
  eyebrow?: string;
  name: string;
  h1: string;
  intro: string;
  metric: { value: string; label: string };
  reviewLabel: string;
  crumbs: Crumb[];
  accountTypes?: { title: string; body: string }[];
  problems: ChannelProblem[];
  showCapabilities?: boolean;
  related?: { label: string; href: string }[];
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={h1}
        intro={intro}
        crumbs={crumbs}
        cta={{ href: "/contact", label: reviewLabel }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <div className="h-display text-5xl text-white md:text-6xl">
            {metric.value}
          </div>
          <p className="mt-3 text-sm leading-snug text-white/65">{metric.label}</p>
        </div>
      </PageHero>

      {accountTypes && accountTypes.length > 0 && (
        <section className="bg-white">
          <div className="container-kw py-16">
            <div className="grid gap-5 md:grid-cols-2">
              {accountTypes.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-line bg-paper p-8"
                >
                  <h2 className="h-display text-xl text-ink">{a.title}</h2>
                  <p className="mt-3 text-[0.975rem] leading-relaxed text-ink-700">
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showCapabilities && (
        <section className="bg-paper">
          <div className="container-kw py-16">
            <h2 className="h-display text-2xl text-ink">
              How each capability works on {name}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group rounded-xl border border-line bg-white p-6 transition hover:border-brand-300 hover:shadow-card"
                >
                  <h3 className="text-sm font-semibold text-ink group-hover:text-brand-700">
                    {c.label}
                  </h3>
                  <p className="mt-2 text-sm leading-snug text-muted">{c.blurb}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="container-kw py-16">
          <h2 className="h-display text-2xl text-ink">Where we help</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {problems.map((p) => (
              <div key={p.problem} className="grid gap-2 py-6 md:grid-cols-5 md:gap-8">
                <h3 className="font-semibold text-ink md:col-span-2">{p.problem}</h3>
                <p className="text-[0.975rem] leading-relaxed text-ink-700 md:col-span-3">
                  {p.solution}
                </p>
              </div>
            ))}
          </div>

          {related && related.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {related.map((r) => (
                <Button key={r.href} href={r.href} variant="outline">
                  {r.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      <ExecFaq />

      <CtaBand />
    </>
  );
}
