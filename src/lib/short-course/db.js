import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
import {promises as fs} from 'node:fs';
import path from 'node:path';

const defaults = {id: 1, title: '100න් 1ක්', introduction: 'විනාඩි 2කින් ගණිතයේ එක අදහසක් පැහැදිලිව ඉගෙන ගමු. වීඩියෝව බලන්න, කෙටි සටහන කියවන්න, ඉන්පසු අදාළ පසුගිය විභාග ප්‍රශ්න විසඳලා බලන්න. දවසින් දවස ඔබේ දැනුම ගොඩනගාගන්න.', intro_video_id: 'RNMhFnaG-yg'};
const local = () => process.env.COURSE_LOCAL_DATA === '1' && process.env.NODE_ENV !== 'production' && !process.env.VERCEL;
const localFile = () => path.join(process.cwd(), 'data', 'short-course.json');
let queue = Promise.resolve();
function localAction(action) {
  const operation = queue.then(async () => {
    let data;
    try { data = JSON.parse(await fs.readFile(localFile(), 'utf8')); }
    catch (e) { if (e.code !== 'ENOENT') throw e; data = {settings: defaults, lessons: ['මිනිස් බල ප්‍රශ්න', 'තීරු බදු', 'වරිපනම් බදු'].map((title, index) => ({id: randomUUID(), title, position: index + 1, description: '', notes: '', video_id: ['tqn0_95UuII', 'qAGG_wvHasA', ''][index], questions: [], published: index < 2})), progress: []}; }
    const result = action(data);
    await fs.mkdir(path.dirname(localFile()), {recursive: true});
    const temporary = `${localFile()}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(data, null, 2));
    await fs.rename(temporary, localFile());
    return result;
  });
  queue = operation.catch(() => {});
  return operation;
}
function client() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('පාඩම් සේවාව සකස් කර නැත. කරුණාකර ගුරුවරයා අමතන්න.');
  return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
}
function checked(result) {
  if (result.error) { console.error('[100n1 database]', result.error.code); throw new Error('දත්ත ලබා ගැනීමට හෝ සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න.'); }
  return result.data;
}
export async function readCourse(includeDrafts = false) {
  if (local()) return localAction(d => ({settings: d.settings, lessons: d.lessons.filter(l => includeDrafts || l.published).sort((a,b) => a.position - b.position || a.title.localeCompare(b.title))}));
  const db = client();
  let query = db.from('short_course_lessons').select('*').order('position').order('title');
  if (!includeDrafts) query = query.eq('published', true);
  const [settings, lessons] = await Promise.all([db.from('short_course_settings').select('*').eq('id', 1).single(), query]);
  return {settings: checked(settings), lessons: checked(lessons)};
}
export async function saveSettings(value) {
  if (local()) return localAction(d => { d.settings = value; return value; });
  return checked(await client().from('short_course_settings').upsert(value).select().single());
}
export async function saveLesson(id, value) {
  if (local()) return localAction(d => {
    if (id && !d.lessons.some(l => l.id === id)) throw new Error('පාඩම හමු නොවීය.');
    const item = {...value, id: id || randomUUID()};
    d.lessons = [...d.lessons.filter(l => l.id !== item.id), item]; return item;
  });
  const query = id ? client().from('short_course_lessons').update(value).eq('id', id) : client().from('short_course_lessons').insert(value);
  return checked(await query.select().single());
}
export async function removeLesson(id) {
  if (local()) return localAction(d => { d.lessons = d.lessons.filter(l => l.id !== id); d.progress = d.progress.filter(p => p.lesson_id !== id); });
  checked(await client().from('short_course_lessons').delete().eq('id', id));
}
export async function readProgress(studentId) {
  if (local()) return localAction(d => d.progress.filter(p => p.student_id === studentId));
  return checked(await client().from('short_course_progress').select('lesson_id, video_id, completed_at').eq('student_id', studentId));
}
export async function completeLesson(studentId, lesson) {
  const record = {student_id: studentId, lesson_id: lesson.id, video_id: lesson.video_id, completed_at: new Date().toISOString()};
  if (local()) return localAction(d => { if (!d.progress.some(p => p.student_id === studentId && p.lesson_id === lesson.id && p.video_id === lesson.video_id)) d.progress.push(record); });
  checked(await client().from('short_course_progress').upsert(record, {onConflict: 'student_id,lesson_id,video_id', ignoreDuplicates: true}));
}
