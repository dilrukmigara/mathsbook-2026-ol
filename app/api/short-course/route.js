import {NextResponse} from 'next/server';
import {getSession} from '../../../src/lib/short-course/session';
import {readCourse, readProgress} from '../../../src/lib/short-course/db';
import {progressSummary} from '../../../src/lib/short-course/validation.mjs';
export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({error: 'කරුණාකර ඇතුල් වන්න.'}, {status: 401});
  try {
    const [course, progress] = await Promise.all([readCourse(), readProgress(user.id)]);
    return NextResponse.json({...course, progress: progressSummary(course.lessons, progress), user}, {headers: {'Cache-Control': 'no-store'}});
  } catch (err) { return NextResponse.json({error: err.message}, {status: 503}); }
}
