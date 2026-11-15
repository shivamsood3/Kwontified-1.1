import type { Metadata } from "next";
import { CollageHero } from "@/components/blocks/CollageHero";
import { MoodBand } from "@/components/blocks/MoodBand";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { Button } from "@/components/site/Button";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work on brands people know. Design Amazon advertising programs, build catalog structures for prestige brands and work on AI commerce — alongside credentialed specialists.",
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
      <CollageHero
        eyebrow="About · Careers"
        title="Work on brands people know."
        intro="You will design Amazon advertising programs, build catalog structures for prestige brands and work on AI commerce for assistants such as Rufus — alongside credentialed specialists."
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Careers" }]}
        ids={["careers-a", "careers-b", "careers-c"]}
      />

      {/* Open roles / empty state (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <p className="eyebrow">Open roles</p>
          <h2 className="h-display mt-4 text-h2 text-navy-900">No open roles right now.</h2>
          <p className="mt-4 max-w-xl text-body text-ink-muted">
            We’re always glad to meet operators who make marketplaces work. Tell us what you
            do best and we’ll keep you in mind as the team grows.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="primary" arrow>Introduce yourself</Button>
          </div>
        </div>
      </section>

      <MoodBand id="careers-band" />

      {/* Why work at Kwontified — 2×2 bordered grid (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">Why work at Kwontified</h2>
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
        cta={{ href: "/contact", label: "Introduce yourself" }}
      />
    </>
  );
}
