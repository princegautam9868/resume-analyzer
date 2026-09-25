export interface AnalysisResult {
  score: number;
  summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  formatting_issues: string[];
  rewrite_suggestions: {
    original: string;
    improved: string;
    reason: string;
  }[];
  quick_wins: string[];
  category_scores: {
    keywords: number;
    formatting: number;
    relevance: number;
  };
  interview_likelihood: string;
  top_strength: string;
  biggest_gap: string;
}