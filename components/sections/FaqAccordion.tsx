import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";

const faqs = [
  { q: "What does Kwontified do?", a: "We run marketplace businesses for consumer brands — advertising, creative, operations and analytics across Amazon, Walmart, Target Plus and global marketplaces — as one team against one plan, reported every week." },
  { q: "Which marketplaces does Kwontified manage?", a: "Amazon (Seller and Vendor Central), Walmart, Target Plus, and international and social channels including Zalando, Mercado Libre, Temu, TikTok Shop and Instagram Shop. We also structure product data for AI shopping assistants." },
  { q: "Which product categories does Kwontified serve?", a: "Consumer brands across beauty and personal care, apparel and accessories, outdoor, home and lifestyle, food and wellness — from emerging labels to established portfolios." },
  { q: "What is included in marketplace management?", a: "Retail media, creative, catalog and inventory operations, promotions, account health, analytics and forecasting, and revenue recovery — all under one named team and one P&L." },
  { q: "How is this different from hiring separate agencies?", a: "Separate agencies split advertising, creative and operations, then lose margin where those plans disagree. We run all of it as one plan, so ads, stock and promotions move together." },
  { q: "How often will we hear from you?", a: "A weekly update, plus monthly and quarterly business reviews against the plan you approve. Senior leaders stay involved long after onboarding." },
  { q: "How do we start?", a: "Request a marketplace review. We reply within one business day with a first read on where the growth is, then scope a plan with you." },
];

export function FaqAccordion({
  items = faqs,
  heading = "Questions executives ask",
}: {
  items?: { q: string; a: string }[];
  heading?: string;
} = {}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
      <JsonLd data={faqLd(items.map((f) => ({ q: f.q, a: f.a })))} />
      <h2 className="h-display text-h2 text-navy-900">{heading}</h2>
      <div className="space-y-3">
        {items.map((f) => (
          <details key={f.q} className="group rounded-md bg-cream-50 px-5 shadow-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-medium text-navy-900">
              {f.q}
              <span className="text-gold-600 transition-transform group-open:rotate-45" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="pb-5 text-body leading-relaxed text-ink-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
