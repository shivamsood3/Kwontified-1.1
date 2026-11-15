import type { Metadata } from "next";
import { DiptychHero } from "@/components/blocks/DiptychHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { ui } from "@/lib/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a marketplace review",
  description:
    "Tell us where you sell and what you want to grow. A member of our team reviews every request and replies within one business day.",
  alternates: { canonical: "/contact" },
};

const next = [
  { title: "We reply within one business day", body: "A member of our team reviews your request and suggests times." },
  { title: "A discovery call", body: "We ask about your channels, goals and constraints." },
];

export default function ContactPage() {
  return (
    <>
      <DiptychHero
        eyebrow="Contact"
        title="Request a marketplace review."
        intro="Tell us where you sell and what you want to grow. A member of our team reviews every request and replies within one business day."
        leftId="contact-a"
        rightId="contact-b"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Form (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_0.7fr] lg:items-start">
            <ContactForm />
            <aside className="space-y-5">
              <h2 className="eyebrow">What happens next</h2>
              {next.map((n) => (
                <div key={n.title} className="rounded-2xl bg-white p-6 shadow-card">
                  <h3 className="text-base font-medium text-navy-900">{n.title}</h3>
                  <p className="mt-2 text-small leading-relaxed text-ink-muted">{n.body}</p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* Locations (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">Where to find us.</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {site.offices.map((o) => (
              <div key={o.label} className="flex gap-3">
                <ui.MapPin size={22} weight="light" className="mt-0.5 shrink-0 text-gold-700" aria-hidden="true" />
                <div>
                  <h3 className="h-display text-h3 text-navy-900">
                    {o.label}
                    {o.note ? <span className="text-ink-faint"> ({o.note})</span> : ""}
                  </h3>
                  <div className="mt-2 text-small leading-relaxed text-ink-muted">
                    {o.lines.map((l) => (
                      <span key={l} className="block">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
