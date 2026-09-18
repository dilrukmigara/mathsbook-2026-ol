import { NextResponse } from 'next/server';
import { 
  getExamPapers, 
  getExamPaperById, 
  createExamPaper, 
  deleteExamPaper, 
  parseCsvQuestions 
} from '../../exams/db.js';

export async function GET() {
  try {
    const papers = await getExamPapers();
    return NextResponse.json({ success: true, papers });
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

    // 1. Validate CSV questions before publishing
    if (action === 'validate_csv') {
      const { csvText } = body;
      const parseResult = parseCsvQuestions(csvText);
      return NextResponse.json({
        success: true,
        valid: parseResult.valid,
        errors: parseResult.errors,
        questions: parseResult.questions,
        total: parseResult.questions.length
      });
    }

    // 2. Publish Paper with Questions
    if (action === 'publish_paper') {
      const { title, paperNumber, grade, durationMinutes, description, questions } = body;

      if (!title || !questions || questions.length === 0) {
        return NextResponse.json(
          { success: false, error: 'ප්‍රශ්න පත්‍රයේ මාතෘකාව (Title) සහ අවම වශයෙන් එක් ප්‍රශ්නයක්වත් තිබිය යුතුය.' },
          { status: 400 }
        );
      }

      const created = await createExamPaper({
        title,
        paperNumber,
        grade: grade || 'grade_11',
        durationMinutes: durationMinutes || 45,
        description: description || '',
        questions
      });

      return NextResponse.json({
        success: true,
        message: `ප්‍රශ්න පත්‍රය (${created.title}) සාර්ථකව නිර්මාණය කරන ලදී!`,
        paper: created
      });
    }

    // 3. Delete Paper
    if (action === 'delete_paper') {
      const { paperId } = body;
      if (!paperId) {
        return NextResponse.json({ success: false, error: 'Paper ID අවශ්‍යයි.' }, { status: 400 });
      }
      await deleteExamPaper(paperId);
      return NextResponse.json({
        success: true,
        message: 'ප්‍රශ්න පත්‍රය සාර්ථකව මකා දමන ලදී (Exam paper deleted successfully).'
      });
    }

    return NextResponse.json({ success: false, error: 'වලංගු නොවන ක්‍රියාවකි (Invalid action).' }, { status: 400 });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'ක්‍රියාවලිය අසාර්ථකයි: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paperId = searchParams.get('id');

    if (!paperId) {
      return NextResponse.json(
        { success: false, error: 'Paper ID අවශ්‍යයි.' },
        { status: 400 }
      );
    }

    await deleteExamPaper(paperId);
    return NextResponse.json({
      success: true,
      message: 'ප්‍රශ්න පත්‍රය සාර්ථකව මකා දමන ලදී (Exam paper deleted successfully).'
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'මකා දැමීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}
