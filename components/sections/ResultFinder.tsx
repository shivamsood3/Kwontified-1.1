"use client";

import { useState } from "react";
import { Button } from "@/components/site/Button";
import { SegmentedControl } from "@/components/ui/Field";
import { Stat } from "@/components/ui/Stat";

const channels = [
  "Amazon Seller Central",
  "Amazon Vendor Central",
  "Walmart",
  "Target Plus",
  "International",
];
const revenues = ["Under $5M", "$5M to $25M", "Over $25M"];

type Result = { stat: string; label: string; body: string; href: string };

const results: Record<string, Result> = {
  "Amazon Seller Central": {
    stat: "9.4x",
    label: "DSP ROAS, Amazon",
    body: "A national beauty brand’s $192K of Amazon DSP returned $1.8M at 9.4x ROAS, with new-to-brand sales up 28% and search ROAS held.",
    href: "/work/amazon-dsp",
  },
  "Amazon Vendor Central": {
    stat: "$14.0M",
    label: "Annual revenue, Vendor Central",
    body: "Annual revenue for a Vendor Central business that was flat at $10.5M before we fixed chargebacks, fill rates and shortage claims.",
    href: "/work/vendor-central-recovery",
  },
  Walmart: {
    stat: "+19%",
    label: "Walmart revenue",
    body: "Combined Walmart revenue for a consumer health brand through a major SKU transition, with supplier ROAS up from 3.0x to 4.2x.",
    href: "/work/walmart-sku-transition",
  },
  "Target Plus": {
    stat: "+34%",
    label: "revenue, Target Plus",
    body: "Revenue growth through operational excellence for an apparel brand run to Target’s standards, with Roundel advertising on margin.",
    href: "/work",
  },
  International: {
    stat: "$1.4M",
    label: "International revenue",
    body: "International revenue across the UK, EU and Canada for a premium fashion brand that had sold only in the US.",
    href: "/work/international-expansion",
  },
};

export function ResultFinder() {
  const [channel, setChannel] = useState(channels[1]);
  const [revenue, setRevenue] = useState(revenues[1]);
  const result = results[channel];

  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      <div>
        <h2 className="h-display text-h2 text-ink">
          Find the result closest to your business.
        </h2>
        <p className="mt-4 max-w-md text-body text-muted">
          Choose where you sell most and your annual marketplace revenue. We show
          the published case study nearest to you, and the review request carries
          your answers.
        </p>

        <div className="mt-6 space-y-5">
          <SegmentedControl
            name="rf-channel"
            legend="Where you sell most"
            value={channel}
            onChange={setChannel}
            options={channels}
          />
          <SegmentedControl
            name="rf-revenue"
            legend="Annual marketplace revenue"
            value={revenue}
            onChange={setRevenue}
            options={revenues}
          />
        </div>
      </div>

      <div className="border border-line bg-white p-8" aria-live="polite">
        <p className="eyebrow">Closest result · {channel}</p>
        <div className="mt-3">
          <Stat value={result.stat} label={result.label} tone="light" size="lg" />
        </div>
        <p className="mt-4 text-small leading-relaxed text-ink-700">{result.body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/contact">Request a review for this business</Button>
          <Button href={result.href} variant="outline">
            Read the case study
          </Button>
        </div>
      </div>
    </div>
  );
}
