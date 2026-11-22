"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage hero video — a contained 16:9 panel. Plays once (muted, inline,
 * autoplay where permitted) and holds the final frame; offers an accessible
 * replay control. Honours prefers-reduced-motion with a static final still.
 * The aspect-ratio box reserves space so there is no layout shift.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [ended, setEnded] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const v = ref.current;
    if (!v) return;
    const play = v.play();
    if (play && typeof play.catch === "function") play.catch(() => setBlocked(true));
  }, [reduced]);

  const replay = () => {
    const v = ref.current;
    if (!v) return;
    setEnded(false);
    setBlocked(false);
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => setBlocked(true));
  };

  const frame =
    "relative aspect-video w-full overflow-hidden rounded-[4px] bg-navy-950 ring-1 ring-white/10";

  if (reduced) {
    return (
      <div className={frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/videos/hero-final.webp"
          alt="A WRENMARKET order finalised on the Kwontified dashboard — $72,578 in sales."
          className="h-full w-full object-cover"
          width={1280}
          height={720}
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <video
        ref={ref}
        muted
        playsInline
        autoPlay
        preload="auto"
        poster="/videos/hero-poster.webp"
        onEnded={() => setEnded(true)}
        className="h-full w-full object-cover"
        aria-label="A navy sweater's journey from a shopper's order through packing, shipping and delivery to a finalised sale on the Kwontified dashboard."
      >
        <source src="/videos/hero-desktop.mp4" media="(min-width: 768px)" type="video/mp4" />
        <source src="/videos/hero-mobile.mp4" type="video/mp4" />
      </video>

      {(ended || blocked) && (
        <button
          type="button"
          onClick={replay}
          className="group absolute inset-0 flex items-center justify-center bg-navy-950/25 transition hover:bg-navy-950/35 focus-visible:outline-none"
          aria-label={blocked ? "Play hero video" : "Replay hero video"}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-navy-900 shadow-pop transition group-hover:bg-white">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {blocked ? <path d="M8 5v14l11-7z" /> : <path d="M12 5V2L7 7l5 5V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6z" />}
            </svg>
            {blocked ? "Play" : "Replay"}
          </span>
        </button>
      )}
    </div>
  );
}
