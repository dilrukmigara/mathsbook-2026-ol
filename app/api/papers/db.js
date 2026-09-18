import { supabase } from '../auth/supabaseClient.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TOPICS_FILE = path.join(DATA_DIR, 'paper_topics.json');
const PAPERS_FILE = path.join(DATA_DIR, 'papers.json');

// Default initial fallback topics
const DEFAULT_TOPICS = [
  {
    id: 'TOPIC-G10-ALG',
    name: 'Algebra (වීජගණිතය)',
    grade: 'grade_10',
    description: 'Equations, Expressions, and Factorization papers',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TOPIC-G10-GEO',
    name: 'Geometry (ජ්‍යාමිතිය)',
    grade: 'grade_10',
    description: 'Triangles, Angles, and Geometric Theorems',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TOPIC-G10-STAT',
    name: 'Statistics & Probability (සංඛ්‍යානය)',
    grade: 'grade_10',
    description: 'Frequency distributions and basic probability',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TOPIC-G11-ALG',
    name: 'Algebra (වීජගණිතය)',
    grade: 'grade_11',
    description: 'Quadratic equations, graphs, and matrices',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TOPIC-G11-GEO',
    name: 'Geometry & Circles (වෘත්ත ප්‍රමේයයන්)',
    grade: 'grade_11',
    description: 'Circle theorems, tangents, and riders',
    createdAt: new Date().toISOString()
  },
  {
    id: 'TOPIC-G11-TRIG',
    name: 'Trigonometry & Mensuration (ත්‍රිකෝණමිතිය)',
    grade: 'grade_11',
    description: 'Heights, distances, surface areas, and volumes',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_PAPERS = [
  {
    id: 'PAPER-G10-01',
    title: 'Grade 10 Algebra - Unit Test Paper 01',
    grade: 'grade_10',
    topicId: 'TOPIC-G10-ALG',
    topicName: 'Algebra (වීජගණිතය)',
    fileName: 'Grade_10_Algebra_Paper_01.pdf',
    fileUrl: '/uploads/papers/sample_math_paper.pdf',
    fileSize: '485 KB',
    year: '2026',
    term: 'Model Paper',
    downloads: 142,
    createdAt: new Date().toISOString()
  },
  {
    id: 'PAPER-G10-02',
    title: 'Grade 10 Geometry - Circle & Triangle Theorems Paper',
    grade: 'grade_10',
    topicId: 'TOPIC-G10-GEO',
    topicName: 'Geometry (ජ්‍යාමිතිය)',
    fileName: 'Grade_10_Geometry_Paper_01.pdf',
    fileUrl: '/uploads/papers/sample_math_paper.pdf',
    fileSize: '512 KB',
    year: '2026',
    term: 'Term 1 Exam',
    downloads: 98,
    createdAt: new Date().toISOString()
  },
  {
    id: 'PAPER-G11-01',
    title: 'Grade 11 Quadratic Equations & Graphs - Paper 01',
    grade: 'grade_11',
    topicId: 'TOPIC-G11-ALG',
    topicName: 'Algebra (වීජගණිතය)',
    fileName: 'Grade_11_Algebra_Paper_01.pdf',
    fileUrl: '/uploads/papers/sample_math_paper.pdf',
    fileSize: '620 KB',
    year: '2026',
    term: 'O/L Model Paper',
    downloads: 230,
    createdAt: new Date().toISOString()
  },
  {
    id: 'PAPER-G11-02',
    title: 'Grade 11 Circle Theorems & Tangents - Paper 02',
    grade: 'grade_11',
    topicId: 'TOPIC-G11-GEO',
    topicName: 'Geometry & Circles (වෘත්ත ප්‍රමේයයන්)',
    fileName: 'Grade_11_Geometry_Paper_02.pdf',
    fileUrl: '/uploads/papers/sample_math_paper.pdf',
    fileSize: '575 KB',
    year: '2026',
    term: 'Term 2 Exam',
    downloads: 184,
    createdAt: new Date().toISOString()
  }
];

// Ensure local data directory and default files exist (only on local machine, never on Vercel)
function ensureDataFiles() {
  if (process.env.VERCEL) return; // Skip writing on Vercel read-only filesystem
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TOPICS_FILE)) {
      fs.writeFileSync(TOPICS_FILE, JSON.stringify(DEFAULT_TOPICS, null, 2));
    }
    if (!fs.existsSync(PAPERS_FILE)) {
      fs.writeFileSync(PAPERS_FILE, JSON.stringify(DEFAULT_PAPERS, null, 2));
    }
  } catch (err) {
    console.error('[Papers DB] Local file init skipped/failed:', err.message);
  }
}

// Read local topics
export function getLocalTopics() {
  if (process.env.VERCEL) return DEFAULT_TOPICS;
  ensureDataFiles();
  try {
    const data = fs.readFileSync(TOPICS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return DEFAULT_TOPICS;
  }
}

// Save local topics
export function saveLocalTopics(topics) {
  if (process.env.VERCEL) return;
  ensureDataFiles();
  try {
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2));
  } catch (err) {
    console.error('[Papers DB] Failed to save topics:', err.message);
  }
}

// Read local papers
export function getLocalPapers() {
  if (process.env.VERCEL) return DEFAULT_PAPERS;
  ensureDataFiles();
  try {
    const data = fs.readFileSync(PAPERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return DEFAULT_PAPERS;
  }
}

// Save local papers
export function saveLocalPapers(papers) {
  if (process.env.VERCEL) return;
  ensureDataFiles();
  try {
    fs.writeFileSync(PAPERS_FILE, JSON.stringify(papers, null, 2));
  } catch (err) {
    console.error('[Papers DB] Failed to save papers:', err.message);
  }
}

// Fetch topics (with Supabase fallback to local/default)
export async function getTopics(grade = null) {
  try {
    let query = supabase.from('paper_topics').select('*').order('created_at', { ascending: false });
    if (grade) {
      query = query.eq('grade', grade);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      const fallback = getLocalTopics();
      return grade ? fallback.filter(t => t.grade === grade) : fallback;
    }
    return data.map(d => ({
      id: d.id,
      name: d.name,
      grade: d.grade,
      description: d.description,
      createdAt: d.created_at
    }));
  } catch (err) {
    const fallback = getLocalTopics();
    return grade ? fallback.filter(t => t.grade === grade) : fallback;
  }
}

// Create new topic
export async function createTopic({ name, grade, description = '' }) {
  const id = 'TOPIC-' + Math.floor(100000 + Math.random() * 900000);
  const newTopic = {
    id,
    name: name.trim(),
    grade,
    description: description.trim(),
    createdAt: new Date().toISOString()
  };

  // Attempt Supabase insert
  try {
    const { error } = await supabase.from('paper_topics').insert([{
      id: newTopic.id,
      name: newTopic.name,
      grade: newTopic.grade,
      description: newTopic.description,
      created_at: newTopic.createdAt
    }]);

    if (error) {
      console.warn('[Papers DB] Supabase topic insert error:', error.message);
      if (process.env.VERCEL) {
        throw new Error(
          `Supabase හි 'paper_topics' Table එක නොමැත: ${error.message}. ` +
          `කරුණාකර Supabase Dashboard > SQL Editor හි 'paper_topics' Table එක සාදන්න.`
        );
      }
    }
  } catch (err) {
    if (process.env.VERCEL) {
      throw err;
    }
  }

  // Save to local if not on Vercel
  if (!process.env.VERCEL) {
    const topics = getLocalTopics();
    topics.unshift(newTopic);
    saveLocalTopics(topics);
  }

  return newTopic;
}

// Delete topic
export async function deleteTopic(topicId) {
  try {
    const { error } = await supabase.from('paper_topics').delete().eq('id', topicId);
    if (error && process.env.VERCEL) {
      throw new Error(`Supabase topic delete error: ${error.message}`);
    }
  } catch (err) {
    if (process.env.VERCEL) throw err;
  }

  if (!process.env.VERCEL) {
    const topics = getLocalTopics();
    const filtered = topics.filter(t => t.id !== topicId);
    saveLocalTopics(filtered);
  }

  return { success: true };
}

// Fetch papers
export async function getPapers({ grade = null, topicId = null } = {}) {
  try {
    let query = supabase.from('papers').select('*').order('created_at', { ascending: false });
    if (grade) query = query.eq('grade', grade);
    if (topicId) query = query.eq('topic_id', topicId);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let local = getLocalPapers();
      if (grade) local = local.filter(p => p.grade === grade);
      if (topicId) local = local.filter(p => p.topicId === topicId);
      return local;
    }

    return data.map(d => ({
      id: d.id,
      title: d.title,
      grade: d.grade,
      topicId: d.topic_id,
      topicName: d.topic_name,
      fileName: d.file_name,
      fileUrl: d.file_url,
      fileSize: d.file_size,
      year: d.year,
      term: d.term,
      downloads: d.downloads || 0,
      createdAt: d.created_at
    }));
  } catch (err) {
    let local = getLocalPapers();
    if (grade) local = local.filter(p => p.grade === grade);
    if (topicId) local = local.filter(p => p.topicId === topicId);
    return local;
  }
}

// Create new paper
export async function createPaper(paperData) {
  const id = 'PAPER-' + Math.floor(100000 + Math.random() * 900000);
  const newPaper = {
    id,
    title: paperData.title.trim(),
    grade: paperData.grade,
    topicId: paperData.topicId,
    topicName: paperData.topicName || '',
    fileName: paperData.fileName,
    fileUrl: paperData.fileUrl,
    fileSize: paperData.fileSize || 'Unknown size',
    year: paperData.year || new Date().getFullYear().toString(),
    term: paperData.term || 'Model Paper',
    downloads: 0,
    createdAt: new Date().toISOString()
  };

  // Attempt Supabase insert
  try {
    const { error } = await supabase.from('papers').insert([{
      id: newPaper.id,
      title: newPaper.title,
      grade: newPaper.grade,
      topic_id: newPaper.topicId,
      topic_name: newPaper.topicName,
      file_name: newPaper.fileName,
      file_url: newPaper.fileUrl,
      file_size: newPaper.fileSize,
      year: newPaper.year,
      term: newPaper.term,
      downloads: 0,
      created_at: newPaper.createdAt
    }]);

    if (error) {
      console.warn('[Papers DB] Supabase paper insert error:', error.message);
      if (process.env.VERCEL) {
        throw new Error(
          `Supabase හි 'papers' Table එක නොමැත: ${error.message}. ` +
          `කරුණාකර Supabase Dashboard > SQL Editor හි 'papers' Table එක සාදන්න.`
        );
      }
    }
  } catch (err) {
    if (process.env.VERCEL) throw err;
  }

  // Save to local if not on Vercel
  if (!process.env.VERCEL) {
    const papers = getLocalPapers();
    papers.unshift(newPaper);
    saveLocalPapers(papers);
  }

  return newPaper;
}

// Update paper metadata
export async function updatePaper(paperId, updates) {
  try {
    const supabaseUpdates = {};
    if (updates.title) supabaseUpdates.title = updates.title;
    if (updates.grade) supabaseUpdates.grade = updates.grade;
    if (updates.topicId) supabaseUpdates.topic_id = updates.topicId;
    if (updates.topicName) supabaseUpdates.topic_name = updates.topicName;
    if (updates.year) supabaseUpdates.year = updates.year;
    if (updates.term) supabaseUpdates.term = updates.term;
    if (updates.downloads !== undefined) supabaseUpdates.downloads = updates.downloads;

    const { error } = await supabase.from('papers').update(supabaseUpdates).eq('id', paperId);
    if (error && process.env.VERCEL) {
      throw new Error(`Supabase update error: ${error.message}`);
    }
  } catch (err) {
    if (process.env.VERCEL) throw err;
  }

  if (!process.env.VERCEL) {
    const papers = getLocalPapers();
    const idx = papers.findIndex(p => p.id === paperId);
    if (idx !== -1) {
      papers[idx] = { ...papers[idx], ...updates };
      saveLocalPapers(papers);
      return papers[idx];
    }
  }

  return { id: paperId, ...updates };
}

// Delete paper
export async function deletePaper(paperId) {
  try {
    const { error } = await supabase.from('papers').delete().eq('id', paperId);
    if (error && process.env.VERCEL) {
      throw new Error(`Supabase delete error: ${error.message}`);
    }
  } catch (err) {
    if (process.env.VERCEL) throw err;
  }

  if (!process.env.VERCEL) {
    const papers = getLocalPapers();
    const toDelete = papers.find(p => p.id === paperId);
    const filtered = papers.filter(p => p.id !== paperId);
    saveLocalPapers(filtered);

    // If local file exists, remove it
    if (toDelete && toDelete.fileUrl && toDelete.fileUrl.startsWith('/uploads/papers/')) {
      const localFilePath = path.join(process.cwd(), 'public', toDelete.fileUrl);
      if (!toDelete.fileUrl.endsWith('/sample_math_paper.pdf') && fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (e) {
          console.warn('Could not delete physical file:', e.message);
        }
      }
    }
  }

  return { success: true };
}

// Increment download count
export async function incrementPaperDownload(paperId) {
  try {
    await supabase.rpc('increment_paper_download', { paper_id: paperId });
  } catch (e) {
    // fallback
  }

  if (!process.env.VERCEL) {
    const papers = getLocalPapers();
    const idx = papers.findIndex(p => p.id === paperId);
    if (idx !== -1) {
      papers[idx].downloads = (papers[idx].downloads || 0) + 1;
      saveLocalPapers(papers);
    }
  }
}
