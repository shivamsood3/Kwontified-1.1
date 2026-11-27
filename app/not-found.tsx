import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

// The 404 page is built by scripts/build-site.mjs from the Thank-you export
// (same layout and styles, different words). Its head styles and scripts and its
// body are rendered as-is; the inline scripts run on load, so the menu, search
// and cookie banner work exactly as on every other page.
const html = fs.readFileSync(path.join(process.cwd(), "public/_kq/404.html"), "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
const headAssets = (head.match(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g) ?? []).join("\n");
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";

export const metadata: Metadata = {
  title: "Page not found | Kwontified",
  description: "The page you were looking for has moved or no longer exists. Use Search in the menu, or start from Kwontified’s case studies or the homepage.",
  robots: { index: false },
};

export default function NotFound() {
  return <div dangerouslySetInnerHTML={{ __html: headAssets + body }} />;
}
