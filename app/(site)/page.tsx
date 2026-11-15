import Link from "next/link";
import type { Metadata } from "next";
import { ImageHero } from "@/components/blocks/ImageHero";
import { ImageStrip } from "@/components/blocks/ImageStrip";
import { FeatureSplit } from "@/components/blocks/FeatureSplit";
import { ImageCard } from "@/components/blocks/ImageCard";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { StatRow } from "@/components/blocks/StatRow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LogoGrid } from "@/components/ui/LogoMarquee";
import { Chip } from "@/components/ui/Chip";
import { Quote } from "@/components/ui/Quote";
import { IconTile } from "@/components/ui/IconTile";
import { BeforeAfterBars } from "@/components/ui/BeforeAfterBars";
import { Img } from "@/components/ui/Img";
import { MarketplaceLogo } from "@/components/ui/MarketplaceLogo";
import { clientLogos, pressLogos } from "@/lib/logos";
import { capabilityIcons, channelIcons, ui } from "@/lib/icons";
import { homepageResults } from "@/lib/data/metrics";
import { marketplaceLogos } from "@/lib/content/marketplaceLogos";

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Results cards come from a single source derived from the case studies (fix 1).
const results = homepageResults;
// Image above each results column (§5.2-5).
const resultImage: Record<string, string> = {
  "walmart-sku-transition": "case-walmart",
  "international-expansion": "case-international",
  "account-health-restore": "case-account-health",
};

const pillars = [
  { cap: "Retail media", slug: "retail-media", desc: "Sponsored ads, DSP, Walmart Connect and Roundel, managed on incremental return and new-to-brand growth, with TACoS held to the plan.", connect: "Budgets ease off before a product stocks out, so ads never send shoppers to an empty listing." },
  { cap: "Creative Studio", slug: "creative-studio", desc: "Photography, image editing, AI image and video, A+ Content and Storefronts, finished to your brand’s own standard.", connect: "Briefs start from the search terms and conversion data the advertising team reads every day." },
  { cap: "Marketplace operations", slug: "marketplace-operations", desc: "Catalog, inventory, 1P and 3P operations, promotions and account health, in every market you sell in.", connect: "Promotions are planned with the stock to support them and the advertising to drive them." },
  { cap: "AI commerce", slug: "ai-commerce", desc: "Complete, structured product data, so Rufus, ChatGPT, Gemini and Claude can recommend your products accurately.", connect: "Built on the catalog the operations team already maintains, so nothing is written twice." },
  { cap: "Analytics", slug: "analytics", desc: "Dashboards and sales, budget and inventory forecasts in conservative, standard and reach scenarios: one version of the numbers.", connect: "Advertising, stock and promotions all plan to the same forecast." },
  { cap: "Revenue recovery", slug: "revenue-recovery", desc: "Vendor Central shortages and chargebacks, and Seller Central FBA reimbursements, audited, filed and followed inside Amazon’s claim windows.", connect: "The operations team fixes the causes, so the same losses stop coming back." },
];

const channelTiles: { label: string; href: string; slug?: string; icon?: boolean; ai?: boolean; sub?: string }[] = [
  { label: "Amazon", href: "/channels/amazon", slug: "amazon" },
  { label: "Walmart", href: "/channels/walmart", slug: "walmart" },
  { label: "Target Plus", href: "/channels/target-plus", slug: "target-plus" },
  { label: "International", href: "/channels/international", icon: true },
  { label: "Zalando", href: "/channels/zalando", slug: "zalando" },
  { label: "Mercado Libre", href: "/channels/mercado-libre", slug: "mercado-libre" },
  { label: "Temu", href: "/channels/temu", slug: "temu" },
  { label: "TikTok Shop", href: "/channels/tiktok-shop", slug: "tiktok-shop" },
  { label: "Instagram Shop", href: "/channels/instagram-shop", slug: "instagram-shop" },
  { label: "AI shopping assistants", href: "/capabilities/ai-commerce", ai: true, sub: "Rufus, ChatGPT, Gemini and Claude" },
];

const creative: { caption: string; metric: string; id: string }[] = [
  { caption: "National beauty brand, Amazon DSP.", metric: "+28% NTB", id: "creative-beauty" },
  { caption: "Global accessories, Amazon and Target Plus, on 17% less spend.", metric: "11.1x ROAS", id: "creative-accessories" },
  { caption: "Luxury swimwear, Amazon US, EU and UK, without discounting.", metric: "+204%", id: "creative-swimwear" },
  { caption: "Men’s outdoor apparel, Amazon launch, first nine months.", metric: "$4.5M", id: "creative-outdoor" },
  { caption: "Premium skincare, Amazon US, on the same ad budget.", metric: "12.1% CVR", id: "creative-skincare" },
];

// Case-study cards under the featured split (§5.2-9).
const caseCards = [
  { href: "/work/walmart-sku-transition", id: "case-walmart", chip: "Walmart", title: "A clean SKU transition, revenue intact.", excerpt: "Combined Walmart revenue up 19% through a major SKU transition, supplier ROAS from 3.0x to 4.2x." },
  { href: "/work/international-expansion", id: "case-international", chip: "UK · EU · CA", title: "$1.4M international, from a US-only start.", excerpt: "One localized catalog live across three regions for a premium fashion brand." },
  { href: "/work/account-health-restore", id: "case-account-health", chip: "Amazon", title: "A collapsed $6.2M business, restored.", excerpt: "147 listings restored and annualized revenue up 68% for a leading CPG brand." },
];

// Featured post + three cards (§5.2-10). Only the DSP guide has a confirmed
// byline; the rest ship without an author until confirmed (fix 4).
const featuredPost = {
  topic: "Retail media",
  channel: "Amazon",
  author: "Priyanka Shah",
  title: "Is your Amazon DSP spend incremental?",
  body: "Attributed ROAS shows what DSP touched. Lift studies and AMC path analysis show what it caused — the test design we use before scaling a DSP budget.",
  href: "/perspectives/amazon-dsp-incrementality",
};
const postCards = [
  { href: "/perspectives/rufus-listing-signals", id: "post-rufus", chip: "AI commerce", title: "What Rufus reads on a listing, and what it ignores", excerpt: "How shopping assistants parse your detail page." },
  { href: "/perspectives/conversion-8-to-12", id: "post-conversion", chip: "Creative", title: "What moved conversion from 8.2% to 12.1%", excerpt: "The image tests and A+ modules behind a skincare lift." },
  { href: "/perspectives/vendor-central-chargebacks", id: "post-chargebacks", chip: "Operations", title: "The five Vendor Central chargeback causes that cost the most", excerpt: "Where 1P deductions come from, and how to stop them." },
];

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero diptych */}
      <ImageHero
        eyebrow="Measured growth · Beautiful work"
        title="One team for every marketplace you sell in."
        intro="Advertising, creative, operations and analytics, run as one plan across Amazon, Walmart, Target Plus and global marketplaces — reviewed against the margin you approve."
        leftId="home-hero-a"
        rightId="home-hero-b"
        primary={{ href: "/contact", label: "Request a marketplace review" }}
        secondary={{ href: "/work", label: "See the work" }}
      />

      {/* 2 — Statement + stats */}
      <section className="bg-cream-50">
        <div className="container-kw py-20 lg:py-28">
          <p className="mx-auto max-w-[1100px] text-center text-[clamp(26px,3.4vw,44px)] font-medium leading-[1.2] tracking-tightish">
            <span className="text-ink">We run marketplaces as one business.</span>{" "}
            <span className="text-ink-muted">
              Advertising, creative, operations and analytics sit on one team that reads
              the numbers and makes the work that moves them.
            </span>{" "}
            <span className="text-ink-faint">
              One plan, one P&amp;L, one inbox — across every channel you sell in.
            </span>
          </p>
          <StatRow
            className="mx-auto mt-14 max-w-4xl"
            stats={[
              { value: "9.4x", label: "Amazon DSP ROAS on $192K spend" },
              { value: "$1.4M", label: "International revenue, from a US-only start" },
              { value: "+68%", label: "Annualized revenue, account health restored" },
            ]}
          />
        </div>
      </section>

      {/* 3 — Image strip */}
      <ImageStrip ids={["home-strip-1", "home-strip-2", "home-strip-3", "home-strip-4", "home-strip-5"]} />

      {/* 4 — Selected clients */}
      <section className="border-y border-line bg-white">
        <div className="container-kw py-16">
          <p className="eyebrow">Selected clients</p>
          <LogoGrid logos={clientLogos} height={26} className="mt-8" />
        </div>
      </section>

      {/* 5 — Results across channels and markets (navy) */}
      <section className="bg-navy-900 text-white">
        <div className="container-kw py-20 lg:py-28">
          <SectionHeading
            tone="dark"
            eyebrow="Results"
            title="Results across channels and markets."
            intro="Every figure comes from an account we run and has a published case study behind it."
            link={{ href: "/work", label: "See all case studies" }}
          />
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {results.map((s) => (
              <div key={s.slug} className="flex flex-col">
                <div className="relative mb-6 aspect-[3/2] overflow-hidden rounded-2xl">
                  <Img id={resultImage[s.slug]} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <span className="text-[clamp(40px,4vw,56px)] font-medium leading-none tracking-tightish text-gold-300">
                    {s.value}
                  </span>
                  <Chip tone="dark">{s.chip}</Chip>
                </div>
                {s.beforeAfter && (
                  <div className="mt-6">
                    <BeforeAfterBars before={s.beforeAfter.before} after={s.beforeAfter.after} tone="dark" />
                  </div>
                )}
                <p className="mt-6 text-small leading-relaxed text-white/65">{s.body}</p>
                <Link href={s.href} className="learn-more mt-5 !text-gold-300 hover:!text-white">
                  {s.link}
                  <ui.ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — One team owns the plan and the work (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20 lg:py-28">
          <FeatureSplit
            eyebrow="One team"
            title="One team owns the plan and the work."
            imageId="home-one-team"
            cta={{ href: "/why-kwontified", label: "Why one team wins" }}
          >
            <p>
              Most brands split advertising, creative and operations across separate
              agencies, then lose margin where those plans disagree. We run all of it as
              one plan, reviewed against one P&amp;L.
            </p>
            <p>
              One named team and one inbox for every channel you sell in, with senior
              leaders who stay involved long after onboarding.
            </p>
          </FeatureSplit>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => {
              const Icon = capabilityIcons[p.slug];
              return (
                <Link
                  key={p.cap}
                  href={`/capabilities/${p.slug}`}
                  className="group flex flex-col rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
                >
                  {Icon && <IconTile icon={Icon} />}
                  <h3 className="h-display mt-4 text-h3 text-navy-900">{p.cap}</h3>
                  <p className="mt-2 text-small leading-relaxed text-ink-muted">{p.desc}</p>
                  <p className="mt-4 border-t border-sand-300 pt-4 text-[13px] leading-relaxed text-ink-muted">
                    <span className="font-medium text-gold-700">How it connects — </span>
                    {p.connect}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7 — Budget goes where it earns most (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20 lg:py-28">
          <FeatureSplit
            reverse
            eyebrow="Where we operate"
            title="Budget goes where it earns most."
            imageId="home-channels"
            stats={[
              { value: "5.0x → 6.8x", label: "Blended Amazon ROAS, ad spend down 29%" },
            ]}
            cta={{ href: "/capabilities/analytics", label: "How we report across channels" }}
          >
            <p>
              We manage every marketplace as one business. Spend moves between channels on
              measured return, catalog work is done once and adapted, and reporting shows
              the whole P&amp;L in one view.
            </p>
          </FeatureSplit>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {channelTiles.map((c) => {
              if (c.ai) {
                return (
                  <Link
                    key={c.label}
                    href={c.href}
                    className="group flex flex-col justify-between rounded-2xl bg-navy-900 p-5 text-white shadow-card transition-shadow hover:shadow-lift"
                  >
                    <span className="text-[13px] font-medium uppercase tracking-[0.12em] text-gold-300">AI</span>
                    <span className="mt-6">
                      <span className="block h-display text-h3 text-white">{c.label}</span>
                      <span className="mt-1 block text-[13px] text-white/65">{c.sub}</span>
                    </span>
                  </Link>
                );
              }
              const Icon = c.icon ? channelIcons.international : null;
              return (
                <Link
                  key={c.label}
                  href={c.href}
                  className="group flex flex-col justify-between rounded-2xl border border-sand-300 bg-white p-5 shadow-card transition-shadow hover:shadow-lift"
                >
                  <span className="flex h-10 items-center">
                    {c.slug && marketplaceLogos[c.slug] ? (
                      <MarketplaceLogo slug={c.slug} className="max-h-8 max-w-[60%]" />
                    ) : Icon ? (
                      <Icon size={30} weight="light" className="text-navy-900" />
                    ) : null}
                  </span>
                  <span className="mt-6 flex items-center justify-between">
                    <span className="h-display text-h3 text-navy-900">{c.label}</span>
                    <ui.ArrowRight size={18} weight="bold" className="text-ink-faint transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8 — Creative that sells, still on brand (white) */}
      <section className="bg-white">
        <div className="container-kw py-20 lg:py-28">
          <SectionHeading
            eyebrow="Creative Studio"
            title="Creative that sells, still on brand."
            intro="Photography, video, A+ Content and Storefronts built from the conversion data — then measured on what they do to the numbers."
            link={{ href: "/work/creative", label: "See the Creative Studio" }}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {creative.slice(0, 2).map((c) => (
              <CreativeTile key={c.id} {...c} h="h-72 md:h-[420px]" />
            ))}
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {creative.slice(2).map((c) => (
              <CreativeTile key={c.id} {...c} h="h-72 md:h-80" />
            ))}
          </div>
        </div>
      </section>

      {/* 9 — Featured case study (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20 lg:py-28">
          <FeatureSplit
            eyebrow="Featured case study · Amazon"
            title="$1.8M from DSP, with search intact."
            imageId="case-amazon-dsp"
            stats={[
              { value: "9.4x", label: "DSP ROAS on $192K" },
              { value: "$1.8M", label: "Incremental DSP revenue" },
            ]}
            cta={{ href: "/work/amazon-dsp", label: "Read case study" }}
          >
            <p>
              A national beauty brand wanted to scale Amazon DSP without cannibalising its
              search business. We designed the lift test, proved incrementality, then
              scaled the budget on measured return.
            </p>
          </FeatureSplit>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {caseCards.map((c) => (
              <ImageCard key={c.href} href={c.href} imageId={c.id} ratio="16/9" chip={c.chip} title={c.title} excerpt={c.excerpt} cta="Read case study" />
            ))}
          </div>
        </div>
      </section>

      {/* 10 — What we're seeing in the market (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20 lg:py-28">
          <SectionHeading
            eyebrow="Perspectives"
            title="What we’re seeing in the market."
            link={{ href: "/perspectives", label: "All Perspectives" }}
          />
          <Link href={featuredPost.href} className="group mt-10 block overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-lift">
            <div className="relative aspect-[16/9] overflow-hidden md:aspect-[21/9]">
              <Img id="post-dsp" sizes="(max-width: 1312px) 100vw, 1312px" className="transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="brand">{featuredPost.topic}</Chip>
                <span className="text-[13px] text-ink-faint">{featuredPost.channel} · {featuredPost.author}</span>
              </div>
              <h3 className="h-display mt-3 max-w-3xl text-h2 text-navy-900">{featuredPost.title}</h3>
              <p className="mt-3 max-w-2xl text-body text-ink-muted">{featuredPost.body}</p>
              <span className="learn-more mt-5">Read the guide<ui.ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" /></span>
            </div>
          </Link>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {postCards.map((p) => (
              <ImageCard key={p.href} href={p.href} imageId={p.id} ratio="4/3" chip={p.chip} title={p.title} excerpt={p.excerpt} cta="Read" />
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Featured in (white) */}
      <section className="border-y border-line bg-white">
        <div className="container-kw py-14">
          <p className="text-center text-caption text-ink-muted">Featured in</p>
          <LogoGrid logos={pressLogos} height={26} className="mt-8" />
        </div>
      </section>

      {/* 12 — What clients say (navy) */}
      <section className="bg-navy-900">
        <div className="container-kw py-20 lg:py-28">
          <h2 className="sr-only">What clients say</h2>
          <Quote tone="dark">
            “We finally have one team that owns the plan, the ads and the operations,
            and reports all of it against our margin.”
          </Quote>
        </div>
      </section>

      {/* 13 — Promo banner */}
      <PromoBanner imageId="promo-home" title="See what your marketplaces could return." />
    </>
  );
}

function CreativeTile({ id, caption, metric, h }: { id: string; caption: string; metric: string; h: string }) {
  return (
    <figure>
      <div className={`relative overflow-hidden rounded-2xl ${h}`}>
        <Img id={id} sizes="(max-width: 768px) 100vw, 50vw" className="transition-transform duration-500 hover:scale-[1.03]" />
      </div>
      <figcaption className="mt-3 flex items-center gap-2 text-small text-ink-muted">
        <Chip tone="brand" className="whitespace-nowrap">{metric}</Chip>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
