import { NextResponse } from 'next/server';
import { saveEnrollment, getAllEnrollments, deleteEnrollment } from './db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { studentName, contactNumber, whatsappNumber, schoolName, lastTermMarks, course } = body;

    if (!studentName || !contactNumber || !whatsappNumber) {
      return NextResponse.json(
        { success: false, error: 'කරුණාකර සියලුම අවශ්‍ය තොරතුරු සම්පූර්ණ කරන්න.' },
        { status: 400 }
      );
    }

    const result = await saveEnrollment(body);
    return NextResponse.json({
      success: true,
      message: 'ලියාපදිංචි වීම සාර්ථකයි!',
      enrollment: result.enrollment,
      storage: result.storage
    });
  } catch (error) {
    console.error('Enrollment API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'ලියාපදිංචි වීමේදී දෝෂයක් සිදු විය.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const enrollments = await getAllEnrollments();
    return NextResponse.json({ success: true, enrollments });
  } catch (error) {
    console.error('Get enrollments API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'අයදුම්පත් ලබාගැනීමට නොහැකි විය.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await deleteEnrollment(id);
    return NextResponse.json({ success: true, message: 'අයදුම්පත සාර්ථකව ඉවත් කරන ලදී.' });
  } catch (error) {
    console.error('Delete enrollment API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'ඉවත් කිරීමේදී දෝෂයක් සිදු විය.' },
      { status: 500 }
    );
  }
}
