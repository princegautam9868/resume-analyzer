'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadZone } from '@/components/UploadZone';
import { ResultsView } from '@/components/ResultsView';
import type { AnalysisResult } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!file || jd.trim().length < 50) {
      setError('Please upload a resume and paste a job description (50+ chars)');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const form = new FormData();
      form.append('resume', file);
      form.append('jd', jd);

      const res = await fetch('/api/analyze', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Analyze Your Resume</h1>
        <p className="text-muted-foreground">
          Get your ATS score and keyword gaps in seconds
        </p>
      </div>

      {!result && (
        <Card>
          <CardHeader>
            <CardTitle>1. Upload Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <UploadZone file={file} onFileChange={setFile} />

            <div>
              <h3 className="mb-3 font-semibold">2. Paste Job Description</h3>
              <Textarea
                placeholder="Paste the full job description here..."
                rows={10}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {jd.length} characters {jd.length < 50 && '(minimum 50)'}
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze My Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <Button variant="outline" onClick={() => setResult(null)} className="mb-6">
            ← Analyze Another
          </Button>
          <ResultsView result={result} />
        </>
      )}
    </main>
  );
}