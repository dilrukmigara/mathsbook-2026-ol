import { NextResponse } from 'next/server';
import { getAllUsers, updateUserCourses, deleteUser } from '../../auth/db';

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'ශිෂ්‍ය ලැයිස්තුව ලබා ගැනීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { id, enrolledCourses } = await req.json();
    
    if (!id || !enrolledCourses || !Array.isArray(enrolledCourses)) {
      return NextResponse.json(
        { success: false, error: 'වලංගු ශිෂ්‍ය හැඳුනුම්පතක් සහ පාඨමාලා ලැයිස්තුවක් ලබා දෙන්න.' },
        { status: 400 }
      );
    }

    const res = await updateUserCourses(id, enrolledCourses);
    
    if (res && res.success) {
      return NextResponse.json({
        success: true,
        message: 'පාඨමාලා සාර්ථකව යාවත්කාලීන කරන ලදී!'
      });
    }

    return NextResponse.json(
      { success: false, error: 'යාවත්කාලීන කිරීමට නොහැකි විය.' },
      { status: 400 }
    );

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'සේවාදායකයේ දෝෂයක් සිදුවිය: ' + err.message },
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
        { success: false, error: 'ශිෂ්‍ය ID එක ලබා දෙන්න.' },
        { status: 400 }
      );
    }

    const res = await deleteUser(id);
    if (res && res.success) {
      return NextResponse.json({
        success: true,
        message: 'ශිෂ්‍ය ගිණුම සාර්ථකව ඉවත් කරන ලදී!'
      });
    }

    return NextResponse.json(
      { success: false, error: 'ශිෂ්‍ය ගිණුම ඉවත් කිරීමට නොහැකි විය.' },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'සේවාදායකයේ දෝෂයක්: ' + err.message },
      { status: 500 }
    );
  }
}
