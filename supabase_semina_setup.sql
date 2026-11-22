-- Additive only. Run in an isolated preview Supabase project first.
create table if not exists public.seminar_registrations (
  id uuid primary key,
  request_id uuid not null unique,
  event_key text not null,
  registration_code text not null unique,
  student_name text not null check (char_length(student_name) between 2 and 100),
  whatsapp_number text not null check (whatsapp_number ~ '^947[0-9]{8}$'),
  school text not null default '',
  exam_year integer not null check (exam_year between 2026 and 2035),
  source text not null default 'direct',
  consent boolean not null check (consent = true),
  consent_version text not null,
  created_at timestamptz not null default now(),
  group_status text not null default 'unchecked' check (group_status in ('unchecked','joined','not_joined')),
  message_status text not null default 'pending' check (message_status in ('pending','sent')),
  payment_status text not null default 'pending' check (payment_status in ('pending','verified')),
  attendance text not null default 'unknown' check (attendance in ('unknown','present','absent')),
  notes text not null default '',
  notification_status text not null default 'pending' check (notification_status in ('pending','sending','not_configured','accepted','failed','unknown'))
);
create unique index if not exists seminar_student_dedupe on public.seminar_registrations(event_key,whatsapp_number,lower(student_name));
create index if not exists seminar_created on public.seminar_registrations(event_key,created_at desc);
alter table public.seminar_registrations enable row level security;
revoke all on public.seminar_registrations from anon,authenticated;
grant select,insert,update on public.seminar_registrations to service_role;
