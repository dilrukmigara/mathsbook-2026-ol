-- ==============================================================================
-- MathsBook: Student Enrollments Supabase Database Setup Script
-- ==============================================================================
-- 1. Copy all the SQL commands below.
-- 2. Open your Supabase Dashboard: https://supabase.com/dashboard/project/etnkhxifqvpqdvalzuwx
-- 3. Click "SQL Editor" in the left sidebar.
-- 4. Paste this script and click "Run".
-- ==============================================================================

-- 1. Create 'enrollments' table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  school_name TEXT,
  last_term_marks NUMERIC DEFAULT 0,
  course TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 3. Policies for 'enrollments' (allow read, insert, update, delete)
DROP POLICY IF EXISTS "Allow public read enrollments" ON public.enrollments;
CREATE POLICY "Allow public read enrollments" ON public.enrollments 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Allow public insert enrollments" ON public.enrollments;
CREATE POLICY "Allow public insert enrollments" ON public.enrollments 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update enrollments" ON public.enrollments;
CREATE POLICY "Allow public update enrollments" ON public.enrollments 
  FOR UPDATE 
  TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Allow public delete enrollments" ON public.enrollments;
CREATE POLICY "Allow public delete enrollments" ON public.enrollments 
  FOR DELETE 
  TO anon, authenticated 
  USING (true);

-- 4. Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON public.enrollments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enrollments_contact ON public.enrollments(contact_number);
