'use client';

import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Props {
  keywords: string[];
  variant: 'matched' | 'missing';
}

export function KeywordList({ keywords, variant }: Props) {
  const isMatched = variant === 'matched';
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.length === 0 ? (
        <p className="text-sm text-muted-foreground">None found</p>
      ) : (
        keywords.map((kw, i) => (
          <Badge
            key={i}
            variant={isMatched ? 'default' : 'destructive'}
            className="flex items-center gap-1 py-1"
          >
            {isMatched ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {kw}
          </Badge>
        ))
      )}
    </div>
  );
}