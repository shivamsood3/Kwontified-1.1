import Link from "next/link";
import type { Metadata } from "next";
import { CtaBand } from "@/components/site/CtaBand";
import { Figure } from "@/components/ui/Figure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResultFinder } from "@/components/sections/ResultFinder";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { OneTeamRows } from "@/components/sections/OneTeamRows";
import { LogoMarquee, LogoGrid } from "@/components/ui/LogoMarquee";
import { Chip } from "@/components/ui/Chip";
import { Stat } from "@/components/ui/Stat";
import { Quote } from "@/components/ui/Quote";
import { Card } from "@/components/ui/Card";
import { ListRow } from "@/components/ui/ListRow";
import { BeforeAfterBars } from "@/components/ui/BeforeAfterBars";
import { clientLogos, pressLogos } from "@/lib/logos";
import { budgetChannelIcons, oneTeamMeansIcons, ui } from "@/lib/icons";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const stats = [
  {
    value: "+19%",
    chip: "Walmart",
    body: "Combined Walmart revenue for a consumer health brand through a major SKU transition, with supplier ROAS up from 3.0x to 4.2x.",
    before: { label: "Before", value: "$4.1M", height: 72 },
    after: { label: "After", value: "$4.9M", height: 100 },
    href: "/work/walmart-sku-transition",
    link: "Read the Walmart case study",
  },
  {
    value: "$1.4M",
    chip: "UK · EU · CA",
    body: "International revenue across the UK, EU and Canada for a premium fashion brand that had sold only in the US.",
    before: { label: "Before", value: "$0", height: 4 },
    after: { label: "After", value: "$1.4M", height: 100 },
    href: "/work/international-expansion",
    link: "Read the international case study",
  },
  {
    value: "$6.2M",
    chip: "Amazon",
    body: "A leading CPG brand’s collapsed $6.2M Amazon business, restored, with annualized revenue up 68%.",
    before: { label: "Before", value: "$2.83M", height: 60 },
    after: { label: "After", value: "$3.38M", height: 100 },
    href: "/work/account-health-restore",
    link: "Read the account health case study",
  },
];

const oneTeam = [
  { k: "Measured", cap: "Retail media", href: "/capabilities/retail-media", desc: "Sponsored ads, DSP, Walmart Connect and Roundel, managed on incremental return and new-to-brand growth, with TACoS held to the plan.", connect: "Budgets ease off before a product stocks out, so ads never send shoppers to an empty listing." },
  { k: "Made", cap: "Creative Studio", href: "/capabilities/creative-studio", desc: "Product photography, image editing, AI image and video, A+ Content and Storefronts, finished to your brand’s own standard.", connect: "Briefs start from the search terms and conversion data the advertising team reads every day." },
  { k: "Run", cap: "Marketplace operations", href: "/capabilities/marketplace-operations", desc: "Catalog, inventory, 1P and 3P operations, promotions and account health, in every market you sell in.", connect: "Promotions are planned with the stock to support them and the advertising to drive them." },
  { k: "Found", cap: "AI commerce", href: "/capabilities/ai-commerce", desc: "Complete, structured product data, so Amazon Rufus, ChatGPT, Google Gemini and Claude can recommend your products accurately.", connect: "Built on the catalog the operations team already maintains, so nothing is written twice." },
  { k: "Reported", cap: "Analytics", href: "/capabilities/analytics", desc: "Dashboards and sales, budget and inventory forecasts in conservative, standard and reach scenarios: one version of the numbers for brand managers and the board.", connect: "Advertising, stock and promotions all plan to the same forecast." },
  { k: "Recovered", cap: "Revenue recovery", href: "/capabilities/revenue-recovery", desc: "Vendor Central shortages, chargebacks and accruals, and Seller Central FBA reimbursements, audited, filed and followed inside Amazon’s claim windows.", connect: "The operations team fixes the causes, so the same losses stop coming back." },
];

const oneTeamBullets = [
  "One named team and one inbox for every channel you sell in.",
  "One plan, with sales, margin, advertising and inventory targets you approve.",
  "A weekly update, plus monthly and quarterly business reviews against that plan.",
  "Senior leaders who stay involved long after onboarding.",
];

const budgetChannels = [
  { label: "Amazon Seller Central", sub: "Advertising, content and FBA for 3P sellers", href: "/channels/amazon" },
  { label: "Amazon Vendor Central", sub: "1P margin, fill rates and shortage recovery", href: "/channels/amazon" },
  { label: "Walmart", sub: "Marketplace sellers and suppliers, with Walmart Connect", href: "/channels/walmart" },
  { label: "Target Plus", sub: "Run to Target’s standards, with Roundel", href: "/channels/target-plus" },
  { label: "International", sub: "Canada, Mexico, the UK and the EU", href: "/channels/international" },
  { label: "Zalando", sub: "Fashion across Europe’s markets and seasons", href: "/channels/zalando" },
  { label: "Mercado Libre", sub: "Latin America, set up country by country", href: "/channels/mercado-libre" },
  { label: "Temu", sub: "On your brand’s terms, with price floors", href: "/channels/temu" },
  { label: "TikTok Shop", sub: "Creators, shoppable video and GMV Max", href: "/channels/tiktok-shop" },
  { label: "Instagram Shop", sub: "Shoppable content and Meta advertising", href: "/channels/instagram-shop" },
  { label: "AI shopping assistants", sub: "Rufus, ChatGPT, Gemini and Claude", href: "/capabilities/ai-commerce" },
];

const creative = [
  { caption: "National beauty brand, Amazon DSP.", metric: "+28% NTB", img: "/creative/beauty.jpg", ratio: "3/2" as const, span: "lg:col-span-7" },
  { caption: "Global accessories, Amazon and Target Plus, on 17% less spend.", metric: "11.1x ROAS", img: "/creative/accessories.jpg", ratio: "4/5" as const, span: "lg:col-span-5" },
  { caption: "Luxury swimwear, Amazon US, EU and UK, without discounting.", metric: "+204%", img: "/creative/swimwear.jpg", ratio: "4/3" as const, span: "lg:col-span-4" },
  { caption: "Men’s outdoor apparel, Amazon launch, first nine months.", metric: "$4.5M", img: "/creative/outdoor.jpg", ratio: "4/3" as const, span: "lg:col-span-4" },
  { caption: "Premium skincare, Amazon US, on the same ad budget.", metric: "12.1% CVR", img: "/creative/skincare.jpg", ratio: "4/3" as const, span: "lg:col-span-4" },
];

const perspectives = [
  { topic: "Retail media", channel: "Amazon", author: "Priyanka Shah", read: "6 min", title: "Is your Amazon DSP spend incremental?", body: "Attributed ROAS shows what DSP touched. Lift studies and AMC path analysis show what it caused — the test design we use before scaling a DSP budget.", href: "/perspectives/amazon-dsp-incrementality", img: "/creative/skincare.jpg", featured: true },
  { topic: "AI commerce", channel: "Amazon", author: "Jordan Taylor", read: "5 min", title: "What Rufus reads on a listing, and what it ignores", body: "How shopping assistants parse your detail page.", href: "/perspectives" },
  { topic: "Creative", channel: "Amazon", author: "Priyanka Shah", read: "4 min", title: "What moved conversion from 8.2% to 12.1%", body: "The image tests and A+ modules behind a skincare lift.", href: "/perspectives" },
  { topic: "Operations", channel: "Vendor Central", author: "Jordan Taylor", read: "7 min", title: "The five Vendor Central chargeback causes that cost the most", body: "Where 1P deductions come from, and how to stop them.", href: "/perspectives" },
];

export default function HomePage() {
  const [featured, ...rest] = perspectives;
  return (
    <>
      {/* Hero carousel */}
      <HeroCarousel />

      {/* Results across channels and markets (§7.4) */}
      <section className="bg-ink text-white">
        <div className="container-kw border-t border-white/10 py-20">
          <SectionHeading
            tone="dark"
            eyebrow="Results"
            title="Results across channels and markets."
            intro="Every figure comes from an account we run and has a published case study behind it."
            link={{ href: "/work", label: "See all case studies" }}
          />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:divide-x md:divide-white/12">
            {stats.map((s) => (
              <div key={s.value} className="md:px-8 md:first:pl-0">
                <div className="flex items-baseline gap-3">
                  <Stat value={s.value} label="" tone="dark" size="lg" className="[&>div:nth-child(2)]:hidden" />
                  <Chip tone="dark">{s.chip}</Chip>
                </div>
                <div className="mt-6">
                  <BeforeAfterBars before={s.before} after={s.after} tone="dark" />
                </div>
                <p className="mt-6 text-small leading-relaxed text-white/60">{s.body}</p>
                <Link
                  href={s.href}
                  className="mt-4 inline-flex items-center gap-1 text-small text-brand-300 transition hover:text-white"
                >
                  {s.link}
                  <ui.ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected clients (§7.3) */}
      <section className="border-y border-line bg-white">
        <div className="container-kw py-16">
          <LogoMarquee logos={clientLogos} rows={2} label="Selected clients" />
        </div>
      </section>

      {/* One team owns the plan and the work (§7.5) */}
      <section className="bg-paper">
        <div className="container-kw grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="One team"
              title="One team owns the plan and the work."
              intro="Most brands split advertising, creative and operations across separate agencies, then lose margin where those plans disagree: ads that drive shoppers to products about to stock out, creative briefed without the search data, promotions with no stock behind them. We run all of it as one plan, reviewed against one P&L."
            />
            <div className="mt-8">
              <h3 className="text-caption text-muted">What one team means for you</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {oneTeamBullets.map((b, i) => {
                  const Icon = oneTeamMeansIcons[i];
                  return (
                    <li key={b} className="flex items-center gap-3 py-3 text-small text-ink-700">
                      <Icon size={22} weight="light" className="shrink-0 text-brand-600" />
                      <span>{b}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <OneTeamRows rows={oneTeam} />
        </div>
      </section>

      {/* Budget goes where it earns most (§7.6) */}
      <section className="bg-white">
        <div className="container-kw grid gap-12 py-20 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div className="md:sticky md:top-28">
            <SectionHeading
              eyebrow="Where we operate"
              title="Budget goes where it earns most."
              intro="We manage every marketplace as one business. Spend moves between channels on measured return, catalog work is done once and adapted, and reporting shows the whole P&L in one view."
            />
            <div className="mt-8 border-l-2 border-brand-600 bg-brand-50 p-6">
              <Stat value="5.0x to 6.8x" label="Blended Amazon ROAS" tone="light" />
              <p className="mt-3 text-small leading-relaxed text-ink-700">
                For a natural oral care brand after we consolidated reporting across
                Amazon and Walmart, with Amazon ad spend down 29%.
              </p>
              <Link href="/capabilities/analytics" className="link-underline mt-3 text-small">
                How we report across channels
              </Link>
            </div>
          </div>
          <div className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
            {budgetChannels.map((c) => (
              <ListRow key={c.label} href={c.href} title={c.label} sub={c.sub} icon={budgetChannelIcons[c.label]} />
            ))}
          </div>
        </div>
      </section>

      {/* Creative that sells (§7.7) */}
      <section className="bg-paper">
        <div className="container-kw py-20">
          <SectionHeading
            eyebrow="Creative Studio"
            title="Creative that sells, still on brand."
            intro="Photography, video, A+ Content and Storefronts built from the conversion data — then measured on what they do to the numbers."
            link={{ href: "/work/creative", label: "See the Creative Studio" }}
          />
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {creative.map((c) => (
              <figure key={c.caption} className={c.span}>
                <div className="overflow-hidden">
                  <Figure ratio={c.ratio} src={c.img} alt={c.caption} rounded="" className="transition-transform duration-500 hover:scale-[1.03]" />
                </div>
                <figcaption className="mt-3 flex items-center gap-2 text-small text-muted">
                  <Chip tone="brand">{c.metric}</Chip>
                  <span>{c.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* What we're seeing in the market — Perspectives (§7.8, white editorial) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <SectionHeading
            eyebrow="Perspectives"
            title="What we’re seeing in the market."
            link={{ href: "/perspectives", label: "All Perspectives" }}
          />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <Card
              href={featured.href}
              img={featured.img}
              ratio="16/9"
              chips={[featured.topic, featured.channel]}
              meta={`${featured.author} · ${featured.read}`}
              title={featured.title}
              excerpt={featured.body}
            />
            <div className="divide-y divide-line border-t border-line">
              {rest.map((p) => (
                <Link key={p.title} href={p.href} className="group block py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip>{p.topic}</Chip>
                    <span className="text-[13px] text-muted">
                      {p.author} · {p.read}
                    </span>
                  </div>
                  <h3 className="h-display mt-2 text-h3 text-ink group-hover:text-brand-700">
                    {p.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured in (§7.9) */}
      <section className="border-y border-line bg-paper">
        <div className="container-kw py-14">
          <p className="text-center text-caption text-muted">Featured in</p>
          <LogoGrid logos={pressLogos} height={26} className="mt-8" />
        </div>
      </section>

      {/* What clients say (§7.9) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <h2 className="sr-only">What clients say</h2>
          <Quote name="[Name]" title="VP of Ecommerce" company="[Skincare brand]">
            “We finally have one team that owns the plan, the ads and the operations,
            and reports all of it against our margin.”
          </Quote>
        </div>
      </section>

      {/* Result finder (§7.10) */}
      <section className="bg-paper">
        <div className="container-kw py-20">
          <ResultFinder />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
