import { NextResponse } from "next/server";

/**
 * Receives marketplace-review requests from /contact.
 * The submission is logged server-side and, if CONTACT_WEBHOOK_URL is set
 * (e.g. a Slack/CRM/email webhook or Formspree endpoint), forwarded there —
 * so the form "goes somewhere" without hard-coding a provider.
 */
export async function POST(req: Request) {
  let data: Record<string, unknown> = {};
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      data = await req.json();
    } else {
      const form = await req.formData();
      data = Object.fromEntries(form.entries());
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  if (!data.email || typeof data.email !== "string" || !data.email.includes("@")) {
    return NextResponse.json({ ok: false, error: "valid email required" }, { status: 422 });
  }

  const submission = { ...data, submittedAt: new Date().toISOString(), form: "marketplace-review" };
  console.log("[contact] marketplace review request:", JSON.stringify(submission));

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(submission),
      });
    } catch (e) {
      console.error("[contact] webhook forward failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
