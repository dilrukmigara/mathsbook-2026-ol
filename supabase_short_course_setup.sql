-- Run once in the existing Supabase project's SQL Editor before deploying.
-- These tables are accessible ONLY through the server's service-role client.
begin;
create table if not exists public.short_course_settings (
 id integer primary key check (id = 1),
 title text not null,
 introduction text not null default '',
 intro_video_id text not null default ''
);
create table if not exists public.short_course_lessons (
 id uuid primary key default gen_random_uuid(),
 position integer not null check (position between 1 and 1000),
 title text not null,
 description text not null default '',
 video_id text not null default '',
 notes text not null default '',
 questions jsonb not null default '[]'::jsonb check (jsonb_typeof(questions) = 'array'),
 published boolean not null default false,
 created_at timestamptz not null default now(),
 check (not published or video_id ~ '^[A-Za-z0-9_-]{11}$')
);
create table if not exists public.short_course_progress (
 student_id text not null,
 lesson_id uuid not null references public.short_course_lessons(id) on delete cascade,
 video_id text not null,
 completed_at timestamptz not null default now(),
 primary key (student_id, lesson_id, video_id)
);
create index if not exists short_course_published_order on public.short_course_lessons(published, position);
alter table public.short_course_settings enable row level security;
alter table public.short_course_lessons enable row level security;
alter table public.short_course_progress enable row level security;
revoke all on public.short_course_settings, public.short_course_lessons, public.short_course_progress from anon, authenticated;
grant all on public.short_course_settings, public.short_course_lessons, public.short_course_progress to service_role;
insert into public.short_course_settings(id, title, introduction, intro_video_id) values
(1, '100න් 1ක්', 'විනාඩි 2කින් ගණිතයේ එක අදහසක් පැහැදිලිව ඉගෙන ගමු. වීඩියෝව බලන්න, කෙටි සටහන කියවන්න, ඉන්පසු අදාළ පසුගිය විභාග ප්‍රශ්න විසඳලා බලන්න. දවසින් දවස ඔබේ දැනුම ගොඩනගාගන්න.', 'RNMhFnaG-yg') on conflict do nothing;
insert into public.short_course_lessons(id, position, title, video_id, published) values
('10000000-0000-4000-8000-000000000001', 1, 'මිනිස් බල ප්‍රශ්න', 'tqn0_95UuII', true),
('10000000-0000-4000-8000-000000000002', 2, 'තීරු බදු', 'qAGG_wvHasA', true),
('10000000-0000-4000-8000-000000000003', 3, 'වරිපනම් බදු', '', false) on conflict do nothing;
commit;
