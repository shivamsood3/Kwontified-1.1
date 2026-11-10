import type { Metadata } from "next";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";

// TODO(licence): self-host Neue Haas Grotesk Text/Display Pro via next/font/local
// once the web licence + WOFF2 files are supplied. Until then the CSS stack in
// globals.css falls back to Helvetica Neue / Arial.

const siteUrl = "https://kwontified.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kwontified — Measured growth. Beautiful work.",
    template: "%s · Kwontified",
  },
  description:
    "Kwontified runs Amazon, Walmart, Target Plus and global marketplaces for brands — advertising, creative, operations and analytics under one team that reads the numbers and makes the work that moves them.",
  applicationName: "Kwontified",
  authors: [{ name: "Kwontified" }],
  creator: "Kwontified",
  publisher: "Kwontified LLC",
  category: "Ecommerce marketplace agency",
  keywords: [
    "ecommerce agency",
    "Amazon agency",
    "Amazon advertising",
    "Amazon DSP",
    "retail media",
    "Walmart Connect",
    "Target Plus",
    "marketplace management",
    "Amazon Vendor Central",
    "AI commerce",
    "Amazon Rufus",
    "ecommerce analytics",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Kwontified — Measured growth. Beautiful work.",
    description:
      "One team for retail media, creative, operations and analytics across Amazon, Walmart, Target Plus and global marketplaces.",
    url: siteUrl,
    siteName: "Kwontified",
    images: ["/brand/opengraph-image.png"],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwontified — Measured growth. Beautiful work.",
    description:
      "One team for retail media, creative, operations and analytics across the marketplaces that drive growth.",
    images: ["/brand/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-ink antialiased">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {children}
      </body>
    </html>
  );
}
