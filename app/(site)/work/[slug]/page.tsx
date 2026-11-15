import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Chip } from "@/components/ui/Chip";
import { StatRow } from "@/components/blocks/StatRow";
import { ImageCard } from "@/components/blocks/ImageCard";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { BeforeAfterBars } from "@/components/ui/BeforeAfterBars";
import { caseStudyDetails, getCaseStudyDetail } from "@/lib/content/caseStudies";

export function generateStaticParams() {
  return caseStudyDetails.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyDetail(slug);
  if (!cs) return {};
  return { title: cs.title.replace(/\.$/, ""), description: cs.intro, alternates: { canonical: `/work/${cs.slug}` } };
}

const heroImage: Record<string, string> = {
  "walmart-sku-transition": "case-walmart",
  "international-expansion": "case-international",
  "account-health-restore": "case-account-health",
  "vendor-central-recovery": "case-vendor-central",
};

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudyDetail(slug);
  if (!cs) notFound();

  const hero = heroImage[cs.slug] ?? "case-amazon-dsp";
  const detail = `${hero}-detail`;
  const related = caseStudyDetails.filter((c) => c.slug !== cs.slug).slice(0, 1);

  return (
    <>
      {/* Contained hero on cream */}
      <section className="border-b border-sand-300 bg-cream-50">
        <div className="container-kw py-12 md:py-16">
          <nav className="mb-5 flex items-center gap-2 text-small text-ink-muted">
            <Link href="/" className="hover:text-navy-900">Home</Link>
            <span className="text-sand-300">/</span>
            <Link href="/work" className="hover:text-navy-900">Work</Link>
            <span className="text-sand-300">/</span>
            <span className="text-navy-900">{cs.channel}</span>
          </nav>
          <p className="eyebrow">{cs.category} · {cs.channel}</p>
          <h1 className="h-display mt-4 max-w-3xl text-h1 text-navy-900">{cs.title}</h1>
          <p className="mt-6 max-w-2xl text-lead text-ink-muted">{cs.intro}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {cs.capabilities.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
            <Img id={hero} priority sizes="(max-width: 1312px) 100vw, 1312px" />
          </div>
        </div>
      </section>

      {/* Reading column: summary / challenge / strategy → image → result */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <div className="mx-auto max-w-[760px]">
            <Block heading="Summary">{cs.intro}</Block>
            <Block heading="The challenge">{cs.challenge}</Block>

            <h2 className="h-display mt-12 text-h2 text-navy-900">What we did</h2>
            <div className="mt-6 space-y-8">
              {cs.whatWeDid.map((d, i) => (
                <div key={d.title}>
                  <span className="h-display text-h3 text-gold-700">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1 text-h3 text-navy-900">{d.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-ink-muted">{d.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* in-text image between strategy and result */}
          <div className="relative mx-auto mt-12 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl">
            <Img id={detail} sizes="(max-width: 896px) 100vw, 896px" />
          </div>

          <div className="mx-auto mt-12 max-w-[760px]">
            <Block heading="The result">{cs.results}</Block>
          </div>
        </div>
      </section>

      {/* Results stats (navy) */}
      <section className="bg-navy-900">
        <div className="container-kw py-16">
          <p className="eyebrow-light">Results</p>
          <StatRow className="mt-8" tone="navy" stats={cs.stats.map((s) => ({ value: s.value, label: s.label }))} />
          {cs.beforeAfter && (
            <div className="mt-12 max-w-md border-t border-white/10 pt-10">
              <p className="eyebrow-light">{cs.beforeAfter.metric}</p>
              <div className="mt-5">
                <BeforeAfterBars before={cs.beforeAfter.before} after={cs.beforeAfter.after} tone="dark" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Next case study (cream) */}
      {related.length > 0 && (
        <section className="bg-cream-50">
          <div className="container-kw py-16">
            <h2 className="h-display text-h2 text-navy-900">Next case study</h2>
            <div className="mt-8 grid gap-6 md:max-w-xl">
              {related.map((r) => (
                <ImageCard
                  key={r.slug}
                  href={`/work/${r.slug}`}
                  imageId={heroImage[r.slug] ?? "case-amazon-dsp"}
                  ratio="16/9"
                  chip={`${r.category} · ${r.channel}`}
                  title={r.title}
                  cta="Read case study"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <PromoBanner imageId="promo-work" />
    </>
  );
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <h2 className="h-display text-h2 text-navy-900">{heading}</h2>
      <p className="mt-4 text-body leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}
