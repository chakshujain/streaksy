'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { revisionApi } from '@/lib/api';
import { BookOpen, Loader2, ChevronDown, ChevronUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AIExplanation } from '@/lib/types';

interface AIExplanationPanelProps {
  problemId: string;
}

export function AIExplanationPanel({ problemId }: AIExplanationPanelProps) {
  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedApproach, setExpandedApproach] = useState<number | null>(null);

  const fetchExplanation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await revisionApi.getExplanation(problemId);
      setExplanation(res.data.explanation);
      setExpandedApproach(0);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate explanation';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!explanation) {
    return (
      <div>
        <button
          onClick={fetchExplanation}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <BookOpen className="h-3.5 w-3.5" />
          )}
          {loading ? 'Analyzing problem...' : 'AI Explanation'}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-blue-300">AI Explanation</h3>
      </div>

      {/* Overview */}
      <p className="text-sm text-zinc-300 mb-4">{explanation.overview}</p>

      {/* Approaches */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Approaches</h4>
        {explanation.approaches.map((approach, i) => (
          <div key={i} className="rounded-lg border border-zinc-700/50 bg-zinc-800/30 overflow-hidden">
            <button
              onClick={() => setExpandedApproach(expandedApproach === i ? null : i)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  'inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold',
                  i === explanation.approaches.length - 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-600/30 text-zinc-400'
                )}>
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-zinc-200">{approach.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">{approach.timeComplexity} / {approach.spaceComplexity}</span>
              </div>
              {expandedApproach === i ? (
                <ChevronUp className="h-4 w-4 text-zinc-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              )}
            </button>
            {expandedApproach === i && (
              <div className="px-3 pb-3 space-y-2">
                <p className="text-sm text-zinc-400">{approach.description}</p>
                <div className="flex gap-4">
                  {approach.pros.length > 0 && (
                    <div>
                      <span className="text-[10px] font-semibold text-green-400 uppercase">Pros</span>
                      <ul className="mt-1 space-y-0.5">
                        {approach.pros.map((pro, j) => (
                          <li key={j} className="text-xs text-zinc-400 flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">+</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {approach.cons.length > 0 && (
                    <div>
                      <span className="text-[10px] font-semibold text-red-400 uppercase">Cons</span>
                      <ul className="mt-1 space-y-0.5">
                        {approach.cons.map((con, j) => (
                          <li key={j} className="text-xs text-zinc-400 flex items-start gap-1">
                            <span className="text-red-500 mt-0.5">-</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Best approach */}
      {explanation.bestApproach && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">Optimal Approach</span>
          </div>
          <p className="text-sm text-zinc-300">{explanation.bestApproach}</p>
        </div>
      )}

      {/* Common mistakes */}
      {explanation.commonMistakes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-3.5 w-3.5 text-yellow-400" />
            <h4 className="text-xs font-semibold text-yellow-400">Common Mistakes</h4>
          </div>
          <ul className="space-y-1">
            {explanation.commonMistakes.map((mistake, i) => (
              <li key={i} className="text-xs text-zinc-400 flex items-start gap-1.5">
                <span className="text-yellow-500 mt-0.5">&bull;</span> {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related patterns */}
      {explanation.relatedPatterns.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {explanation.relatedPatterns.map((pattern, i) => (
            <span key={i} className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-400">
              {pattern}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
