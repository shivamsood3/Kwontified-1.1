// Perspectives authors — the real bylines from the content archive. Bios, topics
// and press appearances are taken from the author pages in the Kwontified archive.

export type AuthorPress = { outlet: string; title: string; date: string };

export type PerspectiveAuthor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  topics: string[];
  press: AuthorPress[];
  image: string;
};

export const perspectiveAuthors: PerspectiveAuthor[] = [
  {
    slug: "elaine-kwon",
    name: "Elaine Kwon",
    role: "Co-Founder and Managing Partner",
    bio: "Elaine co-founded Kwontified and leads company strategy and client partnerships. At Amazon Fashion she managed the luxury goods P&L across 150+ brands and ran Amazon’s Corporate Holiday Free-Shipping program, which later became the Free One-Day Shipping Prime Program. She speaks on ecommerce strategy for NPR, the Wall Street Journal and other publications, and serves as an Industry Leader for Ecommerce and Agentic Commerce at KeyBanc Capital Markets.",
    topics: [
      "Luxury and prestige brands on Amazon",
      "Agentic commerce",
      "Marketplace strategy",
      "Shipping and fulfillment programs",
    ],
    press: [
      { outlet: "NPR", title: "When It Comes to Clothes, Amazon Is Not the First Choice for Online Shoppers", date: "Jun 7, 2018" },
      { outlet: "Digiday", title: "Amazon’s pushing its private-label brands for the holidays", date: "Nov 9, 2017" },
      { outlet: "Digiday", title: "Amazon Reviews Have a Bot Problem", date: "Sep 18, 2017" },
      { outlet: "Fierce Retail", title: "Elaine Kwon: 5 reasons to switch from Amazon’s wholesale to marketplace", date: "Sep 7, 2017" },
      { outlet: "Digiday", title: "Amazon’s fashion charm offensive moves to London Fashion Week", date: "Aug 1, 2017" },
      { outlet: "GeekWire", title: "Ex-Amazon manager’s startup Kwontified aims to help fashion retailers navigate e-commerce", date: "Jul 25, 2017" },
      { outlet: "Racked", title: "A Former Amazon Employee Has a Warning For Brands", date: "Jun 28, 2017" },
    ],
    image: "/team/elaine-kwon.jpg",
  },
  {
    slug: "jordan-taylor",
    name: "Jordan Taylor",
    role: "Co-Founder and Managing Partner",
    bio: "Jordan co-founded Kwontified and has run its technology infrastructure and account operations for the past decade. He builds the data and systems that connect promotions, content and demand generation to revenue. His background spans digital marketing, SEO and consumer analytics in fashion, beauty and lifestyle. Before Kwontified he led digital marketing teams of 20+ specialists serving 11,000+ clients, and he has taken brands from their home market into US and international Amazon marketplaces.",
    topics: [
      "Marketplace data and reporting systems",
      "Agentic commerce and Alexa for Shopping",
      "SEO and consumer analytics",
      "International Amazon expansion",
    ],
    press: [
      { outlet: "Digiday", title: "Amazon advertisers want more video ads if they’re to spend more", date: "Jul 30, 2018" },
      { outlet: "Total Retail", title: "3 Reasons Brands Should Re-Evaluate Their Retail Distribution Agreements", date: "Mar 27, 2018" },
      { outlet: "GeekWire", title: "Ex-Amazon manager’s startup Kwontified aims to help fashion retailers navigate e-commerce", date: "Jul 25, 2017" },
    ],
    image: "/team/jordan-taylor.jpg",
  },
];

export function getPerspectiveAuthor(slug: string) {
  return perspectiveAuthors.find((a) => a.slug === slug);
}

export function authorSlug(name: string) {
  return perspectiveAuthors.find((a) => a.name === name)?.slug;
}
