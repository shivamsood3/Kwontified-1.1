import { NextResponse } from "next/server";
import { esc, isEmail, saveContact, sendEmail, settings } from "../_lib/resend";
import { context, toMailchimp, toSheet } from "../_lib/sinks";

/**
 * "Request a marketplace review" form (/contact). The form hook added by
 * scripts/build-site.mjs sends the fields here; the design's own handler then
 * shows the Thank-you page. Each request is emailed to the team (Reply-To: the
 * visitor) and the visitor is saved in Resend (see ../_lib/resend.ts).
 */

// in the form's order, with the form's own labels
const FIELDS: [string, string][] = [
  ["first_name", "First name"],
  ["last_name", "Last name"],
  ["email", "Work email"],
  ["job_title", "Job title"],
  ["company", "Company or brand"],
  ["website", "Brand website"],
  ["channels", "Where you sell"],
  ["revenue", "Annual ecommerce revenue"],
  ["goal", "Main goal"],
  ["notes", "What are you trying to achieve?"],
];

export async function POST(req: Request) {
  const data: Record<string, string> = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      for (const [k, v] of Object.entries(await req.json())) data[k] = Array.isArray(v) ? v.join(", ") : String(v ?? "");
    } else {
      const form = await req.formData();
      // repeated fields (the "channels" checkboxes) keep every value
      for (const key of new Set(form.keys())) data[key] = form.getAll(key).map(String).join(", ");
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }
  for (const k of Object.keys(data)) data[k] = data[k].trim().slice(0, k === "notes" ? 5000 : 500);

  if (!isEmail(data.email)) {
    return NextResponse.json({ ok: false, error: "valid email required" }, { status: 422 });
  }

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

  const [mailed, saved] = await Promise.allSettled([
    sendEmail({ to: settings().contactTo, subject, html, text, replyTo: data.email }),
    saveContact({ email: data.email, firstName: data.first_name, lastName: data.last_name }, "reviews"),
    toSheet("contact", { ...context(req), ...data }),
    toMailchimp("contact", { email: data.email, firstName: data.first_name, lastName: data.last_name }),
  ]);
  if (!settings().key) console.warn("[contact] RESEND_API_KEY is not set: the request was logged only");

  return NextResponse.json({
    ok: true,
    emailed: mailed.status === "fulfilled" && mailed.value,
    saved: saved.status === "fulfilled" && saved.value,
  });
}
