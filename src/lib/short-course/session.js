import {createHmac, timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';

export function sessionSecret() {
  const value = process.env.COURSE_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('Login සේවාව සකස් කර නැත. කරුණාකර ගුරුවරයා අමතන්න.');
  return value;
}
export function signSession(user, role = 'student') {
  const expires = Math.floor(Date.now() / 1000) + (role === 'admin' ? 28800 : 604800);
  const body = Buffer.from(JSON.stringify({id: user.id, name: user.name, role, expires})).toString('base64url');
  return `${body}.${createHmac('sha256', sessionSecret()).update(body).digest('base64url')}`;
}
export function verifySession(token, role = 'student') {
  try {
    const [body, signature, extra] = (token || '').split('.');
    if (!body || !signature || extra) return null;
    const expected = createHmac('sha256', sessionSecret()).update(body).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(expected, actual)) return null;
    const user = JSON.parse(Buffer.from(body, 'base64url').toString());
    return user.role === role && typeof user.id === 'string' && user.expires > Date.now() / 1000 ? user : null;
  } catch { return null; }
}
export const cookieName = role => role === 'admin' ? 'mathsbook_admin' : 'mathsbook_student';
export function setSession(response, user, role = 'student') {
  response.cookies.set(cookieName(role), signSession(user, role), {httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: role === 'admin' ? 28800 : 604800});
  return response;
}
export async function getSession(role = 'student') {
  return verifySession((await cookies()).get(cookieName(role))?.value, role);
}
export function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    const source = new URL(origin);
    // Next.js may construct req.url with an internal hostname. Compare the
    // browser-facing Host header, retaining the scheme check behind Vercel.
    const host = req.headers.get('host') || new URL(req.url).host;
    const protocol = req.headers.get('x-forwarded-proto')?.split(',')[0].trim() || new URL(req.url).protocol.slice(0, -1);
    return source.host === host && source.protocol === `${protocol}:`;
  } catch { return false; }
}
export function constantEqual(a, b) {
  const left = createHmac('sha256', sessionSecret()).update(a).digest();
  const right = createHmac('sha256', sessionSecret()).update(b).digest();
  return timingSafeEqual(left, right);
}

export async function requireAdmin(req) {
  const {NextResponse} = await import('next/server');
  if (!sameOrigin(req)) return NextResponse.json({success: false, error: 'Forbidden'}, {status: 403});
  if (!await getSession('admin')) return NextResponse.json({success: false, error: 'කරුණාකර admin ලෙස ඇතුල් වන්න.'}, {status: 401});
  return null;
}
