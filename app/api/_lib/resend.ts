// Minimal Resend client (REST, no SDK) used by the form endpoints.
//
// Where submissions go:
//   - contact-form requests are emailed to the team (CONTACT_TO, default contact@kwontified.com),
//     with Reply-To set to the visitor so the team can answer straight from the inbox; a new
//     newsletter subscriber is announced to NEWSLETTER_TO (not again for an address already in
//     the segment)
//   - every visitor is saved as a Resend contact and added to a segment:
//       "Kwontified Briefing" for newsletter sign-ups (usable for Resend broadcasts). Subscribed
//         at once (single opt-in, the owner's choice). With double opt-in switched on
//         (MAILCHIMP_DOUBLE_OPT_IN=true, see sinks.ts doubleOptIn) and Mailchimp connected, a new
//         contact is created unsubscribed: Mailchimp sends the confirmation and holds the
//         confirmed list.
//       "Marketplace review requests" for the contact form. These people asked for a review,
//         not for email, so a new contact is created unsubscribed and no broadcast reaches them.
//     An existing contact's subscription is never changed here.
//
// Settings (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY   required; without it submissions are only logged
//   RESEND_FROM      sender, default "Kwontified website <website@kwontified.com>";
//                    the domain must be verified in Resend
//   CONTACT_TO       inbox for contact-form requests, default contact@kwontified.com
//   NEWSLETTER_TO    inbox told about new subscribers, default CONTACT_TO; "off" to disable
//   RESEND_SEGMENT_NEWSLETTER / RESEND_SEGMENT_REVIEWS   optional segment ids; when unset
//                    the segments are found by name, or created on first use
//
// Nothing here throws: a failed step is logged (without the visitor's address) and returns
// false. Neither form tells a visitor that a submission arrived when it reached nobody (since
// 2026-11-27): the contact form answers with an error unless the team email was sent or the
// sheet row was written (../contact/route.ts), and the newsletter form unless the address was
// stored in the Resend segment, the sheet or Mailchimp (../subscribe/route.ts).

import { redact } from "./guard";

const API = process.env.RESEND_API_BASE || "https://api.resend.com"; // override only for local testing

export const settings = () => {
  const contactTo = process.env.CONTACT_TO || "contact@kwontified.com";
  const newsletterTo = process.env.NEWSLETTER_TO || contactTo;
  return {
    key: process.env.RESEND_API_KEY || "",
    from: process.env.RESEND_FROM || "Kwontified website <website@kwontified.com>",
    contactTo,
    newsletterTo: newsletterTo === "off" ? "" : newsletterTo,
  };
};

async function call(path: string, init: { method: string; body?: unknown }) {
  const { key } = settings();
  const res = await fetch(API + path, {
    method: init.method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { ok: res.ok, status: res.status, json };
}

export async function sendEmail(msg: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const { key, from } = settings();
  if (!key || !msg.to) return false;
  const r = await call("/emails", {
    method: "POST",
    body: { from, to: [msg.to], subject: msg.subject, html: msg.html, text: msg.text, ...(msg.replyTo ? { reply_to: msg.replyTo } : {}) },
  });
  if (!r.ok) console.error("[resend] email failed", r.status, redact(JSON.stringify(r.json)));
  return r.ok;
}

const segmentCache = new Map<string, string>();

async function segmentId(name: string, envId?: string) {
  if (envId) return envId;
  if (segmentCache.has(name)) return segmentCache.get(name)!;
  const list = await call("/segments", { method: "GET" });
  const found = ((list.json as { data?: { id: string; name: string }[] })?.data || []).find((s) => s.name === name);
  let id = found?.id;
  if (!id) {
    const made = await call("/segments", { method: "POST", body: { name } });
    id = (made.json as { id?: string })?.id;
    if (!made.ok || !id) {
      console.error("[resend] could not find or create segment", name, made.status, redact(JSON.stringify(made.json)));
      return "";
    }
  }
  segmentCache.set(name, id);
  return id;
}

/**
 * Save the visitor as a contact and add them to the named segment. A new contact is created
 * with the given subscription; an existing one keeps its own. stored: the address is in the
 * segment now; already: it was there before this request.
 */
export async function saveContact(
  c: { email: string; firstName?: string; lastName?: string },
  segment: "newsletter" | "reviews",
  opts: { unsubscribed: boolean },
) {
  const none = { stored: false, already: false };
  if (!settings().key) return none;
  const created = await call("/contacts", {
    method: "POST",
    body: { email: c.email, first_name: c.firstName || undefined, last_name: c.lastName || undefined, unsubscribed: opts.unsubscribed },
  });
  // an existing contact is fine: it is still added to the segment below
  if (!created.ok && created.status !== 409 && created.status !== 422) {
    console.error("[resend] contact create failed", created.status, redact(JSON.stringify(created.json)));
  }
  const name = segment === "newsletter" ? "Kwontified Briefing" : "Marketplace review requests";
  const env = segment === "newsletter" ? process.env.RESEND_SEGMENT_NEWSLETTER : process.env.RESEND_SEGMENT_REVIEWS;
  const id = await segmentId(name, env);
  if (!id) return none;
  const contact = encodeURIComponent(c.email);
  const current = await call(`/contacts/${contact}/segments`, { method: "GET" });
  const already = current.ok && ((current.json as { data?: { id: string }[] })?.data || []).some((s) => s.id === id);
  if (already) return { stored: true, already };
  const added = await call(`/contacts/${contact}/segments/${id}`, { method: "POST" });
  if (!added.ok) console.error("[resend] add to segment failed", added.status, redact(JSON.stringify(added.json)));
  return { stored: added.ok, already: false };
}

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const isEmail = (s: unknown): s is string =>
  typeof s === "string" && s.length <= 254 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(s);
