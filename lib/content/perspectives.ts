export type Perspective = {
  slug?: string;
  title: string;
  topic: string;
  channel: string;
  author: string;
  excerpt: string;
  featured?: boolean;
};

export const perspectives: Perspective[] = [
  {
    slug: "amazon-dsp-incrementality",
    title: "Is your Amazon DSP spend incremental?",
    topic: "Retail media",
    channel: "Amazon",
    author: "Priyanka Shah",
    excerpt:
      "Attributed ROAS shows what DSP touched. Lift studies and AMC path analysis show what it caused. The test design we use before scaling a DSP budget.",
    featured: true,
  },
  {
    title: "TACoS or ROAS: which number to run an Amazon business on",
    topic: "Analytics",
    channel: "Amazon",
    author: "Jordan Taylor",
    excerpt:
      "Why the metric you optimise decides the business you build — and when each number tells the truth.",
  },
  {
    title: "Walmart Connect or Amazon Ads: where the next dollar should go",
    topic: "Retail media",
    channel: "Walmart",
    author: "Priyanka Shah",
    excerpt:
      "A framework for moving budget between marketplaces based on incremental return, not channel loyalty.",
  },
  {
    title: "What Target Plus’ invitation requires — and how to keep it",
    topic: "Operations",
    channel: "Target Plus",
    author: "Elaine Kwon",
    excerpt:
      "The standards Target holds sellers to on content, price and service, and how to run to them.",
  },
  {
    title: "Content structured for AI shopping assistants",
    topic: "AI commerce",
    channel: "Amazon",
    author: "Jordan Taylor",
    excerpt:
      "How to structure product data and content so Rufus, ChatGPT, Gemini and Claude can read and recommend your brand.",
  },
];

export const perspectiveFilters = {
  topics: ["All topics", "Retail media", "Analytics", "Operations", "AI commerce", "Creative"],
  channels: ["All channels", "Amazon", "Walmart", "Target Plus", "International"],
  authors: ["All authors", "Elaine Kwon", "Jordan Taylor", "Priyanka Shah"],
};
