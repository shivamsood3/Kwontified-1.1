import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Request a marketplace review",
  description:
    "Tell us where you sell and what you want to grow. A member of our team reviews every request and replies within one business day.",
  alternates: { canonical: "/contact" },
};

const next = [
  {
    title: "We reply within one business day",
    body: "A member of our team reviews your request and suggests times.",
  },
  {
    title: "A discovery call",
    body: "We ask about your channels, goals and constraints.",
  },
];

export default function ContactPage() {
  return (
    <section className="bg-white">
      <div className="container-kw py-14">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="text-line">/</span>
          <span className="text-ink">Request a marketplace review</span>
        </nav>

        <h1 className="h-display max-w-2xl text-4xl leading-tight text-ink md:text-6xl">
          Request a marketplace review.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Tell us where you sell and what you want to grow. A member of our team
          reviews every request.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_0.7fr] lg:items-start">
          <ContactForm />

          <aside className="space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              What happens next
            </h2>
            {next.map((n) => (
              <div key={n.title} className="rounded-2xl border border-line bg-paper p-6">
                <h3 className="text-base font-semibold text-ink">{n.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{n.body}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
