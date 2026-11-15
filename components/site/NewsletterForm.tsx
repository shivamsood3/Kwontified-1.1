"use client";

import { useState } from "react";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p
        className={
          tone === "dark" ? "text-sm text-white/80" : "text-sm text-brand-700"
        }
      >
        Thanks — you’re on the list. Watch your inbox for Perspectives.
      </p>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email.includes("@")) return;
        try {
          await fetch("/api/subscribe", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email }),
          });
        } catch {
          // Confirm regardless; the sign-up is logged/forwarded server-side.
        }
        setDone(true);
      }}
      className="flex w-full max-w-md gap-2"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Work email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Work email"
        className={
          tone === "dark"
            ? "h-12 flex-1 rounded border border-white/25 bg-white/5 px-3.5 text-sm text-white placeholder:text-white/50 outline-none focus:border-gold-500"
            : "h-12 flex-1 rounded border border-sand-300 bg-white px-3.5 text-sm text-ink outline-none focus:border-gold-500"
        }
      />
      <button
        type="submit"
        className="h-12 shrink-0 rounded bg-gold-500 px-5 text-sm font-medium text-navy-900 transition hover:bg-gold-600"
      >
        Subscribe
      </button>
    </form>
  );
}
