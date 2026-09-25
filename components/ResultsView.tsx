'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScoreGauge } from './ScoreGauge';
import { KeywordList } from './KeywordList';
import type { AnalysisResult } from '@/lib/types';
import { Lightbulb, Wand2, AlertTriangle, Target } from 'lucide-react';

export function ResultsView({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-6 pt-6 md:flex-row md:justify-around">
          <ScoreGauge score={result.score} />
          <div className="max-w-md text-center md:text-left">
            <h2 className="mb-2 text-xl font-semibold">Verdict</h2>
            <p className="text-muted-foreground">{result.summary}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(result.category_scores).map(([key, val]) => (
            <div key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize">{key}</span>
                <span className="font-medium">{val}/100</span>
              </div>
              <Progress value={val} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">
              ✅ Matched Keywords ({result.matched_keywords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordList keywords={result.matched_keywords} variant="matched" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              ❌ Missing Keywords ({result.missing_keywords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordList keywords={result.missing_keywords} variant="missing" />
          </CardContent>
        </Card>
      </div>

      {result.formatting_issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Formatting Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {result.formatting_issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-500" /> Rewrite Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.rewrite_suggestions.map((s, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="mb-2">
                <p className="mb-1 text-xs font-semibold text-red-600">BEFORE</p>
                <p className="text-sm text-muted-foreground line-through">{s.original}</p>
              </div>
              <div className="mb-2">
                <p className="mb-1 text-xs font-semibold text-green-600">AFTER</p>
                <p className="text-sm">{s.improved}</p>
              </div>
              <p className="text-xs italic text-muted-foreground">💡 {s.reason}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" /> Quick Wins (Do These First)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-inside list-decimal space-y-2 text-sm">
            {result.quick_wins.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}