import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { NewsletterForm } from "./NewsletterForm";
import { capabilities, channelsAll, companyNav } from "@/lib/nav";
import { site } from "@/lib/site";
import { socialIcons } from "@/lib/icons";

const socialWithUrls = site.social.filter((s) => s.href && s.href.length > 0);

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white/70">
      {/* Pre-footer CTA */}
      <section className="border-t border-white/10 bg-navy-900">
        <div className="container-kw py-16 md:py-20">
          <h2 className="h-display max-w-2xl text-[clamp(28px,3.4vw,44px)] leading-[1.1] text-white">
            See what your marketplaces can earn.
          </h2>
          <p className="mt-4 max-w-xl text-body text-white/70">
            Share your channels and goals. A member of our team will reply within one business day
            with a first read on where the growth is.
          </p>
          <div className="mt-7">
            <Button href="/contact" variant="primary" size="lg">Request a marketplace review</Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-navy-950">
        <div className="container-kw grid gap-8 py-14 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <h2 className="h-display text-xl text-white">Get our marketplace briefing once a month.</h2>
            <p className="mt-2 max-w-md text-small text-white/65">
              The marketplace changes that matter, what they mean for your brand, and our latest
              guides. Unsubscribe in one click.
            </p>
          </div>
          <div className="md:justify-self-end">
            <NewsletterForm tone="dark" />
          </div>
        </div>
      </section>

      {/* Link columns */}
      <div className="container-kw py-14">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Logo tone="light" />
            <div className="flex items-center gap-4 text-sm">
              <a href={site.phoneHref} className="text-white/80 hover:text-white">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="text-white/80 underline decoration-white/30 underline-offset-2 hover:text-white">{site.email}</a>
            </div>
          </div>
          {socialWithUrls.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/55">Follow Kwontified</span>
              <div className="flex gap-1.5">
                {socialWithUrls.map((s) => {
                  const SocialIcon = socialIcons[s.label];
                  return (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
                      {SocialIcon ? <SocialIcon size={17} weight="fill" aria-hidden="true" /> : <span className="text-xs">{s.label[0]}</span>}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <FooterCol title="Capabilities" items={capabilities} />
          <FooterCol title="Channels" items={channelsAll} />
          <FooterCol title="Company" items={companyNav} />
          <div>
            <ColTitle>Offices</ColTitle>
            <ul className="space-y-4">
              {site.offices.map((o) => (
                <li key={o.label} className="text-small leading-snug text-white/60">
                  <span className="font-medium text-white">{o.label}{o.note ? ` (${o.note})` : ""}</span>
                  {o.lines.map((l) => <span key={l} className="mt-0.5 block">{l}</span>)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.year} {site.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ColTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 text-sm font-medium text-white">{children}</div>;
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <ColTitle>{title}</ColTitle>
      <ul className="space-y-2.5">
        {items.map((i) => {
          const external = i.href.startsWith("http");
          return (
            <li key={i.href}>
              {external ? (
                <a href={i.href} className="text-sm text-white/65 hover:text-white">{i.label}</a>
              ) : (
                <Link href={i.href} className="text-sm text-white/65 hover:text-white">{i.label}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
