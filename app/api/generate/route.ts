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
            contents: [{ parts: [{
