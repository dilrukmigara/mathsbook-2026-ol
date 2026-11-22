// Only point at isolated localhost with SEMINA_LOCAL_DATA=1 and dummy DB credentials.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const base=process.env.SEMINA_TEST_URL||'http://127.0.0.1:3000';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw new Error('Local test server required');
const id=randomUUID();
const input={studentName:`Semina Test ${id}`,whatsapp:'0721234567',examYear:'2026',consent:true,requestId:id};
async function api(path,method='GET',body,headers={}) {const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...headers},body:body?JSON.stringify(body):undefined});return {r,d:await r.json()};}
let x=await api('/api/admin/semina');assert.equal(x.r.status,401);
x=await api('/api/semina','POST',{...input,consent:false});assert.equal(x.r.status,400);
x=await api('/api/semina','POST',input,{Origin:'https://untrusted.example'});assert.equal(x.r.status,403);
x=await api('/api/semina','POST',input);assert.equal(x.r.status,201);assert.match(x.d.registrationCode,/^MB-/);assert.equal(x.d.row,undefined);
x=await api('/api/semina','POST',input);assert.equal(x.r.status,200);assert.equal(x.d.duplicate,true);assert.equal(x.d.registrationCode,null);
x=await api('/api/semina','POST',{...input,requestId:randomUUID()});assert.equal(x.d.duplicate,true);
x=await api('/api/admin/session','POST',{phone:process.env.MATHSBOOK_ADMIN_PHONE||'0700000000',password:process.env.MATHSBOOK_ADMIN_PASSWORD||'local-semina-test-password'});assert.equal(x.r.status,200);
const cookie=x.r.headers.get('set-cookie').split(';')[0];
x=await api('/api/admin/semina','GET',null,{Cookie:cookie});assert.equal(x.r.status,200);const row=x.d.rows.find(r=>r.request_id===id);assert.ok(row);assert.equal(row.notification_status,'not_configured');assert.equal(row.group_status,'unchecked');
x=await api('/api/admin/semina','PATCH',{id:row.id,group_status:'joined',message_status:'sent'},{Cookie:cookie,Origin:'https://untrusted.example'});assert.equal(x.r.status,403);
x=await api('/api/admin/semina','PATCH',{id:row.id,group_status:'joined',message_status:'sent'},{Cookie:cookie});assert.equal(x.r.status,200);assert.equal(x.d.row.group_status,'joined');
x=await api('/api/admin/semina','GET',null,{Cookie:cookie+'tampered'});assert.equal(x.r.status,401);
x=await api('/api/admin/session','DELETE',null,{Cookie:cookie});assert.equal(x.r.status,200);
console.log('PASS: registration persistence, duplicate handling, consent, origin, admin auth, updates, tampered cookie, notification not configured');
