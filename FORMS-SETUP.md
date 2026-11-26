# Form destinations: Google Sheets and Mailchimp

Both forms already email the team and save the contact in Resend. Two more destinations
are built in and stay off until their environment variables are set in Vercel.

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
            "channels", "revenue", "goal", "notes", "page", "utm", "country"],
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

## Mailchimp

Full step-by-step guide: `MAILCHIMP-SETUP.md`. In short, use one audience for both forms and set:

- `MAILCHIMP_API_KEY` (Profile > Extras > API keys; it ends in the data centre, e.g. `-us21`)
- `MAILCHIMP_NEWSLETTER_LIST_ID` and `MAILCHIMP_CONTACT_LIST_ID` (Audience > Settings > Audience name and defaults > Audience ID; the same ID for both)
- optionally `MAILCHIMP_DOUBLE_OPT_IN=true` to send a confirmation email first

Newsletter sign-ups are added as subscribed with the tag "Website newsletter" (an existing
contact is subscribed too). Contact form visitors did not ask for marketing email, so new ones
are added as non-subscribed contacts with the tag "Website contact form" and an existing
contact's status is left alone.
