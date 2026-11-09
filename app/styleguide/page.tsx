"use client";

import { useState } from "react";
import { Button } from "@/components/site/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Stat } from "@/components/ui/Stat";
import { Chip } from "@/components/ui/Chip";
import { Callout } from "@/components/ui/Callout";
import { Quote } from "@/components/ui/Quote";
import { ListRow } from "@/components/ui/ListRow";
import { Card } from "@/components/ui/Card";
import { BeforeAfterBars } from "@/components/ui/BeforeAfterBars";
import { SegmentedControl, Input, Select, Textarea, Label } from "@/components/ui/Field";
import { Breadcrumbs } from "@/components/ui/Nav";
import { LogoMarquee, LogoGrid } from "@/components/ui/LogoMarquee";
import { capabilityIcons, ui } from "@/lib/icons";
import { clientLogos, pressLogos } from "@/lib/logos";

function Block({ title, dark, children }: { title: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <section className={dark ? "bg-ink text-white" : "bg-white"}>
      <div className="container-kw border-t border-line py-12">
        <h2 className="mb-6 text-caption text-muted">{title}</h2>
        <div className="flex flex-wrap items-start gap-6">{children}</div>
      </div>
    </section>
  );
}

export default function Styleguide() {
  const [seg, setSeg] = useState("Amazon Vendor Central");
  return (
    <main className="pb-24">
      <div className="container-kw py-12">
        <p className="eyebrow">Internal · noindex</p>
        <h1 className="h-display mt-2 text-h1 text-ink">Kwontified component styleguide</h1>
        <p className="mt-3 max-w-prose text-muted">
          Every §4 component in its states, on light and dark surfaces.
        </p>
      </div>

      <Block title="Buttons">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary-light">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="text-link">Text link</Button>
        <Button variant="primary" arrow>With arrow</Button>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="lg">Large</Button>
      </Block>

      <Block title="Buttons on dark" dark>
        <Button variant="secondary-light">Secondary light</Button>
        <Button variant="outline-light">Outline light</Button>
        <Button variant="primary" arrow>Primary</Button>
      </Block>

      <Block title="IconTile">
        <IconTile icon={capabilityIcons["retail-media"]} />
        <IconTile icon={capabilityIcons["creative-studio"]} size="lg" />
        <IconTile icon={capabilityIcons["analytics"]} tone="dark" />
      </Block>

      <Block title="Stat + Chip + Callout">
        <Stat value="9.4x" label="DSP ROAS" sub="search ROAS held" tone="light" size="lg" />
        <div className="flex gap-2">
          <Chip>Amazon</Chip>
          <Chip tone="brand">+28% NTB</Chip>
        </div>
        <Callout label="How it connects.">
          Budgets ease off before a product stocks out.
        </Callout>
      </Block>

      <Block title="ListRow">
        <div className="w-full max-w-2xl">
          <ListRow href="#" icon={capabilityIcons["retail-media"]} title="Retail Media and Advertising" sub="Amazon Ads, DSP and Marketing Cloud" />
          <ListRow href="#" icon={capabilityIcons["creative-studio"]} title="Creative Studio" sub="Photography, video, A+ Content" />
        </div>
      </Block>

      <Block title="Editorial Card">
        <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
          <Card href="#" ratio="3/2" chips={["Retail media", "Amazon"]} meta="Priyanka Shah" title="Is your Amazon DSP spend incremental?" excerpt="Attributed ROAS shows what DSP touched; lift studies show what it caused." />
          <Card href="#" ratio="3/2" chips={["Creative"]} title="What moved conversion from 8.2% to 12.1%" excerpt="The image tests and A+ modules behind a skincare lift." />
        </div>
      </Block>

      <Block title="BeforeAfterBars" dark>
        <BeforeAfterBars before={{ label: "Before", value: "$2.83M", height: 72 }} after={{ label: "After", value: "$3.38M", height: 100 }} />
      </Block>

      <Block title="Form controls + Segmented control">
        <div className="w-full max-w-md space-y-4">
          <div><Label htmlFor="sg-e">Work email</Label><Input id="sg-e" placeholder="name@brand.com" /></div>
          <div><Label htmlFor="sg-s">Where you sell</Label><Select id="sg-s"><option>Amazon</option><option>Walmart</option></Select></div>
          <Textarea rows={3} placeholder="Message" />
          <SegmentedControl name="sg" legend="Where you sell most" value={seg} onChange={setSeg} options={["Amazon Seller Central", "Amazon Vendor Central", "Walmart"]} />
        </div>
      </Block>

      <Block title="Quote">
        <Quote name="VP of Ecommerce" company="skincare brand" align="left">
          “We finally have one team that owns the plan, the ads and the operations.”
        </Quote>
      </Block>

      <Block title="Breadcrumbs + UI icons">
        <Breadcrumbs tone="light" items={[{ label: "Home", href: "/" }, { label: "Capabilities", href: "/capabilities" }, { label: "Retail Media" }]} />
        <div className="flex gap-4 text-ink-700">
          <ui.ArrowRight size={24} /><ui.Search size={24} /><ui.Phone size={24} /><ui.MapPin size={24} /><ui.Clock size={24} />
        </div>
      </Block>

      <Block title="Logo marquee (clients) + press grid">
        <div className="w-full space-y-10">
          <LogoMarquee logos={clientLogos} rows={2} label="Selected clients" />
          <LogoGrid logos={pressLogos} height={24} />
        </div>
      </Block>
    </main>
  );
}
