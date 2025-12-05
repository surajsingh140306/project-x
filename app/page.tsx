"use client";

import { useState } from "react";

interface GenerateResponse {
  result?: string;
  error?: string;
}

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt before generating.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = (await response.json()) as GenerateResponse;

      if (!response.ok) {
        setError(data.error || "Something went wrong while calling /api/generate.");
        setResult("");
        return;
      }

      if (data.result) {
        setResult(data.result);
      } else if (data.error) {
        setError(data.error);
        setResult("");
      } else {
        setError("Unexpected response from /api/generate.");
        setResult("");
      }
    } catch (err) {
      setError("Network error while calling /api/generate.");
      setResult("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur"
      data-testid="home-page"
    >
      <header className="space-y-1" data-testid="home-header">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          project-x{" "}
          <span className="text-slate-400"> · AI Coding Playground (Skeleton)</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Enter a prompt and hit &quot;Test Generate&quot; to call the /api/generate
          endpoint. When configured with AI_PROVIDER=gemini, this will use Gemini 1.5
          Flash via its REST API.
        </p>
      </header>

      <section className="space-y-2" data-testid="prompt-section">
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-200">
          Prompt
        </label>
        <textarea
          id="prompt"
          data-testid="prompt-textarea"
          className="w-full min-h-[140px] resize-y rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
          placeholder="Describe what you want the AI to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </section>

      <section className="flex items-center justify-between gap-3" data-testid="controls-section">
        <button
          type="button"
          data-testid="test-generate-button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-slate-50 shadow-sm transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Generating..." : "Test Generate"}
        </button>
        {isLoading && (
          <p className="text-xs text-slate-400" data-testid="loading-indicator">
            Calling /api/generate...
          </p>
        )}
      </section>

      <section className="space-y-2" data-testid="result-section">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200">Result</span>
          {error && (
            <span className="text-xs text-red-400" data-testid="error-message">
              {error}
            </span>
          )}
        </div>
        <pre
          data-testid="result-code-block"
          className="max-h-[320px] overflow-auto rounded-md border border-slate-800 bg-slate-950/80 p-3 text-xs leading-relaxed text-slate-100 font-mono whitespace-pre-wrap"
        >
          {result || "// The AI response will appear here."}
        </pre>
      </section>
    </div>
  );
}

