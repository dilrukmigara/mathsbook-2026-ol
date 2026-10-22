# Mathsbook brand redesign

Implemented locally on `version-2`.

- Original supplied logo and cover in `public/brand/`.
- Shared brand tokens, responsive layouts, reduced motion and focus states in `app/brand.css`.
- Reusable navigation/footer across public pages, with Sinhala/English navigation.
- New homepage with resource cards, course cards, learning approach, enrollment and FAQ.
- Course selection is shared between cards and enrollment; server failures no longer show a successful receipt.
- Light palette applied to existing Papers, Exams and LMS flows; backend APIs unchanged.
- Language defaults to Sinhala without an entry popup.

## Validation

Production build passed. Browser checks covered desktop (1440px), mobile (461px), language switching, and course selection propagation and eligibility state. Public portal layouts inspected. No real registrations, messages, purchases or student-data mutations were submitted. Authenticated LMS/exam flows were not verified with a student account.

## Before publishing

Business phone and WhatsApp confirmed by the owner: 0729780053. All contact links use tel:0729780053 and https://wa.me/94729780053.

Previously identified authentication and admin API access issues remain outside this UI redesign. Dependency install reported existing audit findings; runtime recommends Node 22+. No dependency changes made.

## Preview

`npm ci`, `npm run build`, then `npm run start -- --port 3100`.
