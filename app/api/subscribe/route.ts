import { NextResponse } from "next/server";
import { esc, isEmail, saveContact, sendEmail, settings } from "../_lib/resend";
import { context, toMailchimp, toSheet } from "../_lib/sinks";

/**
 * "Get our marketplace briefing once a month" sign-up (footer of every page).
 * The subscriber is saved in Resend in the "Kwontified Briefing" segment, ready
 * for Resend broadcasts, and the team is told by email (NEWSLETTER_TO).
 */
export async function POST(req: Request) {
  let email = "";
  try {
    const ct = req.headers.get("content-type") || "";
    email = ct.includes("application/json")
      ? String((await req.json())?.email ?? "")
      : String((await req.formData()).get("email") ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }
  email = email.trim();
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "valid email required" }, { status: 422 });
  }

  console.log("[subscribe] newsletter sign-up:", JSON.stringify({ email, submittedAt: new Date().toISOString() }));

  const { newsletterTo, key } = settings();
  const ctx = context(req);
  const [saved] = await Promise.allSettled([
    saveContact({ email }, "newsletter"),
    toSheet("newsletter", { ...ctx, email }),
    toMailchimp("newsletter", { email }),
    newsletterTo
      ? sendEmail({
          to: newsletterTo,
          subject: `New briefing subscriber: ${email}`,
          text: `${email} subscribed to the Kwontified Briefing on kwontified.com.`,
          html: `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#262524">${esc(email)} subscribed to the Kwontified Briefing on kwontified.com.</p>`,
          replyTo: email,
        })
      : Promise.resolve(false),
  ]);
  if (!key) console.warn("[subscribe] RESEND_API_KEY is not set: the sign-up was logged only");

  return NextResponse.json({ ok: true, saved: saved.status === "fulfilled" && saved.value });
}
