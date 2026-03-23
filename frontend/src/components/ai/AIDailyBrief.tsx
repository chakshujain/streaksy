'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { dailyApi } from '@/lib/api';
import { Sunrise, Loader2, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIDailyBrief as AIDailyBriefType } from '@/lib/types';

export function AIDailyBrief() {
  const [brief, setBrief] = useState<AIDailyBriefType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const fetchBrief = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dailyApi.getAIBrief();
      setBrief(res.data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate brief';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!brief) {
    return (
      <div>
        <button
          onClick={fetchBrief}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 hover:bg-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sunrise className="h-3.5 w-3.5" />
          )}
          {loading ? 'Generating brief...' : 'AI Daily Brief'}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-orange-500/20 bg-orange-500/5">
      <div className="flex items-center gap-2 mb-3">
        <Sunrise className="h-4 w-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-orange-300">Daily Brief</h3>
      </div>

      <div className="space-y-2">
        {brief.briefs.map((b, i) => (
          <div key={i} className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium text-zinc-200 truncate">{b.problemTitle}</span>
                <span className="inline-flex items-center rounded-full bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[10px] font-medium text-orange-400 flex-shrink-0">
                  {b.pattern}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500">{b.estimatedMinutes}m</span>
                </div>
                {expandedIndex === i ? (
                  <ChevronUp className="h-4 w-4 text-zinc-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-500" />
                )}
              </div>
            </button>
            {expandedIndex === i && (
              <div className="px-3 pb-3 space-y-2">
                <div className="flex items-start gap-1.5">
                  <Target className="h-3 w-3 text-orange-400 mt-0.5" />
                  <p className="text-xs text-zinc-400">{b.whySelected}</p>
                </div>
                <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-2">
                  <p className="text-xs text-orange-300">{b.warmupTip}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
