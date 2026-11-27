import fs from "node:fs";
import path from "node:path";

// The "access restricted" page, served with status 403 at /403.
// scripts/site-errors.mjs builds it (same header, footer and styles as every other page).
// Nothing on the public site refuses a visitor today; this address is here for the client
// portal and for host rules that turn a request away, so they have a branded page to show
// instead of the host's plain one. Rewrite or redirect such a request to /403.
const html = fs.readFileSync(path.join(process.cwd(), "public/_kq/403.html"), "utf8");

export const dynamic = "force-static";

export function GET() {
  return new Response(html, {
    status: 403,
    headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=0, must-revalidate" },
  });
}
