import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * Brakes shared by the form endpoints (/api/contact and /api/subscribe), and the small
 * helpers both need to read a submission and answer it.
 *
 *   - same-site check: a request whose Origin is another site is refused (403)
 *   - a hidden field people never see (HONEYPOT) and the page's load time ("t"): a request
 *     with the field filled, or sent within two seconds of the page opening, is answered with
 *     success and dropped, so a bot learns nothing
 *   - a per-address limit: at most 5 accepted requests in 10 minutes from one IP, per form
 *     (per server instance: a brake, not a wall). Only requests that were accepted count, so a
 *     visitor who mistyped an address, or retried during an outage, is not locked out.
 *   - at most MAX_KEYS fields in a body
 *
 * Logging: never the visitor's address or what they typed. logId() gives each request a short
 * id; domainOf() gives the part of the address after the @; redact() removes any address from
 * text an outside service sent back before it is logged.
 */

export const HONEYPOT = "contact_me_by_fax_only";
export const MAX_KEYS = 30;
const MIN_MS = 2000;

/** True when the request came from another site's page. */
export function crossSite(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  if (!origin || !host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

/** A browser posting a form without the page's script wants a page back, not JSON. */
export const wantsPage = (req: Request) =>
  !req.headers.get("x-kq-form") && (req.headers.get("accept") || "").includes("text/html");

/**
 * The submitted fields, trimmed and cut to length (repeated fields, such as checkboxes, keep
 * every value). null when the body cannot be read or has more than MAX_KEYS fields.
 */
export async function readFields(req: Request, maxLength: (key: string) => number = () => 500) {
  const data: Record<string, string> = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await req.json();
      if (!body || typeof body !== "object" || Array.isArray(body)) return null;
      const entries = Object.entries(body);
      if (entries.length > MAX_KEYS) return null;
      for (const [k, v] of entries) data[k] = Array.isArray(v) ? v.join(", ") : String(v ?? "");
    } else {
      const form = await req.formData();
      const keys = new Set(form.keys());
      if (keys.size > MAX_KEYS) return null;
      for (const key of keys) data[key] = form.getAll(key).map(String).join(", ");
    }
  } catch {
    return null;
  }
  for (const k of Object.keys(data)) data[k] = data[k].trim().slice(0, maxLength(k));
  return data;
}

/** The hidden field is filled, or the form came back faster than a person can fill it. */
export function looksAutomated(data: Record<string, string>) {
  const opened = Number(data.t || 0);
  return !!data[HONEYPOT] || (opened > 0 && Date.now() - opened < MIN_MS);
}

export const clientIp = (req: Request) => (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";

/** At most `limit` accepted requests per address in `windowMs`. One per form. */
export function limiter(limit = 5, windowMs = 10 * 60 * 1000) {
  const seen = new Map<string, number[]>();
  const recent = (ip: string, now: number) => (seen.get(ip) || []).filter((t) => now - t < windowMs);
  return {
    /** true when this address has used up its allowance; counts nothing */
    full(ip: string) {
      return recent(ip, Date.now()).length >= limit;
    },
    /** count one accepted request */
    hit(ip: string) {
      const now = Date.now();
      seen.set(ip, [...recent(ip, now), now]);
      if (seen.size > 5000) for (const [k, v] of seen) if (!v.some((t) => now - t < windowMs)) seen.delete(k);
    },
  };
}

/** JSON for the page's script, or a 303 to a page for a browser without it. */
export function answer(req: Request, body: Record<string, unknown>, status: number, page: () => string) {
  return wantsPage(req) ? NextResponse.redirect(new URL(page(), req.url), 303) : NextResponse.json(body, { status });
}

export const logId = () => randomUUID().slice(0, 8);

export const domainOf = (email: string) => (email.includes("@") ? email.slice(email.lastIndexOf("@") + 1).toLowerCase() : "");

export const redact = (s: string) => s.replace(/[^\s@<>"'(),;:]+@[^\s@<>"'(),;:]+/g, "<address>");
