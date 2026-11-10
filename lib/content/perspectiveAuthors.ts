// Perspectives author profiles (fix 6). Bios reuse copy already published on
// the site (the DSP guide's author card and the leadership bios) — nothing
// invented. Linked from article bylines.

export type PerspectiveAuthor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export const perspectiveAuthors: PerspectiveAuthor[] = [
  {
    slug: "priyanka-shah",
    name: "Priyanka Shah",
    role: "VP, Commercial and Retail Media",
    bio: "Priyanka leads commercial strategy and retail media at Kwontified. She is a former Amazon NA Category Lead and Senior Strategic Account Manager, and writes on measurement, incrementality and where marketplace ad budgets earn their return.",
    image: "/team/priyanka-shah.jpg",
  },
  {
    slug: "jordan-taylor",
    name: "Jordan Taylor",
    role: "Co-Founder and Managing Partner",
    bio: "Jordan co-founded Kwontified and has run its technology infrastructure and account operations for the past decade. He builds the data and systems that connect promotions, content and demand generation to revenue, and writes on marketplace data, reporting and AI commerce.",
    image: "/team/jordan-taylor.jpg",
  },
];

export function getPerspectiveAuthor(slug: string) {
  return perspectiveAuthors.find((a) => a.slug === slug);
}

export function authorSlug(name: string) {
  return perspectiveAuthors.find((a) => a.name === name)?.slug;
}
