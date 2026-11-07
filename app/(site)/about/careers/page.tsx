import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work on brands people know. Design Amazon advertising programs, build catalog structures for prestige brands and work on AI commerce — alongside credentialed specialists.",
};

const traits = [
  {
    title: "Data-driven strategists",
    body: "You treat reporting and attribution as the basis for decisions. You can explain why a number moved and what to change next, and you work comfortably with Amazon Marketing Cloud, forecasts and test design.",
  },
  {
    title: "Proactive operators",
    body: "You find the problem and fix it before a client has to ask. You watch accounts closely enough to catch a suppressed listing, a stockout or a pacing problem early, and you raise it with a fix attached.",
  },
  {
    title: "Adaptive problem solvers",
    body: "You bring structure to marketplaces whose algorithms and competitors change constantly. Platform rules, ad products and AI shopping tools change often; you learn them fast and turn what you learn into a better plan.",
  },
  {
    title: "Collaborative partners",
    body: "You know the best results come from teams that plan together. Media, creative, operations and analytics work as one team here, so you share data, credit and accountability with people outside your discipline.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="About · Careers"
        title="Work on brands people know."
        intro="You will design Amazon advertising programs, build catalog structures for prestige brands and work on AI commerce for assistants such as Rufus — alongside credentialed specialists."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Careers" },
        ]}
        cta={{ href: "/contact", label: "See open roles" }}
      />

      <section className="bg-white">
        <div className="container-kw py-16">
          <h2 className="h-display text-3xl text-ink">Who we hire</h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2">
            {traits.map((t) => (
              <div key={t.title}>
                <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-slate-600">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Don’t see your role yet?"
        body="We’re always glad to meet operators who make marketplaces work. Tell us what you do best."
        cta={{ href: "/contact", label: "Introduce yourself" }}
      />
    </>
  );
}
