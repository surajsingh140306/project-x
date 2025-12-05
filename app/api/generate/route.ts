import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const provider = process.env.AI_PROVIDER;

    // -------- GEMINI --------
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'GEMINI_API_KEY is not set in the environment.' },
          { status: 500 }
        );
      }

      // Gemini REST call
      const geminiRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await geminiRes.json();

      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p.text ?? '')
          .join('') ?? '';

      if (!text) {
        return NextResponse.json(
          { error: 'Gemini API returned an empty response.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ result: text });
    }

    // -------- GROQ (future) --------
    if (provider === 'groq') {
      return NextResponse.json({
        result: 'Groq provider not implemented yet.',
      });
    }

    return NextResponse.json(
      { error: 'Unsupported AI_PROVIDER' },
      { status: 500 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
 
