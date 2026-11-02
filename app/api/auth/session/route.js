import {NextResponse} from 'next/server';
import {getSession} from '../../../../src/lib/short-course/session';
import {findPublicUserById} from '../db';
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({user:null}, {status:401});
  try {
    const user = await findPublicUserById(session.id);
    return NextResponse.json({user}, {status:user?200:401, headers:{'Cache-Control':'no-store'}});
  } catch { return NextResponse.json({error:'Profile unavailable'}, {status:503}); }
}
