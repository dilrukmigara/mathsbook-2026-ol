import {NextResponse} from 'next/server';
import {cookieName, sameOrigin} from '../../../../src/lib/short-course/session';
export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({error: 'Forbidden'}, {status: 403});
  const response = NextResponse.json({success: true});
  response.cookies.set(cookieName('student'), '', {path: '/', maxAge: 0});
  return response;
}
