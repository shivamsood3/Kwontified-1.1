import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

// Fallback only. Unknown addresses are answered by app/[...missing]/route.ts, which sends
// the built 404 page as-is (a third of the size: rendering it here sends the page twice,
// as markup and again as React data, and loads the Next.js runtime). This component is
// used only if Next.js itself raises a "not found" that the catch-all route does not see.
// The 404 page is built by scripts/site-errors.mjs; its head styles and scripts and its
// body are rendered as-is, so the menu, search and cookie banner still work.
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
