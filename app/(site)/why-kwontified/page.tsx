import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Why Kwontified",
  description:
    "Operators who have run marketplace businesses, working from your data and holding your account to the standard your brand holds itself to.",
  alternates: { canonical: "/why-kwontified" },
};

const sections = [
  {
    title: "How we solve problems",
    body: "We find the cause before we choose the fix. A drop in sales gets traced through traffic, conversion, price, Buy Box, inventory and ad delivery until the data shows why it happened. Then we fix the problem and the process that allowed it. One Vendor Central business sat flat at $10.5M. Once we fixed chargebacks, fill rates and shortage claims, its annual revenue reached $14.0M.",
    see: "A clear diagnosis, a recommendation with the numbers behind it, and an owner and a date for every next step.",
    link: null as { href: string; label: string } | null,
    bg: "bg-white",
  },
  {
    title: "Decisions made from your data",
    body: "Every recommendation starts with your own account data: sales, traffic, search terms, inventory and ad performance across every marketplace you sell on. Benchmarks give context. Your data decides. We judge spend on profit and incrementality. On one Amazon account, DSP returned 9.4x on $192K of spend while search ROAS held. Forecasts come in conservative, standard and reach scenarios, so you plan against a range.",
    see: "A dashboard for each channel, reports that explain what moved and why, and forecasts your finance team can use.",
    link: { href: "/work/amazon-dsp", label: "Read the DSP case study" },
    bg: "bg-paper",
  },
  {
    title: "Service built for premium brands",
    body: "Your account has a named team, a dedicated team inbox and senior leaders who stay involved in your strategy. Creative is briefed from what converts and finished to your brand’s own standard. Reports are written for executives. Your portal holds every dashboard, report, forecast, call note and open task.",
    see: "People who know your business as well as you do, and work you would put your own name on.",
    link: null,
    bg: "bg-white",
  },
];

const values = [
  { n: "01", title: "Trust", body: "We do what we say, when we say we will. Every recommendation is made for the good of your business." },
  { n: "02", title: "Radical Transparency & Accountability", body: "You hear about problems from us as soon as we see them, along with what we’re doing about them." },
  { n: "03", title: "Ownership Mentality", body: "We don’t wait to be asked. When we see a gap in your catalog, inventory or advertising, we close it and fix the process behind it." },
  { n: "04", title: "Bias for Action", body: "When we see a potential issue, we address it before it can cause harm. When we see a new opportunity, we quantify it, report it to you and then act on it. We execute against the plan we agreed with you and keep looking for ways to exceed your goals." },
  { n: "05", title: "White Gloves, Dirty Hands", body: "You get senior-level polish in every meeting and deliverable, from people who still read the search-term reports and case logs themselves." },
  { n: "06", title: "We Raise the Bar — Together", body: "Work is reviewed before it reaches you, and we tell you plainly when something can be better, including our own work." },
  { n: "07", title: "Curious with Care", body: "We learn your brand, your customers and your margins before we act, and we test ideas instead of assuming them." },
  { n: "08", title: "Same Team, Same Mission", body: "We work as a partner to your team, with one shared plan, and we lean in when a quarter gets hard." },
];

const faqs = [
  {
    q: "What makes Kwontified different from other marketplace agencies?",
    a: "Kwontified is led by operators who have run marketplace P&Ls, including Amazon Fashion’s luxury goods business. Each client gets one team that finds the cause of a problem before fixing it, makes decisions from the account’s own data, and shares every dashboard, report and forecast through a client portal.",
  },
  {
    q: "What results can we expect, and how soon?",
    a: "The first weeks start with an audit that looks for the fastest wins, such as wasted ad spend, suppressed listings and stock risks, and we fix those first. Larger gains from creative, new channels and DSP build over the following quarters. Past results include a Vendor Central business that grew from $10.5M to $14.0M a year and a premium skincare listing whose conversion rose from 8.2% to 12.1%. We set targets with you and report against them in your client portal.",
  },
];

export default function WhyKwontifiedPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Why Kwontified", path: "/why-kwontified" },
          ]),
          faqLd(faqs.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
      {/* Hero (light) */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="text-line">/</span>
            <span className="text-ink">Why Kwontified</span>
          </nav>
          <h1 className="h-display max-w-3xl text-4xl leading-tight text-ink md:text-6xl">
            Why brands choose Kwontified
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Operators who have run marketplace businesses, working from your data,
            holding your account to the standard your brand holds itself to.
          </p>
        </div>
      </section>

      {/* Built by operators (dark) */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-ecom-dark absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="container-kw relative py-16">
          <div className="grid gap-8 md:grid-cols-[0.6fr_1.4fr] md:items-start">
            <h2 className="h-display text-2xl text-white">Built by operators</h2>
            <div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/75">
                Our leaders ran Amazon Fashion’s luxury goods P&L across 150+
                brands, led an Amazon category in North America, ran a $50M+ brand
                portfolio and built a seven-figure brand on Amazon and Walmart. We
                run your business the way we ran those.
              </p>
              <Link href="/about/leadership" className="link-underline mt-5 inline-flex text-brand-300 hover:text-white">
                Leadership →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / data / service sections */}
      {sections.map((s) => (
        <section key={s.title} className={s.bg}>
          <div className="container-kw py-16">
            <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
              <h2 className="h-display text-3xl text-ink">{s.title}</h2>
              <div>
                <p className="text-[1.0625rem] leading-relaxed text-ink-700">{s.body}</p>
                {s.link && (
                  <Link href={s.link.href} className="link-underline mt-4 inline-flex text-sm">
                    {s.link.label} →
                  </Link>
                )}
                <div className="mt-6 rounded-xl border-l-2 border-brand-500 bg-white/60 p-5 shadow-card">
                  <p className="text-xs font-normal text-brand-600">
                    What you see
                  </p>
                  <p className="mt-2 text-[0.975rem] leading-relaxed text-ink-700">{s.see}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Values */}
      <section className="bg-paper">
        <div className="container-kw py-20">
          <h2 className="h-display text-3xl text-ink">Our values</h2>
          <p className="mt-3 max-w-2xl text-[1.0625rem] text-muted">
            Eight values guide how we make decisions, build our team and work with
            every client.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.n} className="rounded-2xl border border-line bg-white p-6">
                <div className="text-sm font-semibold text-brand-400">{v.n}</div>
                <h3 className="mt-2 text-base font-semibold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions executives ask */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <h2 className="h-display text-3xl text-ink">Questions executives ask</h2>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                    {f.q}
                    <span className="text-brand-500 transition group-open:rotate-45">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="See how we would run your business."
        body="Share your channels and goals. A member of our team replies within one business day with a first read on where we would start."
        cta={{ href: "/contact", label: "Get your first read" }}
      />
    </>
  );
}
