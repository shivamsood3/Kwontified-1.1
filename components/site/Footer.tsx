import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { NewsletterForm } from "./NewsletterForm";
import { capabilities, channelsAll, companyNav } from "@/lib/nav";
import { site } from "@/lib/site";
import { ui } from "@/lib/icons";

// §7.12 — only render social links that have a real URL.
const socialWithUrls = site.social.filter((s) => s.href && s.href.length > 0);

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      {/* Conversation + newsletter band */}
      <div className="border-b border-line bg-paper">
        <div className="container-kw grid gap-10 py-14 md:grid-cols-2">
          <div>
            <h2 className="h-display text-2xl text-ink">Let’s start a conversation.</h2>
            <p className="mt-2 max-w-sm text-[0.95rem] text-muted">
              Tell us where you sell and what you want to grow. A member of our
              team replies within one business day.
            </p>
            <div className="mt-5">
              <Button href="/contact">Start a conversation</Button>
            </div>
          </div>
          <div className="md:justify-self-end">
            <h2 className="h-display text-2xl text-ink">
              Get our marketplace briefing once a month.
            </h2>
            <p className="mt-2 max-w-sm text-[0.95rem] text-muted">
              The marketplace changes that matter, what they mean for your brand
              and our latest guides. Unsubscribe in one click.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-kw py-14">
        <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Logo tone="dark" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Follow Kwontified</span>
              <div className="flex gap-1.5">
                {socialWithUrls.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center border border-line bg-white transition hover:border-brand-300 hover:bg-paper"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.icon} alt={s.label} className="h-[18px] w-[18px]" loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm md:items-end">
            <a href={site.phoneHref} className="flex items-center gap-2 font-medium text-ink hover:text-brand-700">
              <ui.Phone size={16} className="text-brand-600" aria-hidden="true" />
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-brand-600 hover:text-brand-700">
              <ui.Email size={16} aria-hidden="true" />
              {site.email}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          <FooterCol title="Capabilities" items={capabilities} />
          <FooterCol title="Channels" items={channelsAll} />
          <FooterCol title="Company" items={companyNav} />
          <div>
            <ColTitle>Offices</ColTitle>
            <ul className="space-y-4">
              {site.offices.map((o) => (
                <li key={o.label} className="flex gap-2 text-sm leading-snug text-muted">
                  <ui.MapPin size={16} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-ink">
                      {o.label}
                      {o.note ? ` (${o.note})` : ""}
                    </span>
                    {o.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <Link href="/accessibility" className="hover:text-ink">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-xs font-normal text-ink">
      {children}
    </div>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <ColTitle>{title}</ColTitle>
      <ul className="space-y-2">
        {items.map((i) => {
          const external = i.href.startsWith("http");
          return (
            <li key={i.href}>
              {external ? (
                <a href={i.href} className="text-sm text-muted hover:text-brand-700">
                  {i.label}
                </a>
              ) : (
                <Link href={i.href} className="text-sm text-muted hover:text-brand-700">
                  {i.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
