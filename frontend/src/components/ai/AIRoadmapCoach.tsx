'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { roadmapsApi } from '@/lib/api';
import { Compass, Loader2, Clock, Lightbulb } from 'lucide-react';
import type { AIRoadmapGuidance } from '@/lib/types';

interface AIRoadmapCoachProps {
  roadmapId: string;
}

export function AIRoadmapCoach({ roadmapId }: AIRoadmapCoachProps) {
  const [guidance, setGuidance] = useState<AIRoadmapGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGuidance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await roadmapsApi.getAIGuidance(roadmapId);
      setGuidance(res.data.guidance);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate guidance';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!guidance) {
    return (
      <div>
        <button
          onClick={fetchGuidance}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-400 hover:bg-teal-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Compass className="h-3.5 w-3.5" />
          )}
          {loading ? 'Getting guidance...' : 'AI Guidance'}
        </button>
        {error && (
          <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-teal-500/20 bg-teal-500/5">
      <div className="flex items-center gap-2 mb-3">
        <Compass className="h-4 w-4 text-teal-400" />
        <h3 className="text-sm font-semibold text-teal-300">AI Guidance</h3>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Lightbulb className="h-3 w-3 text-teal-400" />
            <span className="text-xs font-semibold text-teal-400">Today&apos;s Tip</span>
          </div>
          <p className="text-sm text-zinc-300">{guidance.todayTip}</p>
        </div>

        <div className="rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50">
          <span className="text-xs font-semibold text-zinc-400 mb-1 block">Approach</span>
          <p className="text-sm text-zinc-300">{guidance.approachSuggestion}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-zinc-400" />
            <span className="text-xs text-zinc-400">{guidance.timeEstimate}</span>
          </div>
        </div>

        {guidance.motivationalNote && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5">
            <p className="text-xs text-emerald-400">{guidance.motivationalNote}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
