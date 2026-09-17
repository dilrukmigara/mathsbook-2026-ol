import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createPaper, getLocalTopics } from '../../../papers/db.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function formatBytes(bytes, decimals = 1) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const grade = formData.get('grade');
    const topicId = formData.get('topicId');
    const year = formData.get('year') || new Date().getFullYear().toString();
    const term = formData.get('term') || 'Model Paper';

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'කරුණාකර වලංගු PDF ගොනුවක් තෝරන්න (Please select a valid PDF file).' },
        { status: 400 }
      );
    }

    if (!title || !grade || !topicId) {
      return NextResponse.json(
        { success: false, error: 'කරුණාකර සියලුම අනිවාර්ය තොරතුරු (Title, Grade, Topic) ඇතුළත් කරන්න.' },
        { status: 400 }
      );
    }

    // Validate mime type and extension
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: 'PDF ගොනු පමණක් උඩුගත කළ හැක (Only PDF files are supported).' },
        { status: 400 }
      );
    }

    // Target directory: public/uploads/papers
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'papers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean original filename
    const cleanBaseName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.pdf$/i, '');
    const uniqueFileName = `${grade}_${Date.now()}_${cleanBaseName.slice(0, 40)}.pdf`;
    const destinationPath = path.join(uploadDir, uniqueFileName);

    // Read bytes and write to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destinationPath, buffer);

    // Resolve topic name
    const topics = getLocalTopics();
    const matchedTopic = topics.find(t => t.id === topicId);
    const topicName = matchedTopic ? matchedTopic.name : '';

    const publicUrl = `/uploads/papers/${uniqueFileName}`;
    const fileSizeFormatted = formatBytes(buffer.length);

    // Save paper metadata
    const createdPaper = await createPaper({
      title,
      grade,
      topicId,
      topicName,
      fileName: file.name,
      fileUrl: publicUrl,
      fileSize: fileSizeFormatted,
      year,
      term
    });

    return NextResponse.json({
      success: true,
      message: 'PDF ගොනුව සාර්ථකව උඩුගත කරන ලදී (PDF uploaded successfully)!',
      paper: createdPaper
    });

  } catch (err) {
    console.error('PDF upload failed:', err);
    return NextResponse.json(
      { success: false, error: 'PDF උඩුගත කිරීමට නොහැකි විය: ' + err.message },
      { status: 500 }
    );
  }
}
