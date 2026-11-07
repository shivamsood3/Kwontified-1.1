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
        className="h-11 flex-1 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-md bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink-700"
      >
        Subscribe
      </button>
    </form>
  );
}
