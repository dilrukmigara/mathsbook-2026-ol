import { NextResponse } from 'next/server';
import { 
  getTopics, 
  getPapers, 
  createTopic, 
  deleteTopic, 
  updatePaper, 
  deletePaper 
} from '../../papers/db.js';

export async function GET() {
  try {
    const [topics, papers] = await Promise.all([
      getTopics(),
      getPapers()
    ]);
    return NextResponse.json({ success: true, topics, papers });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'දත්ත ලබා ගැනීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    // Create topic
    if (action === 'create_topic') {
      const { name, grade, description } = body;
      if (!name || !grade) {
        return NextResponse.json(
          { success: false, error: 'මාතෘකාවේ නම සහ ශ්‍රේණිය (Grade) අවශ්‍යයි.' },
          { status: 400 }
        );
      }
      const newTopic = await createTopic({ name, grade, description });
      return NextResponse.json({
        success: true,
        message: 'නව මාතෘකාව සාර්ථකව නිර්මාණය කරන ලදී.',
        topic: newTopic
      });
    }

    return NextResponse.json({ success: false, error: 'වලංගු නොවන ක්‍රියාවකි.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'දෝෂයක් සිදුවිය: ' + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { paperId, updates } = body;

    if (!paperId || !updates) {
      return NextResponse.json(
        { success: false, error: 'Paper ID සහ යාවත්කාලීන තොරතුරු අවශ්‍යයි.' },
        { status: 400 }
      );
    }

    const updated = await updatePaper(paperId, updates);
    return NextResponse.json({
      success: true,
      message: 'ප්‍රශ්න පත්‍රයේ විස්තර සාර්ථකව යාවත්කාලීන කරන ලදී.',
      paper: updated
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'යාවත්කාලීන කිරීම අසාර්ථකයි: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'paper' or 'topic'
    const id = searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json(
        { success: false, error: 'ID සහ Type (paper හෝ topic) අවශ්‍යයි.' },
        { status: 400 }
      );
    }

    if (type === 'paper') {
      await deletePaper(id);
      return NextResponse.json({
        success: true,
        message: 'ප්‍රශ්න පත්‍රය සාර්ථකව මකා දමන ලදී (Paper deleted successfully).'
      });
    } else if (type === 'topic') {
      // Check if any papers belong to this topic
      const papers = await getPapers({ topicId: id });
      if (papers.length > 0) {
        return NextResponse.json(
          { success: false, error: `මෙම මාතෘකාව යටතේ ප්‍රශ්න පත්‍ර ${papers.length}ක් ඇති බැවින් එය මකා දැමිය නොහැක. කරුණාකර පළමුව එම ප්‍රශ්න පත්‍ර මකා දමන්න හෝ වෙනත් මාතෘකාවකට මාරු කරන්න.` },
          { status: 400 }
        );
      }
      await deleteTopic(id);
      return NextResponse.json({
        success: true,
        message: 'මාතෘකාව සාර්ථකව මකා දමන ලදී (Topic deleted successfully).'
      });
    }

    return NextResponse.json({ success: false, error: 'වලංගු නොවන Type එකකි.' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'මකා දැමීම අසාර්ථකයි: ' + err.message },
      { status: 500 }
    );
  }
}
