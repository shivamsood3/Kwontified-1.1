import type { MetadataRoute } from "next";
import { capabilitiesContent } from "@/lib/content/capabilities";
import { channelsContent } from "@/lib/content/channels";
import { leaders } from "@/lib/content/leadership";
import { caseStudyDetails } from "@/lib/content/caseStudies";
import { perspectivePosts } from "@/lib/content/perspectivePosts";
import { perspectiveAuthors } from "@/lib/content/perspectiveAuthors";

const base = "https://kwontified.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/capabilities",
    "/channels",
    "/channels/amazon",
    "/channels/amazon/brand-programs",
    "/work",
    "/work/amazon-dsp",
    "/work/creative",
    "/work/gallery",
    "/perspectives",
    "/perspectives/amazon-dsp-incrementality",
    "/why-kwontified",
    "/about",
    "/about/leadership",
    "/about/careers",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
  ];

  const capPaths = capabilitiesContent.map((c) => `/capabilities/${c.slug}`);
  const chanPaths = channelsContent
    .filter((c) => c.slug !== "amazon")
    .map((c) => `/channels/${c.slug}`);
  const leaderPaths = leaders.map((l) => `/about/leadership/${l.slug}`);
  const caseStudyPaths = caseStudyDetails.map((c) => `/work/${c.slug}`);
  const postPaths = perspectivePosts.map((p) => `/perspectives/${p.slug}`);
  const authorPaths = perspectiveAuthors.map((a) => `/perspectives/authors/${a.slug}`);

  const all = [
    ...staticPaths,
    ...capPaths,
    ...chanPaths,
    ...leaderPaths,
    ...caseStudyPaths,
    ...postPaths,
    ...authorPaths,
  ];

  return all.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
