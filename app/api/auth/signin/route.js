import { NextResponse } from 'next/server';
import { findUserByPhone } from '../db';

export async function POST(req) {
  try {
    const { phone, password } = await req.json();
    
    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: 'කරුණාකර දුරකථන අංකය සහ මුරපදය ඇතුළත් කරන්න.' },
        { status: 400 }
      );
    }

    const normalizedPhone = phone.replace(/\s+/g, '').trim();

    // Find student
    const user = await findUserByPhone(normalizedPhone);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'මෙම අංකයෙන් ලියාපදිංචි වූ සිසුවෙකු හමු නොවීය. කරුණාකර පළමුව ලියාපදිංචි වන්න (Sign Up).' },
        { status: 400 }
      );
    }

    // Verify password
    if (user.password !== password.trim()) {
      return NextResponse.json(
        { success: false, error: 'ඇතුළත් කළ මුරපදය වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        enrolledCourses: user.enrolledCourses
      },
      message: 'සාර්ථකව ඇතුල් විය!'
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'සේවාදායකයේ දෝෂයක් සිදුවිය: ' + err.message },
      { status: 500 }
    );
  }
}
