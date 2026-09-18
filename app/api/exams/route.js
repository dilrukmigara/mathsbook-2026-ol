import { NextResponse } from 'next/server';
import { getExamPapers, getExamPaperById, evaluateExamAttempt } from './db.js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const paperId = searchParams.get('id');

    if (paperId) {
      // Student taking exam: hide correct answers and explanations until submitted
      const paper = await getExamPaperById(paperId, false);
      if (!paper) {
        return NextResponse.json(
          { success: false, error: 'ප්‍රශ්න පත්‍රය සොයාගත නොහැක (Paper not found).' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, paper });
    }

    // List all papers
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
    const { paperId, studentId, studentName, studentPhone, answers } = body;

    if (!paperId) {
      return NextResponse.json(
        { success: false, error: 'Paper ID අවශ්‍යයි (Paper ID is required).' },
        { status: 400 }
      );
    }

    const evaluation = await evaluateExamAttempt({
      paperId,
      studentId: studentId || 'STUDENT',
      studentName: studentName || 'Student',
      studentPhone: studentPhone || '',
      answers: answers || {}
    });

    return NextResponse.json({
      success: true,
      message: 'ප්‍රශ්න පත්‍රය සාර්ථකව අවසන් කරන ලදී!',
      result: evaluation
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'ප්‍රතිඵල ගණනය කිරීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}
