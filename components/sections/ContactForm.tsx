"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const sellOptions = [
  "Amazon Seller Central (3P)",
  "Amazon Vendor Central (1P)",
  "Walmart",
  "Target Plus",
  "Brand site or Shopify",
  "International marketplaces",
  "TikTok Shop or Instagram Shop",
];

const revenueOptions = [
  "Pre-launch",
  "Under $1M",
  "$1M – $5M",
  "$5M – $20M",
  "$20M – $100M",
  "$100M+",
];

const goals = [
  "Consolidate agencies and vendors",
  "Launch new marketplaces",
  "Fix inventory or fulfillment",
  "Prepare for AI shopping assistants",
  "Advanced analytics and AMC",
  "Full-service management",
];

export function ContactForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.currentTarget);
        try {
          await fetch("/api/contact", { method: "POST", body: fd });
        } catch {
          // Still take the user to the thank-you page; the request is logged
          // server-side and forwarded if a webhook is configured.
        }
        router.push("/thank-you");
      }}
      className="space-y-8"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Text name="firstName" label="First name" required />
        <Text name="lastName" label="Last name" required />
        <Text name="email" label="Work email" type="email" required />
        <Text name="jobTitle" label="Job title" />
        <Text name="company" label="Company or brand" required />
        <Text name="website" label="Brand website" />
      </div>

      <Fieldset legend="Where you sell today">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sellOptions.map((o) => (
            <label key={o} className="flex items-start gap-2 text-sm text-ink">
              <input type="checkbox" name="sell" value={o} className="mt-0.5 h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-400" />
              {o}
            </label>
          ))}
        </div>
      </Fieldset>

      <div className="max-w-xs">
        <label htmlFor="revenue" className="mb-1.5 block text-sm font-semibold text-ink">
          Annual ecommerce revenue
        </label>
        <select
          id="revenue"
          name="revenue"
          className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        >
          {revenueOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <Fieldset legend="Primary goal">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <label key={g} className="flex items-start gap-2 text-sm text-ink">
              <input type="radio" name="goal" value={g} className="mt-0.5 h-4 w-4 border-line text-brand-600 focus:ring-brand-400" />
              {g}
            </label>
          ))}
        </div>
      </Fieldset>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-ink">
          What are you trying to achieve?
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="For example: we run Amazon in-house and want to launch Target Plus and Walmart with one partner."
          className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <p className="text-sm text-muted">
        We use what you share only to prepare for and hold this conversation. We
        do not share it with third parties.
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center justify-center rounded-md bg-brand-600 px-6 text-[0.95rem] font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Request a marketplace review"}
      </button>
    </form>
  );
}

function Text({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-ink">{legend}</legend>
      {children}
    </fieldset>
  );
}
