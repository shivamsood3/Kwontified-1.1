import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for your request — a member of our team will reply within one business day.",
  alternates: { canonical: "/thank-you" },
  robots: { index: false },
};

const recent = [
  { kicker: "Case study · Amazon DSP", title: "$1.8M from DSP, with search intact", href: "/work/amazon-dsp" },
  { kicker: "Perspectives · retail media", title: "Is your Amazon DSP spend incremental?", href: "/perspectives/amazon-dsp-incrementality" },
  { kicker: "Work", title: "Case studies with figures", href: "/work" },
];

export default function ThankYouPage() {
  return (
    <section className="bg-cream-50">
      <div className="container-kw py-20">
        <p className="eyebrow">Request received</p>
        <h1 className="h-display mt-4 text-5xl text-navy-900 md:text-7xl">Thank you.</h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-muted">
          A member of our team will reply within one business day. While you
          wait, here is what we have published recently.
        </p>

        <div className="mt-16 border-t border-sand-300 pt-10">
          <h2 className="h-display text-2xl text-navy-900">Recent work and thinking</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {recent.map((r) => (
              <Link key={r.title} href={r.href} className="group">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-gold-700">
                  {r.kicker}
                </p>
                <h3 className="h-display mt-2 text-lg text-navy-900 group-hover:text-gold-700">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <Link href="/" className="learn-more">← Back to home</Link>
        </div>
      </div>
    </section>
  );
}
