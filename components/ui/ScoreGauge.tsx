'use client';

interface Props {
  score: number;
}

export function ScoreGauge({ score }: Props) {
  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#16a34a', text: 'text-green-600', label: 'Excellent' };
    if (s >= 60) return { stroke: '#ca8a04', text: 'text-yellow-600', label: 'Good' };
    if (s >= 40) return { stroke: '#ea580c', text: 'text-orange-600', label: 'Needs Work' };
    return { stroke: '#dc2626', text: 'text-red-600', label: 'Poor' };
  };

  const { stroke, text, label } = getColor(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-48 w-48">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${text}`}>{score}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className={`mt-2 text-lg font-semibold ${text}`}>{label}</p>
    </div>
  );
}