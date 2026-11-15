"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Stat } from "@/components/ui/Stat";
import { Img } from "@/components/ui/Img";
import {
  capabilities,
  channelMarketplaces,
  channelSocial,
} from "@/lib/nav";
import { capImage, chImage } from "@/lib/content/imageMap";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

type MenuId = "cap" | "chan";

// Featured case-study rail shown on the right of each mega-panel (§7.1).
// Figures are real (amazon-dsp and international-expansion case studies).
const featured: Record<MenuId, { kicker: string; stat: string; statLabel: string; title: string; href: string }> = {
  cap: {
    kicker: "Featured case study · Amazon",
    stat: "9.4x",
    statLabel: "DSP ROAS on $192K",
    title: "$1.8M from DSP, with search intact.",
    href: "/work/amazon-dsp",
  },
  chan: {
    kicker: "Featured case study · International",
    stat: "$1.4M",
    statLabel: "International revenue, 3 regions",
    title: "$1.4M in international revenue, from a US-only start.",
    href: "/work/international-expansion",
  },
};

export function Header() {
  const [open, setOpen] = useState<MenuId | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<MenuId, HTMLButtonElement | null>>({ cap: null, chan: null });
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  // Hover intent: 120ms to open, but switch instantly between menus.
  const scheduleOpen = useCallback(
    (id: MenuId) => {
      clearTimers();
      setOpen((cur) => {
        if (cur && cur !== id) return id; // already open → switch with no delay
        openTimer.current = setTimeout(() => setOpen(id), 120);
        return cur;
      });
    },
    [],
  );

  // 200ms close delay, cancelled if the pointer re-enters trigger or panel.
  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(null), 200);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const toggle = useCallback((id: MenuId) => {
    clearTimers();
    setOpen((cur) => (cur === id ? null : id));
  }, []);

  const closeAll = useCallback(() => {
    clearTimers();
    setOpen(null);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click / focus, and on Escape (returning focus to trigger).
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const id = open;
        closeAll();
        triggerRefs.current[id]?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeAll]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition-[border-color,box-shadow] supports-[backdrop-filter]:bg-white/80",
        scrolled || open
          ? "border-line shadow-[0_1px_0_rgba(38,37,36,0.04),0_8px_24px_-16px_rgba(38,37,36,0.25)]"
          : "border-transparent",
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
        <nav className="hidden h-full items-stretch lg:flex" aria-label="Primary">
          <MenuItem
            id="cap"
            label="Capabilities"
            open={open === "cap"}
            triggerRef={(el) => (triggerRefs.current.cap = el)}
            onPointerOpen={() => scheduleOpen("cap")}
            onPointerClose={scheduleClose}
            onToggle={() => toggle("cap")}
          />
          <MenuItem
            id="chan"
            label="Channels"
            open={open === "chan"}
            triggerRef={(el) => (triggerRefs.current.chan = el)}
            onPointerOpen={() => scheduleOpen("chan")}
            onPointerClose={scheduleClose}
            onToggle={() => toggle("chan")}
          />
          <TopLink href="/work" onEnter={closeAll}>Work</TopLink>
          <TopLink href="/why-kwontified" onEnter={closeAll}>Why Kwontified</TopLink>
          <TopLink href="/perspectives" onEnter={closeAll}>Perspectives</TopLink>
          <TopLink href="/about" onEnter={closeAll}>About</TopLink>
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={site.clientSignInUrl}
            className="text-sm font-medium text-ink transition hover:text-gold-700"
          >
            Client sign-in
          </a>
          <Button href="/contact" size="md">Let’s talk</Button>
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

      {/* Desktop mega-panels — full container width, square, shadow-pop */}
      {(["cap", "chan"] as MenuId[]).map((id) =>
        open === id ? (
          <MegaPanel
            key={id}
            id={id}
            onPointerEnter={cancelClose}
            onPointerLeave={scheduleClose}
          />
        ) : null,
      )}

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
            <Button href="/contact" size="lg" className="w-full">Let’s talk</Button>
          </div>
        </div>
      )}
    </header>
  );
}

/** A top-level menu trigger. The trigger fills header height so there is no
 *  dead zone between it and the panel below (fix 0b). Pointer handlers are
 *  gated to mouse so touch toggles on tap instead of hover. */
function MenuItem({
  id,
  label,
  open,
  triggerRef,
  onPointerOpen,
  onPointerClose,
  onToggle,
}: {
  id: MenuId;
  label: string;
  open: boolean;
  triggerRef: (el: HTMLButtonElement | null) => void;
  onPointerOpen: () => void;
  onPointerClose: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-stretch"
      onPointerEnter={(e) => e.pointerType === "mouse" && onPointerOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onPointerClose()}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={`mega-${id}`}
        onClick={onToggle}
        className={cn(
          "flex h-full items-center gap-1 px-3 text-sm font-medium transition-colors",
          open ? "text-brand-700" : "text-ink hover:text-brand-700",
        )}
      >
        {label}
        <ChevronIcon className={cn("transition-transform", open && "rotate-180")} />
      </button>
    </div>
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
      onPointerEnter={(e) => e.pointerType === "mouse" && onEnter?.()}
      className="flex h-full items-center px-3 text-sm font-medium text-ink transition-colors hover:text-brand-700"
    >
      {children}
    </Link>
  );
}

function MegaPanel({
  id,
  onPointerEnter,
  onPointerLeave,
}: {
  id: MenuId;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const f = featured[id];
  return (
    <div
      id={`mega-${id}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="absolute left-0 right-0 top-full z-40"
    >
      {/* pt-2 keeps the gap inside the hover area (fix 0b) */}
      <div className="container-kw pt-2">
        <div className="flex gap-10 rounded-2xl border border-sand-300 bg-cream-50 p-6 shadow-pop">
          <div className="min-w-0 flex-1">
            {id === "cap" ? (
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {capabilities.map((c) => (
                  <PanelLink key={c.href} item={c} thumb={`${capImage(c.href.split("/").pop() ?? "")}-a`} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-x-8">
                <div className="col-span-2">
                  <PanelHeading>Marketplaces</PanelHeading>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {channelMarketplaces.map((c) => (
                      <PanelLink key={c.href} item={c} compact thumb={`${chImage(c.href.split("/").pop() ?? "")}-a`} />
                    ))}
                  </div>
                </div>
                <div>
                  <PanelHeading>Social commerce</PanelHeading>
                  <div className="grid gap-y-1">
                    {channelSocial.map((c) => (
                      <PanelLink key={c.href} item={c} compact thumb={`${chImage(c.href.split("/").pop() ?? "")}-a`} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <PanelFooter
              href={id === "cap" ? "/capabilities" : "/channels"}
              label={id === "cap" ? "All capabilities" : "All channels"}
            />
          </div>

          {/* Featured-stat rail (§7.1, fix 13) */}
          <aside className="hidden w-72 shrink-0 border-l border-ink-300 pl-8 xl:block">
            <p className="eyebrow">{f.kicker}</p>
            <div className="mt-4">
              <Stat value={f.stat} label={f.statLabel} tone="light" />
            </div>
            <Link href={f.href} className="group mt-5 block">
              <p className="h-display text-lg leading-snug text-ink group-hover:text-brand-700">
                {f.title}
              </p>
              <span className="link-underline mt-2 inline-flex text-sm">
                Read the case study
                <ArrowIcon />
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PanelHeading({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-xs font-normal text-muted">{children}</div>;
}

function PanelLink({
  item,
  compact,
  thumb,
}: {
  item: { label: string; href: string; blurb?: string };
  compact?: boolean;
  thumb?: string;
}) {
  const hasThumb = thumb && !thumb.startsWith("null");
  return (
    <Link href={item.href} className="group flex items-start gap-3 rounded-xl px-3 py-2 transition hover:bg-white">
      {hasThumb && (
        <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          <Img id={thumb} sizes="40px" />
        </span>
      )}
      <div className="min-w-0">
        <div className="text-sm font-semibold text-navy-900 group-hover:text-gold-700">{item.label}</div>
        {!compact && item.blurb && (
          <div className="mt-0.5 text-xs leading-snug text-ink-muted">{item.blurb}</div>
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
          <Link key={i.href} href={i.href} onClick={onNav} className="py-1 text-sm text-muted">
            {i.label}
          </Link>
        ))}
      </div>
    </div>
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
