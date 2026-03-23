'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { discussionsApi } from '@/lib/api';
import { MessagesSquare, Loader2, Zap, CheckCircle } from 'lucide-react';
import type { AIDiscussionSummary as AIDiscussionSummaryType } from '@/lib/types';

interface AIDiscussionSummaryProps {
  problemSlug: string;
}

export function AIDiscussionSummary({ problemSlug }: AIDiscussionSummaryProps) {
  const [summary, setSummary] = useState<AIDiscussionSummaryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await discussionsApi.getAISummary(problemSlug);
      setSummary(res.data.summary);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate summary';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!summary) {
    return (
      <div>
        <button
          onClick={fetchSummary}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MessagesSquare className="h-3.5 w-3.5" />
          )}
          {loading ? 'Summarizing...' : 'AI Discussion Summary'}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-indigo-500/20 bg-indigo-500/5">
      <div className="flex items-center gap-2 mb-3">
        <MessagesSquare className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-indigo-300">Discussion Summary</h3>
      </div>

      <p className="text-sm text-zinc-300 mb-3">{summary.summary}</p>

      {summary.approaches.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Approaches Mentioned</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {summary.approaches.map((approach, i) => (
              <span key={i} className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                {approach}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50 mb-3">
        <div className="flex items-center gap-1.5 mb-1">
          <CheckCircle className="h-3 w-3 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-400">Consensus</span>
        </div>
        <p className="text-sm text-zinc-300">{summary.consensus}</p>
      </div>

      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Zap className="h-3 w-3 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">Key Insight</span>
        </div>
        <p className="text-xs text-zinc-300">{summary.keyInsight}</p>
      </div>
    </Card>
  );
}
