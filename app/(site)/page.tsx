import Link from "next/link";
import Image from "next/image";
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
import { IconTile } from "@/components/ui/IconTile";
import { BeforeAfterBars } from "@/components/ui/BeforeAfterBars";
import { LiftStudyChart } from "@/components/ui/LiftStudyChart";
import { clientLogos, pressLogos } from "@/lib/logos";
import { budgetChannelIcons, oneTeamMeansIcons, ui } from "@/lib/icons";
import { homepageResults } from "@/lib/data/metrics";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// TODO(content): publish the testimonial with a real name/title/company once the
// client approves attribution. Until then it shows unattributed (fix 3).
const SHOW_TESTIMONIAL = true;

// Results cards come from a single source derived from the case studies. (fix 1)
const stats = homepageResults;

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

const creative: {
  caption: string;
  metric: string;
  img: string;
  ratio: "3/2" | "4/5" | "4/3";
  span: string;
  objectPosition?: string;
}[] = [
  { caption: "National beauty brand, Amazon DSP.", metric: "+28% NTB", img: "/creative/beauty.jpg", ratio: "3/2", span: "lg:col-span-7" },
  { caption: "Global accessories, Amazon and Target Plus, on 17% less spend.", metric: "11.1x ROAS", img: "/creative/accessories.jpg", ratio: "4/5", span: "lg:col-span-5" },
  { caption: "Luxury swimwear, Amazon US, EU and UK, without discounting.", metric: "+204%", img: "/creative/swimwear.jpg", ratio: "4/3", span: "lg:col-span-4", objectPosition: "center 22%" },
  { caption: "Men’s outdoor apparel, Amazon launch, first nine months.", metric: "$4.5M", img: "/creative/outdoor.jpg", ratio: "4/3", span: "lg:col-span-4" },
  { caption: "Premium skincare, Amazon US, on the same ad budget.", metric: "12.1% CVR", img: "/creative/skincare.jpg", ratio: "4/3", span: "lg:col-span-4" },
];

// Only the DSP guide has a confirmed byline; the rest ship without an author or
// read time until confirmed (fix 4). Non-DSP links resolve to real posts (fix 5).
const perspectives: {
  topic: string;
  channel: string;
  author?: string;
  title: string;
  body: string;
  href: string;
  img?: string;
  featured?: boolean;
}[] = [
  { topic: "Retail media", channel: "Amazon", author: "Priyanka Shah", title: "Is your Amazon DSP spend incremental?", body: "Attributed ROAS shows what DSP touched. Lift studies and AMC path analysis show what it caused — the test design we use before scaling a DSP budget.", href: "/perspectives/amazon-dsp-incrementality", img: "/creative/skincare.jpg", featured: true },
  { topic: "AI commerce", channel: "Amazon", title: "What Rufus reads on a listing, and what it ignores", body: "How shopping assistants parse your detail page.", href: "/perspectives/rufus-listing-signals" },
  { topic: "Creative", channel: "Amazon", title: "What moved conversion from 8.2% to 12.1%", body: "The image tests and A+ modules behind a skincare lift.", href: "/perspectives/conversion-8-to-12" },
  { topic: "Operations", channel: "Vendor Central", title: "The five Vendor Central chargeback causes that cost the most", body: "Where 1P deductions come from, and how to stop them.", href: "/perspectives/vendor-central-chargebacks" },
];

export default function HomePage() {
  const [featured, ...rest] = perspectives;
  return (
    <>
      {/* Hero carousel */}
      <HeroCarousel />

      {/* Results across channels and markets (§7.4) */}
      <section className="bg-ink text-white">
        <div className="container-kw border-t border-white/10 py-20 lg:py-[120px]">
          <SectionHeading
            tone="dark"
            eyebrow="Results"
            title="Results across channels and markets."
            intro="Every figure comes from an account we run and has a published case study behind it."
            link={{ href: "/work", label: "See all case studies" }}
          />
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:divide-x md:divide-white/12">
            {stats.map((s) => (
              <div key={s.slug} className="md:px-8 md:first:pl-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <Stat value={s.value} label="" tone="dark" size="lg" className="[&>div:nth-child(2)]:hidden" />
                  <Chip tone="dark">{s.chip}</Chip>
                </div>
                <div className="mt-6">
                  {s.beforeAfter ? (
                    <BeforeAfterBars
                      before={s.beforeAfter.before}
                      after={s.beforeAfter.after}
                      tone="dark"
                    />
                  ) : (
                    s.stats && (
                      <div className="flex flex-wrap gap-x-10 gap-y-4">
                        {s.stats.map((st) => (
                          <Stat key={st.label} value={st.value} label={st.label} tone="dark" />
                        ))}
                      </div>
                    )
                  )}
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
        <div className="container-kw grid gap-12 py-20 lg:py-[120px] lg:grid-cols-[0.8fr_1.2fr]">
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
        <div className="container-kw grid gap-12 py-20 lg:py-[120px] md:grid-cols-[0.85fr_1.15fr] md:items-start">
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
          {/* First ten channels in two columns; the 11th spans both as a
              highlighted row so it never sits alone (fix 16). */}
          <div className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
            {budgetChannels.slice(0, 10).map((c) => (
              <ListRow key={c.label} href={c.href} title={c.label} sub={c.sub} icon={budgetChannelIcons[c.label]} />
            ))}
          </div>
          {budgetChannels.slice(10).map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group flex items-center gap-4 border-t border-brand-600 bg-brand-50 px-3 py-4 transition-colors hover:bg-brand-100"
            >
              <IconTile icon={budgetChannelIcons[c.label]} />
              <span className="min-w-0 flex-1">
                <span className="block text-h3 font-medium text-ink decoration-[0.07em] underline-offset-4 group-hover:underline">
                  {c.label}
                </span>
                <span className="mt-0.5 block text-small text-muted">{c.sub}</span>
              </span>
              <ui.ArrowRight size={20} weight="light" className="shrink-0 text-ink-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* Creative that sells (§7.7) */}
      <section className="bg-paper">
        <div className="container-kw py-20 lg:py-[120px]">
          <SectionHeading
            eyebrow="Creative Studio"
            title="Creative that sells, still on brand."
            intro="Photography, video, A+ Content and Storefronts built from the conversion data — then measured on what they do to the numbers."
            link={{ href: "/work/creative", label: "See the Creative Studio" }}
          />
          {/* Row 1 — two tiles share one fixed height, object-cover (fix 8) */}
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
            {creative.slice(0, 2).map((c) => (
              <figure key={c.caption} className={c.span}>
                <div className="relative h-64 overflow-hidden sm:h-80 lg:h-[400px]">
                  <Image
                    src={c.img}
                    alt={c.caption}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    style={c.objectPosition ? { objectPosition: c.objectPosition } : undefined}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <figcaption className="mt-3 flex items-center gap-2 text-small text-muted">
                  <Chip tone="brand" className="whitespace-nowrap">{c.metric}</Chip>
                  <span>{c.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {/* Row 2 — three equal tiles, same ratio */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {creative.slice(2).map((c) => (
              <figure key={c.caption}>
                <div className="overflow-hidden">
                  <Figure ratio={c.ratio} src={c.img} alt={c.caption} rounded="" objectPosition={c.objectPosition} className="transition-transform duration-500 hover:scale-[1.03]" />
                </div>
                <figcaption className="mt-3 flex items-center gap-2 text-small text-muted">
                  <Chip tone="brand" className="whitespace-nowrap">{c.metric}</Chip>
                  <span>{c.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* What we're seeing in the market — Perspectives (§7.8, white editorial) */}
      <section className="bg-white">
        <div className="container-kw py-20 lg:py-[120px]">
          <SectionHeading
            eyebrow="Perspectives"
            title="What we’re seeing in the market."
            link={{ href: "/perspectives", label: "All Perspectives" }}
          />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <Card
              href={featured.href}
              visual={<LiftStudyChart />}
              chips={[featured.topic, featured.channel]}
              meta={featured.author}
              title={featured.title}
              excerpt={featured.body}
            />
            <div className="divide-y divide-line border-t border-line">
              {rest.map((p) => (
                <Link key={p.title} href={p.href} className="group block py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip>{p.topic}</Chip>
                    {p.author && (
                      <span className="text-[13px] text-muted">{p.author}</span>
                    )}
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

      {/* What clients say (§7.9) — shown without attribution until the client
          supplies a name to publish (fix 3). Flip SHOW_TESTIMONIAL to hide. */}
      {SHOW_TESTIMONIAL && (
        <section className="bg-white">
          <div className="container-kw py-20 lg:py-[120px]">
            <h2 className="sr-only">What clients say</h2>
            <Quote>
              “We finally have one team that owns the plan, the ads and the operations,
              and reports all of it against our margin.”
            </Quote>
          </div>
        </section>
      )}

      {/* Result finder (§7.10) */}
      <section className="bg-paper">
        <div className="container-kw py-20 lg:py-[120px]">
          <ResultFinder />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
