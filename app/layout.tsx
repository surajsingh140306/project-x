 import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'project-x · AI Coding Playground (Skeleton)',
  description: 'Minimal Next.js 14 + Tailwind + Supabase + AI skeleton for project-x',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" data-testid="root-html">
      <body
        className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col"
        data-testid="root-body"
      >
        <main className="flex-1 flex justify-center px-4 py-8">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
