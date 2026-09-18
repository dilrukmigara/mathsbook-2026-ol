-- ==============================================================================
-- MathsBook: Free Papers & Topics Supabase Database & Storage Setup Script
-- ==============================================================================
-- 1. Copy all the SQL commands below.
-- 2. Open your Supabase Dashboard: https://supabase.com/dashboard/project/etnkhxifqvpqdvalzuwx
-- 3. Click "SQL Editor" in the left sidebar.
-- 4. Paste this script and click "Run".
-- ==============================================================================

-- 1. Create 'paper_topics' table
CREATE TABLE IF NOT EXISTS public.paper_topics (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'papers' table
CREATE TABLE IF NOT EXISTS public.papers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  grade TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  topic_name TEXT,
  file_name TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  year TEXT,
  term TEXT,
  downloads INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE public.paper_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

-- 4. Policies for 'paper_topics' (allow read, insert, update, delete)
DROP POLICY IF EXISTS "Allow public read paper_topics" ON public.paper_topics;
CREATE POLICY "Allow public read paper_topics" ON public.paper_topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert paper_topics" ON public.paper_topics;
CREATE POLICY "Allow public insert paper_topics" ON public.paper_topics FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete paper_topics" ON public.paper_topics;
CREATE POLICY "Allow public delete paper_topics" ON public.paper_topics FOR DELETE USING (true);

-- 5. Policies for 'papers' (allow read, insert, update, delete)
DROP POLICY IF EXISTS "Allow public read papers" ON public.papers;
CREATE POLICY "Allow public read papers" ON public.papers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert papers" ON public.papers;
CREATE POLICY "Allow public insert papers" ON public.papers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update papers" ON public.papers;
CREATE POLICY "Allow public update papers" ON public.papers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete papers" ON public.papers;
CREATE POLICY "Allow public delete papers" ON public.papers FOR DELETE USING (true);

-- 6. Insert Default Topics for Grade 10 and Grade 11 (if not already present)
INSERT INTO public.paper_topics (id, name, grade, description) VALUES
  ('TOPIC-G10-ALG', 'Algebra (වීජගණිතය)', 'grade_10', 'Equations, Expressions, and Factorization papers'),
  ('TOPIC-G10-GEO', 'Geometry (ජ්‍යාමිතිය)', 'grade_10', 'Triangles, Angles, and Geometric Theorems'),
  ('TOPIC-G10-STAT', 'Statistics & Probability (සංඛ්‍යානය)', 'grade_10', 'Frequency distributions and basic probability'),
  ('TOPIC-G11-ALG', 'Algebra (වීජගණිතය)', 'grade_11', 'Quadratic equations, graphs, and matrices'),
  ('TOPIC-G11-GEO', 'Geometry & Circles (වෘත්ත ප්‍රමේයයන්)', 'grade_11', 'Circle theorems, tangents, and riders'),
  ('TOPIC-G11-TRIG', 'Trigonometry & Mensuration (ත්‍රිකෝණමිතිය)', 'grade_11', 'Heights, distances, surface areas, and volumes')
ON CONFLICT (id) DO NOTHING;

-- 7. Setup 'papers' Storage Bucket for PDF uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('papers', 'papers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 8. Storage bucket policies (allow public reading and uploading of PDFs)
DROP POLICY IF EXISTS "Public access to papers bucket" ON storage.objects;
CREATE POLICY "Public access to papers bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'papers');

DROP POLICY IF EXISTS "Allow upload to papers bucket" ON storage.objects;
CREATE POLICY "Allow upload to papers bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'papers');

DROP POLICY IF EXISTS "Allow update to papers bucket" ON storage.objects;
CREATE POLICY "Allow update to papers bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'papers');

DROP POLICY IF EXISTS "Allow delete from papers bucket" ON storage.objects;
CREATE POLICY "Allow delete from papers bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'papers');
