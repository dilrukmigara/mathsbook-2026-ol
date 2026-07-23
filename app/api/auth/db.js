import { supabase } from './supabaseClient';
import fs from 'fs';
import path from 'path';

// Local storage fallback paths
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
}

function getLocalUsers() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    return [];
  }
}

function saveLocalUser(newUser) {
  const users = getLocalUsers();
  users.push(newUser);
  ensureDataFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
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
        enrolledCourses: data.enrolled_courses || ['paper_revision', 'target_c']
      };
    }
  } catch (err) {
    console.error('[Supabase DB Helper] Failed to connect to Supabase, using JSON file database fallback:', err);
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
  const enrolledCourses = ['paper_revision', 'target_c'];

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
      console.error('[Supabase DB Helper] insert failed, writing to local database file:', error.message);
      saveLocalUser(newUser);
      return newUser;
    }
    
    return newUser;
  } catch (err) {
    console.error('[Supabase DB Helper] Failed to insert row, using local fallback:', err);
    saveLocalUser(newUser);
    return newUser;
  }
}
