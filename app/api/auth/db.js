import { supabase } from './supabaseClient';
import fs from 'fs';
import path from 'path';

// Local storage fallback paths
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFile() {
  if (process.env.VERCEL) return; // Skip local file writing on Vercel
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
  } catch (err) {
    console.error('[Supabase DB Helper] Local file init failed:', err.message);
  }
}

function getLocalUsers() {
  if (process.env.VERCEL) return []; // No local reading on Vercel
  ensureDataFile();
  try {
    const content = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    return [];
  }
}

function saveLocalUser(newUser) {
  if (process.env.VERCEL) {
    throw new Error('Supabase දත්ත සමුදාය සම්බන්ධ කළ නොහැක. කරුණාකර Vercel Dashboard හි Environment Variables (SUPABASE_URL, SUPABASE_ANON_KEY) නිවැරදිව ඇතුළත් කර ඇතිදැයි පරීක්ෂා කරන්න.');
  }
  try {
    const users = getLocalUsers();
    users.push(newUser);
    ensureDataFile();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    throw new Error('දේශීය දත්ත ගබඩා කිරීමට නොහැකි විය: ' + err.message);
  }
}

function saveLocalUsersList(users) {
  if (process.env.VERCEL) return;
  ensureDataFile();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('[Supabase DB Helper] Failed to save local users list:', err.message);
  }
}

export async function findUserByPhone(phone) {
  const normalized = phone.replace(/\s+/g, '').trim();
  
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('phone', normalized)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase DB Helper] table query warning, falling back to local JSON database:', error.message);
      if (process.env.VERCEL) {
        throw new Error('Supabase දත්ත සමුදායේ "students" Table එක නිර්මාණය කර නොමැත. කරුණාකර SQL Editor එකෙහි Table එක සකස් කරන්න.');
      }
      const users = getLocalUsers();
      return users.find(u => u.phone.replace(/\s+/g, '').trim() === normalized);
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        password: data.password,
        createdAt: data.created_at,
        enrolledCourses: data.enrolled_courses || ['free_paper']
      };
    }
  } catch (err) {
    console.error('[Supabase DB Helper] Failed to connect to Supabase:', err);
    if (process.env.VERCEL) {
      throw new Error(err.message || 'Supabase සම්බන්ධතා දෝෂයකි. කරුණාකර Vercel Environment Variables පරීක්ෂා කරන්න.');
    }
    const users = getLocalUsers();
    return users.find(u => u.phone.replace(/\s+/g, '').trim() === normalized);
  }
  
  return null;
}

export async function createUser(userData) {
  const normalizedPhone = userData.phone.replace(/\s+/g, '').trim();
  const password = userData.password ? userData.password.trim() : '';
  const name = userData.name || 'Student';
  const id = 'STU-' + Math.floor(100000 + Math.random() * 900000);
  const createdAt = new Date().toISOString();
  
  // Every student is enrolled in 'free_paper' by default
  const enrolledCourses = ['free_paper'];

  const newUser = {
    id,
    name,
    phone: normalizedPhone,
    password,
    createdAt,
    enrolledCourses
  };

  try {
    const { error } = await supabase
      .from('students')
      .insert([
        {
          id,
          name,
          phone: normalizedPhone,
          password,
          created_at: createdAt,
          enrolled_courses: enrolledCourses
        }
      ]);

    if (error) {
      console.error('[Supabase DB Helper] insert failed:', error.message);
      saveLocalUser(newUser);
      return newUser;
    }
    
    return newUser;
  } catch (err) {
    console.error('[Supabase DB Helper] Failed to insert row:', err);
    saveLocalUser(newUser);
    return newUser;
  }
}

// ADMIN HELPER: Get all students
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase DB Helper] getAllUsers failed, using local database fallback:', error.message);
      return getLocalUsers().reverse();
    }

    return (data || []).map(d => ({
      id: d.id,
      name: d.name,
      phone: d.phone,
      password: d.password,
      createdAt: d.created_at,
      enrolledCourses: d.enrolled_courses || ['free_paper']
    }));
  } catch (err) {
    console.error('[Supabase DB Helper] getAllUsers error:', err);
    return getLocalUsers().reverse();
  }
}

// ADMIN HELPER: Update enrolled courses
export async function updateUserCourses(studentId, enrolledCourses) {
  // Ensure 'free_paper' is always included
  if (!enrolledCourses.includes('free_paper')) {
    enrolledCourses.push('free_paper');
  }

  try {
    const { error } = await supabase
      .from('students')
      .update({ enrolled_courses: enrolledCourses })
      .eq('id', studentId);

    if (error) {
      console.warn('[Supabase DB Helper] updateUserCourses failed, updating local database fallback:', error.message);
      const users = getLocalUsers();
      const userIdx = users.findIndex(u => u.id === studentId);
      if (userIdx !== -1) {
        users[userIdx].enrolledCourses = enrolledCourses;
        saveLocalUsersList(users);
      }
      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.error('[Supabase DB Helper] updateUserCourses error:', err);
    const users = getLocalUsers();
    const userIdx = users.findIndex(u => u.id === studentId);
    if (userIdx !== -1) {
      users[userIdx].enrolledCourses = enrolledCourses;
      saveLocalUsersList(users);
    }
    return { success: true };
  }
}
