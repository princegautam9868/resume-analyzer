import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-xl font-bold">ResumeScan</span>
          <Link href="/analyze">
            <Button>Try Free</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          ✨ Powered by Claude AI
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          Is Your Resume Getting
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rejected by ATS Robots?
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          75% of resumes are rejected before a human sees them. Upload yours + the
          job description — get your ATS score and missing keywords in 10 seconds.
        </p>
        <Link href="/analyze">
          <Button size="lg" className="h-14 px-8 text-lg">
            <Zap className="mr-2 h-5 w-5" /> Analyze My Resume — Free
          </Button>
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          No signup required • Instant results
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: 'ATS Score', desc: 'See how robots rank your resume 0-100' },
            { icon: CheckCircle2, title: 'Keyword Gaps', desc: 'Know exactly which skills are missing' },
            { icon: TrendingUp, title: 'Smart Rewrites', desc: 'AI suggestions to fix weak bullet points' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-white p-6">
              <Icon className="mb-3 h-8 w-8 text-blue-600" />
              <h3 className="mb-1 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ResumeScan — Not affiliated with any ATS provider
      </footer>
    </main>
  );
}