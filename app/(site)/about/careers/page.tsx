import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero } from "@/components/blocks/InnerHero";
import { MoodBand } from "@/components/blocks/MoodBand";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { jobs, jobTeams } from "@/lib/content/careers";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Learn marketplaces from people who run them. Join our Advertising or Account Management team and run client accounts across Amazon, Walmart and Target Plus. Five roles are open now.",
  alternates: { canonical: "/about/careers" },
};

const traits = [
  { title: "Data-driven strategists", body: "You treat reporting and attribution as the basis for decisions. You can explain why a number moved and what to change next, and you work comfortably with Amazon Marketing Cloud, forecasts and test design." },
  { title: "Proactive operators", body: "You find the problem and fix it before a client has to ask. You watch accounts closely enough to catch a suppressed listing, a stockout or a pacing problem early, and you raise it with a fix attached." },
  { title: "Adaptive problem solvers", body: "You bring structure to marketplaces whose algorithms and competitors change constantly. Platform rules, ad products and AI shopping tools change often; you learn them fast and turn what you learn into a better plan." },
  { title: "Collaborative partners", body: "You know the best results come from teams that plan together. Media, creative, operations and analytics work as one team here, so you share data, credit and accountability with people outside your discipline." },
];

export default function CareersPage() {
  return (
    <>
      <InnerHero
        eyebrow="About · Careers"
        title="Learn marketplaces from people who run them."
        intro="Join our Advertising or Account Management team and run client accounts on one marketplace or several, from Amazon and Walmart to Target Plus. You train in a structured program, beside leaders who have run marketplace businesses themselves. Every role is fully remote, or hybrid from our Sandy Springs office if you live in metro Atlanta."
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Careers" }]}
        imageId="careers12-hero"
      />

      {/* Open roles (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <p className="eyebrow">Open roles</p>
          <h2 className="h-display mt-3 text-h2 text-navy-900">Five open roles. Remote, or hybrid in Atlanta.</h2>

          <div className="mt-12 space-y-12">
            {jobTeams.map((team) => (
              <div key={team}>
                <h3 className="text-small font-medium uppercase tracking-wide text-gold-700">{team}</h3>
                <div className="mt-5 space-y-4">
                  {jobs.filter((j) => j.team === team).map((j) => (
                    <Link
                      key={j.slug}
                      href={`/about/careers/${j.slug}`}
                      className="group grid gap-4 rounded-2xl border border-sand-300 bg-white p-6 shadow-card transition-shadow hover:shadow-lift md:grid-cols-[1fr_auto] md:items-center"
                    >
                      <div>
                        <h4 className="h-display text-h3 text-navy-900 group-hover:text-gold-700">{j.title}</h4>
                        <p className="mt-2 max-w-2xl text-body text-ink-muted">{j.summary}</p>
                        <p className="mt-3 text-small text-ink-faint">{j.location} · {j.type} · {j.experience}</p>
                      </div>
                      <span className="learn-more shrink-0">View role →</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-body text-ink-muted">
            To apply, open the role and use the button on its page, or send your résumé and cover letter to{" "}
            <a href="mailto:careers@kwontified.com" className="link-underline">careers@kwontified.com</a> with the role title in the subject line.
          </p>
        </div>
      </section>

      <MoodBand id="careers-band" />

      {/* Who we hire — 2×2 bordered grid (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">Who we hire</h2>
          <div className="mt-10 grid overflow-hidden rounded-2xl border border-sand-300 md:grid-cols-2">
            {traits.map((t, i) => (
              <div
                key={t.title}
                className={`bg-white p-8 ${i % 2 === 0 ? "md:border-r" : ""} ${i < 2 ? "md:border-b" : ""} border-sand-300`}
              >
                <h3 className="h-display text-h3 text-navy-900">{t.title}</h3>
                <p className="mt-3 text-body leading-relaxed text-ink-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromoBanner
        imageId="promo-about"
        title="Don’t see your role yet?"
        body="We’re always glad to meet operators who make marketplaces work. Tell us what you do best."
        cta={{ href: "mailto:careers@kwontified.com", label: "Introduce yourself" }}
      />
    </>
  );
}
