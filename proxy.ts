import { NextResponse, type NextRequest } from "next/server";

// Runs on page addresses only (outside /_next, /assets, /_kq and /api; see the matcher).
//
// 1. Pages are read-only. Every page is a built file, and Next.js answered a POST to one with a
//    500 (QA engineering-09, function-01). No form on the site posts to a page: the contact form
//    posts to /api/contact and the newsletter form to /api/subscribe, with or without JavaScript.
//    So anything but GET or HEAD gets 405 with an Allow header.
// 2. Every page address is lower case. Next.js matches rewrites in any letter case, so /ABOUT
//    served a duplicate of /about (and /perspectives/Some-Article a 404, because article files are
//    found by name). Any address with a capital letter is sent once (308) to its lower-case form,
//    query string kept. Percent-escapes (%C3%A9) are left as they are. Runs after the redirects in
//    next.config.ts, which match in any letter case, so an old address such as /Services/Amazon
//    goes straight to its new page in one hop.
export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD")
    return new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD", "Cache-Control": "no-store" } });
  const { pathname } = request.nextUrl;
  const lower = pathname.replace(/%[0-9A-Fa-f]{2}|[A-Z]+/g, (m) => (m[0] === "%" ? m : m.toLowerCase()));
  if (lower === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = lower;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // every address outside /_next, /assets, /_kq and /api (and the files Next.js serves at the root)
  matcher: ["/((?!_next/|assets/|_kq/|api/|favicon\\.ico$|icon\\.svg$|robots\\.txt$|sitemap\\.xml$|manifest\\.webmanifest$).*)"],
};
