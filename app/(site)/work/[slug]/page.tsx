import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/site/Button";
import { Stat } from "@/components/ui/Stat";
import { Chip } from "@/components/ui/Chip";
import { Quote } from "@/components/ui/Quote";
import { BeforeAfterBars } from "@/components/ui/BeforeAfterBars";
import { caseStudyDetails, getCaseStudyDetail } from "@/lib/content/caseStudies";

export function generateStaticParams() {
  return caseStudyDetails.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyDetail(slug);
  if (!cs) return {};
  return {
    title: cs.title.replace(/\.$/, ""),
    description: cs.intro,
    alternates: { canonical: `/work/${cs.slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyDetail(slug);
  if (!cs) notFound();

  const related = caseStudyDetails.filter((c) => c.slug !== cs.slug).slice(0, 2);

  return (
    <>
      {/* Header */}
      <section className="bg-white">
        <div className="container-kw py-14">
          <nav className="mb-5 flex items-center gap-2 text-small text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span className="text-line">/</span>
            <Link href="/work" className="hover:text-ink">
              Work
            </Link>
            <span className="text-line">/</span>
            <span className="text-ink">{cs.channel}</span>
          </nav>
          <p className="eyebrow">
            {cs.category} · {cs.channel}
          </p>
          <h1 className="h-display mt-3 max-w-3xl text-h1 text-ink">{cs.title}</h1>
          <p className="mt-6 max-w-2xl text-lead text-ink-700">{cs.intro}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {cs.capabilities.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        </div>
      </section>

      {/* Results strip */}
      <section className="bg-ink text-white">
        <div className="container-kw py-14">
          <p className="eyebrow-light">Results</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {cs.stats.map((s) => (
              <Stat key={s.label} value={s.value} label={s.label} tone="dark" />
            ))}
          </div>
          {cs.beforeAfter && (
            <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[1fr_1.4fr] md:items-center">
              <div>
                <p className="eyebrow-light">{cs.beforeAfter.metric}</p>
                <p className="mt-3 max-w-sm text-small leading-relaxed text-white/60">
                  {cs.results}
                </p>
              </div>
              <div className="max-w-md">
                <BeforeAfterBars
                  before={cs.beforeAfter.before}
                  after={cs.beforeAfter.after}
                  tone="dark"
                  ariaLabel={`${cs.beforeAfter.metric}: ${cs.beforeAfter.before.value} before, ${cs.beforeAfter.after.value} after`}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* The challenge */}
      <section className="bg-white">
        <div className="container-kw grid gap-8 py-16 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className="h-display text-h2 text-ink">The challenge</h2>
          <p className="max-w-2xl text-lead leading-relaxed text-ink-700">
            {cs.challenge}
          </p>
        </div>
      </section>

      {/* What we did */}
      <section className="bg-paper">
        <div className="container-kw py-16">
          <h2 className="h-display text-h2 text-ink">What we did</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cs.whatWeDid.map((d, i) => (
              <div key={d.title} className="border border-line bg-white p-7">
                <span className="h-display text-h3 text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-h3 text-ink">{d.title}</h3>
                <p className="mt-3 text-small leading-relaxed text-ink-700">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results prose */}
      <section className="bg-white">
        <div className="container-kw grid gap-8 py-16 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className="h-display text-h2 text-ink">The result</h2>
          <p className="max-w-2xl text-lead leading-relaxed text-ink-700">
            {cs.results}
          </p>
        </div>
      </section>

      {/* Quote — TODO(content): client quote pending approval */}
      <section className="bg-brand-50">
        <div className="container-kw py-16">
          {/* TODO(content): replace with an approved client quote and real attribution. */}
          <Quote name="[Name]" title="[Title]" company={`[${cs.category} brand]`}>
            [Client quote pending approval.]
          </Quote>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <h2 className="h-display text-h2 text-ink">More work</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/work/${r.slug}`}
                className="group block border border-line p-7 transition-colors hover:border-brand-600"
              >
                <p className="eyebrow">
                  {r.category} · {r.channel}
                </p>
                <h3 className="h-display mt-3 text-h3 text-ink group-hover:text-brand-700">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/work" variant="outline">
              See all work
            </Button>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
