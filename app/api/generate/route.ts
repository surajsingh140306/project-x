import { NextResponse } from "next/server";

interface GenerateRequestBody {
  prompt?: string;
}

interface GeminiCandidatePart {
  text?: string;
}

interface GeminiContent {
  parts?: GeminiCandidatePart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequestBody;
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const provider = process.env.AI_PROVIDER;

    if (!provider) {
      return NextResponse.json(
        { error: "Unsupported AI_PROVIDER" },
        { status: 500 }
      );
    }

    if (provider === "gemini") {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not set in the environment." },
          { status: 500 }
        );
      }

      const geminiResponse = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Gemini API error:", geminiResponse.status, errorText);
        return NextResponse.json(
          { error: "Gemini API request failed." },
          { status: 500 }
        );
      }

      const geminiJson = (await geminiResponse.json()) as GeminiResponse;
      const textResult =
        geminiJson.candidates?.[0]?.content?.parts
          ?.map((p) => p.text ?? "")
          .join("") ?? "";

      if (!textResult) {
        return NextResponse.json(
          { error: "Gemini API returned an empty response." },
          { status: 500 }
        );
      }

      return NextResponse.json({ result: textResult });
    }

    if (provider === "groq") {
      return NextResponse.json({ result: "Groq provider not implemented yet." });
    }

    return NextResponse.json(
      { error: "Unsupported AI_PROVIDER" },
      { status: 500 }
    );
  } catch (error) {
    console.error("/api/generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
