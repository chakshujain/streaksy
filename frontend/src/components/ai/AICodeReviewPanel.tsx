'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { revisionApi } from '@/lib/api';
import { Code2, Loader2, CheckCircle2, AlertCircle, AlertTriangle, Info, Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AICodeReview } from '@/lib/types';

interface AICodeReviewPanelProps {
  problemId: string;
}

const severityConfig = {
  critical: { icon: AlertCircle, color: 'red', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'yellow', label: 'Warning' },
  suggestion: { icon: Info, color: 'blue', label: 'Suggestion' },
};

function RatingBar({ rating }: { rating: number }) {
  const color = rating >= 8 ? 'emerald' : rating >= 5 ? 'yellow' : 'red';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            color === 'emerald' && 'bg-emerald-500',
            color === 'yellow' && 'bg-yellow-500',
            color === 'red' && 'bg-red-500'
          )}
          style={{ width: `${rating * 10}%` }}
        />
      </div>
      <span className={cn(
        'text-sm font-bold',
        color === 'emerald' && 'text-emerald-400',
        color === 'yellow' && 'text-yellow-400',
        color === 'red' && 'text-red-400'
      )}>
        {rating}/10
      </span>
    </div>
  );
}

export function AICodeReviewPanel({ problemId }: AICodeReviewPanelProps) {
  const [review, setReview] = useState<AICodeReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReview = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await revisionApi.getCodeReview(problemId);
      setReview(res.data.review);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate code review';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!review) {
    return (
      <div>
        <button
          onClick={fetchReview}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Code2 className="h-3.5 w-3.5" />
          )}
          {loading ? 'Reviewing code...' : 'AI Code Review'}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-semibold text-emerald-300">AI Code Review</h3>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <RatingBar rating={review.rating} />
        <p className="text-sm text-zinc-300 mt-2">{review.summary}</p>
      </div>

      {/* Complexity */}
      <div className="flex gap-3 mb-4">
        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-mono text-zinc-400">
          Time: {review.timeComplexity}
        </span>
        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-mono text-zinc-400">
          Space: {review.spaceComplexity}
        </span>
      </div>

      {/* Strengths */}
      {review.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
          </h4>
          <ul className="space-y-1">
            {review.strengths.map((s, i) => (
              <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                <span className="text-emerald-500 mt-0.5">+</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      {review.issues.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-semibold text-zinc-400 mb-2">Issues</h4>
          {review.issues.map((issue, i) => {
            const config = severityConfig[issue.severity];
            const Icon = config.icon;
            return (
              <div key={i} className={cn(
                'rounded-lg border p-3',
                issue.severity === 'critical' && 'border-red-500/20 bg-red-500/5',
                issue.severity === 'warning' && 'border-yellow-500/20 bg-yellow-500/5',
                issue.severity === 'suggestion' && 'border-blue-500/20 bg-blue-500/5'
              )}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={cn(
                    'h-3.5 w-3.5',
                    issue.severity === 'critical' && 'text-red-400',
                    issue.severity === 'warning' && 'text-yellow-400',
                    issue.severity === 'suggestion' && 'text-blue-400'
                  )} />
                  <span className={cn(
                    'text-[10px] font-semibold uppercase',
                    issue.severity === 'critical' && 'text-red-400',
                    issue.severity === 'warning' && 'text-yellow-400',
                    issue.severity === 'suggestion' && 'text-blue-400'
                  )}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-300">{issue.description}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  <span className="text-zinc-400 font-medium">Fix:</span> {issue.fix}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Optimized approach */}
      {review.optimizedApproach && (
        <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Star className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-purple-400">Better Approach</span>
          </div>
          <p className="text-xs text-zinc-300">{review.optimizedApproach}</p>
        </div>
      )}
    </Card>
  );
}
