-- ==============================================================================
-- MathsBook: Online Exams & MCQ Database Setup Script for Supabase
-- ==============================================================================
-- 1. Copy all the SQL commands below.
-- 2. Open your Supabase Dashboard: https://supabase.com/dashboard/project/etnkhxifqvpqdvalzuwx
-- 3. Click "SQL Editor" in the left sidebar.
-- 4. Paste this script and click "Run".
-- ==============================================================================

-- 1. Create 'exam_papers' table
CREATE TABLE IF NOT EXISTS public.exam_papers (
  id TEXT PRIMARY KEY,
  paper_number INT NOT NULL,
  title TEXT NOT NULL,
  grade TEXT DEFAULT 'grade_11',
  duration_minutes INT DEFAULT 45,
  total_questions INT DEFAULT 0,
  description TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'exam_questions' table
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id TEXT PRIMARY KEY,
  paper_id TEXT NOT NULL,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'exam_attempts' table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  student_name TEXT,
  student_phone TEXT,
  paper_id TEXT NOT NULL,
  paper_title TEXT,
  score INT NOT NULL,
  total INT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- 5. Policies for 'exam_papers'
DROP POLICY IF EXISTS "Allow public read exam_papers" ON public.exam_papers;
CREATE POLICY "Allow public read exam_papers" ON public.exam_papers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert exam_papers" ON public.exam_papers;
CREATE POLICY "Allow public insert exam_papers" ON public.exam_papers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update exam_papers" ON public.exam_papers;
CREATE POLICY "Allow public update exam_papers" ON public.exam_papers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete exam_papers" ON public.exam_papers;
CREATE POLICY "Allow public delete exam_papers" ON public.exam_papers FOR DELETE USING (true);

-- 6. Policies for 'exam_questions'
DROP POLICY IF EXISTS "Allow public read exam_questions" ON public.exam_questions;
CREATE POLICY "Allow public read exam_questions" ON public.exam_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert exam_questions" ON public.exam_questions;
CREATE POLICY "Allow public insert exam_questions" ON public.exam_questions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update exam_questions" ON public.exam_questions;
CREATE POLICY "Allow public update exam_questions" ON public.exam_questions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete exam_questions" ON public.exam_questions;
CREATE POLICY "Allow public delete exam_questions" ON public.exam_questions FOR DELETE USING (true);

-- 7. Policies for 'exam_attempts'
DROP POLICY IF EXISTS "Allow public read exam_attempts" ON public.exam_attempts;
CREATE POLICY "Allow public read exam_attempts" ON public.exam_attempts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert exam_attempts" ON public.exam_attempts;
CREATE POLICY "Allow public insert exam_attempts" ON public.exam_attempts FOR INSERT WITH CHECK (true);

-- 8. Seed Default Paper 1 and Paper 2
INSERT INTO public.exam_papers (id, paper_number, title, grade, duration_minutes, total_questions, description, status) VALUES
  ('PAPER-EXAM-01', 1, 'Paper 1 - O/L Mathematics Model MCQ Paper', 'grade_11', 30, 5, 'Essential Grade 10 & 11 Mathematics MCQ questions covering Algebra, Geometry, and Numbers.', 'published'),
  ('PAPER-EXAM-02', 2, 'Paper 2 - Grade 10 & 11 Speed Revision MCQ Paper', 'grade_10', 25, 4, 'Fast practice revision paper focusing on Indices, Percentages, and Coordinate Geometry.', 'published')
ON CONFLICT (id) DO NOTHING;

-- Seed Questions for Paper 1
INSERT INTO public.exam_questions (id, paper_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
  ('Q-01-01', 'PAPER-EXAM-01', 1, '2x + 5 = 15 නම් x හි අගය කීයද? (If 2x + 5 = 15, what is the value of x?)', '3', '5', '7', '10', 'B', '2x + 5 = 15 සමීකරණය විසඳීම:\n2x = 15 - 5\n2x = 10\nx = 10 / 2 = 5 වේ. එබැවින් නිවැරදි පිළිතුර B (5) වේ.'),
  ('Q-01-02', 'PAPER-EXAM-01', 2, 'අරය 7 cm වන වෘත්තයක පරිධිය සොයන්න. (Find the circumference of a circle with radius 7 cm. Take π = 22/7)', '22 cm', '44 cm', '88 cm', '154 cm', 'B', 'වෘත්තයක පරිධිය C = 2πr සූත්‍රයෙන් ගණනය කෙරේ.\nC = 2 × (22/7) × 7 = 2 × 22 = 44 cm.\nඑබැවින් නිවැරදි පිළිතුර B (44 cm) වේ.'),
  ('Q-01-03', 'PAPER-EXAM-01', 3, 'x² - 9 හි සාධක මොනවාද? (What are the factors of x² - 9?)', '(x - 3)(x - 3)', '(x + 3)(x + 3)', '(x - 3)(x + 3)', '(x - 9)(x + 1)', 'C', 'වර්ග දෙකක අන්තරය සූත්‍රය: a² - b² = (a - b)(a + b).\nමෙහි x² - 9 = x² - 3² = (x - 3)(x + 3) වේ. නිවැරදි පිළිතුර C වේ.'),
  ('Q-01-04', 'PAPER-EXAM-01', 4, 'සමපාද ත්‍රිකෝණයක එක් කෝණයක අගය කීයද? (What is the magnitude of an angle in an equilateral triangle?)', '45°', '60°', '90°', '180°', 'B', 'සමපාද ත්‍රිකෝණයක පාද තුනම සමාන වන අතර කෝණ තුනම සමාන වේ. ත්‍රිකෝණයක අභ්‍යන්තර කෝණවල එකතුව 180° බැවින් එක් කෝණයක් 180° / 3 = 60° වේ. නිවැරදි පිළිතුර B වේ.'),
  ('Q-01-05', 'PAPER-EXAM-01', 5, 'සාධාරණ දාදු කැටයක් උඩ දැමූ විට ඉරට්ටේ අංකයක් ලැබීමේ සම්භාවිතාව කීයද? (What is the probability of getting an even number when rolling a fair six-sided die?)', '1/6', '1/3', '1/2', '2/3', 'C', 'දාදු කැටයක මුළු ප්‍රතිඵල සංඛ්‍යාව S = {1, 2, 3, 4, 5, 6} (මුළු 6). ඉරට්ටේ අංක = {2, 4, 6} (3ක්). සම්භාවිතාව = 3/6 = 1/2. නිවැරදි පිළිතුර C (1/2) වේ.')
ON CONFLICT (id) DO NOTHING;

-- Seed Questions for Paper 2
INSERT INTO public.exam_questions (id, paper_id, question_number, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation) VALUES
  ('Q-02-01', 'PAPER-EXAM-02', 1, '2⁴ හි අගය කීයද? (What is the value of 2⁴?)', '8', '12', '16', '32', 'C', '2⁴ = 2 × 2 × 2 × 2 = 16. නිවැරදි පිළිතුර C වේ.'),
  ('Q-02-02', 'PAPER-EXAM-02', 2, 'රු. 5000 ක භාණ්ඩයකට 10% වට්ටමක් ලබා දුන් පසු එහි නව මිල කීයද? (What is the discounted price of an item marked at Rs. 5000 with a 10% discount?)', 'රු. 4000', 'රු. 4500', 'රු. 4800', 'රු. 4900', 'B', 'වට්ටම = 5000 × (10/100) = රු. 500.\nනව මිල = 5000 - 500 = රු. 4500. නිවැරදි පිළිතුර B වේ.'),
  ('Q-02-03', 'PAPER-EXAM-02', 3, 'y = 2x + 3 සරල රේඛාවේ අනුක්‍රමණය (gradient) කීයද? (What is the gradient of the line y = 2x + 3?)', '2', '3', '-2', '1/2', 'A', 'සරල රේඛා සමීකරණය y = mx + c ආකාරයෙන් ලියූ විට m යනු අනුක්‍රමණය වේ. මෙහි m = 2 වේ. නිවැරදි පිළිතුර A වේ.'),
  ('Q-02-04', 'PAPER-EXAM-02', 4, 'ලක්ෂ්‍ය (0, 0) සහ (3, 4) අතර දුර කොපමණද? (What is the distance between points (0, 0) and (3, 4)?)', '3', '4', '5', '7', 'C', 'දුර සූත්‍රය d = √[(x₂ - x₁)² + (y₂ - y₁)²].\nd = √[(3 - 0)² + (4 - 0)²] = √(9 + 16) = √25 = 5. නිවැරදි පිළිතුර C (5) වේ.')
ON CONFLICT (id) DO NOTHING;
