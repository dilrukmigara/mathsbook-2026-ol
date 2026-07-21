import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { activeTab, textQuery, selectedImageBase64, selectedImageMime, customApiKey } = body;

    // Determine API Key: use customApiKey if provided, otherwise server env variable
    const apiKey = (customApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API Key එක සේවාදායකයේ හෝ ඇතුළත් කිරීම්හි නොමැත. කරුණාකර API Key එකක් සකස් කරන්න.' },
        { status: 400 }
      );
    }

    if (activeTab === 'image' && !selectedImageBase64) {
      return NextResponse.json(
        { error: 'කරුණාකර පළමුව ගණිත ගැටලුවේ ඡායාරූපයක් Upload කරන්න.' },
        { status: 400 }
      );
    }

    if (activeTab === 'text' && (!textQuery || !textQuery.trim())) {
      return NextResponse.json(
        { error: 'කරුණාකර පළමුව ඔබේ ගණිත ප්‍රශ්නය ඇතුළත් කරන්න.' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are mathsbook AI, an expert Sinhala Medium O/L & A/L Mathematics tutor created by Migara Wickramarachchi (BSc Hons Undergraduate). Analyze the provided math problem (image or text) and provide a detailed, accurate, step-by-step solution in Sinhala (සිංහල).
Always format your response vertically line-by-line with clear step headings:
- Use clear vertical step headings like "📌 පියවර 1:", "📌 පියවර 2:", etc.
- Format all mathematical equations, formulas, and working steps in clean code blocks using \`\`\`math ... \`\`\` so they can be viewed vertically in dedicated code view containers.
- Highlight common mistakes and state the final answer clearly in a distinct block at the end.`;

    let contentsArray = [];

    if (activeTab === 'image' && selectedImageBase64) {
      contentsArray = [{
        parts: [
          { text: systemPrompt + "\n\nමෙම ඡායාරූපයේ ඇති ගණිත ගැටලුව පියවරෙන් පියවර පැහැදිලි සිංහලෙන් විසඳා දෙන්න." },
          {
            inline_data: {
              mime_type: selectedImageMime || 'image/jpeg',
              data: selectedImageBase64
            }
          }
        ]
      }];
    } else {
      contentsArray = [{
        parts: [
          { text: systemPrompt + "\n\nප්‍රශ්නය: " + textQuery.trim() }
        ]
      }];
    }

    // List of models to try in sequence for maximum reliability
    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-2.5-flash",
      "gemini-2.5-pro"
    ];

    let solText = null;
    let lastError = null;
    let successfulModel = null;

    for (const modelName of candidateModels) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: contentsArray })
        });

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          solText = data.candidates[0].content.parts[0].text;
          successfulModel = modelName;
          break;
        }

        if (data.error) {
          const errCode = data.error.code;
          const errMsg = data.error.message || '';

          if (errCode === 429 || errMsg.includes('Quota exceeded') || errMsg.includes('quota')) {
            lastError = `API Key එකෙහි භාවිත සීමාව (Quota Exceeded) ඉක්මවා ඇත හෝ මෙම Key එකට Quota නොමැත (Limit: 0). aistudio.google.com වෙතින් නව Key එකක් (New Project එකකින්) ලබාගන්න.`;
            break;
          } else if (errCode === 400 || errCode === 403 || errMsg.includes('API key not valid') || errMsg.includes('API_KEY_INVALID')) {
            lastError = 'ඇතුළත් කළ Gemini API Key එක වැරදියි හෝ අක්‍රියයි. Google AI Studio (aistudio.google.com) වෙතින් ලබාගත් නිවැරදි API Key එකක් භාවිතා කරන්න.';
            break;
          } else {
            lastError = data.error.message || `Gemini API දෝෂයක් සිදුවිය (${modelName}).`;
          }
        }
      } catch (err) {
        lastError = err.message || 'සේවාදායකයේ (Server) දෝෂයක් සිදුවිය.';
      }
    }

    if (solText) {
      return NextResponse.json({
        success: true,
        solution: solText,
        modelUsed: successfulModel
      });
    }

    // Return status 429 / 400 with detailed error message so Next server doesn't throw 500
    const isQuotaError = lastError?.includes('Quota Exceeded') || lastError?.includes('429');
    return NextResponse.json(
      { 
        success: false,
        error: lastError || 'ගණිත ගැටලුව විසඳීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.' 
      },
      { status: isQuotaError ? 429 : 400 }
    );

  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Server Error: ' + err.message },
      { status: 400 }
    );
  }
}
