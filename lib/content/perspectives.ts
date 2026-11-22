// Perspectives content — the real editorial set from the client content archive
// (Kwontified website files / Perspectives). Authors: Elaine Kwon and Jordan Taylor.
// The flagship "Holiday 2026" article carries its full body; the rest ship with
// their real title, dek, author, date, topic and channel from the archive.

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  author: "Elaine Kwon" | "Jordan Taylor";
  /** ISO date for sorting + <time> */
  date: string;
  /** Display date, e.g. "Nov 5, 2026" */
  displayDate: string;
  topic: string;
  channel: string;
  featured?: boolean;
  body?: ArticleBlock[];
};

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  topic: string;
  channel: string;
  readTime?: string;
  dek?: string;
  body?: ArticleBlock[];
  sources?: string[];
};

export type PressRelease = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  fullTitle?: string;
  location?: string;
  dek?: string;
  body?: ArticleBlock[];
};

export const articleImage = (slug: string) => `art-${slug}`;

export const articles: Article[] = [
  {
    slug: "holiday-2026-season-starts-in-october",
    title: "Holiday 2026: the season now starts in October",
    dek: "The 2026 holiday season now runs from early October to late December. What the forecasts show, how the season stretched, and how to plan each of its phases.",
    author: "Elaine Kwon",
    date: "2026-11-05",
    displayDate: "Nov 5, 2026",
    topic: "Event playbooks",
    channel: "All channels",
    featured: true,
    body: [
      { type: "p", text: "Adobe expects US shoppers to spend $95.8 billion online in October, up 8%, in a month that sits outside its holiday window and still equals about 35% of the season it forecasts. Retailers moved major events into October and early November, and shoppers spend heavily before the traditional season begins. So the 2026 holiday season now starts in October. Brands should plan a ten-week season with a different job for each phase, rather than concentrating everything on Black Friday and Cyber Monday." },
      { type: "h2", text: "Where the holiday 2026 season stands" },
      { type: "p", text: "Adobe’s headline forecast is a record. US online spending is expected to reach $275.1 billion between November 1 and December 31, up 6.7%. Across October to December, its forecast puts online spending at $370.9 billion, up 7%, and describes October as a step-change in spending." },
      { type: "p", text: "Cyber Week is still the peak. The five days from Thanksgiving to Cyber Monday are forecast to drive $47.5 billion, up 7.4%, or 17.3% of the season, and in 2026 the whole stretch falls inside November, with Cyber Monday on November 30." },
      { type: "p", text: "The two biggest days of that week are converging. Cyber Monday is forecast at $15.1 billion, up 6.2%, while Black Friday is forecast at $12.9 billion, up 9.2%. Black Friday is growing faster than Cyber Monday, though Cyber Monday remains the largest day." },
      { type: "p", text: "The holiday basket mixes gifts and essentials. Adobe expects electronics, apparel, furniture, grocery, toys and cosmetics to lead online holiday spending, with grocery forecast to grow 10.3%. Buy now, pay later services are expected to drive $21.3 billion in spending across November and December, up 6.6%." },
      { type: "p", text: "The October event has already delivered. Prime Big Deal Days brought $9.86 billion in US online spending across retailers over October 6 and 7, up 8.5%. Rivals also set their dates early: Walmart announced early Black Friday deals from November 12 to 15, Black Friday deals from November 23 to 29 and Cyber Monday deals online through December 2." },
      { type: "h2", text: "How the season moved into October" },
      { type: "p", text: "Retailers added events to the calendar. Amazon’s October sale, Walmart’s and Target’s competing events in the same week, and Walmart’s early Black Friday window in mid-November turned a single weekend into a run of events. Shoppers followed the deals: with discounts available from early October, many began buying earlier, especially for everyday items and early gifts." },
      { type: "p", text: "Gift decisions still come later. In Amazon’s October event, only 20% of shoppers said they bought holiday gifts, and 56% were not yet sure what they wanted for the holidays, Numerator found. The season starts earlier for spending than for gift decisions." },
      { type: "p", text: "Inside the peak, the weekend matters again. With Black Friday growing faster than Cyber Monday, brands that hold most of their budget for the Monday may run short when demand arrives earlier in the weekend. Payment options stretch spending too, since buy now, pay later lets shoppers spread larger purchases across weeks, which supports bigger baskets during the peak." },
      { type: "p", text: "And the calendar compresses the peak: with Cyber Monday on November 30, all of Cyber Week falls in November, which makes November an even bigger month for many brands. Put together, a season that runs from early October to late December has phases with different jobs. Treating it as one push around Black Friday wastes money early and misses demand late." },
      { type: "p", text: "Not every category follows this pattern, though. Some products sell mostly in December, and some brands see little October demand, so the phases should be set from each brand’s own sales history." },
      { type: "h2", text: "Four phases, each with its own job" },
      { type: "p", text: "Take a toy brand that, in past years, held most of its budget for Black Friday week. In 2026, it used October to test prices on its best sellers, started gift advertising when Walmart’s early deals opened in mid-November, concentrated spend in Cyber Week and kept a smaller budget for December gift buyers. Its stock plan followed the same phases: an October test, an early November build, a Cyber Week peak and a December finish." },
      { type: "p", text: "Brands should plan October, early November, Cyber Week and December as separate phases, each with its own goal. Price, stock and ad results from October show which products can carry the season, and they should decide which products lead Cyber Week." },
      { type: "p", text: "Gifting starts before Thanksgiving: with Walmart opening early deals on November 12, gift advertising should start well before Black Friday. The five days from Thanksgiving to Cyber Monday remain the largest share of the season and deserve the largest daily budgets." },
      { type: "p", text: "December still needs a reserve. Late gift buyers shop in December, especially for fast delivery, and a small budget keeps best sellers visible through the final weeks. Inventory should be placed for each phase, not only for the Cyber Week peak, so best sellers do not run out before December." },
      { type: "h2", text: "Questions for the holiday plan" },
      { type: "p", text: "Does each phase, from October to December, have its own budget and goal? Which products did October’s price, stock and ad results pick to lead Cyber Week? Will gift advertising start before Walmart’s early deals open on November 12? Is there a December reserve, and is stock placed so best sellers last until then?" },
      { type: "p", text: "For the planning meeting, the first question is whether the holiday plan still centers on one weekend. If it does, splitting it into four phases with separate budgets is the place to start, and planning those phases across Amazon, Walmart and Target is what we help brands do for the full holiday season." },
    ],
  },
  { slug: "prime-big-deal-days-what-it-added", title: "What Prime Big Deal Days 2026 actually added for brands", dek: "Prime Big Deal Days 2026 moved a lot of demand in time rather than creating it. Why event-day lift overstates the gain, and how to measure what the event added.", author: "Jordan Taylor", date: "2026-11-03", displayDate: "Nov 3, 2026", topic: "Event playbooks", channel: "Amazon" },
  { slug: "unauthorized-resellers-distribution-decisions", title: "Unauthorized resellers and the distribution decisions behind them", dek: "Unauthorized resellers on Amazon usually trace back to a brand’s own distribution choices. What changed in 2026, what it cannot fix, and where to start.", author: "Elaine Kwon", date: "2026-10-29", displayDate: "Oct 29, 2026", topic: "Operations", channel: "All channels" },
  { slug: "amazon-ad-benchmarks-cheaper-clicks", title: "Amazon ad benchmarks, Q3 2026: cheaper clicks, weaker conversion", dek: "Public benchmarks show Amazon clicks got cheaper in Q3 2026 while conversion fell. What the numbers mean, why the calendar distorts them, and how to read them.", author: "Jordan Taylor", date: "2026-10-28", displayDate: "Oct 28, 2026", topic: "Retail media", channel: "Amazon" },
  { slug: "prime-big-deal-days-lessons", title: "What Prime Big Deal Days 2026 revealed about shopper behavior", dek: "Prime Big Deal Days 2026 looked more like a price-checked restock than a holiday kickoff. What it showed about shoppers, and when to spend gift budgets.", author: "Elaine Kwon", date: "2026-10-22", displayDate: "Oct 22, 2026", topic: "Event playbooks", channel: "Amazon" },
  { slug: "prime-big-deal-days-results-forecast", title: "Prime Big Deal Days 2026 results: our forecast, measured", dek: "Prime Big Deal Days 2026 spending landed just above our standard case, but click costs fell below our range. What held, what missed and why it matters.", author: "Jordan Taylor", date: "2026-10-20", displayDate: "Oct 20, 2026", topic: "Event playbooks", channel: "Amazon" },
  { slug: "amazon-brand-store-flagship", title: "A Brand Store as the brand’s flagship on Amazon", dek: "Amazon Brand Stores now support pages for different audiences and shape what shopping assistants say. Why the store is the flagship, and how to run it.", author: "Elaine Kwon", date: "2026-10-15", displayDate: "Oct 15, 2026", topic: "Creative and conversion", channel: "Amazon" },
  { slug: "agent-built-ad-stack-unboxed", title: "unBoxed 2026: what an agent-built ad stack changes", dek: "When Amazon’s AI plans, buys and reports on the same campaign, advertisers need independent ways to check the results. What an agent-built ad stack changes.", author: "Jordan Taylor", date: "2026-10-13", displayDate: "Oct 13, 2026", topic: "Agentic commerce", channel: "Amazon" },
  { slug: "latin-america-marketplace-or-direct", title: "Marketplace first or direct first in Latin America", dek: "For most brands entering Latin America, Mercado Libre should come before a direct site. Why the marketplace leads, and when building your own site pays.", author: "Elaine Kwon", date: "2026-10-08", displayDate: "Oct 8, 2026", topic: "Marketplace strategy", channel: "All channels" },
  { slug: "amazon-unboxed-changes-advertisers", title: "What Amazon Ads unBoxed 2026 changes for advertisers", dek: "At unBoxed 2026, Amazon moved advertisers from setting bids and audiences to supplying the inputs its AI acts on. What changes, and what to do first.", author: "Jordan Taylor", date: "2026-10-06", displayDate: "Oct 6, 2026", topic: "Retail media", channel: "Amazon" },
  { slug: "amazon-europe-or-zalando-first", title: "Amazon Europe or Zalando first: choosing where to enter", dek: "Brands entering Europe often weigh Amazon against Zalando. The better first platform depends on how the category sells, not which one is bigger.", author: "Elaine Kwon", date: "2026-10-01", displayDate: "Oct 1, 2026", topic: "Marketplace strategy", channel: "Multiple channels" },
  { slug: "amazon-accelerate-sellers-rules", title: "What Amazon Accelerate 2026 changes for sellers: rules over tasks", dek: "Amazon Accelerate 2026 handed routine seller work to agents that act unprompted. The job now is writing the rules they follow and checking what they did.", author: "Jordan Taylor", date: "2026-09-29", displayDate: "Sep 29, 2026", topic: "Marketplace strategy", channel: "Amazon" },
  { slug: "retailer-ai-assistants-shopper-conversation", title: "Retailer assistants and the fight for the shopper’s conversation", dek: "Walmart, Amazon and Target are putting their own AI assistants where shoppers ask for advice. Why each retailer’s catalog now decides what the assistant says.", author: "Elaine Kwon", date: "2026-09-24", displayDate: "Sep 24, 2026", topic: "Agentic commerce", channel: "All channels" },
  { slug: "prime-big-deal-days-forecast-three-retailers", title: "Prime Big Deal Days 2026 forecast for a three-retailer week", dek: "Prime Big Deal Days 2026 keeps two days and shares its week with Target and Walmart. Our ranges for spending, brand sales and click costs, and how to budget.", author: "Jordan Taylor", date: "2026-09-22", displayDate: "Sep 22, 2026", topic: "Event playbooks", channel: "Amazon" },
  { slug: "amazon-1p-3p-unit-economics", title: "1P or 3P on Amazon in 2026: compare the unit economics", dek: "The 2026 fee headlines were about 3P, but 1P deductions got harder to recover. Compare what each Amazon product keeps per unit, then choose product by product.", author: "Jordan Taylor", date: "2026-09-22", displayDate: "Sep 22, 2026", topic: "Operations", channel: "Amazon" },
  { slug: "instagram-discovery-purchase-elsewhere", title: "Discovery on Instagram, purchase elsewhere: where the sale lands", dek: "Shoppers find products on Instagram and buy them on a brand site, on Amazon or through a checkout partner. Where the sale lands and how brands should plan.", author: "Elaine Kwon", date: "2026-09-17", displayDate: "Sep 17, 2026", topic: "Marketplace strategy", channel: "Instagram Shop" },
  { slug: "tiktok-demand-lands-on-amazon", title: "When TikTok demand lands on Amazon: how brands should prepare", dek: "TikTok creates demand, but many shoppers then buy on Amazon. Why the sale moves to Amazon and what brands should prepare there before the next creator push.", author: "Elaine Kwon", date: "2026-09-10", displayDate: "Sep 10, 2026", topic: "Marketplace strategy", channel: "Multiple channels" },
  { slug: "negative-keywords-cheapest-efficiency-gain", title: "Negative keywords: the cheapest efficiency gain in retail media", dek: "Negative keywords cut wasted ad spend at almost no cost, and Walmart Connect now offers them. The two kinds of negatives, and why one can lower reported ROAS.", author: "Jordan Taylor", date: "2026-09-08", displayDate: "Sep 8, 2026", topic: "Retail media", channel: "All channels" },
  { slug: "why-target-plus-invites-few-brands", title: "Why Target Plus invites so few brands, and how to get in", dek: "Target Plus stays small because Target sells curation. Why Target invites so few brands to its marketplace and what a brand needs to show to earn a place.", author: "Elaine Kwon", date: "2026-09-03", displayDate: "Sep 3, 2026", topic: "Marketplace strategy", channel: "Target Plus" },
  { slug: "shopping-agent-product-listing-needs", title: "What a shopping agent needs from a product listing", dek: "An AI shopping agent recommends only products it can verify against a shopper’s request. The four things it needs from a listing, and how to supply them.", author: "Jordan Taylor", date: "2026-09-01", displayDate: "Sep 1, 2026", topic: "Agentic commerce", channel: "All channels" },
  { slug: "october-three-retailer-week-planning", title: "October’s three-retailer week: planning Prime Big Deal Days 2026", dek: "Amazon, Walmart and Target ran their fall sales in the same week in 2025. Why brands should plan Prime Big Deal Days 2026 as one three-retailer week.", author: "Elaine Kwon", date: "2026-08-27", displayDate: "Aug 27, 2026", topic: "Event playbooks", channel: "Amazon" },
  { slug: "vendor-central-shortages-chargebacks-leak", title: "Where Vendor Central shortages and chargebacks leak money", dek: "Amazon takes shortage claims and chargebacks straight out of vendor payments. Why the two-year dispute limit makes unreviewed deductions the costliest leak.", author: "Jordan Taylor", date: "2026-08-25", displayDate: "Aug 25, 2026", topic: "Operations", channel: "Amazon Vendor Central" },
  { slug: "cfo-retail-media-approval", title: "What a CFO needs before approving more retail media", dek: "Retail media budgets keep growing while buyers struggle to prove returns. The five pieces of evidence a CFO needs before approving more retail media spend.", author: "Elaine Kwon", date: "2026-08-20", displayDate: "Aug 20, 2026", topic: "Retail media", channel: "All channels" },
  { slug: "profit-maximizing-price-amazon-test", title: "Finding the profit-maximizing price on Amazon by test", dek: "The Amazon price that sells the most units is rarely the one that earns the most. How to test prices for profit in 2026 without losing your reference price.", author: "Jordan Taylor", date: "2026-08-18", displayDate: "Aug 18, 2026", topic: "Operations", channel: "Amazon" },
  { slug: "beauty-brands-tiktok-demand-store-sales", title: "How beauty brands turn TikTok demand into store sales", dek: "TikTok Shop sold nearly $1 billion of beauty in the second quarter of 2026, and much of that demand ends on a store shelf. How brands stock the path to it.", author: "Elaine Kwon", date: "2026-08-13", displayDate: "Aug 13, 2026", topic: "Marketplace strategy", channel: "TikTok Shop" },
  { slug: "q4-budget-phase-october-cyber-week", title: "Q4 2026 budget: how to phase spend from October to Cyber Week", dek: "Holiday demand now spreads across more big days, yet competition for clicks still peaks in Cyber Week. How to phase a Q4 2026 budget from October onward.", author: "Jordan Taylor", date: "2026-08-11", displayDate: "Aug 11, 2026", topic: "Event playbooks", channel: "All channels" },
  { slug: "retail-roles-ai-augment-replace", title: "Which retail roles AI will augment and which it will replace", dek: "Walmart and Amazon say AI will change every job, but so far it takes over tasks before whole roles. How brands should sort ecommerce teams by task, not title.", author: "Elaine Kwon", date: "2026-08-06", displayDate: "Aug 6, 2026", topic: "Agentic commerce", channel: "All channels" },
  { slug: "amazon-second-quarter-ad-revenue-clicks", title: "Amazon’s Q2 2026 results: what ad revenue says about clicks", dek: "Amazon’s ad revenue grew 26% in Q2 2026 while paid units grew 17%. What that gap says about a more crowded auction, and the number brands should check.", author: "Jordan Taylor", date: "2026-08-04", displayDate: "Aug 4, 2026", topic: "Retail media", channel: "Amazon" },
];

export const news: NewsItem[] = [
  {
    slug: "amazon-black-friday-week-2026-dates",
    title: "Watch: Amazon Black Friday Week 2026 dates",
    date: "2026-11-02",
    displayDate: "Nov 2, 2026",
    topic: "Event playbooks",
    channel: "Amazon",
    readTime: "2-minute read",
    dek: "Walmart has set three holiday events starting November 12, while Amazon has not yet published its 2026 Black Friday Week dates. Amazon announced its 2025 event on November 10 for a November 20 start. Brands should plan for an Amazon start around the week before Thanksgiving and match prices to Walmart’s earlier window.",
    sources: ["RTTNews", "MT Newswires", "EcomCrew"],
    body: [
      { type: "h2", text: "What happened" },
      { type: "p", text: "Walmart set its calendar first. Walmart announced early Black Friday deals from November 12 to 15, Black Friday deals from November 23 to 29 and Cyber Monday deals online from November 30 to December 2, RTTNews reported on October 26." },
      { type: "p", text: "Amazon’s dates are still to come. In 2025, Amazon said on November 10 that its Black Friday Week and Cyber Monday events would run from November 20 to December 1. Black Friday falls on November 27 in 2026." },
      { type: "p", text: "Amazon’s inventory deadlines have passed. Amazon set inbound deadlines for Black Friday Week and Cyber Monday stock of October 14 for its warehousing service, October 21 for FBA with minimal shipment splits and October 28 with optimized splits." },
      { type: "p", text: "October prices do not count. Prices from Prime Big Deal Days are excluded from the lookback periods Amazon uses to set maximum deal prices for Black Friday Week and Cyber Monday." },
      { type: "h2", text: "Why it matters for brands" },
      { type: "p", text: "Walmart opens early. Its November 12 event starts well before Amazon’s likely window, so shoppers will see Walmart prices first." },
      { type: "p", text: "Amazon’s timing is still a guess. Planning from the 2025 pattern is reasonable, but budgets and staffing should flex once Amazon confirms." },
      { type: "p", text: "Stock is mostly set. With inbound deadlines past, brands are largely selling the inventory already in place." },
      { type: "h2", text: "What to do now" },
      { type: "p", text: "Plan Amazon budgets for a start around November 19 or 20, and adjust once dates are confirmed. Match Amazon prices to Walmart’s November 12 and November 23 events. Check stock levels for Black Friday Week products and plan around any gaps." },
    ],
  },
  { slug: "prime-big-deal-days-2026-early-read", title: "Early read: Prime Big Deal Days 2026 from public sources, labeled preliminary", date: "2026-10-09", displayDate: "Oct 9, 2026", topic: "Event playbooks", channel: "Amazon", readTime: "2-minute read", dek: "A first read on Prime Big Deal Days 2026 from public sources, labeled preliminary until the measured results are in." },
  { slug: "unboxed-2026-day-two-automation", title: "unBoxed 2026, day two: what advertisers give up for automation", date: "2026-10-01", displayDate: "Oct 1, 2026", topic: "Retail media", channel: "Amazon", readTime: "3-minute read", dek: "Day two of unBoxed 2026 made the trade clear: more automation in Amazon Ads means less direct control for advertisers. What you give up, and what to keep hold of." },
  { slug: "unboxed-2026-amazon-ads-agents", title: "unBoxed 2026: Amazon Ads rebuilds buying around agents", date: "2026-09-30", displayDate: "Sep 30, 2026", topic: "Agentic commerce", channel: "Amazon", readTime: "3-minute read", dek: "At unBoxed 2026, Amazon Ads rebuilt campaign buying around agents that plan, buy and report. What changes for advertisers, and the checks that still need a human." },
];

export const pressReleases: PressRelease[] = [
  { slug: "perspectives-briefing-launch", title: "Kwontified launches Perspectives and the Kwontified Briefing newsletter", date: "2026-11-03", displayDate: "Nov 3, 2026", location: "Sandy Springs, Georgia", dek: "Kwontified launches Perspectives, its marketplace insights hub, and the Kwontified Briefing, a monthly newsletter for brand leaders." },
  {
    slug: "unboxed-2026-san-francisco",
    title: "Kwontified to attend Amazon Ads unBoxed 2026 in San Francisco",
    fullTitle: "Kwontified’s Elaine Kwon, Jordan Taylor, Corey Brown and Priyanka Shah to attend Amazon Ads unBoxed 2026 in San Francisco",
    date: "2026-09-18",
    displayDate: "Sep 18, 2026",
    location: "Sandy Springs, Georgia",
    dek: "Managing partners Elaine Kwon and Jordan Taylor, VP of Growth Corey Brown and VP of Commercial and Retail Media Priyanka Shah will attend unBoxed 2026, Amazon Ads’ annual conference, opening September 28 at Moscone Center in San Francisco.",
    body: [
      { type: "p", text: "SANDY SPRINGS, Ga. — September 18, 2026 — Kwontified, an e-commerce channel management, marketing and technology services firm, today announced that managing partners Elaine Kwon and Jordan Taylor, Vice President of Growth Corey Brown and Vice President of Commercial and Retail Media Priyanka Shah will attend unBoxed 2026, Amazon Ads’ annual advertising conference, which opens September 28 at Moscone Center in San Francisco." },
      { type: "p", text: "Brands that want to meet the team in San Francisco, or arrange a video meeting during or after the conference, can write to sales@kwontified.com." },
      { type: "p", text: "The team will be watching three areas closely: advertising inside AI shopping, after Amazon moved Alexa for Shopping into its main search bar in May, and how sponsored products will appear when shoppers ask an assistant for recommendations; video and live sports, after Amazon reported second-quarter advertising revenue of $19.8 billion, up 26%, with sports inventory selling out; and fall event planning, as brands set advertising budgets for Prime Big Deal Days on October 6 and 7 and for the holiday season that follows." },
      { type: "p", text: "“Advertising on Amazon is moving into AI assistants and streaming video at the same time,” said Jordan Taylor, managing partner at Kwontified. “We will be in San Francisco to understand the new tools and how they are measured, so the brands we work with can decide where their next advertising dollar belongs before the holidays.”" },
      { type: "p", text: "Kwontified will publish a summary of the announcements that matter for brands after the conference." },
      { type: "h2", text: "About Kwontified" },
      { type: "p", text: "Kwontified is an e-commerce channel management, marketing and technology services firm that helps brands plan, run and measure their business on Amazon, Walmart, Target and other marketplaces. Learn more at kwontified.com." },
    ],
  },
  { slug: "accelerate-2026-seattle", title: "Kwontified to attend Amazon Accelerate 2026 in Seattle", fullTitle: "Kwontified’s Jordan Taylor, Corey Brown and Dennis Wong to attend Amazon Accelerate 2026 in Seattle", date: "2026-09-14", displayDate: "Sep 14, 2026", location: "Sandy Springs, Georgia", dek: "Kwontified’s Jordan Taylor, VP of Growth Corey Brown and Dennis Wong will attend Amazon Accelerate 2026, Amazon’s annual seller conference, in Seattle." },
];

export const perspectiveFaqs = [
  { q: "What is Perspectives?", a: "Perspectives is where Kwontified publishes what it learns running marketplaces for premium brands. It holds articles, news on platform changes, white papers built on our own data, press releases and the monthly newsletter." },
  { q: "Who writes the articles?", a: "The people doing the work. Each piece carries its author and its date so you know it is current." },
  { q: "How do I find a topic?", a: "Search the index, or filter by type, topic, channel, author or month." },
];

export const perspectiveFilters = {
  types: ["All types", "Articles", "News", "Press releases"],
  topics: ["All topics", "Retail media", "Creative and conversion", "Operations", "Agentic commerce", "Event playbooks", "Marketplace strategy"],
  channels: ["All channels", "Amazon", "Amazon Vendor Central", "Target Plus", "TikTok Shop", "Instagram Shop"],
  authors: ["All authors", "Elaine Kwon", "Jordan Taylor"],
  months: ["Any month", "November 2026", "October 2026", "September 2026", "August 2026"],
};

export const monthOf = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getNews(slug: string) {
  return news.find((n) => n.slug === slug);
}

export function getPress(slug: string) {
  return pressReleases.find((p) => p.slug === slug);
}

export const featuredArticle = articles.find((a) => a.featured) ?? articles[0];
