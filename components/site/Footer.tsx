import Link from "next/link";
import { Logo, KMonogram } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { capabilities, channelsAll, companyNav } from "@/lib/nav";
import { site } from "@/lib/site";
import { ui, socialIcons } from "@/lib/icons";

// §7.12 — only render social links that have a real URL.
const socialWithUrls = site.social.filter((s) => s.href && s.href.length > 0);

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/70">
      {/* outline gold K monogram, bottom-right (§5.2-14) */}
      <KMonogram
        color="#DBBF84"
        className="pointer-events-none absolute -bottom-6 right-4 h-40 w-auto opacity-[0.12] md:right-12 md:h-56"
      />

      <div className="container-kw relative py-16">
        {/* Top: logo + newsletter */}
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2">
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-small leading-relaxed text-white/65">
              One team for retail media, creative, operations and analytics across Amazon,
              Walmart, Target Plus and global marketplaces.
            </p>
          </div>
          <div className="md:justify-self-end">
            <h2 className="h-display text-xl text-white">Get our marketplace briefing once a month.</h2>
            <p className="mt-2 max-w-sm text-small text-white/65">
              The marketplace changes that matter, what they mean for your brand, and our
              latest guides. Unsubscribe in one click.
            </p>
            <div className="mt-5">
              <NewsletterForm tone="dark" />
            </div>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          <FooterCol title="Capabilities" items={capabilities} />
          <FooterCol title="Channels" items={channelsAll} />
          <FooterCol title="Company" items={companyNav} />
          <div>
            <ColTitle>Offices</ColTitle>
            <ul className="space-y-4">
              {site.offices.map((o) => (
                <li key={o.label} className="flex gap-2 text-small leading-snug text-white/60">
                  <ui.MapPin size={16} className="mt-0.5 shrink-0 text-gold-500" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-white">
                      {o.label}
                      {o.note ? ` (${o.note})` : ""}
                    </span>
                    {o.lines.map((l) => (
                      <span key={l} className="block">{l}</span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contacts + social */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6">
            <a href={site.phoneHref} className="flex items-center gap-2 font-medium text-white hover:text-gold-300">
              <ui.Phone size={16} className="text-gold-500" aria-hidden="true" />
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-white/80 hover:text-gold-300">
              <ui.Email size={16} aria-hidden="true" />
              {site.email}
            </a>
          </div>
          {socialWithUrls.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/55">Follow Kwontified</span>
              <div className="flex gap-1.5">
                {socialWithUrls.map((s) => {
                  const SocialIcon = socialIcons[s.label];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded border border-white/20 text-white/70 transition hover:border-gold-500 hover:text-gold-300"
                    >
                      {SocialIcon ? (
                        <SocialIcon size={18} weight="fill" aria-hidden="true" />
                      ) : (
                        <span className="text-xs font-medium">{s.label[0]}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.year} {site.legalName}. All rights reserved.</p>
          <div className="flex gap-6">
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
  return <div className="mb-3 text-[12px] font-medium uppercase tracking-[0.12em] text-gold-500">{children}</div>;
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <ColTitle>{title}</ColTitle>
      <ul className="space-y-2">
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
