export type Leader = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  topics: string[];
  image: string;
};

export const leaders: Leader[] = [
  {
    slug: "elaine-kwon",
    name: "Elaine Kwon",
    role: "Co-Founder and Managing Partner",
    image: "/team/elaine-kwon.jpg",
    bio: "Elaine co-founded Kwontified and leads company strategy and client partnerships. At Amazon Fashion she managed the luxury goods P&L across 150+ brands and ran Amazon’s Corporate Holiday Free-Shipping program, which later became the Free One-Day Shipping Prime Program. She speaks on ecommerce strategy for NPR, the Wall Street Journal and other publications, and serves as an Industry Leader for Ecommerce and Agentic Commerce at KeyBanc Capital Markets.",
    topics: ["Luxury and prestige brands on Amazon", "Agentic commerce", "Marketplace strategy"],
  },
  {
    slug: "jordan-taylor",
    name: "Jordan Taylor",
    role: "Co-Founder and Managing Partner",
    image: "/team/jordan-taylor.jpg",
    bio: "Jordan co-founded Kwontified and has run its technology infrastructure and account operations for the past decade. He builds the data and systems that connect promotions, content and demand generation to revenue. His background spans digital marketing, SEO and consumer analytics in fashion, beauty and lifestyle. Before Kwontified he led digital marketing teams of 20+ specialists serving 11,000+ clients, and he has taken brands from their home market into US and international Amazon marketplaces.",
    topics: ["Marketplace data and reporting systems", "AI commerce and Amazon Rufus", "SEO and consumer analytics"],
  },
];

export function getLeader(slug: string) {
  return leaders.find((l) => l.slug === slug);
}
