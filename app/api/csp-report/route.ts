// Receives the browser's reports for the report-only Content-Security-Policy (next.config.ts)
// and writes one short line per report to the server log ("csp-report"), so the policy can be
// checked against real traffic before it is enforced. Nothing is stored.
// Accepts the older report-uri format ({"csp-report": {...}}) and the Reporting API format
// ([{type: "csp-violation", body: {...}}]).
const MAX_BYTES = 16 * 1024;

type Report = Record<string, unknown>;
const pick = (r: Report, ...keys: string[]) => {
  for (const k of keys) if (typeof r[k] === "string" && r[k]) return String(r[k]).slice(0, 200);
  return "";
};
// log the page and the blocked host or keyword only, never a full address with a query string
const short = (u: string) => {
  try {
    const x = new URL(u);
    return x.origin + x.pathname;
  } catch {
    return u;
  }
};

export async function POST(req: Request) {
  const text = await req.text().catch(() => "");
  if (!text || text.length > MAX_BYTES) return new Response(null, { status: 204 });
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return new Response(null, { status: 204 });
  }
  const reports: Report[] = Array.isArray(data)
    ? data.filter((e) => e && typeof e === "object" && e.body).map((e) => e.body as Report)
    : data && typeof data === "object" && (data as Report)["csp-report"]
      ? [(data as Report)["csp-report"] as Report]
      : [];
  for (const r of reports.slice(0, 20)) {
    console.log(
      "[csp-report]",
      JSON.stringify({
        page: short(pick(r, "document-uri", "documentURL")),
        directive: pick(r, "effective-directive", "effectiveDirective", "violated-directive"),
        blocked: short(pick(r, "blocked-uri", "blockedURL")),
        line: pick(r, "source-file", "sourceFile") ? `${short(pick(r, "source-file", "sourceFile"))}:${r["line-number"] ?? r.lineNumber ?? ""}` : "",
      }),
    );
  }
  return new Response(null, { status: 204 });
}
