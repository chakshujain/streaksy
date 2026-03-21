'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { revisionApi } from '@/lib/api';
import { Lightbulb, Loader2, ChevronDown, Lock } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AIHint } from '@/lib/types';

interface AIHintsPanelProps {
  problemId: string;
}

export function AIHintsPanel({ problemId }: AIHintsPanelProps) {
  const [hints, setHints] = useState<AIHint[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revealedLevel, setRevealedLevel] = useState(0);

  const fetchHints = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await revisionApi.getHints(problemId);
      setHints(res.data.hints);
      setRevealedLevel(1);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate hints';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!hints) {
    return (
      <div>
        <button
          onClick={fetchHints}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Lightbulb className="h-3.5 w-3.5" />
          )}
          {loading ? 'Generating hints...' : 'Get AI Hints'}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-4 w-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-amber-300">AI Hints</h3>
        <span className="text-xs text-zinc-500">Click to reveal progressively</span>
      </div>
      <div className="space-y-3">
        {hints.map((hint) => (
          <div key={hint.level}>
            {hint.level <= revealedLevel ? (
              <div className="rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn(
                    'inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold',
                    hint.level === 1 && 'bg-green-500/20 text-green-400',
                    hint.level === 2 && 'bg-yellow-500/20 text-yellow-400',
                    hint.level === 3 && 'bg-red-500/20 text-red-400'
                  )}>
                    {hint.level}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {hint.level === 1 ? 'Gentle Nudge' : hint.level === 2 ? 'Key Insight' : 'Almost There'}
                  </span>
                </div>
                <p className="text-sm text-zinc-300">{hint.hint}</p>
              </div>
            ) : (
              <button
                onClick={() => setRevealedLevel(hint.level)}
                className="w-full rounded-lg border border-dashed border-zinc-700 p-3 flex items-center justify-center gap-2 text-zinc-500 hover:border-amber-500/30 hover:text-amber-400 transition-colors"
              >
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs">
                  Reveal Hint {hint.level} — {hint.level === 2 ? 'Key Insight' : 'Almost There'}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
