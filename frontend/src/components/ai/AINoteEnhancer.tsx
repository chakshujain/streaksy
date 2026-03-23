'use client';

import { useState } from 'react';
import { notesApi } from '@/lib/api';
import { Wand2, Loader2, Plus, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { AIEnhancedNote } from '@/lib/types';

interface AINoteEnhancerProps {
  noteId: string;
  onApply?: (enhancedContent: string) => void;
}

export function AINoteEnhancer({ noteId, onApply }: AINoteEnhancerProps) {
  const [enhanced, setEnhanced] = useState<AIEnhancedNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const enhance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await notesApi.enhanceWithAI(noteId);
      setEnhanced(res.data.enhanced);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to enhance notes';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!enhanced) {
    return (
      <div>
        <button
          onClick={enhance}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Wand2 className="h-3 w-3" />
          )}
          {loading ? 'Enhancing...' : 'Enhance with AI'}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-300">AI Enhancement</h3>
        </div>
        {onApply && (
          <button
            onClick={() => onApply(enhanced.enhancedContent)}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30 transition-colors"
          >
            <ArrowRight className="h-3 w-3" />
            Apply Changes
          </button>
        )}
      </div>

      {enhanced.addedPoints.length > 0 && (
        <div className="mb-3">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Added Points</span>
          <ul className="mt-1.5 space-y-1">
            {enhanced.addedPoints.map((point, i) => (
              <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                <Plus className="h-3 w-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {enhanced.suggestion && (
        <div className="rounded-lg bg-zinc-800/50 p-2.5 border border-zinc-700/50">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase">Suggestion</span>
          <p className="text-xs text-zinc-400 mt-0.5">{enhanced.suggestion}</p>
        </div>
      )}

      <div className="mt-3 rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase mb-1 block">Enhanced Content Preview</span>
        <p className="text-sm text-zinc-300 whitespace-pre-wrap">{enhanced.enhancedContent}</p>
      </div>
    </Card>
  );
}
