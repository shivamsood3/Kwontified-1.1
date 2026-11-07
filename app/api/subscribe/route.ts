import { NextResponse } from "next/server";

/**
 * Receives newsletter sign-ups ("Get our marketplace briefing once a month").
 * Logged server-side and forwarded to NEWSLETTER_WEBHOOK_URL when set.
 */
export async function POST(req: Request) {
  let email = "";
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      email = (await req.json())?.email ?? "";
    } else {
      email = String((await req.formData()).get("email") ?? "");
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "valid email required" }, { status: 422 });
  }

  const submission = { email, submittedAt: new Date().toISOString(), form: "newsletter" };
  console.log("[subscribe] newsletter sign-up:", JSON.stringify(submission));

  const hook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch (e) {
      console.error("[subscribe] webhook forward failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
