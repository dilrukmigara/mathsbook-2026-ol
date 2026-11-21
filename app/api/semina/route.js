import {NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {sameOrigin} from '../../../src/lib/short-course/session';
import {validateRegistration} from '../../../src/lib/semina/validation.mjs';
import {register} from '../../../src/lib/semina/db.mjs';
import {notifyAdmin} from '../../../src/lib/semina/notify.mjs';
export const runtime='nodejs';
const attempts=new Map();
function limited(req) {
  const now=Date.now();
  for(const [key,entry] of attempts) if(entry.until<now) attempts.delete(key);
  const ip=(req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  const key=createHash('sha256').update(ip).digest('hex');
  const item=attempts.get(key) || {count:0,until:now+600000};
  if(attempts.size>=5000 && !attempts.has(key)) return true;
  attempts.set(key,{...item,count:item.count+1});return item.count>=10;
}
export async function POST(req) {
  const reply=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
  if(!sameOrigin(req)) return reply({error:'Forbidden'},403);
  if(limited(req)) return reply({error:'කරුණාකර මිනිත්තු කිහිපයකින් නැවත උත්සාහ කරන්න.'},429);
  let value;
  try {const raw=await req.text(); if(raw.length>6000) return reply({error:'තොරතුරු දිග වැඩියි.'},413); value=validateRegistration(JSON.parse(raw));}
  catch(err){return reply({error:err instanceof SyntaxError?'තොරතුරු පරීක්ෂා කරන්න.':err.message},400);}
  try {
    const result=await register(value);
    if(result.created) {
      try {await notifyAdmin(result.row.id);} catch {console.error('[seminar] Notification pending; registration saved');}
    }
    // A duplicate never reveals another student's data or overwrites admin status.
    return reply({success:true,duplicate:!result.created,registrationCode:result.created?result.row.registration_code:null},result.created?201:200);
  } catch {return reply({error:'ලියාපදිංචිය සුරැකීමට නොහැකි විය. නැවත උත්සාහ කරන්න හෝ 072 978 0053 අමතන්න.'},503);}
}
