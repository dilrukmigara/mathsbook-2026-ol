# 100න් 1ක් · විනාඩි 2න්

This extends the existing Next.js/Vercel/Supabase website. No new hosting account or domain is needed.

- Student landing: `/100n1`
- Each lesson: `/100n1/<lesson UUID>`
- Administration: existing `/admin` → **100න් 1ක්**
- Home page and navigation link to the new series.

## Before deploying

Set these server-only environment variables in Vercel for the intended environments. Do not prefix them with `NEXT_PUBLIC_`, commit them, or paste secrets into chat.

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | Existing Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Existing project's server service-role key |
| `COURSE_SESSION_SECRET` | Cryptographically random secret of at least 32 characters; keep stable across deployments |
| `MATHSBOOK_ADMIN_PHONE` | Admin login phone number |
| `MATHSBOOK_ADMIN_PASSWORD` | New strong admin password; do not reuse the previously hardcoded password |

1. Configure the variables, but do not change the existing live deployment yet.
2. Run `supabase_short_course_setup.sql` in the existing Supabase SQL Editor. It adds three new tables, restricts direct client access, and seeds the supplied introduction plus two published videos and one draft. Re-running does not overwrite admin edits.
3. Deploy this branch to a Vercel preview using those variables. Verify student login and the new admin area.
4. Deploy the verified source to production.
5. Run `supabase_student_access_setup.sql` **after** the new server is live. It removes anonymous access to existing student records; the updated server uses the service-role key. Applying it before deployment would break the old anonymous-key login implementation.
6. Verify both existing student login and signup, existing admin operations, and `/100n1` on the live site.

Use Node.js 22 or newer as required by the installed Supabase packages. Existing logged-in users with only the old browser storage session will need to sign in once to obtain the new signed cookie. New authentication fails closed if the session secret or admin configuration is missing.

## Initial content

- Introduction: `https://youtu.be/RNMhFnaG-yg`
- 01 — මිනිස් බල ප්‍රශ්න: `https://youtu.be/tqn0_95UuII`
- 02 — තීරු බදු: `https://youtu.be/qAGG_wvHasA`
- 03 — වරිපනම් බදු: draft, no video supplied

The first two lesson names match the supplied YouTube titles. No invented notes or past-paper questions are included.

## Managing content

Sign into `/admin` and select **100න් 1ක්**. Expand the introduction panel to change the title, introduction text, and introduction video. Create or edit lessons with a lesson number, title, card description, YouTube link, plain-text note and any number of question entries (up to 60 per lesson).

Each question supports a year/question label, question text, an optional HTTPS link to an existing PDF or image, and an optional answer/explanation. New file uploads are not included: use an existing paper-library/public file URL. Notes preserve line breaks and Unicode maths notation; HTML is rendered as text.

Check **Publish** to make a lesson visible. A valid YouTube link is required for publication. Uncheck it to hide a lesson without deleting it. Cards sort by lesson number, then title. Deletion asks for confirmation and removes the lesson and its progress records. The introduction is not part of the score.

## Progress behavior

The player counts unique played video seconds. Skipping forward or repeatedly watching one small segment does not complete the lesson. At 90% coverage, the server stores completion for the authenticated student and the current video ID. A failed save offers a retry button.

The score is completed current published videos / total current published videos, plus a percentage. Repeated completion is idempotent; changing a video's ID requires watching the new video. Hiding/deleting a lesson removes it from the denominator. Partial viewing before 90% is held in the current player only; it is not resumed after reloading. Completed lessons persist across devices/logins. Watching directly on YouTube is not tracked.

This is self-reported study progress, not a proctored score: browser-supplied viewing evidence can be forged by a determined client. No exam grades or certificates depend on it.

## Authentication integration and limitations

Student signin/signup now issue signed, expiring, HttpOnly same-site cookies using the existing student accounts. All new course APIs require the correct server-verified role. The existing admin login no longer exposes hardcoded credentials in JavaScript. Existing admin mutations and private admin listings now require the admin cookie. LMS profile refresh uses only the signed-in student's profile instead of requesting the complete student list. Logout clears the shared student cookie from LMS, papers, exams, and the series.

This is not a full migration of legacy account storage: the existing student password format and Google Sheets signup sync are retained. Password hashing, durable login rate limiting, old exam/paper authorization and a broader audit remain separate work. Apply the post-deployment student-table access script to prevent direct anonymous credential reads.

## Verification

- `node --test tests/short-course.test.mjs`: URL/input validation and progress accounting.
- `node tests/short-course.integration.mjs`: local-only functional checks for signup/signin, cookie tampering, access isolation, draft/publish/edit/delete, settings, questions/notes, progress persistence/idempotency, video replacement, logout and cross-origin writes.
- `npm run build`: production compilation and type checks.

The integration runner must only target an isolated local development server with `COURSE_LOCAL_DATA=1`, `SUPABASE_URL=http://127.0.0.1:9` and a dummy Supabase key. Set local test credentials and `COURSE_SESSION_SECRET`; the runner defaults to the documented synthetic test values in its source. No live Supabase requests should be made during tests. Course local storage is explicitly disabled on Vercel and in production. Local `data/` is ignored by Git and must never be deployed as a database.
