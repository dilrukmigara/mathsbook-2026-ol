import {NextResponse} from 'next/server';
import {requireAdmin} from '../../../../src/lib/short-course/session';
import {listRegistrations,updateRegistration} from '../../../../src/lib/semina/db.mjs';
import {validateUpdate} from '../../../../src/lib/semina/validation.mjs';
import {notifyAdmin} from '../../../../src/lib/semina/notify.mjs';
export const runtime='nodejs';
const reply=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req) {
  const denied=await requireAdmin(req);if(denied)return denied;
  try{return reply({rows:await listRegistrations()});}catch{return reply({error:'ලියාපදිංචි තොරතුරු ලබාගත නොහැක. Database setup එක පරීක්ෂා කරන්න.'},503);}
}
export async function PATCH(req) {
  const denied=await requireAdmin(req);if(denied)return denied;
  let body,changes;
  try {body=await req.json();changes=validateUpdate(body);}catch(e){return reply({error:e.message},400);}
  try{return reply({row:await updateRegistration(body.id,changes)});}catch{return reply({error:'වෙනස් කිරීම සුරැකීමට නොහැකි විය.'},503);}
}
export async function POST(req) {
  const denied=await requireAdmin(req);if(denied)return denied;
  try{const body=await req.json();if(!/^[0-9a-f-]{36}$/i.test(body.id||''))return reply({error:'Invalid ID'},400);await notifyAdmin(body.id);return reply({success:true});}catch{return reply({error:'Notification එක යැවීමට නොහැකි විය.'},503);}
}
