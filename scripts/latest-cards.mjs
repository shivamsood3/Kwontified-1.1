// The three newest articles on the Perspectives index, as cards for the newsletter
// confirmation page. site-content.mjs writes them when it builds that page;
// site-archive.mjs writes them again once the archive is on the index, so the page
// always shows what was published last.
const MON = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
export const OPEN = "<!--kq-latest-->", CLOSE = "<!--/kq-latest-->";
const CARD = 'style="color: #262524; text-decoration: none; display: block; background: #FDFCFA; padding: 28px 32px; border-top: 3px solid #DCBF85"';

export function latestCards(indexHtml, n = 3) {
  const main = indexHtml.slice(indexHtml.indexOf("<main"));
  const seen = new Set(), items = [];
  for (const m of main.matchAll(/<article\b([^>]*\bdata-date="(\d{4})-(\d\d)-(\d\d)"[^>]*)>([\s\S]*?)<\/article>/g)) {
    const [, attrs, y, mo, d, body] = m;
    const a = body.match(/<a\b[^>]*href="(\/perspectives\/[^"#]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!a || seen.has(a[1])) continue;
    seen.add(a[1]);
    const attr = (k) => (attrs.match(new RegExp(`data-${k}="([^"]*)"`)) || [])[1] || "";
    const title = a[2].replace(/<[^>]+>/g, "").trim();
    if (!title) continue;
    items.push({ date: `${y}-${mo}-${d}`, href: a[1], title, meta: [attr("topic"), attr("author"), `${MON[+mo - 1]} ${+d}, ${y}`].filter(Boolean).join(". ") });
  }
  items.sort((p, q) => (p.date < q.date ? 1 : p.date > q.date ? -1 : 0));
  if (items.length < n) throw new Error(`latest-cards: only ${items.length} articles found on the Perspectives index`);
  return OPEN + items.slice(0, n).map((x) =>
    `<a href="${x.href}" ${CARD}><p style="margin: 0; font-size: 15px; color: #626366">${x.meta}</p><h3 style="margin: 8px 0 0; font-weight: 500; font-size: 22px; line-height: 1.3">${x.title}</h3></a>`).join("") + CLOSE;
}

export function fillLatest(pageHtml, indexHtml) {
  const a = pageHtml.indexOf(OPEN), b = pageHtml.indexOf(CLOSE);
  if (a < 0 || b < a) throw new Error("latest-cards: marker not found on the confirmation page");
  return pageHtml.slice(0, a) + latestCards(indexHtml) + pageHtml.slice(b + CLOSE.length);
}
