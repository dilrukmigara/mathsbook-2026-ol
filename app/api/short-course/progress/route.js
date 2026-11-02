import {NextResponse} from 'next/server';
import {getSession, sameOrigin} from '../../../../src/lib/short-course/session';
import {readCourse, readProgress, completeLesson} from '../../../../src/lib/short-course/db';
import {progressSummary} from '../../../../src/lib/short-course/validation.mjs';
export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({error: 'Forbidden'}, {status: 403});
  const user = await getSession();
  if (!user) return NextResponse.json({error: 'කරුණාකර නැවත ඇතුල් වන්න.'}, {status: 401});
  try {
    const body = await req.json();
    const course = await readCourse();
    const lesson = course.lessons.find(l => l.id === body.lessonId && l.video_id === body.videoId);
    if (!lesson) return NextResponse.json({error: 'පාඩම හමු නොවීය.'}, {status: 404});
    if (!Number.isFinite(body.duration) || body.duration <= 0 || !Number.isFinite(body.watchedSeconds) || body.watchedSeconds < body.duration * .9) return NextResponse.json({error: 'වීඩියෝවෙන් අවම වශයෙන් 90%ක් නරඹන්න.'}, {status: 400});
    await completeLesson(user.id, lesson);
    return NextResponse.json({success: true, progress: progressSummary(course.lessons, await readProgress(user.id))});
  } catch (err) { return NextResponse.json({error: err.message}, {status: 503}); }
}
