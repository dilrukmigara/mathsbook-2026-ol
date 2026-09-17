import { NextResponse } from 'next/server';
import { getTopics, getPapers, incrementPaperDownload } from './db.js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade') || null;
    const topicId = searchParams.get('topicId') || null;

    const [allTopics, allPapers, filteredPapers] = await Promise.all([
      getTopics(grade),
      getPapers(),
      getPapers({ grade, topicId })
    ]);

    const grade10Papers = allPapers.filter(p => p.grade === 'grade_10');
    const grade11Papers = allPapers.filter(p => p.grade === 'grade_11');

    // Attach paper counts to topics
    const topicsWithCount = allTopics.map(t => ({
      ...t,
      paperCount: allPapers.filter(p => p.topicId === t.id).length
    }));

    return NextResponse.json({
      success: true,
      topics: topicsWithCount,
      papers: filteredPapers,
      stats: {
        totalPapers: allPapers.length,
        grade10Count: grade10Papers.length,
        grade11Count: grade11Papers.length
      }
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'දත්ත ලබා ගැනීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { paperId, action } = await req.json();
    if (action === 'download' && paperId) {
      await incrementPaperDownload(paperId);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
