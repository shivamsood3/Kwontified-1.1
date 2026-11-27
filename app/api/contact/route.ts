import { NextResponse } from "next/server";
import { esc, isEmail, saveContact, sendEmail, settings } from "../_lib/resend";
import { context, toMailchimp, toSheet } from "../_lib/sinks";

/**
 * "Request a marketplace review" form (/contact). The page's script
 * (scripts/site-contact.mjs) sends the fields here and opens the Thank-you page only when
 * this answers { ok: true }.
 *
 * A request counts as delivered when the team was emailed or the row reached the Google
 * Sheet. If neither happened the answer is an error, so the visitor is told and can try
 * again or send the same request by email. (Until 2026-11-27 every request was answered
 * with success, including ones that reached nobody.)
 *
 * Spam: a hidden field people never see, a minimum time on the page, a same-site check and
 * a small per-address limit. A request caught by the first two is answered with success and
 * dropped, so a bot learns nothing.
 *
 * The visitor gets a short confirmation email. It contains nothing they typed, so the form
 * cannot be used to send someone else a message. Set CONTACT_CONFIRMATION=off to disable it.
 */

// in the form's order, with the form's own labels
const FIELDS: [string, string][] = [
  ["first_name", "First name"],
  ["last_name", "Last name"],
  ["email", "Work email"],
  ["company", "Company or brand"],
  ["website", "Brand website"],
  ["notes", "What they want to achieve"],
  ["job_title", "Job title"],
  ["channels", "Where they sell"],
  ["revenue", "Annual e-commerce revenue"],
  ["goal", "What they need help with"],
  ["finder", "Case finder answers"],
  ["from", "Page before the form"],
];
const REQUIRED = ["first_name", "last_name", "email", "company", "website", "notes"];
const HONEYPOT = "contact_me_by_fax_only";

// at most 5 requests in 10 minutes from one address (per server instance: a brake, not a wall)
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const seen = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const times = (seen.get(ip) || []).filter((t) => now - t < WINDOW);
  times.push(now);
  seen.set(ip, times);
  if (seen.size > 5000) for (const [k, v] of seen) if (!v.some((t) => now - t < WINDOW)) seen.delete(k);
  return times.length > LIMIT;
}

export async function POST(req: Request) {
  // a browser posting the form without the page's script wants a page back, not JSON
  const plain = !req.headers.get("x-kq-form") && (req.headers.get("accept") || "").includes("text/html");
  const answer = (body: Record<string, unknown>, status: number) =>
    plain
      ? NextResponse.redirect(new URL(body.ok ? "/contact/thank-you" : "/contact?sent=0#send-failed", req.url), 303)
      : NextResponse.json(body, { status });

  // only from this site's own pages
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  if (origin && host) {
    let from = "";
    try {
      from = new URL(origin).host;
    } catch {}
    if (from !== host) return answer({ ok: false, error: "cross-site request" }, 403);
  }

  const data: Record<string, string> = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      for (const [k, v] of Object.entries(await req.json())) data[k] = Array.isArray(v) ? v.join(", ") : String(v ?? "");
    } else {
      const form = await req.formData();
      // repeated fields (the "channels" and "goal" checkboxes) keep every value
      for (const key of new Set(form.keys())) data[key] = form.getAll(key).map(String).join(", ");
    }
  } catch {
    return answer({ ok: false, error: "invalid payload" }, 400);
  }
  for (const k of Object.keys(data)) data[k] = data[k].trim().slice(0, k === "notes" ? 5000 : 500);

  // bots: the hidden field is filled, or the form came back faster than a person can type it
  const opened = Number(data.t || 0);
  if (data[HONEYPOT] || (opened > 0 && Date.now() - opened < 2000)) {
    console.warn("[contact] dropped a request that looks automated");
    return answer({ ok: true }, 200);
  }
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return answer({ ok: false, error: "too many requests" }, 429);

  const missing = REQUIRED.filter((k) => !data[k]);
  if (missing.length || !isEmail(data.email)) {
    return answer({ ok: false, error: missing.length ? "missing fields" : "valid email required", fields: missing }, 422);
  }
  delete data.t;
  delete data[HONEYPOT];

  const rows = FIELDS.filter(([k]) => data[k]);
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || data.email;
  const subject = `Marketplace review request: ${name}${data.company ? `, ${data.company}` : ""}`;
  const text = rows.map(([k, label]) => `${label}: ${data[k]}`).join("\n") + "\n\nReply to this email to answer the request.";
  const html =
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#262524;font-size:15px;line-height:1.5">` +
    `<p style="margin:0 0 16px;font-size:20px;color:#102A4C">New marketplace review request</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">` +
    rows
      .map(
        ([k, label]) =>
          `<tr><td style="padding:6px 18px 6px 0;color:#626366;vertical-align:top;white-space:nowrap">${esc(label)}</td>` +
          `<td style="padding:6px 0;white-space:pre-wrap">${esc(data[k])}</td></tr>`,
      )
      .join("") +
    `</table><p style="margin:20px 0 0;color:#626366">Reply to this email to answer ${esc(name)} directly.</p></div>`;

  console.log("[contact] marketplace review request:", JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));

  const [mailed, , sheet] = await Promise.allSettled([
    sendEmail({ to: settings().contactTo, subject, html, text, replyTo: data.email }),
    saveContact({ email: data.email, firstName: data.first_name, lastName: data.last_name }, "reviews"),
    toSheet("contact", { ...context(req), ...data }),
    toMailchimp("contact", { email: data.email, firstName: data.first_name, lastName: data.last_name }),
  ]);
  const emailed = mailed.status === "fulfilled" && mailed.value === true;
  const logged = sheet.status === "fulfilled" && sheet.value === true;
  if (!emailed && !logged) {
    console.error(
      settings().key
        ? "[contact] the request reached neither the team inbox nor the sheet; the visitor was told it did not send"
        : "[contact] RESEND_API_KEY is not set and no sheet is connected: the request was logged only; the visitor was told it did not send",
    );
    return answer({ ok: false, error: "not delivered" }, 502);
  }

  // a short receipt for the visitor; nothing they typed is repeated in it
  let confirmed = false;
  if (emailed && process.env.CONTACT_CONFIRMATION !== "off") {
    const lines = [
      "Thank you for your request. It has reached us.",
      "A managing partner will read it, and we will reply within one business day to suggest times for a discovery call. On the call we ask about your channels, your goals and your constraints. Afterwards we send a short written note on where we see the growth and what it would take.",
      "If something changes before we speak, reply to this email.",
      "Kwontified\n7000 Central Parkway, Suite 1100, Atlanta, GA 30328\n404.873.9148",
      "You are receiving this because this address was entered in the review request form on kwontified.com. If that was not you, ignore this email and we will not write again.",
    ];
    confirmed = await sendEmail({
      to: data.email,
      subject: "We received your marketplace review request",
      text: lines.join("\n\n"),
      html:
        `<div style="font-family:Helvetica,Arial,sans-serif;color:#262524;font-size:15px;line-height:1.55;max-width:560px">` +
        lines
          .map((l, i) => `<p style="margin:0 0 16px${i >= 3 ? ";color:#626366;font-size:13px" : ""}">${esc(l).replace(/\n/g, "<br>")}</p>`)
          .join("") +
        `</div>`,
      replyTo: settings().contactTo,
    }).catch(() => false);
  }

  return answer({ ok: true, emailed, confirmed }, 200);
}
