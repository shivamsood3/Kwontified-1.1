import { createHash } from "node:crypto";
import { redact } from "./guard";

/**
 * Extra destinations for form submissions: a Google Sheet (through an Apps Script
 * web app) and a Mailchimp audience. Each one is skipped unless its environment
 * variables are set, so the forms keep working without them. See FORMS-SETUP.md.
 *
 *   NEWSLETTER_SHEET_WEBHOOK_URL / CONTACT_SHEET_WEBHOOK_URL   Apps Script web app URLs
 *   SHEET_WEBHOOK_SECRET                                       shared secret checked by the script
 *   MAILCHIMP_API_KEY                                          ends in the data centre, e.g. "-us21"
 *   MAILCHIMP_NEWSLETTER_LIST_ID / MAILCHIMP_CONTACT_LIST_ID   audience IDs (can be the same audience)
 *   MAILCHIMP_DOUBLE_OPT_IN                                    "true" for double opt-in on newsletter
 *                                                              sign-ups; off by default (see doubleOptIn)
 */
export type Kind = "newsletter" | "contact";

/**
 * Double opt-in: a newsletter sign-up is "pending" in Mailchimp until the person confirms by
 * email, and the Resend copy of a new contact is created unsubscribed until then. Off by
 * default: the owner chose single opt-in on 2026-11-27 (subscribers are added at once, no
 * confirmation email). Set MAILCHIMP_DOUBLE_OPT_IN=true in Vercel to turn it on.
 */
export const doubleOptIn = () => process.env.MAILCHIMP_DOUBLE_OPT_IN === "true";

const mailchimpList = (kind: Kind) =>
  kind === "newsletter" ? process.env.MAILCHIMP_NEWSLETTER_LIST_ID : process.env.MAILCHIMP_CONTACT_LIST_ID;

/** Mailchimp is connected for this form (key with its data centre, and an audience). */
export const mailchimpReady = (kind: Kind) => {
  const key = process.env.MAILCHIMP_API_KEY || "";
  return !!(key && key.split("-")[1] && mailchimpList(kind));
};

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

/** One row; the caller builds it from known fields only. The secret goes last so no field can replace it. */
export async function toSheet(kind: Kind, row: Record<string, string>) {
  const url = kind === "newsletter" ? process.env.NEWSLETTER_SHEET_WEBHOOK_URL : process.env.CONTACT_SHEET_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...row, secret: process.env.SHEET_WEBHOOK_SECRET || "" }),
  });
  if (!res.ok) console.error(`[${kind}] sheet webhook answered ${res.status}`);
  return res.ok;
}

export async function toMailchimp(kind: Kind, c: { email: string; firstName?: string; lastName?: string }) {
  if (!mailchimpReady(kind)) return false;
  const key = process.env.MAILCHIMP_API_KEY || "";
  const list = mailchimpList(kind);
  const dc = key.split("-")[1];
  const member = `https://${dc}.api.mailchimp.com/3.0/lists/${list}/members/${createHash("md5").update(c.email.toLowerCase()).digest("hex")}`;
  const headers = { "content-type": "application/json", authorization: `Basic ${Buffer.from(`key:${key}`).toString("base64")}` };
  const merge: Record<string, string> = {};
  if (c.firstName) merge.FNAME = c.firstName;
  if (c.lastName) merge.LNAME = c.lastName;
  // Newsletter sign-ups asked for email, so they are subscribed even if they were already in
  // the audience from the contact form. With double opt-in (MAILCHIMP_DOUBLE_OPT_IN=true) Mailchimp first
  // sends a confirmation email ("pending"). Contact-form visitors did not ask for marketing
  // email: new ones are stored as non-subscribed ("transactional") and an existing
  // contact's status is left alone.
  const optIn = doubleOptIn() ? "pending" : "subscribed";
  const put = (status?: string) =>
    fetch(`${member}?skip_merge_validation=true`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        email_address: c.email,
        status_if_new: kind === "newsletter" ? optIn : "transactional",
        ...(status ? { status } : {}),
        merge_fields: merge,
      }),
    });
  // Step 1 adds the person if they are new and leaves an existing member's status alone, so
  // nobody who is already subscribed is sent back to "pending".
  let res = await put();
  let state = "";
  if (res.ok) {
    state = String(((await res.json().catch(() => ({}))) as { status?: string }).status || "");
    if (kind === "newsletter") {
      // Step 2, only where the sign-up changes something: a contact-form visitor who now asks
      // for the newsletter is opted in, and someone who unsubscribed earlier (or is archived)
      // can only rejoin by confirming by email.
      const want = state === "transactional" ? optIn : state === "unsubscribed" || state === "archived" ? "pending" : "";
      if (want) {
        res = await put(want);
        if (!res.ok && res.status === 400 && want === "subscribed") res = await put("pending");
        if (res.ok) state = String(((await res.json().catch(() => ({}))) as { status?: string }).status || want);
      }
    }
  }
  if (!res.ok) {
    console.error(`[${kind}] Mailchimp answered ${res.status}: ${redact((await res.text()).slice(0, 300))}`);
    return false;
  }
  // tags are not part of the add-or-update call; they have their own endpoint
  const tag = await fetch(`${member}/tags`, {
    method: "POST",
    headers,
    body: JSON.stringify({ tags: [{ name: kind === "newsletter" ? "Website newsletter" : "Website contact form", status: "active" }] }),
  });
  if (!tag.ok) console.error(`[${kind}] Mailchimp tag answered ${tag.status}`);
  // the member's status after the call: "pending" means Mailchimp has emailed a confirmation link
  return state || true;
}
