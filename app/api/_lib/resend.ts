// Minimal Resend client (REST, no SDK) used by the form endpoints.
//
// Where submissions go:
//   - every submission is emailed to the team (CONTACT_TO, default contact@kwontified.com),
//     with Reply-To set to the visitor so the team can answer straight from the inbox
//   - every visitor is saved as a Resend contact and added to a segment:
//       "Kwontified Briefing" for newsletter sign-ups (usable for Resend broadcasts)
//       "Marketplace review requests" for the contact form
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
// Nothing here throws: a failed step is logged and returns false. The newsletter form still
// answers with success in that case. The contact form does not (since 2026-11-27): it answers
// with an error unless the team email was sent or the sheet row was written, so a visitor is
// never told a request arrived when it reached nobody (see ../contact/route.ts).

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
  if (!r.ok) console.error("[resend] email failed", r.status, JSON.stringify(r.json));
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
      console.error("[resend] could not find or create segment", name, made.status, JSON.stringify(made.json));
      return "";
    }
  }
  segmentCache.set(name, id);
  return id;
}

/** Save the visitor as a contact and add them to the named segment. */
export async function saveContact(c: { email: string; firstName?: string; lastName?: string }, segment: "newsletter" | "reviews") {
  if (!settings().key) return false;
  const created = await call("/contacts", {
    method: "POST",
    body: { email: c.email, first_name: c.firstName || undefined, last_name: c.lastName || undefined, unsubscribed: false },
  });
  // an existing contact is fine: it is still added to the segment below
  if (!created.ok && created.status !== 409 && created.status !== 422) {
    console.error("[resend] contact create failed", created.status, JSON.stringify(created.json));
  }
  const name = segment === "newsletter" ? "Kwontified Briefing" : "Marketplace review requests";
  const env = segment === "newsletter" ? process.env.RESEND_SEGMENT_NEWSLETTER : process.env.RESEND_SEGMENT_REVIEWS;
  const id = await segmentId(name, env);
  if (!id) return false;
  const added = await call(`/contacts/${encodeURIComponent(c.email)}/segments/${id}`, { method: "POST" });
  if (!added.ok) console.error("[resend] add to segment failed", added.status, JSON.stringify(added.json));
  return added.ok;
}

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const isEmail = (s: unknown): s is string =>
  typeof s === "string" && s.length <= 254 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(s);
