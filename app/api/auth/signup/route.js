import {setSession, sessionSecret, sameOrigin} from '../../../../src/lib/short-course/session';
import { NextResponse } from 'next/server';
import { findUserByPhone, createUser } from '../db';

export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({error: 'Forbidden'}, {status: 403});
  try {
    sessionSecret();
    const { name, phone, password } = await req.json();
    
    if (typeof name !== 'string' || typeof phone !== 'string' || typeof password !== 'string' || !name.trim() || !phone.trim() || !password.trim()) {
      return NextResponse.json(
        { success: false, error: 'කරුණාකර සියලුම විස්තර (නම, දුරකථන අංකය සහ මුරපදය) ඇතුළත් කරන්න.' },
        { status: 400 }
      );
    }

    const normalizedPhone = phone.replace(/\s+/g, '').trim();

    // Check if user already exists
    const existingUser = await findUserByPhone(normalizedPhone);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'මෙම දුරකථන අංකය දැනටමත් ලියාපදිංචි කර ඇත. කරුණාකර ඇතුල් වන්න (Sign In).' },
        { status: 400 }
      );
    }

    // Register user
    const newUser = await createUser({
      name: name.trim(),
      phone: normalizedPhone,
      password: password.trim()
    });

    // Send to Google Sheets if AppScript URL is configured in environment variables
    const appScriptUrl = process.env.LMS_APPSCRIPT_URL;
    if (appScriptUrl) {
      try {
        await fetch(appScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' }, // Avoid CORS preflight options issues with Apps Script
          body: JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            phone: newUser.phone,
            password: newUser.password
          })
        });
      } catch (err) {
        console.error('Failed to sync student to Google Sheet:', err);
      }
    }

    return setSession(NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        enrolledCourses: newUser.enrolledCourses
      },
      message: 'ලියාපදිංචිය සාර්ථකයි!'
    }), newUser);

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'සේවාදායකයේ දෝෂයක් සිදුවිය: ' + err.message },
      { status: 500 }
    );
  }
}
