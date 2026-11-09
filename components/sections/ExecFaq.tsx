import { JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";

const faqs = [
  {
    q: "How does an engagement start?",
    a: "Every engagement begins with an audit of catalog health, advertising efficiency, listing quality, content completeness, compliance and organic performance. We share what we find, agree priorities with you, and repeat the audit on a set schedule once the work is under way.",
  },
  {
    q: "Do you report on profit, or only on revenue?",
    a: "Both. Plans and reports track contribution margin after cost of goods, marketplace fees, fulfillment and advertising, alongside revenue, so growth is judged on what it earns.",
  },
  {
    q: "Who will we work with day to day?",
    a: "A named team with its own inbox, supported by specialists in retail media, creative, operations and analytics, with senior leaders who stay involved in your strategy. You do not need to coordinate separate agencies for each discipline.",
  },
  {
    q: "How are your fees structured?",
    a: "Fees are set per channel in each statement of work and reflect the scope we run. Depending on the channel, they can include a commission on the sales we manage, and Amazon DSP carries a fee on managed spend. You receive a written proposal with fees after the first review, before anything is signed.",
  },
  {
    q: "Can we start with one channel or one capability?",
    a: "Yes. Because each channel has its own statement of work, you can start with one, such as Amazon advertising, and add channels or capabilities later under the same agreement.",
  },
  {
    q: "How are engagements structured?",
    a: "Each engagement runs under one master services agreement, with a statement of work for each channel. Scope, fees and responsibilities are set per channel, so each one is clear on its own.",
  },
  {
    q: "Can you work alongside our in-house team?",
    a: "Yes. Your statement of work sets which channels and tasks we own and which stay with your team, so responsibilities are clear from day one. We coordinate with you on brand, product and inventory decisions.",
  },
];

export function ExecFaq() {
  return (
    <section className="bg-white">
      <JsonLd data={faqLd(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <div className="container-kw py-20">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <h2 className="h-display text-3xl text-ink">Questions executives ask</h2>
            <p className="mt-3 text-sm text-muted">
              Applies to every capability and channel.
            </p>
          </div>
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
  );
}
