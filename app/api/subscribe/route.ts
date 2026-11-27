import { esc, isEmail, saveContact, sendEmail, settings } from "../_lib/resend";
import { context, doubleOptIn, mailchimpReady, toMailchimp, toSheet } from "../_lib/sinks";
import { answer, clientIp, crossSite, domainOf, limiter, logId, looksAutomated, readFields } from "../_lib/guard";

/**
 * "Get our marketplace briefing once a month" sign-up (footer of every page).
 *
 * The address is stored in up to three places: the Resend segment "Kwontified Briefing", the
 * newsletter Google Sheet and the Mailchimp audience (each only when connected). The answer is
 * success only when at least one of them stored it; otherwise 502, and the footer says the
 * sign-up did not go through. (Until 2026-11-27 every well-formed address was answered with
 * success, including ones stored nowhere.) The team is told about a new subscriber by email
 * (NEWSLETTER_TO; "off" to stop), but not again for an address already in the segment.
 *
 * Brakes (../_lib/guard.ts): same-site check (403), hidden field and minimum time (answered
 * with success and dropped), at most 5 accepted sign-ups per address in 10 minutes (429).
 * Single opt-in by default (the owner's choice); MAILCHIMP_DOUBLE_OPT_IN=true switches on double
 * opt-in (../_lib/sinks.ts).
 *
 * The footer's script sends the form with an x-kq-form header and reads the JSON. A browser
 * without JavaScript posts the form itself and is sent to /subscribe/thank-you, or back to its
 * page with ?nl=invalid|wait|failed, which the footer shows as a note under the form.
 */
const brake = limiter();

export async function POST(req: Request) {
  const id = logId();
  const back = (reason: string) => () => {
    let page = "/";
    try {
      const from = new URL(req.headers.get("referer") || "");
      if (from.host === new URL(req.url).host && from.pathname.startsWith("/") && !from.pathname.startsWith("/api/")) page = from.pathname;
    } catch {}
    return `${page}?nl=${reason}#newsletter-email`;
  };
  const done = (confirm: boolean) => () => `/subscribe/thank-you${confirm ? "?confirm=1" : ""}`;

  if (crossSite(req)) return answer(req, { ok: false, error: "cross-site request" }, 403, back("failed"));
  const data = await readFields(req);
  if (!data) return answer(req, { ok: false, error: "invalid payload" }, 400, back("failed"));
  if (looksAutomated(data)) {
    console.warn(`[subscribe ${id}] dropped a request that looks automated`);
    return answer(req, { ok: true, confirm: false }, 200, done(false));
  }
  const ip = clientIp(req);
  if (brake.full(ip)) return answer(req, { ok: false, error: "too many requests" }, 429, back("wait"));
  const email = data.email || "";
  if (!isEmail(email)) return answer(req, { ok: false, error: "valid email required", fields: ["email"] }, 422, back("invalid"));

  const ctx = context(req);
  const [saved, sheet, mailchimp] = await Promise.allSettled([
    // with double opt-in, Mailchimp sends the confirmation; until then the Resend copy is unsubscribed
    saveContact({ email }, "newsletter", { unsubscribed: doubleOptIn() && mailchimpReady("newsletter") }),
    toSheet("newsletter", { timestamp: ctx.timestamp, email, page: ctx.page, utm: ctx.utm, country: ctx.country }),
    toMailchimp("newsletter", { email }),
  ]);
  const inSegment = saved.status === "fulfilled" && saved.value.stored;
  const already = saved.status === "fulfilled" && saved.value.already;
  const inSheet = sheet.status === "fulfilled" && sheet.value === true;
  const inMailchimp = mailchimp.status === "fulfilled" && !!mailchimp.value;
  const outcome = `resend=${inSegment ? (already ? "already" : "saved") : "no"} sheet=${inSheet ? "saved" : "no"} mailchimp=${inMailchimp ? mailchimp.value : "no"}`;

  if (!inSegment && !inSheet && !inMailchimp) {
    console.error(`[subscribe ${id}] not stored anywhere (${outcome}, domain ${domainOf(email)}${settings().key ? "" : ", RESEND_API_KEY not set"}); the visitor was told it did not go through`);
    return answer(req, { ok: false, error: "not delivered" }, 502, back("failed"));
  }
  brake.hit(ip);

  // tell the team about a new subscriber (not about one already in the segment)
  const { newsletterTo } = settings();
  let told = false;
  if (newsletterTo && !already) {
    told = await sendEmail({
      to: newsletterTo,
      subject: `New briefing subscriber: ${email}`,
      text: `${email} subscribed to the Kwontified Briefing on kwontified.com.`,
      html: `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#262524">${esc(email)} subscribed to the Kwontified Briefing on kwontified.com.</p>`,
      replyTo: email,
    }).catch(() => false);
  }
  console.log(`[subscribe ${id}] stored (${outcome}, team ${told ? "told" : "not told"}, domain ${domainOf(email)})`);

  // confirm: Mailchimp has sent this person a confirmation email (double opt-in, or rejoining
  // after unsubscribing), so the confirmation page asks them to open it instead of saying
  // they are subscribed.
  const confirm = inMailchimp && mailchimp.status === "fulfilled" && mailchimp.value === "pending";
  return answer(req, { ok: true, saved: inSegment, confirm }, 200, done(confirm));
}
