import type { Metadata } from "next";
import Link from "next/link";
import { CollageHero } from "@/components/blocks/CollageHero";
import { FeatureSplit } from "@/components/blocks/FeatureSplit";
import { MoodBand } from "@/components/blocks/MoodBand";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { Callout } from "@/components/ui/Callout";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd, breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Why Kwontified",
  description:
    "Operators who have run marketplace businesses, working from your data and holding your account to the standard your brand holds itself to.",
  alternates: { canonical: "/why-kwontified" },
};

const values = [
  { n: "01", title: "Trust", body: "We do what we say, when we say we will. Every recommendation is made for the good of your business." },
  { n: "02", title: "Radical Transparency & Accountability", body: "You hear about problems from us as soon as we see them, along with what we’re doing about them." },
  { n: "03", title: "Ownership Mentality", body: "We don’t wait to be asked. When we see a gap in your catalog, inventory or advertising, we close it and fix the process behind it." },
  { n: "04", title: "Bias for Action", body: "When we see a potential issue, we address it before it can cause harm. When we see a new opportunity, we quantify it, report it and act on it." },
  { n: "05", title: "White Gloves, Dirty Hands", body: "You get senior-level polish in every meeting and deliverable, from people who still read the search-term reports and case logs themselves." },
  { n: "06", title: "We Raise the Bar — Together", body: "Work is reviewed before it reaches you, and we tell you plainly when something can be better, including our own work." },
  { n: "07", title: "Curious with Care", body: "We learn your brand, your customers and your margins before we act, and we test ideas instead of assuming them." },
  { n: "08", title: "Same Team, Same Mission", body: "We work as a partner to your team, with one shared plan, and we lean in when a quarter gets hard." },
];

const faqs = [
  { q: "What makes Kwontified different from other marketplace agencies?", a: "Kwontified is led by operators who have run marketplace P&Ls, including Amazon Fashion’s luxury goods business. Each client gets one team that finds the cause of a problem before fixing it, makes decisions from the account’s own data, and shares every dashboard, report and forecast through a client portal." },
  { q: "What results can we expect, and how soon?", a: "The first weeks start with an audit that looks for the fastest wins, such as wasted ad spend, suppressed listings and stock risks, and we fix those first. Larger gains from creative, new channels and DSP build over the following quarters. Past results include a Vendor Central business that grew from $10.5M to $14.0M a year and a premium skincare listing whose conversion rose from 8.2% to 12.1%. We set targets with you and report against them in your client portal." },
];

export default function WhyKwontifiedPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Why Kwontified", path: "/why-kwontified" }]),
          faqLd(faqs.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />

      <CollageHero
        eyebrow="Why Kwontified"
        title="Why brands choose Kwontified."
        intro="Operators who have run marketplace businesses, working from your data, holding your account to the standard your brand holds itself to."
        crumbs={[{ label: "Home", href: "/" }, { label: "Why Kwontified" }]}
        ids={["why-a", "why-b", "why-c"]}
      />

      {/* Built by operators (navy) */}
      <section className="bg-navy-900">
        <div className="container-kw py-16">
          <div className="grid gap-8 md:grid-cols-[0.6fr_1.4fr] md:items-start">
            <h2 className="h-display text-h2 text-white">Built by operators</h2>
            <div>
              <p className="max-w-2xl text-lead leading-relaxed text-white/75">
                Our leaders ran Amazon Fashion’s luxury goods P&amp;L across 150+ brands, led an
                Amazon category in North America, ran a $50M+ brand portfolio and built a
                seven-figure brand on Amazon and Walmart. We run your business the way we ran those.
              </p>
              <Link href="/about/leadership" className="learn-more mt-5 !text-gold-300 hover:!text-white">Leadership →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How we solve problems (cream, image left) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <FeatureSplit eyebrow="How we solve problems" title="We find the cause before we choose the fix." imageId="why-d">
            <p>
              A drop in sales gets traced through traffic, conversion, price, Buy Box, inventory
              and ad delivery until the data shows why it happened. Then we fix the problem and
              the process that allowed it. One Vendor Central business sat flat at $10.5M. Once we
              fixed chargebacks, fill rates and shortage claims, its annual revenue reached $14.0M.
            </p>
            <Callout label="What you see">
              A clear diagnosis, a recommendation with the numbers behind it, and an owner and a
              date for every next step.
            </Callout>
          </FeatureSplit>
        </div>
      </section>

      {/* Decisions from your data (beige, image right) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20">
          <FeatureSplit
            reverse
            eyebrow="Decisions made from your data"
            title="Your data decides. Benchmarks give context."
            imageId="why-e"
            cta={{ href: "/work/amazon-dsp", label: "Read the DSP case study" }}
          >
            <p>
              Every recommendation starts with your own account data across every marketplace you
              sell on. We judge spend on profit and incrementality — on one Amazon account, DSP
              returned 9.4x on $192K of spend while search ROAS held. Forecasts come in
              conservative, standard and reach scenarios, so you plan against a range.
            </p>
            <Callout label="What you see">
              A dashboard for each channel, reports that explain what moved and why, and forecasts
              your finance team can use.
            </Callout>
          </FeatureSplit>
        </div>
      </section>

      <MoodBand id="why-band" />

      {/* Values (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">Our values</h2>
          <p className="mt-3 max-w-2xl text-body text-ink-muted">
            Eight values guide how we make decisions, build our team and work with every client.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.n} className="rounded-2xl bg-white p-6 shadow-card">
                <div className="text-sm font-medium text-gold-700">{v.n}</div>
                <h3 className="mt-2 text-h3 text-navy-900">{v.title}</h3>
                <p className="mt-2 text-small leading-relaxed text-ink-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs (white) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <h2 className="h-display text-h2 text-navy-900">Questions executives ask</h2>
            <div className="divide-y divide-sand-300 border-y border-sand-300">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-navy-900">
                    {f.q}
                    <span className="text-gold-700 transition group-open:rotate-45">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-body leading-relaxed text-ink-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PromoBanner
        imageId="promo-about"
        title="See how we would run your business."
        body="Share your channels and goals. A member of our team replies within one business day with a first read on where we would start."
        cta={{ href: "/contact", label: "Get your first read" }}
      />
    </>
  );
}
