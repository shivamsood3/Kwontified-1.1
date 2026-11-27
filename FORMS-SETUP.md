# Form destinations: Google Sheets and Mailchimp

Both forms already email the team and save the contact in Resend. Two more destinations
are built in and stay off until their environment variables are set in Vercel.

## What each form answers (since 2026-11-27)

- **Contact form** (`/api/contact`): success only when the team email was sent or the sheet
  row was written; otherwise the page says it did not send and offers the same request by email.
  The visitor is saved in Resend's "Marketplace review requests" segment as an **unsubscribed**
  contact (they asked for a review, not for email; no broadcast reaches them) and in Mailchimp
  as non-subscribed. An existing contact's subscription is left alone.
- **Newsletter form** (footer, `/api/subscribe`): success only when the address was stored in at
  least one place: the Resend "Kwontified Briefing" segment, the newsletter sheet or Mailchimp.
  Otherwise it answers 502 and the footer says "That didn't go through". With no
  `RESEND_API_KEY`, no sheet and no Mailchimp, every sign-up fails, honestly.
- **Team email for new subscribers** goes to `NEWSLETTER_TO` (default `CONTACT_TO`), not again
  for an address already in the segment. Set `NEWSLETTER_TO=off` to stop it (recommended once the
  list grows; a daily digest can come later).
- **Opt-in: single** (the owner's choice, 2026-11-27). A subscriber is added at once and no
  confirmation email is sent. Double opt-in is still built in: set `MAILCHIMP_DOUBLE_OPT_IN=true`
  and Mailchimp emails a confirmation link first (the Thank-you page then says "One step left"),
  and the Resend copy of a new subscriber is created unsubscribed until Mailchimp confirms them.

## Spam brakes (both forms, `app/api/_lib/guard.ts`)

- A request from another site's page is refused (403).
- A hidden field people never see, and the page's load time: a request with the field filled,
  or sent within two seconds of the page opening, is answered with success and dropped.
- At most 5 accepted requests per IP address in 10 minutes, per form (429). Only accepted
  requests count, so a mistyped address or a retry during an outage does not lock anyone out.
  The limit is kept per server instance: a brake, not a wall.
- At most 30 fields in a request.
- An email address must have a dot after the @ (the browser checks the same rule first). A
  field the server turns down comes back in a 422 answer and the page marks it.
- Without JavaScript the forms still work: the server answers with the Thank-you page, or sends
  the visitor back to the form with a note (`/contact?sent=0`, `?sent=wait`; `?nl=invalid`,
  `?nl=wait`, `?nl=failed` for the footer).

## Logs

The server log never holds what a visitor typed or their address: each request gets a short id,
and the log line names each destination's outcome and the email's domain only. Error text
returned by Resend or Mailchimp has addresses removed before it is logged.

## Google Sheets

Sheets (owned by jordan@kwontified.com):

- Newsletter sign-ups: https://docs.google.com/spreadsheets/d/1M0n6BbVqIvCRD_PE8M2tZ_Q2aXztE6CleaSAECRf6J8
- Contact form requests: https://docs.google.com/spreadsheets/d/1taG-zZP97yaV-RdaycNyoBEr9jB8Oqjcrsgr5nZfdPw

In each sheet: Extensions > Apps Script, paste the script below, set SECRET, then
Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone). Put the web
app URL in `NEWSLETTER_SHEET_WEBHOOK_URL` or `CONTACT_SHEET_WEBHOOK_URL`, and the same
secret in `SHEET_WEBHOOK_SECRET`.

```js
const SECRET = "choose-a-long-random-string";
// payload keys in the order of the sheet's columns
const KEYS = {
  newsletter: ["timestamp", "email", "page", "utm", "country"],
  contact: ["timestamp", "first_name", "last_name", "email", "job_title", "company", "website",
            "channels", "revenue", "goal", "notes", "page", "utm", "country", "finder", "from"],
};
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  if (d.secret !== SECRET) return ContentService.createTextOutput("forbidden");
  const keys = "first_name" in d || "company" in d ? KEYS.contact : KEYS.newsletter;
  // a leading apostrophe stops Sheets from running anything a visitor typed as a formula
  const cell = (v) => (/^[=+\-@]/.test(String(v || "")) ? "'" + v : v || "");
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow(keys.map((k) => cell(d[k])));
  return ContentService.createTextOutput("ok");
}
```

The site sends only the form's own fields plus timestamp, page, utm and country (the server's
values), with the secret last, so a submitted extra field cannot add a column or replace the
server's values or the secret.

Contact sheet columns, in order: timestamp, first name, last name, email, job title, company, website, channels, revenue, goal, notes, page, utm, country, finder, from. `goal` ("What you need help with") can hold several values, separated by commas. `finder` is what the visitor chose in the home page case finder, and `from` is the page they were on before the form. The last two were added on 2026-11-27; add the two column headings if the sheet already exists.

The contact form tells the visitor a request did not send unless the team email or this sheet accepted it, so connecting the sheet also gives the form a second way to succeed during a mail outage.

## Mailchimp

Full step-by-step guide: `MAILCHIMP-SETUP.md`. In short, use one audience for both forms and set:

- `MAILCHIMP_API_KEY` (Profile > Extras > API keys; it ends in the data center, e.g. `-us21`)
- `MAILCHIMP_NEWSLETTER_LIST_ID` and `MAILCHIMP_CONTACT_LIST_ID` (Audience > Settings > Audience name and defaults > Audience ID; the same ID for both)
- optionally `MAILCHIMP_DOUBLE_OPT_IN=true` to send a confirmation email first (off by default: single opt-in, the owner's choice)

Newsletter sign-ups are added as subscribed with the tag "Website newsletter" (an existing
contact is subscribed too). Contact form visitors did not ask for marketing email, so new ones
are added as non-subscribed contacts with the tag "Website contact form" and an existing
contact's status is left alone.
