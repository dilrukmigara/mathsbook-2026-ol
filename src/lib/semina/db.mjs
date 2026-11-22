import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {SEMINAR} from './config.mjs';
const local = () => process.env.SEMINA_LOCAL_DATA === '1' && process.env.NODE_ENV !== 'production' && !process.env.VERCEL;
let queue = Promise.resolve();
function localAction(action) {
  const job = queue.then(async () => {
    const file = path.join(process.cwd(), 'data', 'semina.json');
    let rows;
    try { rows = JSON.parse(await fs.readFile(file, 'utf8')); } catch (e) {if(e.code !== 'ENOENT') throw e; rows = [];}
    const result = action(rows);
    await fs.mkdir(path.dirname(file), {recursive:true});
    await fs.writeFile(`${file}.tmp`, JSON.stringify(rows));
    await fs.rename(`${file}.tmp`, file);
    return result;
  });
  queue = job.catch(() => {}); return job;
}
function client() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Seminar registration storage is not configured');
  return createClient(url, key, {auth:{persistSession:false, autoRefreshToken:false}});
}
function checked(result) { if(result.error) throw new Error('Seminar database unavailable'); return result.data; }
export async function register(value) {
  const id = randomUUID();
  const row = {...value, id, event_key: SEMINAR.key, registration_code:`MB-${id.slice(0,8).toUpperCase()}`, created_at:new Date().toISOString(), group_status:'unchecked', message_status:'pending', payment_status:'pending', attendance:'unknown', notes:'', notification_status:'pending'};
  if(local()) return localAction(rows => {
    const previous = rows.find(r => r.request_id === row.request_id || (r.event_key === row.event_key && r.whatsapp_number === row.whatsapp_number && r.student_name.toLocaleLowerCase() === row.student_name.toLocaleLowerCase()));
    if(previous) return {created:false};
    rows.unshift(row); return {created:true, row};
  });
  const result = await client().from('seminar_registrations').insert(row).select().single();
  if(result.error?.code === '23505') return {created:false};
  return {created:true, row:checked(result)};
}
export async function listRegistrations() {
  if(local()) return localAction(rows => rows.filter(r=>r.event_key===SEMINAR.key));
  // Paginate instead of silently truncating at Supabase's default row limit.
  const rows = []; const db = client();
  for(let from=0;;from+=500) {
    const batch = checked(await db.from('seminar_registrations').select('*').eq('event_key',SEMINAR.key).order('created_at',{ascending:false}).order('id').range(from,from+499));
    rows.push(...batch); if(batch.length < 500) return rows;
  }
}
export async function updateRegistration(id, changes) {
  if(local()) return localAction(rows => {const row=rows.find(r=>r.id===id && r.event_key===SEMINAR.key); if(!row) throw new Error('Registration not found'); Object.assign(row, changes); return row;});
  return checked(await client().from('seminar_registrations').update(changes).eq('id',id).eq('event_key',SEMINAR.key).select().single());
}
export async function claimNotification(id) {
  if(local()) return localAction(rows => {const row=rows.find(r=>r.id===id); if(!row || !['pending','failed','not_configured'].includes(row.notification_status)) return null; row.notification_status='sending'; return {...row};});
  return checked(await client().from('seminar_registrations').update({notification_status:'sending'}).eq('id',id).eq('event_key',SEMINAR.key).in('notification_status',['pending','failed','not_configured']).select().maybeSingle());
}
