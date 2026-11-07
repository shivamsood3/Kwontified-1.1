import { site } from "./site";

export const BASE_URL = "https://kwontified.com";
const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

export function abs(path = "/") {
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
}

/** Topics the brand is an authority on — entity signals for AI/generative search. */
export const knowsAbout = [
  "Ecommerce marketplace management",
  "Amazon advertising",
  "Amazon DSP",
  "Amazon Marketing Cloud",
  "Retail media",
  "Walmart Connect",
  "Target Plus",
  "Marketplace operations",
  "Amazon Vendor Central",
  "Revenue recovery",
  "AI commerce",
  "Amazon Rufus optimization",
  "Ecommerce analytics and forecasting",
];

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: BASE_URL,
    logo: abs("/brand/icon-192.png"),
    image: abs("/brand/opengraph-image.png"),
    description:
      "Kwontified is an ecommerce agency running Amazon, Walmart, Target Plus and global marketplaces for brands — advertising, creative, operations and analytics under one team.",
    email: site.email,
    telephone: "+14048739148",
    foundingDate: "2016",
    founders: [
      { "@type": "Person", name: "Elaine Kwon" },
      { "@type": "Person", name: "Jordan Taylor" },
    ],
    sameAs: site.social.map((s) => s.href),
    knowsAbout,
    areaServed: ["United States", "Canada", "United Kingdom", "European Union"],
    address: site.offices.map((o) => ({
      "@type": "PostalAddress",
      streetAddress: o.lines[0],
      addressLocality: o.lines[1]?.split(",")[0]?.trim(),
      addressRegion: o.lines[1]?.split(",")[1]?.trim()?.split(" ")[0],
      addressCountry: "US",
      name: o.label,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      email: site.email,
      telephone: "+14048739148",
      contactType: "sales",
      areaServed: "US",
      availableLanguage: "English",
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: BASE_URL,
    name: site.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export function breadcrumbLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: abs(it.path) } : {}),
    })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleLd({
  title,
  description,
  path,
  authorName,
  section,
}: {
  title: string;
  description: string;
  path: string;
  authorName: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    author: { "@type": "Person", name: authorName },
    publisher: { "@id": ORG_ID },
    ...(section ? { articleSection: section } : {}),
    inLanguage: "en-US",
  };
}

export function personLd({
  name,
  role,
  bio,
  path,
}: {
  name: string;
  role: string;
  bio: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    description: bio,
    url: abs(path),
    worksFor: { "@id": ORG_ID },
  };
}

export function serviceLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: abs(path),
    provider: { "@id": ORG_ID },
    areaServed: "US",
  };
}
