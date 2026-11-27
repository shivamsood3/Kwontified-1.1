import { NextResponse, type NextRequest } from "next/server";

// Every page address is lower case. Next.js matches rewrites in any letter case, so /ABOUT
// served a duplicate of /about (and /perspectives/Some-Article a 404, because article files are
// found by name). Any address with a capital letter is sent once (308) to its lower-case form,
// query string kept. Percent-escapes (%C3%A9) are left as they are. Built files, assets and
// API routes are not pages and are never touched.
// Runs after the redirects in next.config.ts, which match in any letter case, so an old
// address such as /Services/Amazon goes straight to its new page in one hop.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lower = pathname.replace(/%[0-9A-Fa-f]{2}|[A-Z]+/g, (m) => (m[0] === "%" ? m : m.toLowerCase()));
  if (lower === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = lower;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // only addresses that contain a capital letter, outside /_next, /assets, /_kq and /api
  matcher: ["/((?!_next/|assets/|_kq/|api/).*[A-Z].*)"],
};
