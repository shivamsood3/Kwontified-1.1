"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { IconTile } from "@/components/ui/IconTile";
import {
  capabilities,
  channelMarketplaces,
  channelSocial,
} from "@/lib/nav";
import { capabilityIcons, channelIcons, type Icon } from "@/lib/icons";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition-[border-color,box-shadow] supports-[backdrop-filter]:bg-white/80",
        scrolled ? "border-line shadow-[0_1px_0_rgba(38,37,36,0.04),0_8px_24px_-16px_rgba(38,37,36,0.25)]" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "container-kw flex items-center justify-between gap-6 transition-[height] duration-200",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <Logo tone="dark" />

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setOpen(null)}
        >
          <DropdownTrigger
            label="Capabilities"
            href="/capabilities"
            active={open === "cap"}
            onEnter={() => setOpen("cap")}
          />
          <DropdownTrigger
            label="Channels"
            href="/channels"
            active={open === "chan"}
            onEnter={() => setOpen("chan")}
          />
          <TopLink href="/work" onEnter={() => setOpen(null)}>
            Work
          </TopLink>
          <TopLink href="/why-kwontified" onEnter={() => setOpen(null)}>
            Why Kwontified
          </TopLink>
          <TopLink href="/perspectives" onEnter={() => setOpen(null)}>
            Perspectives
          </TopLink>
          <TopLink href="/about" onEnter={() => setOpen(null)}>
            About
          </TopLink>

          {open === "cap" && (
            <MegaPanel onEnter={() => setOpen("cap")}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {capabilities.map((c) => (
                  <PanelLink
                    key={c.href}
                    item={c}
                    icon={capabilityIcons[c.href.split("/").pop() ?? ""]}
                  />
                ))}
              </div>
              <PanelFooter href="/capabilities" label="All capabilities" />
            </MegaPanel>
          )}

          {open === "chan" && (
            <MegaPanel onEnter={() => setOpen("chan")} wide>
              <div className="grid grid-cols-3 gap-x-8">
                <div className="col-span-2">
                  <PanelHeading>Marketplaces</PanelHeading>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {channelMarketplaces.map((c) => (
                      <PanelLink
                        key={c.href}
                        item={c}
                        compact
                        icon={channelIcons[c.href.split("/").pop() ?? ""]}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <PanelHeading>Social commerce</PanelHeading>
                  <div className="grid gap-y-1">
                    {channelSocial.map((c) => (
                      <PanelLink
                        key={c.href}
                        item={c}
                        compact
                        icon={channelIcons[c.href.split("/").pop() ?? ""]}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <PanelFooter href="/channels" label="All channels" />
            </MegaPanel>
          )}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm text-muted transition hover:border-brand-300 hover:text-ink"
            aria-label="Search"
          >
            <SearchIcon />
            <span>Search</span>
            <kbd className="rounded bg-paper px-1.5 py-0.5 text-[0.65rem] font-medium text-muted">
              ⌘K
            </kbd>
          </button>
          <a
            href={site.clientSignInUrl}
            className="text-sm font-medium text-ink transition hover:text-brand-700"
          >
            Client sign-in
          </a>
          <Button href="/contact" size="md">
            Let’s talk
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobile}
          onClick={() => setMobile((v) => !v)}
        >
          <BurgerIcon open={mobile} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="border-t border-line bg-white lg:hidden">
          <div className="container-kw space-y-5 py-6">
            <MobileGroup title="Capabilities" href="/capabilities" items={capabilities} onNav={() => setMobile(false)} />
            <MobileGroup title="Channels" href="/channels" items={[...channelMarketplaces, ...channelSocial]} onNav={() => setMobile(false)} />
            <div className="flex flex-col gap-3 border-t border-line pt-4 text-[0.95rem] font-medium">
              <Link href="/work" onClick={() => setMobile(false)}>Work</Link>
              <Link href="/why-kwontified" onClick={() => setMobile(false)}>Why Kwontified</Link>
              <Link href="/perspectives" onClick={() => setMobile(false)}>Perspectives</Link>
              <Link href="/about" onClick={() => setMobile(false)}>About</Link>
              <a href={site.clientSignInUrl}>Client sign-in</a>
            </div>
            <Button href="/contact" size="lg" className="w-full">
              Let’s talk
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function TopLink({
  href,
  children,
  onEnter,
}: {
  href: string;
  children: React.ReactNode;
  onEnter?: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      className="rounded-md px-3 py-2 text-sm font-medium text-ink transition hover:text-brand-700"
    >
      {children}
    </Link>
  );
}

function DropdownTrigger({
  label,
  href,
  active,
  onEnter,
}: {
  label: string;
  href: string;
  active: boolean;
  onEnter: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onEnter}
      className={cn(
        "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition",
        active ? "text-brand-700" : "text-ink hover:text-brand-700",
      )}
    >
      {label}
      <ChevronIcon className={cn("transition", active && "rotate-180")} />
    </Link>
  );
}

function MegaPanel({
  children,
  onEnter,
  wide,
}: {
  children: React.ReactNode;
  onEnter: () => void;
  wide?: boolean;
}) {
  return (
    <div
      onMouseEnter={onEnter}
      className="absolute left-0 right-0 top-full z-40"
    >
      <div className="container-kw">
        <div
          className={cn(
            "mt-2 rounded-xl border border-line bg-white p-6 shadow-lift",
            wide ? "max-w-4xl" : "max-w-2xl",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs font-normal text-muted">
      {children}
    </div>
  );
}

function PanelLink({
  item,
  compact,
  icon,
}: {
  item: { label: string; href: string; blurb?: string };
  compact?: boolean;
  icon?: Icon;
}) {
  return (
    <Link
      href={item.href}
      className="group flex items-start gap-3 px-3 py-2 transition hover:bg-paper"
    >
      {icon && <IconTile icon={icon} />}
      <div className="min-w-0">
        <div className="text-sm font-semibold text-ink group-hover:text-brand-700">
          {item.label}
        </div>
        {!compact && item.blurb && (
          <div className="mt-0.5 text-xs leading-snug text-muted">{item.blurb}</div>
        )}
      </div>
    </Link>
  );
}

function PanelFooter({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-4 border-t border-line pt-3">
      <Link href={href} className="link-underline text-sm">
        {label}
        <ArrowIcon />
      </Link>
    </div>
  );
}

function MobileGroup({
  title,
  href,
  items,
  onNav,
}: {
  title: string;
  href: string;
  items: { label: string; href: string }[];
  onNav: () => void;
}) {
  return (
    <div>
      <Link href={href} onClick={onNav} className="text-[0.95rem] font-semibold">
        {title}
      </Link>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            onClick={onNav}
            className="py-1 text-sm text-muted"
          >
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}
