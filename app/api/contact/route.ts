import { esc, isEmail, saveContact, sendEmail, settings } from "../_lib/resend";
import { context, toMailchimp, toSheet } from "../_lib/sinks";
import { answer as reply, clientIp, crossSite, domainOf, limiter, logId, looksAutomated, readFields } from "../_lib/guard";

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
 * Spam (../_lib/guard.ts, shared with the newsletter form): a hidden field people never see, a
 * minimum time on the page, a same-site check (403) and at most 5 accepted requests per address
 * in 10 minutes (429). A request caught by the first two is answered with success and dropped,
 * so a bot learns nothing. A field the server turns down is named in a 422 answer
 * ({ fields: [...] }) so the page can mark it.
 *
 * Only the fields below are used: the sheet row is built from them, with the server's own
 * values (time, page, country) and the sheet's secret after them, so a submitted key cannot add
 * a column or replace them. The log records a request id, each destination's outcome and the
 * email's domain, never what the visitor typed.
 *
 * The visitor is saved in Resend's "Marketplace review requests" segment as an unsubscribed
 * contact (they asked for a review, not for email), and in Mailchimp as non-subscribed.
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

const brake = limiter();

export async function POST(req: Request) {
  const id = logId();
  const answer = (body: Record<string, unknown>, status: number) =>
    reply(req, body, status, () => (body.ok ? "/contact/thank-you" : status === 429 ? "/contact?sent=wait#send-wait" : "/contact?sent=0#send-failed"));

  // only from this site's own pages
  if (crossSite(req)) return answer({ ok: false, error: "cross-site request" }, 403);
  const data = await readFields(req, (k) => (k === "notes" ? 5000 : 500));
  if (!data) return answer({ ok: false, error: "invalid payload" }, 400);

  // bots: the hidden field is filled, or the form came back faster than a person can type it
  if (looksAutomated(data)) {
    console.warn(`[contact ${id}] dropped a request that looks automated`);
    return answer({ ok: true }, 200);
  }
  const ip = clientIp(req);
  if (brake.full(ip)) return answer({ ok: false, error: "too many requests" }, 429);

  const missing = REQUIRED.filter((k) => !data[k]);
  if (missing.length || !isEmail(data.email)) {
    const fields = missing.length ? missing : ["email"];
    return answer({ ok: false, error: missing.length ? "missing fields" : "valid email required", fields }, 422);
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

  // the sheet row: the form's own fields only, then the server's values
  const row = { ...Object.fromEntries(FIELDS.map(([k]) => [k, data[k] || ""])), ...context(req) };

  const [mailed, saved, sheet, mailchimp] = await Promise.allSettled([
    sendEmail({ to: settings().contactTo, subject, html, text, replyTo: data.email }),
    saveContact({ email: data.email, firstName: data.first_name, lastName: data.last_name }, "reviews", { unsubscribed: true }),
    toSheet("contact", row),
    toMailchimp("contact", { email: data.email, firstName: data.first_name, lastName: data.last_name }),
  ]);
  const emailed = mailed.status === "fulfilled" && mailed.value === true;
  const logged = sheet.status === "fulfilled" && sheet.value === true;
  const outcome =
    `team email=${emailed ? "sent" : "no"} sheet=${logged ? "saved" : "no"}` +
    ` resend=${saved.status === "fulfilled" && saved.value.stored ? "saved" : "no"} mailchimp=${mailchimp.status === "fulfilled" && mailchimp.value ? "saved" : "no"}`;
  if (!emailed && !logged) {
    console.error(
      `[contact ${id}] reached neither the team inbox nor the sheet (${outcome}, domain ${domainOf(data.email)}` +
        `${settings().key ? "" : ", RESEND_API_KEY not set"}); the visitor was told it did not send`,
    );
    return answer({ ok: false, error: "not delivered" }, 502);
  }
  brake.hit(ip);

  // a short receipt for the visitor; nothing they typed is repeated in it
  let confirmed = false;
  if (emailed && process.env.CONTACT_CONFIRMATION !== "off") {
    const lines = [
      "Thank you for your request. It has reached us.",
      "A senior team member will read it, and we will reply within one business day to suggest times for a discovery call. On the call we ask about your channels, your goals and your constraints. Afterwards we send a short written note on where we see the growth and what it would take.",
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

  console.log(`[contact ${id}] delivered (${outcome}, receipt ${confirmed ? "sent" : "not sent"}, domain ${domainOf(data.email)})`);
  return answer({ ok: true, emailed, confirmed }, 200);
}
