import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {register,listRegistrations} from '../src/lib/semina/db.mjs';
import {notifyAdmin} from '../src/lib/semina/notify.mjs';
test('notification failure never loses registration; atomic claim avoids duplicate sends',async()=>{
 const cwd=process.cwd(),env={...process.env},originalFetch=global.fetch;
 const dir=await mkdtemp(path.join(tmpdir(),'semina-notification-'));
 try{
  process.chdir(dir);Object.assign(process.env,{NODE_ENV:'test',SEMINA_LOCAL_DATA:'1',SEMINA_WHATSAPP_ENABLED:'1',WHATSAPP_ACCESS_TOKEN:'fake-test-only',WHATSAPP_PHONE_NUMBER_ID:'123456',WHATSAPP_API_VERSION:'v27.0',SEMINA_NOTIFY_PHONE:'94700000000',SEMINA_WHATSAPP_TEMPLATE:'test_template',SEMINA_WHATSAPP_LANGUAGE:'en_US'});delete process.env.VERCEL;
  const make=()=>register({request_id:randomUUID(),student_name:randomUUID(),whatsapp_number:'94721234567',school:'',exam_year:2026,consent:true,consent_version:'semina-v1',source:'test'});
  let calls=0;
  global.fetch=async(url,options)=>{calls++;const payload=JSON.parse(options.body);assert.equal(payload.to,'94700000000');assert.equal(payload.template.components[0].parameters.length,3);return {ok:true,json:async()=>({messages:[{id:'test-message'}]})};};
  const success=await make();await Promise.all([notifyAdmin(success.row.id),notifyAdmin(success.row.id)]);assert.equal(calls,1);assert.equal((await listRegistrations()).find(r=>r.id===success.row.id).notification_status,'accepted');
  const failure=await make();global.fetch=async()=>({ok:false,json:async()=>({error:{code:400}})});await notifyAdmin(failure.row.id);assert.equal((await listRegistrations()).find(r=>r.id===failure.row.id).notification_status,'failed');
  const timeout=await make();global.fetch=async()=>{throw new Error('timeout');};await notifyAdmin(timeout.row.id);assert.equal((await listRegistrations()).find(r=>r.id===timeout.row.id).notification_status,'unknown');
  assert.equal((await listRegistrations()).length,3);
 }finally{global.fetch=originalFetch;process.chdir(cwd);for(const key of Object.keys(process.env))if(!(key in env))delete process.env[key];Object.assign(process.env,env);await rm(dir,{recursive:true,force:true});}
});
