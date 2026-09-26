import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const VIDEO_DATA_PATH = path.join(DATA_DIR, 'videoLessons.json');

// Helper to extract 11-char YouTube ID from any YouTube URL format or return trimmed ID
function extractYouTubeId(urlOrId) {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : trimmed;
}

function ensureVideoFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(VIDEO_DATA_PATH)) {
    fs.writeFileSync(VIDEO_DATA_PATH, JSON.stringify([], null, 2));
  }
}

function getLessons() {
  ensureVideoFile();
  try {
    const data = fs.readFileSync(VIDEO_DATA_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function saveLessons(lessons) {
  ensureVideoFile();
  fs.writeFileSync(VIDEO_DATA_PATH, JSON.stringify(lessons, null, 2));
}

export async function GET() {
  try {
    const lessons = getLessons();
    return NextResponse.json({ success: true, lessons });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'වීඩියෝ දේශන ලැයිස්තුව ලබා ගැනීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, id, title, course, duration, videoUrl, videoId } = body;

    const lessons = getLessons();
    const rawVideoInput = videoUrl || videoId || '';
    const parsedVideoId = extractYouTubeId(rawVideoInput);

    if (action === 'create' || (!id && title)) {
      if (!title || !title.trim()) {
        return NextResponse.json(
          { success: false, error: 'පාඩමේ මාතෘකාව (Title) ඇතුළත් කිරීම අනිවාර්යයි.' },
          { status: 400 }
        );
      }

      if (!parsedVideoId) {
        return NextResponse.json(
          { success: false, error: 'වලංගු YouTube වීඩියෝ සබැඳියක් (URL) හෝ Video ID එකක් ඇතුළත් කරන්න.' },
          { status: 400 }
        );
      }

      const newId = lessons.length > 0 ? Math.max(...lessons.map(l => Number(l.id) || 0)) + 1 : 1;
      const newLesson = {
        id: newId,
        title: title.trim(),
        duration: (duration && duration.trim()) || '1h 30m',
        course: course || 'grade_10',
        videoId: parsedVideoId,
        createdAt: new Date().toISOString()
      };

      lessons.unshift(newLesson);
      saveLessons(lessons);

      return NextResponse.json({
        success: true,
        message: 'නව වීඩියෝ පාඩම සාර්ථකව ඇතුළත් කරන ලදී!',
        lesson: newLesson,
        lessons
      });
    }

    // Update existing lesson
    if (id) {
      const lessonIndex = lessons.findIndex(l => String(l.id) === String(id));
      if (lessonIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'අදාළ වීඩියෝ පාඩම සොයාගත නොහැක.' },
          { status: 404 }
        );
      }

      if (title) lessons[lessonIndex].title = title.trim();
      if (course) lessons[lessonIndex].course = course;
      if (duration) lessons[lessonIndex].duration = duration.trim();
      if (parsedVideoId) lessons[lessonIndex].videoId = parsedVideoId;

      saveLessons(lessons);

      return NextResponse.json({
        success: true,
        message: 'වීඩියෝ පාඩමේ තොරතුරු සාර්ථකව යාවත්කාලීන කරන ලදී!',
        lesson: lessons[lessonIndex],
        lessons
      });
    }

    return NextResponse.json(
      { success: false, error: 'වලංගු තොරතුරු ලබා දෙන්න.' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'සේවාදායකයේ දෝෂයක්: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ඉවත් කිරීමට අවශ්‍ය පාඩමේ ID එක ලබා දෙන්න.' },
        { status: 400 }
      );
    }

    const lessons = getLessons();
    const filtered = lessons.filter(l => String(l.id) !== String(id));

    if (filtered.length === lessons.length) {
      return NextResponse.json(
        { success: false, error: 'අදාළ වීඩියෝ පාඩම හමු නොවීය.' },
        { status: 404 }
      );
    }

    saveLessons(filtered);
    return NextResponse.json({
      success: true,
      message: 'වීඩියෝ පාඩම සාර්ථකව ඉවත් කරන ලදී!',
      lessons: filtered
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'ඉවත් කිරීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}
