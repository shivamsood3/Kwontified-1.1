// Careers content — the five open roles, parsed from the Kwontified content
// archive (Careers + the five job posts). Real copy; do not invent fields.

export type JobOwn = { h: string; d: string };
export type JobSuccess = { at: string; d: string };
export type Job = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  reportsTo: string;
  directReports: string;
  book: string;
  experience: string;
  summary: string;
  roleParas: string[];
  owns: JobOwn[];
  required: string[];
  preferred: string[];
  success: JobSuccess[];
};

export const jobs: Job[] = [
  {
    "slug": "marketplace-account-manager",
    "title": "Marketplace Account Manager",
    "team": "Strategy & Implementation, Marketplace Operations",
    "location": "Remote, or hybrid in Atlanta, Georgia",
    "type": "Full-time",
    "reportsTo": "Sr. Marketplace Account Manager or the Vice President of Commercial and Retail Media",
    "directReports": "1–2 Marketplace Account Analysts",
    "book": "A pod of 5–7 brands",
    "experience": "5+ years",
    "summary": "Strategy & Implementation, Marketplace Operations",
    "roleParas": [
      "This is the seat where Kwontified’s work gets done. You are the person in Seller Central and Vendor Central: writing the flat file, catching the suppression, modeling the deal, and building and presenting the QBR. You are also the person the client calls, so the work has to stand up to questioning.",
      "The role is broad by design, across the thirteen areas below. Nobody arrives strong in all of them. We expect depth in Amazon platform operations, catalog and analytics on day one, and we build the rest against a written development plan.",
      "The work runs on two clocks. Monthly and quarterly you plan: growth strategy, forecasts, the promotional calendar, the content refresh schedule and the business review. Daily and weekly you operate: restock and stockout risk, listing quality, Buy Box and pricing, account health, case escalations, deal setup and the Monday report.",
      "The hard part is sequencing five to seven brands with different economics, supply constraints and client politics, and knowing which one needs you most. A brand can run excellent advertising and still miss its year over an eleven-day stockout on a hero ASIN, a split variation family, a deal funded at an unmodeled margin or an undisputed chargeback pattern. You catch those before the client does, and you can tell a demand, supply, content or pricing problem apart when the only symptom is that sales are down."
    ],
    "owns": [
      {
        "h": "Account strategy and planning",
        "d": "A written growth strategy for each brand with quarterly milestones and KPIs, and the annual plan behind it: revenue targets, promotional calendar, content refresh schedule and budget recommendations. Monthly revenue forecasts covering seasonality, promotions and launches. Onboarding roadmaps for a new client’s first fifty days: audits, content, store build and launch sequencing. Competitive and category analysis in Brand Analytics, Helium 10 or equivalent, including sizing non-branded category terms by search volume, click share gaps and whitespace."
      },
      {
        "h": "Catalog and content optimization",
        "d": "Full catalog audits (titles, bullets, descriptions, backend search terms, attributes, Item Highlights) and an optimization plan ordered by revenue impact. SEO copy you write or direct. A+ Content strategy (Basic or Premium), briefs, creative execution and final QA. Brand Story, image strategy (main image compliance, lifestyle briefs, infographic specs, sizing charts), variation architecture with parent-child relationships and virtual bundles, and full attribute and browse node coverage. Flat file and bulk uploads at scale; listing quality alerts, search suppression and detail page issues resolved; content compliance in restricted categories."
      },
      {
        "h": "Brand Store and storefront",
        "d": "Store architecture (page hierarchy, navigation, category structure), analyzed in Store Insights by page and traffic source. Page-by-page conversion diagnosis with layout, merchandising or navigation fixes. Store versions for seasonal and promotional moments, creative briefs and QA, and traffic coordination with the ads team so Sponsored Brands campaigns land on the page that converts."
      },
      {
        "h": "Product and assortment strategy",
        "d": "Advice on what to list, hold back and retire on each channel. Launch plans that sequence content readiness, review generation, ad support and inventory positioning. Bundle strategy: virtual bundles, multipacks and cross-category sets. The promotional calendar (Lightning Deals, Best Deals, coupons, price-off promotions, Prime Day and the fall event) and Subscribe & Save enrollment, discount tiers and performance."
      },
      {
        "h": "Pricing and profitability",
        "d": "Profitability models by ASIN and account covering every fee: referral, FBA, storage, removal, returns and advertising. Margin impact modeled before pricing changes, promotions and fee increases, and unit economics before a launch is funded. Pricing architecture across channels, MAP enforcement, competitive pricing and Buy Box monitoring."
      },
      {
        "h": "Inventory and operations",
        "d": "FBA inventory levels and restock velocity, with stockout risk flagged early. FBA versus MFN decisions on velocity, storage cost and margin. Stranded, unfulfillable and aging inventory resolved; removal and liquidation decisions; long-term storage exposure, IPI and capacity limits managed. Shipment creation and troubleshooting with client operations or your analyst, coordination with client supply chain on production timelines, lead times and seasonal positioning, and the Amazon case log (escalations, reimbursement claims, catalog defects) worked to closure."
      },
      {
        "h": "Amazon platform operations",
        "d": "Expert use of Seller Central and Vendor Central: listings, orders, inventory, reports, POs, retail analytics, chargebacks, accruals and A+ content. Account Health Rating, with policy violations, IP complaints and suppressions resolved. Brand Registry tools: Transparency, Project Zero, Report a Violation and Brand Analytics. The recurring hard cases: stranded inventory, suppressed listings, ASIN merges and hijackers."
      },
      {
        "h": "Analytics and reporting",
        "d": "Weekly, biweekly and monthly reporting on revenue, traffic, conversion and advertising, with the KPI set underneath: sessions, conversion rate, Buy Box percentage, BSR, organic rank and market share. Search Query Performance with branded and non-branded split, click share, purchase share and leakage to competitors. CX Health, Voice of the Customer and return reasons (sizing, description mismatch, quality) turned into listing fixes. Listing quality scores and NCX rates tracked across the catalog."
      },
      {
        "h": "Advertising coordination",
        "d": "The retail half of an integrated program. Working knowledge of Sponsored Products, Brands, Brands Video, Display and DSP, and of realistic ACoS, TACoS and ROAS targets by funnel stage. Keyword and audience input for the ads team from catalog and search data, and budget shift recommendations based on content readiness, inventory position and business priority."
      },
      {
        "h": "Brand protection and account health",
        "d": "The Account Health dashboard: policy violations, performance metrics and at-risk status. Unauthorized sellers, counterfeit listings and Buy Box hijacking, enforced through Brand Registry. Vine enrollment for new and under-reviewed ASINs, star rating and review trends, sudden drops and review strategy. Listing compliance with content and category policies, IP infringement monitoring with client legal, and policy changes communicated to the client first."
      },
      {
        "h": "Client management and communication",
        "d": "The day-to-day relationship across calls, email and Slack. The weekly or biweekly strategy call (agenda, update, action items), and MBRs and QBRs prepared and presented. Expectations set on timelines, what is realistic and what needs client input. Trust with stakeholders in marketing, e-commerce, supply chain and the C-suite, and marketplace data translated into language their team can act on."
      },
      {
        "h": "Multi-marketplace",
        "d": "Walmart Seller Center: catalog setup, content optimization including Rich Media and shelf descriptions, and Walmart Fulfillment Services. Target Plus product setup, content requirements and performance monitoring. Enough Walmart advertising knowledge to coordinate with the ads team, and the judgment to adapt an Amazon-first strategy to a different algorithm, content specs and promotional mechanics."
      },
      {
        "h": "People management",
        "d": "One to two Marketplace Account Analysts: assign work, review quality and give feedback that changes behavior. Training for junior team members on catalog operations, reporting workflows and client communication standards. Repeatable processes and checklists for listing audits, QBR prep and launch sequences. QA of every deliverable before it reaches a client; you own the pod’s output, including work you did not do."
      }
    ],
    "required": [
      "Bachelor’s degree, or an equivalent combination of education and directly relevant experience",
      "5+ years of hands-on marketplace account experience, with expert-level use of Amazon Seller Central and Vendor Central",
      "Ownership of a brand or multi-brand book: strategy, catalog, merchandising, assortment, pricing, inventory and profitability, with numbers you can walk us through",
      "Revenue forecasting and planning: building the plan, defending the assumptions and reforecasting",
      "Catalog and content depth: audits, SEO copy, A+ and Brand Story, variation architecture, attributes and browse nodes, and flat file or bulk operations at scale",
      "Retail mechanics: Buy Box and Featured Offer, FBA versus FBM economics, inventory health and IPI, storage and removal fees, chargebacks and shortages, reimbursements, deals and coupons, and Subscribe & Save",
      "ASIN-level profitability modeling, fluent in every fee and in how promotions and price changes move contribution margin",
      "Strong analytical skills and advanced Excel or Sheets: pivot tables, lookups, charting, large exports and clean models you build yourself",
      "Experience leading or developing junior team members; you will manage an analyst early in the role",
      "Client-facing ownership: you have run the weekly call, presented the business review and held the relationship yourself",
      "Excellent written and oral communication, including a one-page recommendation a CFO approves and a difficult call handled calmly",
      "Client advocacy with a spine: you represent the client internally and can tell them no, with a reason and an alternative",
      "A proactive team player who escalates early, loses nothing and takes the problem nobody has claimed",
      "Honesty by default: you report the number you wish were different",
      "Working AI proficiency with Claude and Gemini, and the habit of verifying what the model produced",
      "Completion of the platform training scoped to this role during onboarding"
    ],
    "preferred": [
      "Walmart Marketplace and Target Plus management, including WFS, Rich Media and Target Plus item setup",
      "Analytics tools: Helium 10, Jungle Scout, DataHawk, Intentwise or equivalent",
      "SQL, Power Query or Looker Studio for joining marketplace exports to sales, cost and inventory data",
      "Feeds and integrations at scale: category templates, error triage, and Channel Advisor, Feedonomics, SPS or EDI for Vendor Central",
      "ERP, WMS or 3PL systems (NetSuite, Cin7, SkuVault, ShipBob or similar)",
      "E-commerce, retail or supply-chain expertise; replenishment, allocation or S&OP experience",
      "Project and collaboration tools: Asana, Monday, ClickUp, Notion, Slack",
      "Python or scripting, SP-API and report automation, or AI tooling you built that others use",
      "Additional channels: Zalando, Mercado Libre, Temu, TikTok Shop, Instagram Shop, Tmall or comparable",
      "Category depth in CPG, beauty, skincare, apparel, footwear or accessories"
    ],
    "success": [
      {
        "at": "90 days",
        "d": "You know your pod: catalog, economics, supply constraints, client politics and history. You run your own weekly calls, have delivered your first MBRs and have closed the obvious operational defects."
      },
      {
        "at": "6 months",
        "d": "You own the strategy conversation for every brand in your pod. Your forecasts are trusted. Catalog, content and storefront meet our standard on priority accounts, the promotional calendar is planned ahead, and you have recovered margin the client did not know was available. Your analyst is more capable than when they joined you."
      },
      {
        "at": "12 months",
        "d": "Your pod shows growth and margin improvement that holds up under scrutiny. Stockouts on hero SKUs are rare and explained. You have delivered four QBRs clients found worth the time, started at least one expansion conversation, seen your checklists used outside your pod, and clients ask for you by name."
      }
    ]
  },
  {
    "slug": "senior-marketplace-account-manager",
    "title": "Sr. Marketplace Account Manager",
    "team": "Strategy & Implementation, Marketplace Operations",
    "location": "Remote, or hybrid in Atlanta, Georgia",
    "type": "Full-time",
    "reportsTo": "Director, Marketplace Account Management, or the Vice President of Commercial and Retail Media",
    "directReports": "The analysts in two pods",
    "book": "Two pods of 10 to 14 brands, weighted to the largest and most complex accounts",
    "experience": "8+ years",
    "summary": "Strategy & Implementation, Marketplace Operations",
    "roleParas": [
      "Everything in the Marketplace Account Manager role applies here and is assumed.",
      "The step up shows in three ways, and a candidate needs real evidence in each. Scope: you hold the accounts where getting it wrong is expensive. Organizational impact: you build processes and standards that other pods use. Client seniority: you are credible with VPs, CMOs and founders, and you are in the room for renewals, scope changes and repairs.",
      "About half the work is your own accounts, where you stay hands-on: you can still audit a flat file and diagnose a multi-factor platform failure. About a quarter is your people: account reviews, coaching on judgment and prioritization, and raising the bar on work that reaches a client. The rest is building the function.",
      "The hardest part is that all three compete, and the accounts always feel most urgent. We protect time for the organizational work, and we hold you to it."
    ],
    "owns": [
      {
        "h": "Strategic leadership",
        "d": "The largest, most complex and highest-revenue accounts, with six-to-twelve-month strategic roadmaps. The strategy conversation with senior client stakeholders: VPs, CMOs and founders. Patterns across accounts turned into recommendations for new services or process changes, and advice to our leadership on market trends, competitive shifts and strategic opportunity."
      },
      {
        "h": "Cross-functional leadership",
        "d": "Integrated strategy shaped with advertising leadership, and high-stakes projects with creative and design: A+ redesigns, storefront overhauls and brand launches. Pricing, packaging and scoping of new engagements with leadership. How account management works with ads, creative and operations, defined once at the process level."
      },
      {
        "h": "Team development",
        "d": "Managing managers: coaching on strategy, client management and prioritization. Regular account reviews with direct reports to catch issues early and push thinking past the tactical. Onboarding and training for new hires on Kwontified’s methodology and standards. The SOPs, playbooks and quality benchmarks for the account management function."
      },
      {
        "h": "Operational excellence",
        "d": "Standard reporting templates, audit frameworks and QBR structures across the team. Processes that let the team handle more accounts without proportional headcount. Advanced analytical frameworks: cross-pod benchmarking, incrementality analysis, cohort analysis and LTV modeling. Resourcing and capacity constraints flagged before they become missed deliverables."
      },
      {
        "h": "Business development support",
        "d": "Prospect audits led or co-led: pull the data, find the gaps, build the narrative. Audit findings turned into pitch material that says what we would do, in what order and what it is worth. Prospect and close conversations alongside leadership, and engagements scoped honestly: realistic timelines, the right service tier and cost estimates that survive delivery. You are measured partly on whether the work you scoped could be delivered at the agreed price."
      },
      {
        "h": "Multi-channel and international",
        "d": "Integrated strategies across Amazon, Walmart, Target Plus and DTC. International expansion planning for brands entering Amazon EU, JP, UAE and comparable markets: catalog and compliance requirements, fulfillment model, pricing and tax implications, and realistic sequencing. Case studies from wins in channels we are still establishing."
      },
      {
        "h": "Client escalation and trust",
        "d": "The high-stakes conversations: contract renewals, scope changes, pricing negotiations and unwelcome feedback. At-risk relationships diagnosed and repaired, starting with what went wrong. QBRs for brands outside your book when a senior presence is needed. Cover for the VP or Managing Partner on client calls and internal decisions, with the judgment to know which decisions are yours."
      },
      {
        "h": "Advanced platform expertise",
        "d": "Complex, multi-factor platform problems, where a suppression, a variation collapse, a category miscode and a pricing error interact. Working relationships with Amazon account representatives (SAS Core, AVS) and a sense of when to use them. The internal subject matter expert on Seller Central and Vendor Central edge cases."
      }
    ],
    "required": [
      "Bachelor’s degree, or an equivalent combination of education and directly relevant experience",
      "8+ years in marketplace or e-commerce channel management, with mastery of the full Marketplace Account Manager scope",
      "Expert-level Amazon Seller Central and Vendor Central, current and hands-on",
      "Ownership of large or complex accounts: eight-figure channel revenue, multi-thousand-SKU catalogs, 1P/3P hybrids or heavily regulated categories",
      "Experience managing people who manage accounts, or the closest equivalent: coaching on strategy and prioritization, running account reviews and raising the quality of others’ work",
      "A record of building things the organization kept: SOPs, playbooks, audit frameworks, reporting standards, onboarding curricula or capacity-creating process",
      "Credibility with senior client stakeholders: you have led renewal, scope and pricing conversations with VPs, CMOs or founders",
      "Experience diagnosing and repairing an at-risk client relationship",
      "New business contribution: prospect audits, pitch narrative, close conversations and scoping you were accountable for delivering",
      "Advanced analysis you built yourself: cross-account benchmarking, incrementality, cohort analysis or LTV modeling",
      "Multi-marketplace fluency: Amazon plus operating experience on Walmart Marketplace and Target Plus, and the judgment to adapt strategy to each",
      "Excellent written and oral communication, from a one-page recommendation a CFO approves to an SOP a new hire can follow",
      "Honesty by default: you bring bad news first and persuade by being prepared",
      "AI proficiency at the level where you build tools others use, with the habit of verifying the output and accountability for AI-assisted work in your pods",
      "Completion of the platform training scoped to this role during onboarding"
    ],
    "preferred": [
      "International marketplace expansion led end to end (Amazon EU, JP, UAE or comparable): catalog, compliance, fulfillment and pricing",
      "Working relationships with Amazon account representatives (SAS Core, AVS)",
      "Agency experience with P&L or service-line exposure: utilization, scoping accuracy and delivery economics",
      "Hiring experience: interviewing, evaluation criteria and calibrating a team bar",
      "SQL, Power Query, Looker Studio or Python for cross-account benchmarking and modeling",
      "Experience evaluating and rolling out tooling or Amazon betas across a team",
      "DTC and wholesale exposure, including channel-conflict conversations",
      "Category depth in CPG, beauty, skincare, apparel, footwear or accessories, with case studies you can point to"
    ],
    "success": [
      {
        "at": "90 days",
        "d": "You know both pods: the accounts, the people and where the work is weakest. You have run account reviews with each direct report, given us an honest read on where quality varies, and named the two or three standards you will fix first."
      },
      {
        "at": "6 months",
        "d": "Your accounts are performing and your senior client relationships are established. At least two things you built are in use across the team, such as a reporting standard, an audit framework, a QBR structure or an onboarding module. Your team makes better calls without you in the room, and you have contributed to one new business pursuit from audit through scoping."
      },
      {
        "at": "12 months",
        "d": "Your book shows growth and margin improvement that holds up under scrutiny. Quality across the function is more consistent, and traceable to things you built. One of your people is ready for more scope. Clients ask for you when the conversation is difficult, and leadership sends you when the room needs a senior presence."
      }
    ]
  },
  {
    "slug": "marketplace-account-analyst",
    "title": "Marketplace Account Analyst",
    "team": "Strategy & Implementation, Marketplace Operations",
    "location": "Remote, or hybrid in Atlanta, Georgia",
    "type": "Full-time",
    "reportsTo": "The Marketplace Account Manager or Sr. Marketplace Account Manager who runs the pod",
    "directReports": "None",
    "book": "",
    "experience": "1+ years",
    "summary": "Strategy & Implementation, Marketplace Operations",
    "roleParas": [
      "This is an execution seat, and we mean that as a description rather than a diminishment. The catalog is either accurate or it is not. The flat file either submits cleanly or it takes a hero ASIN down for a weekend. The suppression is either caught on Tuesday morning or discovered by the client on Friday afternoon.",
      "You’ll be a member of a pod, reporting to the Marketplace Account Manager or Sr. Marketplace Account Manager who runs it, alongside any Sr. Analysts and Analysts in the same pod. The Manager owns the strategy, the forecast, the margin, and the client relationship.",
      "You are client-facing, and that is unusual for an entry-level seat. You will attend client calls, take the notes, distribute the action items, send the weekly report, and answer routine client questions the same business day. For your first months the Manager reviews client-facing work before it goes out. The relationship is theirs; the reliability is yours, and clients form their view of us largely from whether things they asked for happened.",
      "Basecamp is not a status tool here, it is the client’s window into the account. We keep continuous, real-time updates in it through the working day — to-dos, progress notes, completed items, blockers — so that a client can look at any moment and see what is happening without asking. Every assignment, status change, deliverable, and blocker lives there. An Analyst who does excellent work and does not record it has done half the job, because the client cannot see the half that is missing."
    ],
    "owns": [
      {
        "h": "Catalog and listing management",
        "d": "Creating and updating listings in Seller Central and Vendor Central — titles, bullets, descriptions, backend terms, attributes. Bulk updates via flat files: Inventory Loader, Listing Loader, category templates, price and quantity changes. ASIN creation, variation family setup and troubleshooting. Images checked against Amazon’s requirements before upload."
      },
      {
        "h": "Content QA and coordination",
        "d": "Everything QA’d before publish: spelling, grammar, keyword coverage, attribute accuracy, platform compliance. Revision status and deadlines tracked across brands with overdue items flagged rather than quietly slipping. Product data, keyword lists, and competitive references supplied to the designer so creative work is not blocked waiting on you. Content gaps flagged to the Manager."
      },
      {
        "h": "Inventory and fulfillment operations",
        "d": "FBA levels monitored daily, sell-through tracked, restock recommendations prepared, stockout risk flagged early enough to act on. Inbound shipments created and tracked. Stranded and unfulfillable inventory resolved, removals processed, liquidation decisions supported. FBA fees and dimension or weight classifications verified, with cases opened on cubiscan errors."
      },
      {
        "h": "Account health and compliance",
        "d": "The Account Health Dashboard read daily — violations, deactivations, performance metrics, at-risk indicators. ODR, late shipment rate, and pre-fulfillment cancel rate tracked. Support cases opened, tracked, and followed up, with a case log that has status, case ID, and response summary in it. Plans of Action drafted for violations and reinstatements, reviewed by the Manager before submission."
      },
      {
        "h": "Reporting and data management",
        "d": "Standard pulls from Seller Central, Vendor Central, and Brand Analytics, including Search Query Performance, Market Basket, and Repeat Purchase. Return reason and Voice of the Customer data organized for review. Weekly and monthly reporting compiled on our templates across every marketplace. KPIs tracked with anomalies flagged rather than reported — a conversion dip is worth an early message, not a line in Friday’s deck."
      },
      {
        "h": "Promotions and deals execution",
        "d": "Lightning Deals, Best Deals and Top Deals submitted against the Manager’s calendar. Coupons, percentage-off promotions, and Prime Exclusive Discounts set up. Subscribe & Save enrollment and discount tiers managed. Submission deadlines tracked so a tentpole event is never missed by a day."
      },
      {
        "h": "Revenue recovery support",
        "d": "Reimbursement-eligible reports pulled, claims filed with documentation, resolution tracked. On Vendor Central, documentation gathered for shortage and chargeback disputes. A claims tracker kept with dates, amounts, and status. Stalled or denied claims escalated rather than abandoned."
      },
      {
        "h": "Client communication and support",
        "d": "Client calls attended with detailed notes and distributed action items. Status updates and weekly reports sent. Routine questions answered the same business day. Real-time Basecamp updates through the day."
      }
    ],
    "required": [
      "Bachelor’s degree, or an equivalent combination of education and directly relevant experience. This is a firm-wide requirement across every team and level",
      "1+ years of hands-on Amazon Seller Central experience, or strong demonstrated proficiency from a structured e-commerce training path or a comparable in-house role",
      "Flat file capability: you have submitted them, you have broken something with one, and you know what you do differently now",
      "Excel or Google Sheets at working level: pivot tables, VLOOKUP/INDEX-MATCH, conditional formatting, charts, and comfort with a large messy export",
      "Accuracy as a habit rather than an aspiration. This seat is detail work, and a misplaced decimal in a price file or a blank cell that overwrites bullet content is not a small error — it is next month’s problem with a delay built in",
      "Excellent written English. You will write to clients, and your writing is most of what they see of you",
      "Proactive communication. You raise a problem when you find it, not when someone asks",
      "Organization you can describe as a mechanism rather than a personality trait, because you will hold many small obligations across several brands at once",
      "Reliable internet, a quiet working environment, and overlap with US Eastern business hours",
      "Working AI proficiency with the verification habit that has to come with it — using Claude or Gemini to accelerate content drafting, data formatting, and routine analysis, and able to say what the model did and what you checked yourself",
      "Completion of the platform curricula scoped to this seat on our onboarding schedule, verified against provider transcripts rather than résumés"
    ],
    "preferred": [
      "Vendor Central exposure — POs, chargebacks, shortages, Sales Diagnostics",
      "Walmart Seller Center or Target Plus item setup",
      "Basecamp, or fluency in a comparable project management tool you can show us",
      "Helium 10, Jungle Scout, or DataHawk",
      "Brand Registry: Report a Violation, IP complaints, Transparency",
      "A+ Content or Brand Story submission at volume",
      "Agency experience, or any background where you carried several accounts at once",
      "Category familiarity in CPG, beauty, skincare, apparel, footwear, or accessories"
    ],
    "success": [
      {
        "at": "30 days",
        "d": "Platform access and certifications in place. The recurring cadence running without reminders on your assigned brands. Basecamp current in real time. Your first client reports out, reviewed by your Manager."
      },
      {
        "at": "90 days",
        "d": "You are the reason the accounts are clean. Defects are caught by you rather than by the client. Your reporting is trusted enough that the Manager reads it rather than rebuilding it. You have filed reimbursement claims that recovered real money."
      },
      {
        "at": "12 months",
        "d": "You hold your assigned brands with the Manager engaged on exceptions rather than on your task list. You have written or rewritten SOPs others use. You have caught something serious before it cost anyone anything. You are ready to be considered for the next level."
      }
    ]
  },
  {
    "slug": "advertising-manager",
    "title": "Advertising Manager",
    "team": "Channel Marketing & Advertising",
    "location": "Remote, or hybrid in Atlanta, Georgia",
    "type": "Full-time",
    "reportsTo": "Account Director",
    "directReports": "Team of Advertising Analysts",
    "book": "",
    "experience": "5+ years",
    "summary": "Channel Marketing & Advertising",
    "roleParas": [
      "The position exists because strategy has outgrown a single seat. Our analysts are strong at execution — campaign builds, bid management, optimization, reporting — but they need someone above them who owns the plan: what the strategy is, what it costs, what it should return, and how it gets sold to the client. You’ll be the person client leadership talks to about media, and the person our analysts come to when they don’t know what to do next.",
      "The work runs on two clocks. Quarterly and annually you’re planning: building the media plan and budget for each brand, forecasting the sales that spend produces, and getting client sign-off. Weekly you’re operating: reviewing performance with your analysts, deciding what to shift, catching problems before the client does, and pushing the tests that inform the next plan.",
      "The hard part isn’t campaign mechanics — it’s judgment under incomplete information. You’ll commit to a forecast while a client’s inventory position is uncertain, defend upper-funnel budget that won’t read cleanly for two months, and distinguish a strategy that isn’t working from one that hasn’t had time. You’ll also be asked to find growth in accounts where the obvious moves are already made, which means identifying demand the brand isn’t capturing rather than optimizing what’s already there.",
      "You’ll have real latitude over strategy, budget, and how your team works, and we’ll expect you to own outcomes rather than effort. You’ll partner with our Strategy & Implementation Team on retail readiness and our Design Team on creative, since performance in these channels is capped by the quality of what the ads point to."
    ],
    "owns": [
      {
        "h": "Media planning",
        "d": "Annual, quarterly, and event-level plans across Amazon Sponsored Ads, Amazon DSP, Walmart Connect, and Target Roundel — channel and tactic mix, funnel allocation, and spend timed to the calendar that matters. Plans should account for inventory, retail readiness, competition, and seasonality, reserve budget for testing, and state assumptions clearly enough to defend six weeks later."
      },
      {
        "h": "Forecasting and budget management",
        "d": "Budget forecasting, pacing, and sales forecasts that connect spend to topline results. Scenario ranges with stated assumptions, not single-number promises. Efficiency targets managed without losing sight of incrementality."
      },
      {
        "h": "Analysis",
        "d": "You’ll do the analytical work yourself rather than wait on a dashboard — interrogating search term, placement, product-level, DSP, and business reports, and using AMC for path to purchase, audience overlap, frequency, cross-channel assist, and new-to-brand contribution. We want people who know what question they’re asking before they query, can tell signal from a short-term wobble, connect ad data to retail data, and check their own math."
      },
      {
        "h": "Knowing the business you are advertising for",
        "d": "Each brand’s economics, not just its account: contribution margin by product, where its efficiency target actually came from, what inventory and inbound will allow, the calendar its own marketing imposes on us, and who signs for money and what that person is measured on. Goals and constraints move during the year; the job is to notice and re-plan before the client has to ask."
      },
      {
        "h": "Growth and new audiences",
        "d": "Find the demand a brand isn’t reaching: unclaimed search terms, untargeted subcategories, competitor share worth contesting, unused placements, adjacent use cases. Build and test audiences in AMC and DSP beyond the obvious — lapsed and repeat purchasers, cross-category buyers, in-market adjacents, lookalikes from high-value cohorts, prospecting pools sized for real new-to-brand reach. Run it as a program: hypothesis, test, clean read, scale or kill."
      },
      {
        "h": "Team leadership",
        "d": "Lead, coach, and develop the analysts running daily campaign work. Set the standard for QA, bulk-operation hygiene, naming conventions, and documentation. Review closely enough to catch the change that shouldn’t have shipped, and explain the reasoning rather than just correcting it. The weekly question is not only whether an analyst’s optimizations were competent but whether they served the strategy — and when they did not, whether the analyst misread it or the strategy is wrong."
      },
      {
        "h": "Client communication",
        "d": "Bring plans, strategy, and performance to client senior management with a recommendation rather than a set of options. Anticipate the objection, name the tradeoff, show what you’d trade to get what you’re asking for. Adjust for the audience — a CFO wants payback and risk, a brand lead wants positioning and reach, a founder wants to know whether it works. When results disappoint, say so first and bring a plan."
      }
    ],
    "required": [
      "5+ years creating, managing, and optimizing Amazon Sponsored Ads campaigns (Sponsored Products, Brands, Brands Video, Display) and Amazon DSP campaigns",
      "Experience leading digital advertising teams — hiring, coaching, reviewing, holding a standard",
      "Hands-on experience pulling insights from Amazon Marketing Cloud and acting on them",
      "Strong analytical skills; comfortable building your own models and reasoning about incrementality, attribution, and significance",
      "Media planning, budget forecasting, and sales forecasting experience",
      "Depth in PPC management and optimization, and in programmatic display",
      "A track record of new-to-brand acquisition and consistent incremental sales growth, with numbers you can walk us through",
      "Clear writing and speaking, including presenting media plans to client senior leadership and getting agreement",
      "Honesty by default. You report the number you wish were different, and you persuade by being prepared rather than polished",
      "Working AI proficiency, with the verification habit that has to come with it. Claude and Gemini in the analytical, planning, and writing workflow, and the ability to say what you had the model do, what you checked by hand, and where it was wrong.",
      "Current Amazon Ad Academy and Walmart Connect Academy certifications as scoped to this role, or completion of them on our onboarding schedule"
    ],
    "preferred": [
      "Google Data Studio / Looker Studio and SQL, particularly for AMC queries",
      "Building AI tooling yourself — a Gem, a skill, a script, or an agentic workflow you made and someone else now uses",
      "Walmart Connect and/or Target Roundel campaign management",
      "Retail fundamentals: Buy Box, inventory health, catalog integrity, promotions, subscriptions, and how each limits what advertising can do",
      "Agency or multi-brand portfolio experience",
      "Advanced Excel and bulk operations; Python or scripting a plus"
    ],
    "success": [
      {
        "at": "90 days",
        "d": "You know your portfolio cold — structure, history, constraints. Your analysts know what you expect. You’ve given us a clear read on what’s working and what isn’t."
      },
      {
        "at": "6 months",
        "d": "You’ve materially improved the ad architecture on your priority accounts, you own the client strategy conversation, and you have tests in market on untapped demand."
      },
      {
        "at": "12 months",
        "d": "Your portfolio shows new-to-brand and incremental growth that holds up under scrutiny, your analysts have grown, and clients ask for you by name."
      }
    ]
  },
  {
    "slug": "advertising-analyst",
    "title": "Advertising Analyst",
    "team": "Channel Marketing & Advertising",
    "location": "Remote, or hybrid in Atlanta, Georgia",
    "type": "Full-time",
    "reportsTo": "Manager, E-Commerce Channel Marketing & Advertising",
    "directReports": "None: individual contributor",
    "book": "",
    "experience": "2+ years",
    "summary": "Channel Marketing & Advertising",
    "roleParas": [
      "You’ll own the day-to-day management of advertising for a set of client brands across Amazon, Walmart Marketplace, and Target Plus — building campaigns, managing bids and budgets, adjusting targeting, watching pacing, and finding the changes that move performance. Your manager sets the strategy and the media plan; you make it real in the platform, and you’re the first person to know when something isn’t working.",
      "This is an individual contributor role, but it isn’t a heads-down one. You’ll work directly with our Strategy & Implementation Team on retail readiness — inventory, catalog, promotions, detail page quality — and with our Design Team on creative for Sponsored Brands, video, and display. Advertising in these channels doesn’t perform in isolation, and analysts who understand that make better recommendations than analysts who only look at ad reports.",
      "You’ll also do a meaningful amount of thinking, not just executing. You’ll run account audits, dig into search term and placement data to find waste and opportunity, build the analysis behind quarterly and annual business reviews, and prepare the decks your manager presents to client leadership. Where you see a better answer than the plan calls for, we want to hear it.",
      "We expect analysts to use AI in their work. Our team uses AI for report analysis, bulk file preparation, keyword and search term work, audit drafting, and internal tooling. You don’t need to be an engineer, but you should be comfortable working with AI tools and interested in using them to get through the mechanical parts of the job faster so you can spend more time on the parts that require judgment."
    ],
    "owns": [
      {
        "h": "Campaign management and optimization",
        "d": "Build, launch, and manage Sponsored Products, Sponsored Brands, Sponsored Brands Video, Sponsored Display, and Amazon DSP campaigns, plus their Walmart Connect and Target Roundel equivalents. Manage bids, budgets, negatives, placement modifiers, and dayparting against agreed targets. Keep pacing on plan and flag risk before it becomes a shortfall."
      },
      {
        "h": "Keyword, targeting, and audience work",
        "d": "Research and build keyword and product targeting sets, mine search term reports for new opportunity and wasted spend, and maintain clean negative structures. Support audience building and testing in DSP."
      },
      {
        "h": "Analysis",
        "d": "Pull and interrogate the data yourself — search term, placement, product-level, and business reports — and turn it into a recommendation rather than a summary. Understand why a number moved, not just that it did."
      },
      {
        "h": "Account audits",
        "d": "Perform structured audits on new and existing accounts: campaign architecture, targeting overlap, budget allocation, wasted spend, missed placements, and gaps between what the account is doing and what the strategy calls for. Write up findings clearly enough that someone else can act on them."
      },
      {
        "h": "Client reporting and business reviews",
        "d": "Build the reporting that keeps clients informed, and prepare the analysis and decks for quarterly and annual business reviews. Your work goes in front of client leadership, so it needs to be accurate, clear, and defensible."
      },
      {
        "h": "AI-assisted workflows",
        "d": "Use AI tools to speed up analysis, bulk file work, keyword processing, and documentation. Contribute to improving how the team works rather than just following the process you were handed."
      },
      {
        "h": "Collaboration",
        "d": "Partner with the Strategy & Implementation Team on retail readiness and the Design Team on creative. Raise the constraints — inventory, catalog, pricing, page quality — that advertising can’t fix on its own."
      }
    ],
    "required": [
      "2+ years of hands-on experience building, managing, and optimizing Amazon advertising campaigns",
      "Amazon Ads certification in Sponsored Ads and in Amazon DSP, now issued as the Amazon Ads Programmatic Solutions Certification (both required)",
      "Experience with Amazon DSP campaign management, not just Sponsored Ads",
      "Genuinely analytical. You’re comfortable in large data sets, you can build your own analysis in Excel or Sheets, and you check your own math",
      "Intellectual curiosity. You want to know why something happened, and you keep pulling the thread after the immediate question is answered",
      "Strong written and verbal communication. You can explain a performance change in plain language and write findings a client can read",
      "Proficiency working with AI tools and AI-assisted workflows",
      "Detail discipline. Bulk uploads, naming conventions, and negatives done right the first time"
    ],
    "preferred": [
      "Walmart Sponsored Ads and Walmart DSP certification",
      "Meta and TikTok ads experience, with certifications",
      "Target Roundel experience",
      "SQL, Looker Studio / Google Data Studio, or Amazon Marketing Cloud exposure",
      "Agency or multi-brand experience across categories",
      "Advanced Excel; Python or scripting a plus",
      "Familiarity with retail fundamentals: Buy Box, inventory health, catalog integrity, promotions, subscriptions"
    ],
    "success": [
      {
        "at": "30 days of account work",
        "d": "You’re managing daily optimizations on your accounts with light supervision, and you know each brand’s structure, targets, and constraints."
      },
      {
        "at": "90 days",
        "d": "You’re running your accounts independently, delivering audits and reporting your manager doesn’t have to rewrite, and surfacing recommendations rather than waiting for direction."
      },
      {
        "at": "12 months",
        "d": "Your accounts show measurable improvement you can explain, you’re trusted in front of clients, and you’ve improved at least one thing about how the team works."
      }
    ]
  }
];

export function getJob(slug: string) {
  return jobs.find((j) => j.slug === slug);
}

export const jobTeams = Array.from(new Set(jobs.map((j) => j.team)));
