import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Chip } from "@/components/ui/Chip";
import { InitialsTile } from "@/components/ui/InitialsTile";
import { ImageCard } from "@/components/blocks/ImageCard";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleLd, breadcrumbLd } from "@/lib/seo";

const POST = {
  title: "Is your Amazon DSP spend incremental?",
  description:
    "Attributed ROAS shows what DSP touched; lift studies and AMC path analysis show what it caused. The test design we use before scaling a DSP budget.",
  path: "/perspectives/amazon-dsp-incrementality",
  author: "Priyanka Shah",
  section: "Retail media",
};

export const metadata: Metadata = {
  title: POST.title,
  description: POST.description,
  alternates: { canonical: POST.path },
  authors: [{ name: POST.author }],
  openGraph: { type: "article", title: POST.title, description: POST.description, authors: [POST.author], section: POST.section },
};

const sections = [
  { h: "What does attributed ROAS miss?", p: [
    "Attributed ROAS counts revenue from anyone who saw an ad before buying, including shoppers who would have bought anyway. View-through attribution is generous by design: a low-cost impression can claim a sale that search, email or organic rank actually drove.",
    "The overlap with search is where most DSP budgets fool themselves. If DSP and Sponsored paid for the same buyer, both report the sale. Incrementality is the question of how much revenue exists because DSP ran — not how much revenue DSP happened to touch.",
  ] },
  { h: "Which tests show incrementality?", p: [
    "Three tools, used in order. A geo or audience lift study holds out a comparable group and measures the difference DSP made. AMC path-to-conversion shows how often DSP appears on new-to-brand journeys versus repeat purchases. A halo read confirms that search ROAS and branded search held steady — if branded search climbed while DSP ran, DSP created demand rather than harvesting it.",
    "Use a holdout when you can afford to suppress a segment, AMC when you cannot, and the halo read on every campaign as a standing check.",
  ] },
  { h: "What did this look like for one beauty brand?", p: [
    "A national beauty brand with $7.5M a year on Amazon and search at 5.8x ROAS added DSP with its own measurement framework. $192K of DSP spend returned $1.8M in attributed revenue at 9.4x ROAS, new-to-brand sales rose 28%, and total account revenue grew 19% while search ROAS did not decline.",
  ] },
  { h: "When should you scale the budget?", p: [
    "Scale when the lift study shows positive incremental return at the current spend, when AMC confirms DSP is reaching new-to-brand buyers rather than reordering customers, and when branded search and search ROAS hold. Raise budget in steps and re-measure at each one; the incremental curve bends, and the last efficient dollar is lower than the attributed number suggests.",
  ] },
];

const related = [
  { href: "/work/amazon-dsp", id: "case-amazon-dsp", chip: "Case study · Amazon", title: "$1.8M from DSP, with search intact." },
  { href: "/capabilities/retail-media", id: "cap-retail-media-b", chip: "Capability", title: "Retail Media and Advertising." },
  { href: "/perspectives/conversion-8-to-12", id: "post-conversion", chip: "Creative", title: "What moved conversion from 8.2% to 12.1%." },
];

export default function DspIncrementalityPost() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Perspectives", path: "/perspectives" }, { name: POST.title, path: POST.path }]),
          articleLd({ title: POST.title, description: POST.description, path: POST.path, authorName: POST.author, section: POST.section }),
        ]}
      />
      <article>
        {/* Contained cream hero + image */}
        <section className="border-b border-sand-300 bg-cream-50">
          <div className="container-kw py-12 md:py-16">
            <nav className="mb-5 flex items-center gap-2 text-sm text-ink-muted">
              <Link href="/" className="hover:text-navy-900">Home</Link>
              <span className="text-sand-300">/</span>
              <Link href="/perspectives" className="hover:text-navy-900">Perspectives</Link>
              <span className="text-sand-300">/</span>
              <span className="text-navy-900">DSP incrementality</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="brand">Retail media</Chip>
              <span className="text-[13px] text-ink-faint">Guide · By {POST.author}</span>
            </div>
            <h1 className="h-display mt-4 max-w-3xl text-h1 text-navy-900">{POST.title}</h1>
            <p className="mt-5 max-w-2xl text-lead text-ink-muted">
              Attributed ROAS shows which ads a buyer saw before purchase, not which ads caused it.
            </p>
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <Img id="post-dsp" priority sizes="(max-width: 1312px) 100vw, 1312px" position="center" />
            </div>
          </div>
        </section>

        {/* Reading column */}
        <section className="bg-white">
          <div className="container-kw py-16">
            <div className="mx-auto max-w-[720px]">
              <p className="text-xl leading-relaxed text-navy-900">
                To judge DSP, compare exposed and unexposed audiences with a lift study, check AMC
                path-to-conversion for new-to-brand buyers, and confirm that search ROAS and branded
                search held steady while DSP ran.
              </p>

              {sections.map((s) => (
                <section key={s.h} className="mt-10">
                  <h2 className="h-display text-h2 text-navy-900">{s.h}</h2>
                  {s.p.map((para, i) => (
                    <p key={i} className="mt-4 text-body leading-relaxed text-ink-muted">{para}</p>
                  ))}
                </section>
              ))}

              <p className="mt-10 border-t border-sand-300 pt-6 text-sm text-ink-faint">
                Sources: Amazon Ads documentation on lift studies and Amazon Marketing Cloud.
                Figures are from a Kwontified-managed account, used with permission.
              </p>

              {/* Author */}
              <div className="mt-10 flex gap-4 rounded-2xl bg-cream-50 p-6">
                <InitialsTile name={POST.author} className="h-16 w-16 shrink-0" />
                <div>
                  <h3 className="text-base font-medium text-navy-900">
                    <Link href="/perspectives/authors/priyanka-shah" className="hover:text-gold-700">{POST.author}</Link>
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-ink-muted">
                    VP, Commercial and Retail Media. Former Amazon NA Category Lead and Senior
                    Strategic Account Manager.
                  </p>
                  <Link href="/perspectives/authors/priyanka-shah" className="learn-more mt-3">More from Priyanka →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related (cream) */}
        <section className="bg-cream-50">
          <div className="container-kw py-16">
            <h2 className="h-display text-h2 text-navy-900">Related</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <ImageCard key={r.href} href={r.href} imageId={r.id} ratio="16/9" chip={r.chip} title={r.title} cta="Read" />
              ))}
            </div>
          </div>
        </section>
      </article>

      <PromoBanner
        imageId="promo-work"
        title="Want a read on your own DSP spend?"
        body="We’ll run the lift study and the AMC analysis, and tell you how much of your DSP revenue is incremental."
        cta={{ href: "/contact", label: "Request a media review" }}
      />
    </>
  );
}
