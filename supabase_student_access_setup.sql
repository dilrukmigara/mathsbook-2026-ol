-- Run AFTER deploying the server changes with SUPABASE_SERVICE_ROLE_KEY configured.
-- This prevents direct anonymous access to existing student login records.
begin;
revoke all on public.students from anon, authenticated;
grant all on public.students to service_role;
commit;
