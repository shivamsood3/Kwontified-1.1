import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero } from "@/components/blocks/InnerHero";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Img } from "@/components/ui/Img";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Six capabilities, one team: retail media, creative, operations, analytics, agentic commerce and revenue recovery — all sharing one plan and one data set.",
  alternates: { canonical: "/capabilities" },
};

const cards = [
  { title: "Retail Media and Advertising", href: "/capabilities/retail-media", img: "home12-pillar-measured", body: "Amazon Ads, Amazon DSP, Amazon Marketing Cloud, Walmart Connect, Target Roundel, Meta and TikTok, measured on incremental revenue.", stat: "6.8x omnichannel ROAS" },
  { title: "Creative Studio", href: "/capabilities/creative-studio", img: "home12-pillar-made", body: "Creative strategy, product photography, AI image and video, A+ Content, Storefront design and listing copy, briefed from conversion data.", stat: "+64% Amazon sales" },
  { title: "Marketplace Operations", href: "/capabilities/marketplace-operations", img: "home12-pillar-run", body: "Catalog, inventory, 1P and 3P account management, promotions and compliance.", stat: "71% sold at full price" },
  { title: "Analytics and Forecasting", href: "/capabilities/analytics", img: "home12-pillar-reported", body: "Dashboards, audits, forecasts and fiscal year plans built on your own account data.", stat: "Break-even in 7 weeks" },
  { title: "Agentic Commerce", href: "/capabilities/ai-commerce", img: "home12-pillar-found", body: "Product data and content that AI shopping assistants such as Alexa for Shopping, ChatGPT and Claude can read and recommend, plus Claude Commerce agents built for your own store.", stat: "6 to 23 of 40 Rufus answers" },
  { title: "Revenue Recovery", href: "/capabilities/revenue-recovery", img: "home12-pillar-recovered", body: "Vendor Central deduction disputes and Seller Central FBA reimbursements.", stat: "$781K recovered" },
];

export default function CapabilitiesOverview() {
  return (
    <>
      <InnerHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
        title="Six capabilities, one team."
        intro="Each capability is staffed by specialists. All six share one plan, one data set and one account lead, so media, creative and operations never work against each other."
        imageId="cap12-index-hero"
        cta={{ href: "/contact", label: "Request a marketplace review" }}
      />

      <section className="bg-sky-100">
        <div className="container-kw py-20 lg:py-28">
          <h2 className="h-display text-h2 text-navy-900">What we do</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <Link key={c.href} href={c.href} className="group flex flex-col bg-cream-50 p-6 transition-shadow hover:shadow-card">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Img id={c.img} sizes="(max-width:768px) 100vw, 33vw" className="transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <h3 className="h-display mt-5 text-[24px] leading-tight text-navy-900 group-hover:text-gold-700">{c.title}</h3>
                <p className="mt-3 flex-1 text-body leading-relaxed text-ink">{c.body}</p>
                <p className="mt-6 text-[24px] font-normal text-navy-900">{c.stat}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="container-kw py-20 lg:py-28">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
