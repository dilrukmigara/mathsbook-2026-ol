import { supabase } from '../auth/supabaseClient.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const EXAMS_FILE = path.join(DATA_DIR, 'exams.json');

// Default sample papers with high quality Mathematics questions
const DEFAULT_PAPERS = [
  {
    id: 'PAPER-EXAM-01',
    paper_number: 1,
    title: 'Paper 1 - O/L Mathematics Model MCQ Paper',
    grade: 'grade_11',
    duration_minutes: 30,
    total_questions: 5,
    description: 'Essential Grade 10 & 11 Mathematics MCQ questions covering Algebra, Geometry, and Numbers.',
    status: 'published',
    created_at: new Date('2026-09-01T08:00:00.000Z').toISOString(),
    questions: [
      {
        id: 'Q-01-01',
        paper_id: 'PAPER-EXAM-01',
        question_number: 1,
        question_text: '2x + 5 = 15 නම් x හි අගය කීයද? (If 2x + 5 = 15, what is the value of x?)',
        option_a: '3',
        option_b: '5',
        option_c: '7',
        option_d: '10',
        correct_answer: 'B',
        explanation: '2x + 5 = 15 සමීකරණය විසඳීම:\n2x = 15 - 5\n2x = 10\nx = 10 / 2 = 5 වේ. එබැවින් නිවැරදි පිළිතුර B (5) වේ.'
      },
      {
        id: 'Q-01-02',
        paper_id: 'PAPER-EXAM-01',
        question_number: 2,
        question_text: 'අරය 7 cm වන වෘත්තයක පරිධිය සොයන්න. (Find the circumference of a circle with radius 7 cm. Take π = 22/7)',
        option_a: '22 cm',
        option_b: '44 cm',
        option_c: '88 cm',
        option_d: '154 cm',
        correct_answer: 'B',
        explanation: 'වෘත්තයක පරිධිය C = 2πr සූත්‍රයෙන් ගණනය කෙරේ.\nC = 2 × (22/7) × 7 = 2 × 22 = 44 cm.\nඑබැවින් නිවැරදි පිළිතුර B (44 cm) වේ.'
      },
      {
        id: 'Q-01-03',
        paper_id: 'PAPER-EXAM-01',
        question_number: 3,
        question_text: 'x² - 9 හි සාධක මොනවාද? (What are the factors of x² - 9?)',
        option_a: '(x - 3)(x - 3)',
        option_b: '(x + 3)(x + 3)',
        option_c: '(x - 3)(x + 3)',
        option_d: '(x - 9)(x + 1)',
        correct_answer: 'C',
        explanation: 'වර්ග දෙකක අන්තරය සූත්‍රය: a² - b² = (a - b)(a + b).\nමෙහි x² - 9 = x² - 3² = (x - 3)(x + 3) වේ. නිවැරදි පිළිතුර C වේ.'
      },
      {
        id: 'Q-01-04',
        paper_id: 'PAPER-EXAM-01',
        question_number: 4,
        question_text: 'සමපාද ත්‍රිකෝණයක එක් කෝණයක අගය කීයද? (What is the magnitude of an angle in an equilateral triangle?)',
        option_a: '45°',
        option_b: '60°',
        option_c: '90°',
        option_d: '180°',
        correct_answer: 'B',
        explanation: 'සමපාද ත්‍රිකෝණයක පාද තුනම සමාන වන අතර කෝණ තුනම සමාන වේ. ත්‍රිකෝණයක අභ්‍යන්තර කෝණවල එකතුව 180° බැවින් එක් කෝණයක් 180° / 3 = 60° වේ. නිවැරදි පිළිතුර B වේ.'
      },
      {
        id: 'Q-01-05',
        paper_id: 'PAPER-EXAM-01',
        question_number: 5,
        question_text: 'සාධාරණ දාදු කැටයක් උඩ දැමූ විට ඉරට්ටේ අංකයක් ලැබීමේ සම්භාවිතාව කීයද? (What is the probability of getting an even number when rolling a fair six-sided die?)',
        option_a: '1/6',
        option_b: '1/3',
        option_c: '1/2',
        option_d: '2/3',
        correct_answer: 'C',
        explanation: 'දාදු කැටයක මුළු ප්‍රතිඵල සංඛ්‍යාව S = {1, 2, 3, 4, 5, 6} (මුළු 6). ඉරට්ටේ අංක = {2, 4, 6} (3ක්). සම්භාවිතාව = 3/6 = 1/2. නිවැරදි පිළිතුර C (1/2) වේ.'
      }
    ]
  },
  {
    id: 'PAPER-EXAM-02',
    paper_number: 2,
    title: 'Paper 2 - Grade 10 & 11 Speed Revision MCQ Paper',
    grade: 'grade_10',
    duration_minutes: 25,
    total_questions: 4,
    description: 'Fast practice revision paper focusing on Indices, Percentages, and Coordinate Geometry.',
    status: 'published',
    created_at: new Date('2026-09-05T08:00:00.000Z').toISOString(),
    questions: [
      {
        id: 'Q-02-01',
        paper_id: 'PAPER-EXAM-02',
        question_number: 1,
        question_text: '2⁴ හි අගය කීයද? (What is the value of 2⁴?)',
        option_a: '8',
        option_b: '12',
        option_c: '16',
        option_d: '32',
        correct_answer: 'C',
        explanation: '2⁴ = 2 × 2 × 2 × 2 = 16. නිවැරදි පිළිතුර C වේ.'
      },
      {
        id: 'Q-02-02',
        paper_id: 'PAPER-EXAM-02',
        question_number: 2,
        question_text: 'රු. 5000 ක භාණ්ඩයකට 10% වට්ටමක් ලබා දුන් පසු එහි නව මිල කීයද? (What is the discounted price of an item marked at Rs. 5000 with a 10% discount?)',
        option_a: 'රු. 4000',
        option_b: 'රු. 4500',
        option_c: 'රු. 4800',
        option_d: 'රු. 4900',
        correct_answer: 'B',
        explanation: 'වට්ටම = 5000 × (10/100) = රු. 500.\nනව මිල = 5000 - 500 = රු. 4500. නිවැරදි පිළිතුර B වේ.'
      },
      {
        id: 'Q-02-03',
        paper_id: 'PAPER-EXAM-02',
        question_number: 3,
        question_text: 'y = 2x + 3 සරල රේඛාවේ අනුක්‍රමණය (gradient) කීයද? (What is the gradient of the line y = 2x + 3?)',
        option_a: '2',
        option_b: '3',
        option_c: '-2',
        option_d: '1/2',
        correct_answer: 'A',
        explanation: 'සරල රේඛා සමීකරණය y = mx + c ආකාරයෙන් ලියූ විට m යනු අනුක්‍රමණය වේ. මෙහි m = 2 වේ. නිවැරදි පිළිතුර A වේ.'
      },
      {
        id: 'Q-02-04',
        paper_id: 'PAPER-EXAM-02',
        question_number: 4,
        question_text: 'ලක්ෂ්‍ය (0, 0) සහ (3, 4) අතර දුර කොපමණද? (What is the distance between points (0, 0) and (3, 4)?)',
        option_a: '3',
        option_b: '4',
        option_c: '5',
        option_d: '7',
        correct_answer: 'C',
        explanation: 'දුර සූත්‍රය d = √[(x₂ - x₁)² + (y₂ - y₁)²].\nd = √[(3 - 0)² + (4 - 0)²] = √(9 + 16) = √25 = 5. නිවැරදි පිළිතුර C (5) වේ.'
      }
    ]
  }
];

// Helper: Ensure local fallback file exists (only when not on Vercel)
function ensureLocalExamsFile() {
  if (process.env.VERCEL) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(EXAMS_FILE)) {
      fs.writeFileSync(EXAMS_FILE, JSON.stringify(DEFAULT_PAPERS, null, 2));
    }
  } catch (err) {
    console.error('[Exams DB] Local file init skipped/failed:', err.message);
  }
}

// Helper: Read local papers
export function getLocalExams() {
  if (process.env.VERCEL) return DEFAULT_PAPERS;
  ensureLocalExamsFile();
  try {
    const data = fs.readFileSync(EXAMS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return DEFAULT_PAPERS;
  }
}

// Helper: Save local papers
export function saveLocalExams(exams) {
  if (process.env.VERCEL) return;
  ensureLocalExamsFile();
  try {
    fs.writeFileSync(EXAMS_FILE, JSON.stringify(exams, null, 2));
  } catch (err) {
    console.error('[Exams DB] Failed to save exams locally:', err.message);
  }
}

// Motivation message based on percentage
export function getMotivationalFeedback(percentage) {
  if (percentage >= 75) {
    return {
      tier: 'excellent',
      title: '🌟 Excellent work!',
      message: 'Excellent work! Keep it up and continue practising.',
      messageSi: 'විශිෂ්ටයි! ඔබ ඉතා ඉහළ දක්ෂතාවක් පෙන්වා ඇත. දිගටම පුහුණු වන්න.',
      color: '#2E7D32',
      badgeBg: 'rgba(46, 125, 50, 0.12)',
      badgeBorder: '#2E7D32'
    };
  } else if (percentage >= 50) {
    return {
      tier: 'good',
      title: '👏 Good effort!',
      message: 'Good effort! Review your mistakes and practise more.',
      messageSi: 'හොඳ උත්සාහයක්! වැරදුණු ප්‍රශ්න නැවත බලා වැඩිපුර පුහුණු වන්න.',
      color: '#E65100',
      badgeBg: 'rgba(230, 81, 0, 0.12)',
      badgeBorder: '#E65100'
    };
  } else if (percentage >= 35) {
    return {
      tier: 'pass',
      title: '📖 Keep going!',
      message: 'Keep going! Review the theory and try again.',
      messageSi: 'උත්සාහය අත්හරින්න එපා! අදාළ සිද්ධාන්ත නැවත මතක් කරගෙන නැවත උත්සාහ කරන්න.',
      color: '#D84315',
      badgeBg: 'rgba(216, 67, 21, 0.12)',
      badgeBorder: '#D84315'
    };
  } else {
    return {
      tier: 'encouraging',
      title: "💪 Don't give up!",
      message: "Don't give up! Learn from your mistakes, review the explanations, and try again.",
      messageSi: 'පසුබට වන්න එපා! වැරදි වලින් ඉගෙන ගෙන, විවරණ කියවා නැවත උත්සාහ කරන්න.',
      color: '#C62828',
      badgeBg: 'rgba(198, 40, 40, 0.12)',
      badgeBorder: '#C62828'
    };
  }
}

// RFC 4180 compliant CSV Parser supporting quotes and multi-line explanations
export function parseCsvQuestions(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    return { valid: false, errors: ['CSV ගොනුවේ අන්තර්ගතය හිස්ය (CSV content is empty).'], questions: [] };
  }

  // Split lines while preserving quoted newlines
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some(f => f.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(f => f.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) {
    return {
      valid: false,
      errors: ['CSV ගොනුවේ අවම වශයෙන් එක් ප්‍රශ්නයක්වත් තිබිය යුතුය (At least 1 question row required below header).'],
      questions: []
    };
  }

  // Header check
  const header = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  // Expected columns: Question, Answer A, Answer B, Answer C, Answer D, Answer, Explanation
  
  const parsedQuestions = [];
  const errors = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rowNumber = r + 1;

    if (row.length < 6) {
      errors.push(`Row ${rowNumber}: තීරු (Columns) 6ක් හෝ 7ක් අවශ්‍යයි. හමු වූයේ ${row.length}කි.`);
      continue;
    }

    const questionText = row[0] || '';
    const optionA = row[1] || '';
    const optionB = row[2] || '';
    const optionC = row[3] || '';
    const optionD = row[4] || '';
    const rawAnswer = (row[5] || '').toUpperCase().trim();
    const explanation = row[6] || '';

    if (!questionText) {
      errors.push(`Row ${rowNumber}: ප්‍රශ්නය (Question) හිස් විය නොහැක.`);
      continue;
    }
    if (!optionA || !optionB || !optionC || !optionD) {
      errors.push(`Row ${rowNumber}: A, B, C, D යන සියලුම පිළිතුරු විකල්ප ඇතුළත් විය යුතුය.`);
      continue;
    }

    // Clean answer key (accept A, B, C, D or 1, 2, 3, 4)
    let cleanAnswer = rawAnswer;
    if (cleanAnswer === '1') cleanAnswer = 'A';
    if (cleanAnswer === '2') cleanAnswer = 'B';
    if (cleanAnswer === '3') cleanAnswer = 'C';
    if (cleanAnswer === '4') cleanAnswer = 'D';

    if (!['A', 'B', 'C', 'D'].includes(cleanAnswer)) {
      errors.push(`Row ${rowNumber}: නිවැරදි පිළිතුර (Answer) A, B, C, හෝ D විය යුතුය. (ඇතුළත් කර ඇත්තේ: "${rawAnswer}")`);
      continue;
    }

    parsedQuestions.push({
      question_number: parsedQuestions.length + 1,
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_answer: cleanAnswer,
      explanation: explanation || 'මෙම ප්‍රශ්නය සඳහා විවරණයක් සපයා නොමැත.'
    });
  }

  return {
    valid: errors.length === 0 && parsedQuestions.length > 0,
    errors,
    questions: parsedQuestions
  };
}

// Fetch all published exam papers for students and admin
export async function getExamPapers() {
  try {
    const { data, error } = await supabase
      .from('exam_papers')
      .select('*')
      .order('paper_number', { ascending: true });

    if (error || !data || data.length === 0) {
      const local = getLocalExams();
      return local.map(p => ({
        id: p.id,
        paper_number: p.paper_number,
        title: p.title,
        grade: p.grade,
        duration_minutes: p.duration_minutes,
        total_questions: p.questions ? p.questions.length : (p.total_questions || 0),
        description: p.description,
        status: p.status,
        created_at: p.created_at
      }));
    }

    return data.map(p => ({
      id: p.id,
      paper_number: p.paper_number,
      title: p.title,
      grade: p.grade,
      duration_minutes: p.duration_minutes,
      total_questions: p.total_questions || 0,
      description: p.description,
      status: p.status,
      created_at: p.created_at
    }));
  } catch (err) {
    const local = getLocalExams();
    return local.map(p => ({
      id: p.id,
      paper_number: p.paper_number,
      title: p.title,
      grade: p.grade,
      duration_minutes: p.duration_minutes,
      total_questions: p.questions ? p.questions.length : (p.total_questions || 0),
      description: p.description,
      status: p.status,
      created_at: p.created_at
    }));
  }
}

// Fetch single paper with its questions
export async function getExamPaperById(paperId, includeAnswers = false) {
  try {
    // 1. Fetch paper metadata
    const { data: paperData, error: paperError } = await supabase
      .from('exam_papers')
      .select('*')
      .eq('id', paperId)
      .maybeSingle();

    let paper = paperData;
    let questions = [];

    if (!paperError && paper) {
      // 2. Fetch questions from Supabase
      const { data: qData, error: qError } = await supabase
        .from('exam_questions')
        .select('*')
        .eq('paper_id', paperId)
        .order('question_number', { ascending: true });

      if (!qError && qData) {
        questions = qData;
      }
    }

    // Fallback to local
    if (!paper) {
      const local = getLocalExams();
      paper = local.find(p => p.id === paperId);
      if (paper && paper.questions) {
        questions = paper.questions;
      }
    }

    if (!paper) return null;

    // Filter questions if student taking exam (hide correct_answer & explanation)
    const sanitizedQuestions = questions.map(q => {
      const base = {
        id: q.id,
        paper_id: q.paper_id,
        question_number: q.question_number,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d
      };
      if (includeAnswers) {
        base.correct_answer = q.correct_answer;
        base.explanation = q.explanation;
      }
      return base;
    });

    return {
      ...paper,
      questions: sanitizedQuestions
    };
  } catch (err) {
    const local = getLocalExams();
    const paper = local.find(p => p.id === paperId);
    if (!paper) return null;
    return paper;
  }
}

// Create new paper with questions
export async function createExamPaper({ title, paperNumber, grade = 'grade_11', durationMinutes = 45, description = '', questions = [] }) {
  const allPapers = await getExamPapers();
  const nextNumber = paperNumber ? parseInt(paperNumber) : (allPapers.length + 1);
  const paperId = `PAPER-EXAM-${String(nextNumber).padStart(2, '0')}`;

  const newPaper = {
    id: paperId,
    paper_number: nextNumber,
    title: title.trim(),
    grade,
    duration_minutes: parseInt(durationMinutes) || 45,
    total_questions: questions.length,
    description: description.trim(),
    status: 'published',
    created_at: new Date().toISOString()
  };

  const formattedQuestions = questions.map((q, idx) => ({
    id: `Q-${String(nextNumber).padStart(2, '0')}-${String(idx + 1).padStart(2, '0')}`,
    paper_id: paperId,
    question_number: idx + 1,
    question_text: q.question_text,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    correct_answer: q.correct_answer,
    explanation: q.explanation || 'මෙම ප්‍රශ්නය සඳහා විවරණයක් සපයා නොමැත.',
    created_at: new Date().toISOString()
  }));

  // Save to Supabase
  try {
    const { error: pErr } = await supabase.from('exam_papers').insert([newPaper]);
    if (pErr) console.warn('[Exams DB] Supabase paper insert warning:', pErr.message);

    if (formattedQuestions.length > 0) {
      const { error: qErr } = await supabase.from('exam_questions').insert(formattedQuestions);
      if (qErr) console.warn('[Exams DB] Supabase questions insert warning:', qErr.message);
    }
  } catch (err) {
    console.warn('[Exams DB] Supabase error:', err.message);
  }

  // Save to local fallback if not on Vercel
  if (!process.env.VERCEL) {
    const local = getLocalExams();
    local.push({ ...newPaper, questions: formattedQuestions });
    saveLocalExams(local);
  }

  return { ...newPaper, questions: formattedQuestions };
}

// Delete paper
export async function deleteExamPaper(paperId) {
  try {
    await supabase.from('exam_questions').delete().eq('paper_id', paperId);
    await supabase.from('exam_papers').delete().eq('id', paperId);
    await supabase.from('exam_attempts').delete().eq('paper_id', paperId);
  } catch (err) {
    console.warn('[Exams DB] Supabase delete warning:', err.message);
  }

  if (!process.env.VERCEL) {
    const local = getLocalExams();
    const filtered = local.filter(p => p.id !== paperId);
    saveLocalExams(filtered);
  }

  return { success: true };
}

// Evaluate Student Exam Attempt
export async function evaluateExamAttempt({ studentId, studentName, studentPhone, paperId, answers = {} }) {
  // Fetch paper with complete correct answers and explanations
  const fullPaper = await getExamPaperById(paperId, true);
  if (!fullPaper || !fullPaper.questions || fullPaper.questions.length === 0) {
    throw new Error('Exam paper not found or has no questions.');
  }

  const questions = fullPaper.questions;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const reviewList = questions.map(q => {
    const studentAnswer = (answers[q.id] || answers[q.question_number] || '').toUpperCase();
    const isCorrect = studentAnswer === q.correct_answer;
    
    if (!studentAnswer) {
      unansweredCount++;
    } else if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    return {
      question_id: q.id,
      question_number: q.question_number,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      student_answer: studentAnswer || 'නොකළ (Unanswered)',
      correct_answer: q.correct_answer,
      is_correct: isCorrect,
      explanation: q.explanation
    };
  });

  const totalQuestions = questions.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const motivation = getMotivationalFeedback(percentage);

  const attemptResult = {
    paper_id: paperId,
    paper_title: fullPaper.title,
    student_id: studentId || 'GUEST',
    student_name: studentName || 'Student',
    student_phone: studentPhone || '',
    total_questions: totalQuestions,
    correct_answers: correctCount,
    incorrect_answers: incorrectCount,
    unanswered: unansweredCount,
    marks: correctCount,
    percentage,
    motivation,
    submitted_at: new Date().toISOString(),
    review: reviewList
  };

  // Record attempt in Supabase if table exists
  try {
    await supabase.from('exam_attempts').insert([{
      id: 'ATTEMPT-' + Math.floor(100000 + Math.random() * 900000),
      student_id: studentId,
      student_name: studentName,
      student_phone: studentPhone,
      paper_id: paperId,
      paper_title: fullPaper.title,
      score: correctCount,
      total: totalQuestions,
      percentage,
      answers,
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    // Non-blocking
  }

  return attemptResult;
}
