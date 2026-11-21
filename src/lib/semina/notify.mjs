import {claimNotification, updateRegistration} from './db.mjs';
export async function notifyAdmin(id) {
  const row = await claimNotification(id); if(!row) return;
  const env = process.env;
  const configured = env.SEMINA_WHATSAPP_ENABLED === '1' && env.WHATSAPP_ACCESS_TOKEN && /^\d+$/.test(env.WHATSAPP_PHONE_NUMBER_ID || '') && /^v\d+\.\d+$/.test(env.WHATSAPP_API_VERSION || '') && /^\d{10,15}$/.test(env.SEMINA_NOTIFY_PHONE || '') && env.SEMINA_WHATSAPP_TEMPLATE && env.SEMINA_WHATSAPP_LANGUAGE;
  if(!configured) {await updateRegistration(id,{notification_status:'not_configured'}); return;}
  // No messages in preview/local environments unless explicitly enabled above.
  let status = 'unknown';
  try {
    const response = await fetch(`https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method:'POST', signal:AbortSignal.timeout(8000), headers:{Authorization:`Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,'Content-Type':'application/json'},
      body:JSON.stringify({messaging_product:'whatsapp',to:env.SEMINA_NOTIFY_PHONE,type:'template',template:{name:env.SEMINA_WHATSAPP_TEMPLATE,language:{code:env.SEMINA_WHATSAPP_LANGUAGE},components:[{type:'body',parameters:[row.registration_code,row.student_name,row.whatsapp_number].map(text=>({type:'text',text}))}]}}),
    });
    const data = await response.json();
    status = response.ok && data.messages?.[0]?.id ? 'accepted' : 'failed';
  } catch { /* A timeout may still have sent: avoid automatically sending twice. */ }
  await updateRegistration(id,{notification_status:status});
}
