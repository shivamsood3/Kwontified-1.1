"use client";

import { useState } from "react";
import { Button } from "@/components/site/Button";

const channels = ["Amazon", "Walmart", "Target Plus", "Multiple marketplaces"];
const goals = [
  "Advertising return",
  "New-to-brand growth",
  "Recovered revenue",
  "Operational control",
];

type Result = { stat: string; label: string; body: string; href: string };

const results: Record<string, Result> = {
  "Advertising return": {
    stat: "9.4x",
    label: "DSP ROAS",
    body: "A national beauty brand’s DSP returned 9.4x with search ROAS held, run as one program across Amazon Ads, DSP and Marketing Cloud.",
    href: "/work/amazon-dsp",
  },
  "New-to-brand growth": {
    stat: "+204%",
    label: "three-year growth",
    body: "A luxury swimwear brand grew 204% over three years on Amazon with creative and media briefed from the same conversion data.",
    href: "/work",
  },
  "Recovered revenue": {
    stat: "$14.0M",
    label: "annual revenue",
    body: "Shortage, price-claim and chargeback audits recovered $14.0M in annual revenue for a vendor account, with PO fill rate up to 92%.",
    href: "/capabilities/revenue-recovery",
  },
  "Operational control": {
    stat: "147",
    label: "listings restored",
    body: "A collapsed $6.2M Amazon business restored — catalog, inventory and account health run by the team that plans the advertising.",
    href: "/capabilities/marketplace-operations",
  },
};

export function ResultFinder() {
  const [channel, setChannel] = useState(channels[0]);
  const [goal, setGoal] = useState(goals[0]);
  const result = results[goal];

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div>
        <h2 className="h-display text-3xl text-ink md:text-4xl">
          Find the result closest to your business.
        </h2>
        <p className="mt-4 max-w-md text-[1.0625rem] text-muted">
          Choose where you sell and what you want to grow. We’ll show the
          published case study nearest to it.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Where you sell">
            <Select value={channel} onChange={setChannel} options={channels} />
          </Field>
          <Field label="What you want to grow">
            <Select value={goal} onChange={setGoal} options={goals} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
        <div className="eyebrow">Closest result</div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="h-display text-5xl text-brand-600">{result.stat}</span>
          <span className="text-sm font-medium text-muted">{result.label}</span>
        </div>
        <p className="mt-4 text-[0.975rem] leading-relaxed text-slate-600">
          {result.body}
        </p>
        <div className="mt-6">
          <Button href={result.href}>See how we did it</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
