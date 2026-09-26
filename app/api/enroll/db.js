import { supabase } from '../auth/supabaseClient';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ENROLLMENTS_FILE = path.join(DATA_DIR, 'enrollments.json');

function ensureDataFile() {
  if (process.env.VERCEL) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ENROLLMENTS_FILE)) {
      fs.writeFileSync(ENROLLMENTS_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.error('[Enrollments DB] Local file init failed:', err.message);
  }
}

function getLocalEnrollments() {
  if (process.env.VERCEL) return [];
  ensureDataFile();
  try {
    const content = fs.readFileSync(ENROLLMENTS_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    return [];
  }
}

function saveLocalEnrollment(newRecord) {
  if (process.env.VERCEL) return;
  ensureDataFile();
  try {
    const list = getLocalEnrollments();
    list.unshift(newRecord);
    fs.writeFileSync(ENROLLMENTS_FILE, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('[Enrollments DB] Failed to save locally:', err.message);
  }
}

function deleteLocalEnrollment(id) {
  if (process.env.VERCEL) return;
  ensureDataFile();
  try {
    const list = getLocalEnrollments().filter(item => item.id !== id);
    fs.writeFileSync(ENROLLMENTS_FILE, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('[Enrollments DB] Failed to delete locally:', err.message);
  }
}

export async function saveEnrollment(data) {
  const enrollmentRecord = {
    id: data.id || 'MB-' + Math.floor(100000 + Math.random() * 900000),
    student_name: data.studentName || data.student_name || '',
    contact_number: data.contactNumber || data.contact_number || '',
    whatsapp_number: data.whatsappNumber || data.whatsapp_number || '',
    school_name: data.schoolName || data.school_name || '',
    last_term_marks: parseFloat(data.lastTermMarks || data.last_term_marks || 0),
    course: data.course || '',
    status: data.status || 'pending',
    created_at: new Date().toISOString()
  };

  try {
    const { data: inserted, error } = await supabase
      .from('enrollments')
      .insert([enrollmentRecord])
      .select();

    if (error) {
      console.warn('[Enrollments DB] Supabase insert warning, saving locally:', error.message);
      saveLocalEnrollment(enrollmentRecord);
      return { success: true, enrollment: enrollmentRecord, storage: 'local_fallback', warning: error.message };
    }

    // Backup locally
    saveLocalEnrollment(enrollmentRecord);
    return { success: true, enrollment: (inserted && inserted[0]) || enrollmentRecord, storage: 'supabase' };
  } catch (err) {
    console.error('[Enrollments DB] Save error:', err);
    saveLocalEnrollment(enrollmentRecord);
    return { success: true, enrollment: enrollmentRecord, storage: 'local_fallback', error: err.message };
  }
}

export async function getAllEnrollments() {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Enrollments DB] Supabase fetch warning, reading locally:', error.message);
      return getLocalEnrollments();
    }

    if (Array.isArray(data) && data.length > 0) {
      return data.map(d => ({
        id: d.id,
        studentName: d.student_name,
        contactNumber: d.contact_number,
        whatsappNumber: d.whatsapp_number,
        schoolName: d.school_name,
        lastTermMarks: d.last_term_marks,
        course: d.course,
        status: d.status || 'pending',
        createdAt: d.created_at
      }));
    }

    return getLocalEnrollments();
  } catch (err) {
    console.error('[Enrollments DB] getAllEnrollments error:', err);
    return getLocalEnrollments();
  }
}

export async function deleteEnrollment(id) {
  try {
    deleteLocalEnrollment(id);
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('[Enrollments DB] Supabase delete warning:', error.message);
    }
    return { success: true };
  } catch (err) {
    deleteLocalEnrollment(id);
    return { success: true };
  }
}
