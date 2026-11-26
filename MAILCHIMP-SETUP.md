# Mailchimp setup for kwontified.com

This guide connects the website's two forms to Mailchimp: the "Get our marketplace briefing once a month" sign-up in every page footer, and the "Request a marketplace review" form on /contact. It takes about 45 minutes, plus up to a day for the DNS records in step 3 to take effect.

The website code is finished. Nothing is sent to Mailchimp until the environment variables in step 6 are set in Vercel, and the forms keep working the same way before and after. Mailchimp renames menus from time to time; if a menu below has moved, type its name into Mailchimp's search box.

## What the site does today, and what Mailchimp adds

Every form submission already:

- emails the team (the contact form goes to the addresses in `CONTACT_TO`; newsletter sign-ups to `NEWSLETTER_TO`);
- saves the person in Resend (newsletter sign-ups go into the "Kwontified Briefing" segment);
- can append a row to a Google Sheet (see `FORMS-SETUP.md`; off until its variables are set).

Once Mailchimp is connected, each submission also adds or updates a contact in your Mailchimp audience:

| Form | Status in Mailchimp | Tag | Name fields |
|---|---|---|---|
| Footer newsletter sign-up | Subscribed | Website newsletter | (email only) |
| Contact form | Non-subscribed (cannot receive campaigns) | Website contact form | First name, Last name |

Details that are already handled in the code:

- **Contact-form visitors are not added to the newsletter.** They asked for a review, not for marketing email, so Mailchimp stores them as non-subscribed contacts. If a person is already in the audience, the contact form leaves their status alone.
- **A contact-form visitor who later signs up for the briefing becomes Subscribed.**
- **Someone who unsubscribed and signs up again** gets Mailchimp's confirmation email, because Mailchimp only lets a person rejoin by confirming it themselves.
- **Required audience fields cannot block a sign-up.** The site skips Mailchimp's required-field check, so a newsletter sign-up with only an email address is always accepted.
- **A Mailchimp outage does not affect visitors.** If Mailchimp is down or misconfigured, the visitor still sees the thank-you page, the team still gets the email, and the error is written to the Vercel logs (step 8).

## Decisions to make first

1. **Which tool sends the monthly briefing.** Use Mailchimp. Resend keeps sending the team notifications and keeps its copy of subscribers as a backup. Send each issue from one tool only, or subscribers will get it twice.
2. **Single or double opt-in.** The site's thank-you page says "You're subscribed", which matches single opt-in (the default). With double opt-in, Mailchimp first emails a confirmation link, which gives a cleaner list and is the safer choice for subscribers in the EU and Canada. To use it, set `MAILCHIMP_DOUBLE_OPT_IN` to `true` in step 6 and ask for the thank-you page to be reworded to "Check your inbox to confirm".
3. **One audience.** Mailchimp recommends a single audience separated by tags, and its Free plan allows only one. Both forms use the same audience; the tags tell them apart. Mailchimp's plan limits can also count non-subscribed and unsubscribed contacts, so check the current limits on Mailchimp's pricing page against the number of contact-form requests you expect.

## Step 1. Sign in and pick a plan

1. Go to mailchimp.com and sign in, or create the account with a shared company address (for example contact@kwontified.com) so the account does not depend on one person's mailbox.
2. Turn on two-factor authentication: profile icon > Profile > Security.
3. Pick a plan. The Free plan is enough to start. Moving to a paid plan later keeps the audience, tags and settings.

## Step 2. Create and set up the audience

1. Open **Audience** > **All contacts**. A new account already has one audience; use it rather than creating a second.
2. Open **Settings** > **Audience name and defaults** and fill in:
   - Audience name: `Kwontified Briefing`
   - Default From email address: `contact@kwontified.com` (it receives mail, so replies reach the team)
   - Default From name: `Kwontified`
   - Permission reminder: `You are receiving this because you signed up for the Kwontified Briefing at kwontified.com.`
3. On the same page, find **Audience ID** and copy it (a short code such as `a1b2c3d4e5`). You need it in step 6.
4. Open **Settings** > **Required email footer content** and enter the postal address. US anti-spam law requires it in every campaign:
   `Kwontified, 7000 Central Parkway, Suite 1100, Atlanta, GA 30328`
5. Open **Settings** > **Audience fields and \*|MERGE|\* tags**. Keep First Name (`FNAME`) and Last Name (`LNAME`), which the contact form fills in. Leave every field except Email unrequired.
6. Optional: open **Audience** > **Tags** and create the two tags now, spelled exactly `Website newsletter` and `Website contact form`. If you skip this, Mailchimp creates them with the first submission of each form.

## Step 3. Authenticate the kwontified.com domain

This lets Mailchimp send as @kwontified.com without "via mcsv.net" in the inbox and keeps the briefing out of spam folders.

1. In Mailchimp, search for **Domains** (it sits under Account or Website settings, depending on the account) and add `kwontified.com`.
2. Verify it with the code Mailchimp emails to contact@kwontified.com.
3. Choose **Authenticate**. Mailchimp shows two CNAME records (named like `k2._domainkey` and `k3._domainkey`) and, if the domain has none, a DMARC record (`_dmarc`).
4. Add these records wherever kwontified.com's DNS is managed. If the domain uses Vercel's nameservers, that is Vercel > the `kwontified` team > Domains > kwontified.com > DNS Records. Copy the names and values exactly.
   - Do not remove or change the records Resend uses. Both services can be authenticated on the same domain.
   - A domain can have only one `_dmarc` record. If one exists, keep it and skip Mailchimp's DMARC record.
5. Return to Mailchimp and select **Authenticate** again. DNS changes usually take effect within an hour and at most 48 hours.

## Step 4. Create the API key

1. Profile icon > **Profile** > **Extras** > **API keys** > **Create A Key**.
2. Name it `kwontified.com website`, create it and copy it straight away. Mailchimp shows the full key only once.
3. The key ends in a data-centre code such as `-us21`. Keep the whole value, including that ending: the site uses it to find your account's server.

Treat the key like a password. Do not email it or paste it into chat; it goes straight into Vercel. If it leaks, delete it on the same page and create a new one.

## Step 5. Check the newsletter sign-up form wording

The footer form says "Get our marketplace briefing once a month" and the thank-you page promises a monthly issue with a one-click unsubscribe link. Mailchimp adds the unsubscribe link and the postal address to every campaign automatically, so no website change is needed for single opt-in.

## Step 6. Add the settings in Vercel

1. Open Vercel > team `kwontified` > the site's project > **Settings** > **Environment Variables**.
2. Add these, each for the **Production** environment. Add them to **Preview** as well only if you want to test on preview links; contacts from tests then go into the real audience.

| Name | Value |
|---|---|
| `MAILCHIMP_API_KEY` | the key from step 4, with its `-us21`-style ending (mark it **Sensitive**) |
| `MAILCHIMP_NEWSLETTER_LIST_ID` | the Audience ID from step 2 |
| `MAILCHIMP_CONTACT_LIST_ID` | the same Audience ID |
| `MAILCHIMP_DOUBLE_OPT_IN` | `true` only if you chose double opt-in; otherwise leave it out |

3. Redeploy. Vercel applies new variables only to new deployments: open **Deployments**, select the latest production deployment, open the menu (three dots) and choose **Redeploy**.

## Step 7. Test both forms

Use addresses you control. Google Workspace delivers `jordan+test1@kwontified.com` to jordan@kwontified.com, so plus-addresses work well for tests.

1. **Newsletter.** On the live site, enter `jordan+mc1@kwontified.com` in the footer sign-up. Expect the thank-you page.
   In Mailchimp, open Audience > All contacts and search for the address. Expect: status **Subscribed**, tag **Website newsletter**.
2. **Contact form.** Submit /contact with `jordan+mc2@kwontified.com` and a first and last name.
   Expect: status **Non-subscribed**, tag **Website contact form**, first and last name filled in. The team notification email arrives as before.
3. **Contact first, then newsletter.** Sign up for the newsletter with `jordan+mc2@kwontified.com`.
   Expect: the same contact is now **Subscribed** and has both tags.
4. **Double opt-in only.** Expect a confirmation email and the status **Pending** until the link is clicked.
5. Delete the test contacts: select them > **Actions** > **Archive** (or Permanently delete).

## Step 8. If a test fails

Open Vercel > project > **Logs**, set the time range to cover the test and search for `Mailchimp`. Each failure is logged with Mailchimp's answer:

| Logged answer | Meaning | Fix |
|---|---|---|
| `Mailchimp answered 401` | The API key is wrong or deleted | Create a new key (step 4), update `MAILCHIMP_API_KEY`, redeploy |
| `Mailchimp answered 404` | The Audience ID is wrong, or the key belongs to another Mailchimp account | Copy the Audience ID again (step 2) |
| `Mailchimp answered 400 ... looks fake or invalid` | Mailchimp rejects addresses such as test@example.com | Test with a real mailbox |
| `Mailchimp answered 400 ... compliance state` | The person unsubscribed or was cleaned earlier | Expected; they must rejoin through Mailchimp's confirmation email |
| `Mailchimp tag answered ...` | The contact was saved but the tag was not | Check the tag name; the contact itself is fine |
| Nothing logged and no contact | The variables are not in the deployment | Check the variable names and the environment, then redeploy |

## Step 9. Welcome email

Send new subscribers a short welcome so the first email they get is not a month away.

1. **Automations** > **Customer Journeys** (or **Classic automations** > **Welcome new subscribers** on accounts that still have it) > **Create**.
2. Starting point: **Tag added** > `Website newsletter`. This fires for website sign-ups only, not for contacts you import.
3. Add a **Send email** step. Suggested content: one paragraph on what the briefing covers and when it arrives, links to two or three recent Perspectives articles, and contact@kwontified.com for questions.
4. Turn the journey on and repeat test 1 in step 7 with a new plus-address to check the welcome email arrives.

Which journey features are available depends on the plan; the Free plan may limit journeys to one step, which is all a welcome email needs.

## Step 10. Bring over earlier subscribers

Anyone who signed up before Mailchimp was connected is in Resend (segment "Kwontified Briefing") and, if the sheet webhook was on, the newsletter Google Sheet.

1. In Resend, open **Audiences**, select the audience that holds the "Kwontified Briefing" contacts and export it as CSV.
2. Remove anyone who unsubscribed in Resend, and anyone who came only from the contact form.
3. In Mailchimp: **Audience** > **Add contacts** > **Import contacts** > **Upload a file**.
   - Status: **Subscribed**. Import as Subscribed only people who signed up for the briefing.
   - Tag: `Imported from Resend`. Do not use `Website newsletter`; that tag starts the welcome journey.
4. Check the import summary for rejected rows.

## Step 11. Sending the monthly briefing

1. **Create** > **Email** > **Regular email**.
2. **To:** the Kwontified Briefing audience, all subscribed contacts. Non-subscribed contact-form visitors are excluded automatically.
3. **From:** Kwontified, contact@kwontified.com. **Subject** and **preview text** for that issue.
4. Design the email, then **Send a test** to two people before scheduling.
5. Schedule for a weekday morning in US Eastern time.

Mailchimp adds the unsubscribe link and the postal address from step 2 to the footer of every campaign.

## Privacy and consent

- The site's Privacy Policy already covers vendors that send email and the right to unsubscribe, so it needs no change for Mailchimp.
- Do not send campaigns to contact-form visitors. They did not ask for marketing email; the site keeps them non-subscribed for that reason.
- Each submission records the visitor's country in the Google Sheet (when connected). If many subscribers are in the EU or Canada, switch to double opt-in (decision 2).

## Checklist

- [ ] Plan chosen; two-factor authentication on
- [ ] Audience named, defaults and postal address filled in, Audience ID copied
- [ ] kwontified.com authenticated (DKIM CNAMEs added; one DMARC record in total)
- [ ] API key created and stored only in Vercel
- [ ] Four variables set in Vercel Production (three for single opt-in), site redeployed
- [ ] Newsletter, contact form and contact-then-newsletter tests pass; test contacts archived
- [ ] Welcome journey on and tested
- [ ] Earlier subscribers imported from Resend
- [ ] First briefing sent from Mailchimp only
