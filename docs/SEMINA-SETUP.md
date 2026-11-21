# Mathsbook Paper I seminar

Adds `/semina`, `/semina/admin`, `/api/semina` and `/api/admin/semina`. No existing tracked files, routes, navigation, authentication or data tables are changed. Do not merge/deploy to production until the owner approves the preview.

## Content

- Sinhala pre-registration for both foundational and A/B students.
- Time: පෙ.ව. 8.30 සිට ප.ව. 4.00 දක්වා. Never advertise a duration in hours.
- Approximately 35 short-question types and 8 structured-question types. No prediction/mark guarantee.
- Date, fee and exam cohort remain unconfirmed. The form asks each student's exam year, without assuming a cohort.
- Owner-provided WhatsApp invite and ROVISTA Maps links are embedded in the page. Group joining is completed inside WhatsApp, never inferred from a click.
- No payment collection or seat reservation. No fabricated scarcity, testimonials or exam results.
- `noindex` remains on the seminar subtree until launch approval. At launch, remove this from the public page if desired but retain noindex on the admin page.

## Isolated preview first

Use Node 22+. Run `npm ci`. Existing signed admin authentication uses `COURSE_SESSION_SECRET` (32+ characters), `MATHSBOOK_ADMIN_PHONE`, `MATHSBOOK_ADMIN_PASSWORD`. Do not paste or commit secrets.

Run `supabase_semina_setup.sql` in a separate preview Supabase project. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the preview only. The new table has RLS and no anon/authenticated grants. Server routes use the service-role key and the existing signed admin cookie. No browser has the key. Production registration fails with 503 if its database is unavailable; there is no pretend-success file fallback.

For an isolated local development check only, set `SEMINA_LOCAL_DATA=1`, a dummy `SUPABASE_URL=http://127.0.0.1:9`, dummy `SUPABASE_SERVICE_ROLE_KEY=local-test-only`, `COURSE_SESSION_SECRET=local-semina-test-secret-at-least-32-characters`, `MATHSBOOK_ADMIN_PHONE=0700000000`, and `MATHSBOOK_ADMIN_PASSWORD=local-semina-test-password`. This mode writes ignored `data/semina.json` and is disabled in production and Vercel. Do not use real student data in preview. No migration has been run against live Supabase.

## Admin workflow

Open `/semina/admin` and use existing admin credentials. Search by name/phone/school/reference; filter group status. Save group membership only after checking WhatsApp, and message status only after pressing Send in WhatsApp. Opening a chat does not update either status. CSV contains the currently filtered records, includes UTF-8 BOM and escapes spreadsheet formulas. Admin APIs are no-store and require server-verified admin cookies. The public API returns only success, duplicate flag and the new registration code, never a student's record. Duplicate event + normalized phone + case-insensitive name returns no existing reference and never overwrites admin changes. Siblings sharing a phone can register separately by name. Consent is versioned and timestamped with registration creation.

The POST route has input length/type checks, a honeypot, origin checking and a bounded per-process 10 attempts/10 minutes IP limiter. This is basic abuse protection, NOT a durable cross-instance limiter. Before buying advertising, configure hosting edge/WAF rate limiting for `/api/semina` and monitor volume. If abuse persists, add a verified challenge. X-Forwarded-For must be sanitized by the trusted hosting proxy.

Deletion requests are handled by the owner in Supabase using the registration reference; do not publicly share exports. Review consent and retention procedures before launch.

## Optional automatic WhatsApp admin notification

The code is ready but disabled by default. No real message has been sent or recipient opted in by this change. Set these server-only variables only after owner approval and Meta setup:

- `SEMINA_WHATSAPP_ENABLED=1`
- `WHATSAPP_ACCESS_TOKEN`: appropriate server access token
- `WHATSAPP_PHONE_NUMBER_ID`: sending business phone ID (not the recipient)
- `WHATSAPP_API_VERSION`: a currently supported version, e.g. v27.0; confirm in Meta dashboard
- `SEMINA_NOTIFY_PHONE`: opted-in owner's recipient in digits-only international format, e.g. 94729780053
- `SEMINA_WHATSAPP_TEMPLATE`: approved template name
- `SEMINA_WHATSAPP_LANGUAGE`: exact approved language code

Create a BODY template with exactly three text parameters, in this order: registration reference, student's name, student's WhatsApp number. Example: `New Mathsbook seminar registration. Reference: {{1}}. Student: {{2}}. Contact: {{3}}.` Ensure the owner's number is eligible to receive from the sending number and has opted in. Meta template approval, account configuration and charges are external prerequisites. Do not expose tokens in NEXT_PUBLIC variables. No automatic student DMs are sent.

Insert commits BEFORE notification. Atomic claim avoids concurrent retries. `accepted` means the provider accepted a message, not delivery/read. `not_configured` and `failed` can be retried from admin. `unknown` (network timeout) or stuck `sending` must be reconciled against provider logs before an operator resets status to pending in Supabase; blindly retrying can send duplicates. The code does not implement delivery webhooks or a background retry scheduler. Notification failure never invalidates the saved registration. A new insertion triggers the first attempt, duplicate registrations do not resend. The notification status remains visible to the admin.

Meta reference: https://www.postman.com/meta/whatsapp-business-platform/request/q2k7j58/send-sample-text-message

## Checks

- `node --test tests/semina.test.mjs tests/semina-notifications.test.mjs tests/short-course.test.mjs`
- `node tests/semina.integration.mjs` against an isolated local dev server configured as above
- `npm run build`
- Visual review at desktop and narrow width; keyboard labels/focus; form validation; success and failed-save messaging; WhatsApp and location targets
- Verify original homepage and course routes unchanged with `git diff --name-status <base>`.

## Owner launch checklist

Confirm event date, price/payment instructions, exam cohort and final content. Review the preview. Configure a production migration and server variables deliberately, test admin access and database persistence in preview, configure WhatsApp if wanted, then obtain owner approval to merge/deploy. Do not auto-merge the draft PR. Check Vercel project production-branch configuration before any branch deployment.

## Review evidence for this branch

Production build passed. Nine validation/regression tests and one notification test passed. Local integration passed registration persistence, consent rejection, duplicate handling, admin access, origin rejection, updates and cookie tampering. No actual WhatsApp messages were sent. Managed browser preview was unavailable: its launcher passes Vite-only `--host` / `--strictPort` arguments to the Next.js dev command. Application startup scripts were left unchanged. Desktop/mobile visual verification is still required in a proper Next.js preview.
