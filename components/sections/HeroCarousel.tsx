"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/site/Button";
import { IconTile } from "@/components/ui/IconTile";
import { capabilities } from "@/lib/nav";
import { capabilityIcons } from "@/lib/icons";

const BLUE = "#00618D";
const INK = "#262524";

// All slides are charcoal with the faint texture and dark chart panels (fix 10).
const slides = [
  { label: "Kwontified", bg: INK, dark: true },
  { label: "Retail media", bg: INK, dark: true },
  { label: "Creative", bg: INK, dark: true },
  { label: "AI commerce", bg: INK, dark: true },
  { label: "Operations", bg: INK, dark: true },
  { label: "Perspectives", bg: INK, dark: true },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [animate, setAnimate] = useState(true);
  const hover = useRef(false);

  useEffect(() => {
    // Keep auto-rotation on even with reduced motion; just drop the per-slide
    // entrance animation for those users.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(false);
    }
  }, []);

  const next = useCallback(() => setI((v) => (v + 1) % slides.length), []);
  const prev = () => setI((v) => (v - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (!hover.current && !document.hidden) next();
    }, 5000);
    return () => clearInterval(id);
  }, [playing, next]);

  const s = slides[i];
  const dark = s.dark;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: s.bg, color: dark ? "#fff" : INK }}
    >
      {dark && s.bg === INK && (
        <div className="bg-ecom-dark absolute inset-0 opacity-40" aria-hidden="true" />
      )}

      <div className="container-kw relative">
        {/* The page H1 is constant; the home slide renders it visibly, other
            slides keep it present but hidden so there is always one h1. (fix 17) */}
        {i !== 0 && <h1 className="sr-only">Measured growth. Beautiful work.</h1>}
        <div
          key={i}
          className={`grid gap-12 py-16 md:py-20 lg:min-h-[560px] lg:grid-cols-2 lg:items-center ${animate ? "animate-fade-up" : ""}`}
        >
          <Slide index={i} dark={dark} />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t py-4"
             style={{ borderColor: dark ? "rgba(255,255,255,.14)" : "rgba(38,37,36,.14)" }}>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {slides.map((sl, n) => {
              const on = n === i;
              const track = dark ? "rgba(255,255,255,.18)" : "rgba(38,37,36,.14)";
              const fill = dark ? "#fff" : BLUE;
              return (
                <div key={sl.label} className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setI(n)}
                    aria-current={on}
                    className="text-sm transition"
                    style={{
                      color: on ? (dark ? "#fff" : INK) : dark ? "rgba(255,255,255,.5)" : "rgba(38,37,36,.5)",
                      fontWeight: on ? 600 : 400,
                    }}
                  >
                    {sl.label}
                  </button>
                  <span
                    aria-hidden="true"
                    className="h-0.5 w-full overflow-hidden"
                    style={{ background: track }}
                  >
                    {on && (
                      <span
                        key={i}
                        className={`block h-full w-full ${playing ? "hero-progress-fill" : ""}`}
                        style={{ background: fill, transform: playing ? undefined : "scaleX(1)" }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm" style={{ color: dark ? "rgba(255,255,255,.7)" : "rgba(38,37,36,.6)" }}>
            <span>{i + 1} of {slides.length}</span>
            <Ctrl onClick={prev} label="Previous slide" dark={dark}>‹</Ctrl>
            <Ctrl onClick={() => setPlaying((p) => !p)} label={playing ? "Pause rotation" : "Play rotation"} dark={dark}>
              {playing ? "❚❚" : "►"}
            </Ctrl>
            <Ctrl onClick={next} label="Next slide" dark={dark}>›</Ctrl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ctrl({ onClick, label, children, dark }: { onClick: () => void; label: string; children: React.ReactNode; dark: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs transition hover:opacity-80"
      style={{ borderColor: dark ? "rgba(255,255,255,.25)" : "rgba(38,37,36,.2)" }}
    >
      {children}
    </button>
  );
}

/* ---------- Slides ---------- */

function Slide({ index, dark }: { index: number; dark: boolean }) {
  switch (index) {
    case 0:
      return <SlideHome />;
    case 1:
      return (
        <SlideProof
          dark={dark}
          eyebrow="Retail media"
          heading="Retail media measured on lift."
          body="For a national beauty brand, $192K of Amazon DSP returned $1.8M at 9.4x ROAS. New-to-brand sales rose 28% and search ROAS did not decline."
          cta={{ href: "/work/amazon-dsp", label: "Read the DSP case study" }}
          visual={<VisualRetail />}
        />
      );
    case 2:
      return (
        <SlideProof
          dark={dark}
          eyebrow="Creative"
          heading="Creative built from what converts."
          body="Image testing and Premium A+ Content lifted a premium skincare brand’s conversion from 8.2% to 12.1% on the same ad budget, worth $4.2M in incremental revenue."
          cta={{ href: "/capabilities/creative-studio", label: "Explore the Creative Studio" }}
          visual={<VisualCreative />}
        />
      );
    case 3:
      return (
        <SlideProof
          dark={dark}
          eyebrow="AI commerce"
          heading="Be the answer when shoppers ask AI."
          body="We build the product data and content that Amazon Rufus, ChatGPT, Google Gemini and Claude rely on when they recommend products."
          cta={{ href: "/capabilities/ai-commerce", label: "Explore AI Commerce" }}
          visual={<VisualAI />}
        />
      );
    case 4:
      return (
        <SlideProof
          dark={dark}
          eyebrow="Operations"
          heading="Operations that protect margin."
          body="For a home goods vendor, PO fill rate rose from 71% to 92%, shortage disputes recovered $450K and annual revenue grew from $10.5M to $14.0M."
          cta={{ href: "/capabilities/revenue-recovery", label: "Explore Revenue Recovery" }}
          visual={<VisualOps />}
        />
      );
    default:
      return (
        <SlideProof
          dark={dark}
          eyebrow="Perspectives"
          heading="What we’re seeing in the market."
          body="Our latest guide: how to tell whether your Amazon DSP spend is incremental, and the test design we use before scaling a budget."
          cta={{ href: "/perspectives/amazon-dsp-incrementality", label: "Read the guide" }}
          visual={<VisualLift />}
        />
      );
  }
}

function SlideHome() {
  return (
    <>
      <div>
        <p className="text-xs font-normal" style={{ color: "rgba(255,255,255,.55)" }}>
          Marketplace growth for consumer brands
        </p>
        <h1 className="h-display mt-4 text-5xl leading-[1.02] text-white md:text-7xl">
          Measured growth.
          <br />
          Beautiful work.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          Since 2016, we have run marketplace businesses on Amazon, Walmart,
          Target Plus and five more channels. One senior team owns all of it:
          your plan, advertising, creative and operations. We report weekly and
          are measured on your sales, return on ad spend and margin.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/contact" variant="primary" size="lg">Request a marketplace review</Button>
          <Button href="/work" variant="outline-light" size="lg">Read 14 client case studies</Button>
        </div>
      </div>
      <nav aria-label="Capabilities" className="lg:justify-self-end lg:max-w-md">
        <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
          {capabilities.map((c) => {
            const slug = c.href.split("/").pop() ?? "";
            const Icon = capabilityIcons[slug];
            return (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="group flex items-center gap-4 py-3 text-white/85 transition hover:text-white"
                >
                  {Icon && <IconTile icon={Icon} tone="dark" />}
                  <span className="flex-1 text-lg font-medium" style={{ letterSpacing: "-0.01em" }}>
                    {c.label}
                  </span>
                  <span className="shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-[color:#99c0d1]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function SlideProof({
  dark, eyebrow, heading, body, cta, visual,
}: {
  dark: boolean; eyebrow: string; heading: string; body: string;
  cta: { href: string; label: string }; visual: React.ReactNode;
}) {
  const sub = dark ? "rgba(255,255,255,.72)" : "rgba(38,37,36,.7)";
  const eye = dark ? "rgba(255,255,255,.55)" : BLUE;
  return (
    <>
      <div>
        <p className="text-xs font-normal" style={{ color: eye }}>{eyebrow}</p>
        {/* Proof-slide headings are h2; the page H1 is the persistent
            "Measured growth. Beautiful work." rendered by the carousel. (fix 17) */}
        <h2 className="h-display mt-4 text-4xl leading-[1.08] md:text-5xl" style={{ color: dark ? "#fff" : INK }}>
          {heading}
        </h2>
        <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: sub }}>{body}</p>
        <Link
          href={cta.href}
          className="mt-6 inline-flex items-center gap-1.5 text-[0.95rem] font-medium"
          style={{ color: dark ? "#99c0d1" : BLUE }}
        >
          {cta.label}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </Link>
      </div>
      <div className="lg:justify-self-end">{visual}</div>
    </>
  );
}

/* ---------- Proof visuals ---------- */

function Panel({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-7"
      style={{
        background: dark ? "rgba(255,255,255,.05)" : "#ffffff",
        border: `1px solid ${dark ? "rgba(255,255,255,.12)" : "rgba(38,37,36,.08)"}`,
        boxShadow: dark ? "none" : "0 20px 50px -24px rgba(13,19,32,.25)",
      }}
    >
      {children}
    </div>
  );
}

function Cap({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-normal text-white/50">{children}</p>;
}

function VisualRetail() {
  return (
    <Panel dark>
      <Cap>Amazon DSP, national beauty brand</Cap>
      <div className="mt-5 flex items-end gap-5">
        <Bar h={14} label="DSP spend" value="$192K" tone="rgba(255,255,255,.25)" dark />
        <Bar h={100} label="Attributed revenue" value="$1.8M" tone="#99c0d1" dark />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
        <Mini v="9.4x" l="DSP ROAS" dark />
        <Mini v="+28%" l="New-to-brand" dark />
        <Mini v="+19%" l="Account revenue" dark />
      </div>
    </Panel>
  );
}

function VisualCreative() {
  return (
    <Panel dark>
      <Cap>Premium skincare brand, Amazon US</Cap>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <figure>
          <div className="aspect-[4/3] overflow-hidden border border-white/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/creative/test-product.jpg"
              alt="Main image, before"
              className="h-full w-full object-cover"
              style={{ filter: "grayscale(1) brightness(0.9)" }}
            />
          </div>
          <p className="mt-1.5 text-[0.7rem] text-white/55">Main image, before</p>
        </figure>
        <figure>
          <div className="aspect-[4/3] overflow-hidden" style={{ boxShadow: "0 0 0 2px #99c0d1" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/creative/test-product.jpg"
              alt="Winning variant"
              className="h-full w-full object-cover"
              style={{ filter: "saturate(1.15) contrast(1.05)" }}
            />
          </div>
          <p className="mt-1.5 text-[0.7rem] font-medium" style={{ color: "#99c0d1" }}>
            Winning variant
          </p>
        </figure>
      </div>
      <div className="mt-5 flex items-end gap-5">
        <Bar h={66} label="Before" value="8.2%" tone="rgba(255,255,255,.25)" dark />
        <Bar h={100} label="After the test" value="12.1%" tone="#99c0d1" dark />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <Mini v="+47%" l="Conversion rate" dark />
        <Mini v="$4.2M" l="Incremental revenue" dark />
      </div>
    </Panel>
  );
}

function VisualAI() {
  const prods = [
    { name: "Gentle vitamin C serum, 30 ml", tags: "Fragrance-free · For sensitive skin", you: true },
    { name: "Brightening serum, 30 ml", tags: "Vitamin C 10%", you: false },
    { name: "Daily vitamin C drops, 15 ml", tags: "Fragrance-free", you: false },
  ];
  return (
    <Panel dark>
      <div className="border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
        Which vitamin C serum suits sensitive skin?
      </div>
      <p className="mt-4 text-sm text-white/60">Three products match what you asked for:</p>
      <ul className="mt-3 space-y-2">
        {prods.map((p) => (
          <li
            key={p.name}
            className="flex items-center justify-between gap-3 border px-3 py-2.5"
            style={{
              borderColor: p.you ? "#99c0d1" : "rgba(255,255,255,.12)",
              background: p.you ? "rgba(153,192,209,.08)" : "transparent",
            }}
          >
            <div>
              <div className="text-sm font-semibold text-white">{p.name}</div>
              <div className="text-xs text-white/50">{p.tags}</div>
            </div>
            {p.you && (
              <span className="shrink-0 px-2 py-0.5 text-[0.65rem] font-semibold text-ink" style={{ background: "#99c0d1" }}>
                Your listing
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[0.7rem] text-white/45">Illustration: an AI shopping assistant answer</p>
    </Panel>
  );
}

function VisualOps() {
  return (
    <Panel dark>
      <Cap>Home goods brand, Amazon Vendor Central</Cap>
      <div className="mt-5 grid grid-cols-2 gap-6">
        <div>
          <div className="text-xs font-medium text-white/55">PO fill rate</div>
          <div className="mt-2 flex items-end gap-3">
            <Bar h={71} label="Before" value="71%" tone="rgba(255,255,255,.25)" dark small />
            <Bar h={92} label="After" value="92%" tone="#99c0d1" dark small />
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-white/55">Annual revenue</div>
          <div className="mt-2 flex items-end gap-3">
            <Bar h={75} label="Before" value="$10.5M" tone="rgba(255,255,255,.25)" dark small />
            <Bar h={100} label="After" value="$14.0M" tone="#99c0d1" dark small />
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
        <Mini v="$450K" l="Shortage claims recovered" dark />
        <Mini v="60%" l="Lower chargeback fees" dark />
      </div>
    </Panel>
  );
}

function VisualLift() {
  return (
    <Panel dark>
      <Cap>Lift study: the test design</Cap>
      <div className="mt-6 flex items-end gap-6">
        <Bar h={58} label="Unexposed audience" value="" tone="rgba(255,255,255,.25)" dark />
        <Bar h={100} label="Exposed audience" value="" tone="#99c0d1" dark />
      </div>
      <p className="mt-4 flex items-center gap-2 text-[0.7rem] text-[color:#99c0d1]">
        <span className="inline-block h-2 w-2" style={{ background: "#99c0d1" }} aria-hidden="true" />
        Incremental lift: the gap between exposed and unexposed
      </p>
      <p className="mt-2 text-xs text-white/50">Purchase rate · illustration of the method, not client data</p>
    </Panel>
  );
}

/* ---------- primitives ---------- */

function Bar({ h, label, value, tone, dark, small }: { h: number; label: string; value?: string; tone: string; dark?: boolean; small?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      {value ? (
        <span className="h-display text-lg" style={{ color: dark ? "#fff" : INK }}>{value}</span>
      ) : null}
      <div className={`flex w-full items-end ${small ? "h-16" : "h-28"}`}>
        <div className="w-full rounded-t" style={{ height: `${h}%`, background: tone }} />
      </div>
      <span className="text-center text-[0.7rem]" style={{ color: dark ? "rgba(255,255,255,.5)" : "rgba(38,37,36,.55)" }}>{label}</span>
    </div>
  );
}

function Mini({ v, l, dark }: { v: string; l: string; dark?: boolean }) {
  return (
    <div>
      <div className="h-display text-xl" style={{ color: dark ? "#fff" : BLUE }}>{v}</div>
      <div className="mt-0.5 text-[0.7rem] leading-snug" style={{ color: dark ? "rgba(255,255,255,.55)" : "rgba(38,37,36,.55)" }}>{l}</div>
    </div>
  );
}
