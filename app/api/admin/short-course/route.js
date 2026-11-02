import {NextResponse} from 'next/server';
import {getSession, sameOrigin} from '../../../../src/lib/short-course/session';
import {readCourse, saveSettings, saveLesson, removeLesson} from '../../../../src/lib/short-course/db';
import {validateLesson, validateSettings} from '../../../../src/lib/short-course/validation.mjs';
const validId = id => typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id);
async function denied(req) {
  if (!sameOrigin(req)) return NextResponse.json({error: 'Forbidden'}, {status: 403});
  if (!await getSession('admin')) return NextResponse.json({error: 'කරුණාකර admin ලෙස නැවත ඇතුල් වන්න.'}, {status: 401});
}
export async function GET(req) {
  const rejection = await denied(req); if (rejection) return rejection;
  try { return NextResponse.json(await readCourse(true), {headers: {'Cache-Control': 'no-store'}}); }
  catch (err) { return NextResponse.json({error: err.message}, {status: 503}); }
}
export async function POST(req) {
  const rejection = await denied(req); if (rejection) return rejection;
  try {
    const body = await req.json();
    if (body.action === 'settings') await saveSettings(validateSettings(body));
    else if (body.action === 'lesson') {
      if (body.id && !validId(body.id)) throw new Error('පාඩමේ ID එක වැරදියි.');
      await saveLesson(body.id || null, validateLesson(body));
    } else throw new Error('වලංගු නොවන ක්‍රියාවකි.');
    return NextResponse.json({success: true, ...await readCourse(true)});
  } catch (err) { return NextResponse.json({error: err.message}, {status: 400}); }
}
export async function DELETE(req) {
  const rejection = await denied(req); if (rejection) return rejection;
  const id = new URL(req.url).searchParams.get('id');
  if (!validId(id)) return NextResponse.json({error: 'වලංගු පාඩමක් තෝරන්න.'}, {status: 400});
  try { await removeLesson(id); return NextResponse.json({success: true, ...await readCourse(true)}); }
  catch (err) { return NextResponse.json({error: err.message}, {status: 503}); }
}
