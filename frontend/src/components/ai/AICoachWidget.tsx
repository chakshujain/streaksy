'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { insightsApi } from '@/lib/api';
import { Sparkles, Loader2, Target } from 'lucide-react';
import type { AICoachTip } from '@/lib/types';

export function AICoachWidget() {
  const [tip, setTip] = useState<AICoachTip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTip = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await insightsApi.getAICoach();
      setTip(res.data.tip);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate tip';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!tip) {
    return (
      <Card className="border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-violet-300">AI Coach</h3>
        </div>
        <p className="text-xs text-zinc-400 mb-3">
          Get a personalized study tip based on your progress and weak areas.
        </p>
        <button
          onClick={fetchTip}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {loading ? 'Analyzing your progress...' : "Get Today's Tip"}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </Card>
    );
  }

  return (
    <Card className="border-violet-500/20 bg-violet-500/5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-violet-400" />
        <h3 className="text-sm font-semibold text-violet-300">AI Coach</h3>
      </div>

      <p className="text-sm text-zinc-300 mb-3">{tip.tip}</p>

      <div className="flex items-center gap-2 mb-3">
        <Target className="h-3.5 w-3.5 text-violet-400" />
        <span className="inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-medium text-violet-400">
          Focus: {tip.focusArea}
        </span>
      </div>

      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5">
        <p className="text-xs text-emerald-400">{tip.encouragement}</p>
      </div>
    </Card>
  );
}
