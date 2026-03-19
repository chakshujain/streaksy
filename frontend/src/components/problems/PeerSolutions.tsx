'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { submissionsApi } from '@/lib/api';
import { Users, Code2, ChevronDown, ChevronUp, Clock, Zap, HardDrive } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatDistanceToNow } from 'date-fns';
import type { PeerSolution } from '@/lib/types';

interface PeerSolutionsProps {
  problemId: string;
}

export function PeerSolutions({ problemId }: PeerSolutionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: solutions, loading } = useAsync<PeerSolution[]>(
    () => problemId ? submissionsApi.peerSolutions(problemId).then(r => r.data.solutions) : Promise.resolve([]),
    [problemId]
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!solutions || solutions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <Users className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm text-zinc-500">No peer solutions yet.</p>
          <p className="text-xs text-zinc-600 mt-1">Be the first to solve this problem!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Peer Solutions ({solutions.length})</h3>
      </div>

      {solutions.map((sol, i) => (
        <div
          key={sol.id}
          className={cn(
            'rounded-xl border transition-all duration-200',
            expandedId === sol.id ? 'border-emerald-500/20 bg-zinc-900/80' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
          )}
        >
          <button
            onClick={() => setExpandedId(expandedId === sol.id ? null : sol.id)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-400">
                #{i + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{sol.display_name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <Code2 className="h-3 w-3" /> {sol.language}
                  </span>
                  {sol.runtime_ms && (
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {sol.runtime_ms}ms
                    </span>
                  )}
                  {sol.memory_kb && (
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <HardDrive className="h-3 w-3" /> {Math.round(sol.memory_kb / 1024 * 10) / 10}MB
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(sol.submitted_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {sol.runtime_percentile && (
                <Badge variant="easy">Beats {sol.runtime_percentile.toFixed(0)}%</Badge>
              )}
              {expandedId === sol.id ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
            </div>
          </button>

          {expandedId === sol.id && sol.code && (
            <div className="px-4 pb-4 animate-fade-in">
              <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto text-xs text-zinc-300 font-mono leading-relaxed max-h-96 overflow-y-auto">
                <code>{sol.code}</code>
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
