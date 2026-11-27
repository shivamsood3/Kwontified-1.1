import fs from "node:fs";
import path from "node:path";

// Every address that is not a page, a redirect, an API route or a file answers here with 404.
// Known pages are rewritten to their built files before routing (next.config.ts), so only
// unknown addresses reach this handler, including an article address with no built file.
// The 404 page is built by scripts/site-errors.mjs (same header, footer and styles as every
// other page) and is sent as-is: rendering it through React (app/not-found.tsx, now only a
// fallback) sent the page twice, as markup and again as React data, plus the Next.js runtime.
// A missing file under /assets (e.g. an old script name requested by a cached page after a
// deploy) gets a short plain-text answer instead of a whole page.
const html = fs.readFileSync(path.join(process.cwd(), "public/_kq/404.html"), "utf8");

const headers = (type: string) => ({
  "Content-Type": type,
  "X-Robots-Tag": "noindex",
  "Cache-Control": "public, max-age=0, must-revalidate",
});

function notFound(request: Request) {
  const asset = /^\/(assets|_next)\//.test(new URL(request.url).pathname);
  return asset
    ? new Response("Not found\n", { status: 404, headers: headers("text/plain; charset=utf-8") })
    : new Response(html, { status: 404, headers: headers("text/html; charset=utf-8") });
}

// HEAD is answered from GET (same status and headers, no body); a form posted to an unknown
// address gets the same 404 rather than 405
export { notFound as GET, notFound as POST };
