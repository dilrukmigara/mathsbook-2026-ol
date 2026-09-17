import { supabase } from '../auth/supabaseClient.js';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TOPICS_FILE = path.join(DATA_DIR, 'paper_topics.json');
const PAPERS_FILE = path.join(DATA_DIR, 'papers.json');

// Ensure data directory and default files exist
function ensureDataFiles() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TOPICS_FILE)) {
      const defaultTopics = [
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
      fs.writeFileSync(TOPICS_FILE, JSON.stringify(defaultTopics, null, 2));
    }

    if (!fs.existsSync(PAPERS_FILE)) {
      const defaultPapers = [
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
      fs.writeFileSync(PAPERS_FILE, JSON.stringify(defaultPapers, null, 2));
    }
  } catch (err) {
    console.error('[Papers DB] Local init error:', err.message);
  }
}

// Read local topics
export function getLocalTopics() {
  ensureDataFiles();
  try {
    const data = fs.readFileSync(TOPICS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

// Save local topics
export function saveLocalTopics(topics) {
  ensureDataFiles();
  try {
    fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2));
  } catch (err) {
    console.error('[Papers DB] Failed to save topics:', err.message);
  }
}

// Read local papers
export function getLocalPapers() {
  ensureDataFiles();
  try {
    const data = fs.readFileSync(PAPERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

// Save local papers
export function saveLocalPapers(papers) {
  ensureDataFiles();
  try {
    fs.writeFileSync(PAPERS_FILE, JSON.stringify(papers, null, 2));
  } catch (err) {
    console.error('[Papers DB] Failed to save papers:', err.message);
  }
}

// Fetch topics (with Supabase fallback to local)
export async function getTopics(grade = null) {
  ensureDataFiles();
  try {
    let query = supabase.from('paper_topics').select('*').order('created_at', { ascending: false });
    if (grade) {
      query = query.eq('grade', grade);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      const local = getLocalTopics();
      return grade ? local.filter(t => t.grade === grade) : local;
    }
    return data.map(d => ({
      id: d.id,
      name: d.name,
      grade: d.grade,
      description: d.description,
      createdAt: d.created_at
    }));
  } catch (err) {
    const local = getLocalTopics();
    return grade ? local.filter(t => t.grade === grade) : local;
  }
}

// Create new topic
export async function createTopic({ name, grade, description = '' }) {
  ensureDataFiles();
  const id = 'TOPIC-' + Math.floor(100000 + Math.random() * 900000);
  const newTopic = {
    id,
    name: name.trim(),
    grade,
    description: description.trim(),
    createdAt: new Date().toISOString()
  };

  // Save to local
  const topics = getLocalTopics();
  topics.unshift(newTopic);
  saveLocalTopics(topics);

  // Attempt Supabase
  try {
    await supabase.from('paper_topics').insert([{
      id: newTopic.id,
      name: newTopic.name,
      grade: newTopic.grade,
      description: newTopic.description,
      created_at: newTopic.createdAt
    }]);
  } catch (err) {
    console.warn('[Papers DB] Supabase topic insert ignored:', err.message);
  }

  return newTopic;
}

// Delete topic
export async function deleteTopic(topicId) {
  ensureDataFiles();
  const topics = getLocalTopics();
  const filtered = topics.filter(t => t.id !== topicId);
  saveLocalTopics(filtered);

  try {
    await supabase.from('paper_topics').delete().eq('id', topicId);
  } catch (err) {
    console.warn('[Papers DB] Supabase topic delete ignored:', err.message);
  }

  return { success: true };
}

// Fetch papers
export async function getPapers({ grade = null, topicId = null } = {}) {
  ensureDataFiles();
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
  ensureDataFiles();
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

  // Save to local
  const papers = getLocalPapers();
  papers.unshift(newPaper);
  saveLocalPapers(papers);

  // Attempt Supabase
  try {
    await supabase.from('papers').insert([{
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
  } catch (err) {
    console.warn('[Papers DB] Supabase paper insert ignored:', err.message);
  }

  return newPaper;
}

// Update paper metadata
export async function updatePaper(paperId, updates) {
  ensureDataFiles();
  const papers = getLocalPapers();
  const idx = papers.findIndex(p => p.id === paperId);
  if (idx !== -1) {
    papers[idx] = { ...papers[idx], ...updates };
    saveLocalPapers(papers);
  }

  try {
    const supabaseUpdates = {};
    if (updates.title) supabaseUpdates.title = updates.title;
    if (updates.grade) supabaseUpdates.grade = updates.grade;
    if (updates.topicId) supabaseUpdates.topic_id = updates.topicId;
    if (updates.topicName) supabaseUpdates.topic_name = updates.topicName;
    if (updates.year) supabaseUpdates.year = updates.year;
    if (updates.term) supabaseUpdates.term = updates.term;
    if (updates.downloads !== undefined) supabaseUpdates.downloads = updates.downloads;

    await supabase.from('papers').update(supabaseUpdates).eq('id', paperId);
  } catch (err) {
    console.warn('[Papers DB] Supabase paper update ignored:', err.message);
  }

  return papers[idx] || null;
}

// Delete paper
export async function deletePaper(paperId) {
  ensureDataFiles();
  const papers = getLocalPapers();
  const toDelete = papers.find(p => p.id === paperId);
  const filtered = papers.filter(p => p.id !== paperId);
  saveLocalPapers(filtered);

  // If local file exists, remove it
  if (toDelete && toDelete.fileUrl && toDelete.fileUrl.startsWith('/uploads/papers/')) {
    const localFilePath = path.join(process.cwd(), 'public', toDelete.fileUrl);
    // Don't delete original default template paper
    if (!toDelete.fileUrl.endsWith('/sample_math_paper.pdf') && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
      } catch (e) {
        console.warn('Could not delete physical file:', e.message);
      }
    }
  }

  try {
    await supabase.from('papers').delete().eq('id', paperId);
  } catch (err) {
    console.warn('[Papers DB] Supabase paper delete ignored:', err.message);
  }

  return { success: true };
}

// Increment download count
export async function incrementPaperDownload(paperId) {
  ensureDataFiles();
  const papers = getLocalPapers();
  const idx = papers.findIndex(p => p.id === paperId);
  if (idx !== -1) {
    papers[idx].downloads = (papers[idx].downloads || 0) + 1;
    saveLocalPapers(papers);
  }

  try {
    await supabase.rpc('increment_paper_download', { paper_id: paperId });
  } catch (e) {
    // fallback
  }
}
