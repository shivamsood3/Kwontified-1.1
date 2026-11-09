import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Kwontified is committed to making kwontified.com usable for everyone. Read our accessibility commitment, the standard we build to, and how to reach us.",
  alternates: { canonical: "/accessibility" },
};

const sections: { h: string; body: string[] }[] = [
  {
    h: "Our commitment",
    body: [
      "Kwontified is committed to making kwontified.com usable for as many people as possible, regardless of ability or technology. Accessibility is part of how we design and build, not an afterthought.",
    ],
  },
  {
    h: "The standard we build to",
    body: [
      "We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. That means we work to keep content perceivable, operable, understandable and robust: readable color contrast, keyboard access to every interactive element, visible focus states, text alternatives for meaningful images, and structure that assistive technology can follow.",
      "We also respect the reduced-motion preference set in your operating system, so animations and auto-rotating content are reduced or stopped when you ask your device for less motion.",
    ],
  },
  {
    h: "Ongoing work",
    body: [
      "Accessibility is an ongoing effort. We test with keyboard navigation and screen readers and review new work against our standard. If something falls short, we treat it as a defect to fix.",
    ],
  },
  {
    h: "Tell us about a barrier",
    body: [
      "If you encounter a barrier on this site, or need information in a different format, we want to hear from you. Contact us and we will work to provide the information or service you need.",
    ],
  },
];

export default function AccessibilityPage() {
  return (
    <section className="bg-white">
      <div className="container-kw py-16">
        <nav className="mb-6 flex items-center gap-2 text-small text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span className="text-line">/</span>
          <span className="text-ink">Accessibility</span>
        </nav>

        <h1 className="h-display text-h1 text-ink">Accessibility</h1>
        <p className="mt-3 text-small text-muted">
          Building kwontified.com to WCAG 2.2 AA.
        </p>

        <div className="mt-8 max-w-3xl">
          {sections.map((s) => (
            <section key={s.h} className="mt-10 first:mt-0">
              <h2 className="h-display text-h3 text-ink">{s.h}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-lead leading-relaxed text-ink-700">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <div className="mt-10 border-l-2 border-brand-600 bg-brand-100 px-5 py-4 text-small leading-relaxed text-ink-700">
            <p className="font-medium text-brand-700">Contact us</p>
            <p className="mt-1">
              Email{" "}
              <a href={`mailto:${site.email}`} className="text-brand-600 hover:text-brand-700">
                {site.email}
              </a>{" "}
              or call{" "}
              <a href={site.phoneHref} className="text-brand-600 hover:text-brand-700">
                {site.phone}
              </a>
              . We reply within one business day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
