import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://kwontified.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kwontified — Measured growth. Beautiful work.",
    template: "%s · Kwontified",
  },
  description:
    "Kwontified runs Amazon, Walmart, Target Plus and global marketplaces for brands — advertising, creative, operations and analytics under one team that reads the numbers and makes the work that moves them.",
  openGraph: {
    title: "Kwontified — Measured growth. Beautiful work.",
    description:
      "One team for retail media, creative, operations and analytics across Amazon, Walmart, Target Plus and global marketplaces.",
    url: siteUrl,
    siteName: "Kwontified",
    images: ["/brand/opengraph-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kwontified — Measured growth. Beautiful work.",
    description:
      "One team for retail media, creative, operations and analytics across the marketplaces that drive growth.",
    images: ["/brand/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/brand/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen bg-white text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
