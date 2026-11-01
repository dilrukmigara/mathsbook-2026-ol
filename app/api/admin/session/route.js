import {NextResponse} from 'next/server';
import {getSession, setSession, sameOrigin, constantEqual, cookieName} from '../../../../src/lib/short-course/session';
export async function GET() {
  const user = await getSession('admin');
  return NextResponse.json({user}, {status: user ? 200 : 401, headers: {'Cache-Control': 'no-store'}});
}
export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({error: 'Forbidden'}, {status: 403});
  const phone = process.env.MATHSBOOK_ADMIN_PHONE;
  const password = process.env.MATHSBOOK_ADMIN_PASSWORD;
  if (!phone || !password) return NextResponse.json({error: 'Admin login සකස් කර නැත. Hosting settings පරීක්ෂා කරන්න.'}, {status: 503});
  try {
    const input = await req.json();
    if (typeof input.phone !== 'string' || typeof input.password !== 'string' || !constantEqual(input.phone.trim(), phone) || !constantEqual(input.password, password)) return NextResponse.json({error: 'දුරකථන අංකය හෝ මුරපදය වැරදියි.'}, {status: 401});
    return setSession(NextResponse.json({success: true}), {id: 'admin', name: 'Mathsbook Admin'}, 'admin');
  } catch { return NextResponse.json({error: 'Login සේවාව ලබාගත නොහැක.'}, {status: 503}); }
}
export async function DELETE(req) {
  if (!sameOrigin(req)) return NextResponse.json({error: 'Forbidden'}, {status: 403});
  const response = NextResponse.json({success: true});
  response.cookies.set(cookieName('admin'), '', {path: '/', maxAge: 0});
  return response;
}
