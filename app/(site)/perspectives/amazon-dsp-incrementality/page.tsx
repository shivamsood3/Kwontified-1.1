import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = {
  title: "Is your Amazon DSP spend incremental?",
  description:
    "Attributed ROAS shows what DSP touched; lift studies and AMC path analysis show what it caused. The test design we use before scaling a DSP budget.",
};

const sections = [
  {
    h: "What does attributed ROAS miss?",
    p: [
      "Attributed ROAS counts revenue from anyone who saw an ad before buying, including shoppers who would have bought anyway. View-through attribution is generous by design: a low-cost impression can claim a sale that search, email or organic rank actually drove.",
      "The overlap with search is where most DSP budgets fool themselves. If DSP and Sponsored paid for the same buyer, both report the sale. Incrementality is the question of how much revenue exists because DSP ran — not how much revenue DSP happened to touch.",
    ],
  },
  {
    h: "Which tests show incrementality?",
    p: [
      "Three tools, used in order. A geo or audience lift study holds out a comparable group and measures the difference DSP made. AMC path-to-conversion shows how often DSP appears on new-to-brand journeys versus repeat purchases. A halo read confirms that search ROAS and branded search held steady — if branded search climbed while DSP ran, DSP created demand rather than harvesting it.",
      "Use a holdout when you can afford to suppress a segment, AMC when you cannot, and the halo read on every campaign as a standing check.",
    ],
  },
  {
    h: "What did this look like for one beauty brand?",
    p: [
      "A national beauty brand with $7.5M a year on Amazon and search at 5.8x ROAS added DSP with its own measurement framework. $192K of DSP spend returned $1.8M in attributed revenue at 9.4x ROAS, new-to-brand sales rose 28%, and total account revenue grew 19% while search ROAS did not decline.",
    ],
  },
  {
    h: "When should you scale the budget?",
    p: [
      "Scale when the lift study shows positive incremental return at the current spend, when AMC confirms DSP is reaching new-to-brand buyers rather than reordering customers, and when branded search and search ROAS hold. Raise budget in steps and re-measure at each one; the incremental curve bends, and the last efficient dollar is lower than the attributed number suggests.",
    ],
  },
];

const related = [
  { kicker: "Analytics", title: "TACoS or ROAS: which number to run an Amazon business on", href: "/perspectives" },
  { kicker: "Retail media", title: "Walmart Connect or Amazon Ads: where the next dollar should go", href: "/perspectives" },
  { kicker: "Capability", title: "Retail Media and Advertising", href: "/capabilities/retail-media" },
];

export default function DspIncrementalityPost() {
  return (
    <>
      <article className="bg-white">
        <div className="container-kw py-14">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="text-line">/</span>
            <Link href="/perspectives" className="hover:text-ink">Perspectives</Link>
            <span className="text-line">/</span>
            <span className="text-ink">DSP incrementality</span>
          </nav>

          <p className="text-sm text-muted">
            Retail media · Guide · By Priyanka Shah
          </p>
          <h1 className="h-display mt-3 max-w-3xl text-4xl leading-tight text-ink md:text-6xl">
            Is your Amazon DSP spend incremental?
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_0.8fr]">
            {/* Body */}
            <div>
              <p className="text-xl leading-relaxed text-slate-700">
                Attributed ROAS shows which ads a buyer saw before purchase, not
                which ads caused the purchase. To judge DSP, compare exposed and
                unexposed audiences with a lift study, check AMC
                path-to-conversion for new-to-brand buyers, and confirm that
                search ROAS and branded search held steady while DSP ran.
              </p>

              {sections.map((s) => (
                <section key={s.h} className="mt-10">
                  <h2 className="h-display text-2xl text-ink">{s.h}</h2>
                  {s.p.map((para, i) => (
                    <p key={i} className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600">
                      {para}
                    </p>
                  ))}
                </section>
              ))}

              <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
                Sources: Amazon Ads documentation on lift studies and Amazon
                Marketing Cloud. Figures are from a Kwontified-managed account,
                used with permission.
              </p>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-line bg-paper p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/team/priyanka-shah.jpg"
                  alt="Priyanka Shah"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <h3 className="mt-4 text-base font-semibold text-ink">
                  Priyanka Shah
                </h3>
                <p className="mt-1 text-sm leading-snug text-muted">
                  VP, Commercial and Retail Media. Former Amazon NA Category Lead
                  and Senior Strategic Account Manager.
                </p>
                <Link href="/perspectives" className="link-underline mt-3 text-sm">
                  More from Priyanka
                </Link>
              </div>

              <Link
                href="/work/amazon-dsp"
                className="group block rounded-2xl bg-ink p-6 text-white"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                  Related case study
                </p>
                <p className="h-display mt-2 text-lg">
                  $1.8M from DSP, with search intact
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-300 group-hover:text-white">
                  Read the case study →
                </span>
              </Link>
            </aside>
          </div>

          {/* Related */}
          <div className="mt-16 border-t border-line pt-10">
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.title} href={r.href} className="group">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {r.kicker}
                  </p>
                  <h3 className="h-display mt-2 text-lg text-ink group-hover:text-brand-700">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <CtaBand
        title="Want a read on your own DSP spend?"
        body="We’ll run the lift study and the AMC analysis, and tell you how much of your DSP revenue is incremental."
        cta={{ href: "/contact", label: "Request a media review" }}
      />
    </>
  );
}
