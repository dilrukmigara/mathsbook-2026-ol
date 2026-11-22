export function normalizePhone(value) {
  if (typeof value !== 'string' || !/^[+\d\s()-]+$/.test(value)) throw new Error('වලංගු WhatsApp අංකයක් ඇතුළත් කරන්න.');
  let phone = value.replace(/[\s()+-]/g, '');
  if (phone.startsWith('0')) phone = `94${phone.slice(1)}`;
  if (!/^947\d{8}$/.test(phone)) throw new Error('07XXXXXXXX හෝ +947XXXXXXXX ආකාරයට අංකය ඇතුළත් කරන්න.');
  return phone;
}
const text = (value, max) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
export function validateRegistration(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('තොරතුරු පරීක්ෂා කරන්න.');
  const student_name = text(body.studentName, 100);
  if (student_name.length < 2) throw new Error('සිසුවාගේ නම ඇතුළත් කරන්න.');
  if (body.consent !== true) throw new Error('WhatsApp හරහා seminar තොරතුරු ලබාගැනීමට එකඟතාව අවශ්‍යයි.');
  if (!/^20\d{2}$/.test(String(body.examYear)) || +body.examYear < 2026 || +body.examYear > 2035) throw new Error('වලංගු O/L විභාග වර්ෂයක් ඇතුළත් කරන්න.');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId || '')) throw new Error('පිටුව නැවත විවෘත කර උත්සාහ කරන්න.');
  if (body.website) throw new Error('ලියාපදිංචිය ලබාගත නොහැක.');
  return {request_id: body.requestId, student_name, whatsapp_number: normalizePhone(body.whatsapp), school: text(body.school, 120), exam_year: +body.examYear, source: text(body.source, 100) || 'direct', consent: true, consent_version: 'semina-v1'};
}
export function validateUpdate(body) {
  if (!body || !/^[0-9a-f-]{36}$/i.test(body.id || '')) throw new Error('වලංගු ලියාපදිංචියක් තෝරන්න.');
  const result = {};
  for (const [key, allowed] of Object.entries({group_status: ['unchecked','joined','not_joined'], message_status: ['pending','sent'], payment_status: ['pending','verified'], attendance: ['unknown','present','absent']})) {
    if (body[key] !== undefined) {
      if (!allowed.includes(body[key])) throw new Error('වලංගු තත්ත්වයක් තෝරන්න.');
      result[key] = body[key];
    }
  }
  if (body.notes !== undefined) result.notes = text(body.notes, 1000);
  if (!Object.keys(result).length) throw new Error('වෙනස් කිරීමක් තෝරන්න.');
  return result;
}
export function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
