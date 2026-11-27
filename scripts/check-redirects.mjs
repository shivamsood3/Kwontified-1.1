// Checks that old addresses still lead somewhere: each must answer 200, or a permanent
// redirect (301/308) that ends on a 200 page of the same site within three hops.
// Not a build step. Run it against a running server (next start, a preview or production):
//   node scripts/check-redirects.mjs <base-url> [file ...]
// Each file lists old addresses, one per line (a path or a full URL; for a CSV export the
// first column is used; blank lines, headers and lines starting with # are skipped). With no
// file it checks every path in site-src/redirects.json. Exits 1 if any address fails.
// Use it on the owner's live-site URL export (F062) and again within 48 hours of launch.
import fs from "node:fs";

const [base, ...files] = process.argv.slice(2);
if (!base) {
  console.error("usage: node scripts/check-redirects.mjs <base-url> [file ...]");
  process.exit(2);
}
const origin = new URL(base).origin;

const toPath = (s) => {
  const t = s.trim().replace(/^"|"$/g, "");
  if (/^https?:\/\//i.test(t)) {
    const u = new URL(t);
    return u.pathname + u.search;
  }
  return t.startsWith("/") ? t : null;
};
const list = files.length
  ? files.flatMap((f) => fs.readFileSync(f, "utf8").split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#")).map((l) => toPath(l.split(",")[0])))
  : Object.keys(JSON.parse(fs.readFileSync("site-src/redirects.json", "utf8")).paths);
const paths = [...new Set(list.filter(Boolean))];

async function check(p) {
  let url = origin + p;
  const hops = [];
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { redirect: "manual" });
    if (r.status === 200) return { ok: hops.every((h) => h === 301 || h === 308), note: hops.length ? `${hops.join(" > ")} > 200 ${new URL(url).pathname}` : "200" };
    if (![301, 302, 303, 307, 308].includes(r.status)) return { ok: false, note: `${hops.concat(r.status).join(" > ")} ${new URL(url).pathname}` };
    hops.push(r.status);
    const next = new URL(r.headers.get("location"), url);
    if (next.origin !== origin) return { ok: false, note: `${hops.join(" > ")} leaves the site: ${next.href}` };
    url = next.href;
  }
  return { ok: false, note: `more than three redirects (${hops.join(" > ")})` };
}

let fail = 0;
for (let i = 0; i < paths.length; i += 8) {
  const batch = paths.slice(i, i + 8);
  const res = await Promise.all(batch.map(check));
  res.forEach((r, k) => {
    if (!r.ok) fail++;
    console.log(`${r.ok ? "PASS" : "FAIL"} ${batch[k]}  ${r.note}`);
  });
}
console.log(`\n${paths.length - fail} of ${paths.length} old addresses lead to a page${fail ? `; ${fail} FAIL` : ""}`);
process.exit(fail ? 1 : 0);
