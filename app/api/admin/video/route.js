import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIDEO_DATA_PATH = path.join(process.cwd(), 'data', 'videoLessons.json');

export async function GET() {
  try {
    const data = fs.readFileSync(VIDEO_DATA_PATH, 'utf8');
    const lessons = JSON.parse(data || '[]');
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
    const { id, videoId } = await req.json();
    if (!id || !videoId) {
      return NextResponse.json(
        { success: false, error: 'වලංගු පාඨමාලා හැඳුනුම්පත හා YouTube videoId එකක් අවශ්‍යයි.' },
        { status: 400 }
      );
    }

    const data = fs.readFileSync(VIDEO_DATA_PATH, 'utf8');
    const lessons = JSON.parse(data || '[]');
    const lessonIndex = lessons.findIndex(l => l.id === id);

    if (lessonIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'මෙම පාඨමාලා කිසිවක් සොයාගත නොහැක.' },
        { status: 404 }
      );
    }

    lessons[lessonIndex].videoId = videoId;
    fs.writeFileSync(VIDEO_DATA_PATH, JSON.stringify(lessons, null, 2));

    return NextResponse.json({ success: true, message: 'Video link updated successfully.', lessons });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'වීඩියෝ සබැඳිය යාවත්කාලීන කිරීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}
