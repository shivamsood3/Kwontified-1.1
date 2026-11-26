import { createHash } from "node:crypto";

/**
 * Extra destinations for form submissions: a Google Sheet (through an Apps Script
 * web app) and a Mailchimp audience. Each one is skipped unless its environment
 * variables are set, so the forms keep working without them. See FORMS-SETUP.md.
 *
 *   NEWSLETTER_SHEET_WEBHOOK_URL / CONTACT_SHEET_WEBHOOK_URL   Apps Script web app URLs
 *   SHEET_WEBHOOK_SECRET                                       shared secret checked by the script
 *   MAILCHIMP_API_KEY                                          ends in the data centre, e.g. "-us21"
 *   MAILCHIMP_NEWSLETTER_LIST_ID / MAILCHIMP_CONTACT_LIST_ID   audience IDs
 */
export type Kind = "newsletter" | "contact";

/** Where and when the form was sent: the first columns of every sheet row. */
export function context(req: Request) {
  const page = req.headers.get("referer") || "";
  let utm = "";
  try {
    const q = new URL(page).searchParams;
    utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => q.get(k)).filter(Boolean).join(" / ");
  } catch {}
  return {
    timestamp: new Date().toISOString(),
    page,
    utm,
    country: req.headers.get("x-vercel-ip-country") || "",
  };
}

export async function toSheet(kind: Kind, row: Record<string, string>) {
  const url = kind === "newsletter" ? process.env.NEWSLETTER_SHEET_WEBHOOK_URL : process.env.CONTACT_SHEET_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret: process.env.SHEET_WEBHOOK_SECRET || "", ...row }),
  });
  if (!res.ok) console.error(`[${kind}] sheet webhook answered ${res.status}`);
  return res.ok;
}

export async function toMailchimp(kind: Kind, c: { email: string; firstName?: string; lastName?: string }) {
  const key = process.env.MAILCHIMP_API_KEY || "";
  const list = kind === "newsletter" ? process.env.MAILCHIMP_NEWSLETTER_LIST_ID : process.env.MAILCHIMP_CONTACT_LIST_ID;
  const dc = key.split("-")[1];
  if (!key || !list || !dc) return false;
  const id = createHash("md5").update(c.email.toLowerCase()).digest("hex");
  const merge: Record<string, string> = {};
  if (c.firstName) merge.FNAME = c.firstName;
  if (c.lastName) merge.LNAME = c.lastName;
  const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${list}/members/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json", authorization: `Basic ${Buffer.from(`key:${key}`).toString("base64")}` },
    body: JSON.stringify({
      email_address: c.email,
      // newsletter sign-ups asked for email; contact-form visitors did not, so they are
      // stored as contacts that marketing campaigns cannot be sent to
      status_if_new: kind === "newsletter" ? "subscribed" : "transactional",
      merge_fields: merge,
      tags: [kind === "newsletter" ? "Website newsletter" : "Website contact form"],
    }),
  });
  if (!res.ok) console.error(`[${kind}] Mailchimp answered ${res.status}`);
  return res.ok;
}
