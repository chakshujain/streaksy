'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ProblemProgress } from '@/lib/types';

interface RecentActivityProps {
  progress: ProblemProgress[];
}

export function RecentActivity({ progress }: RecentActivityProps) {
  const recent = progress
    .filter((p) => p.status !== 'not_started')
    .sort((a, b) => {
      const da = a.solved_at ? new Date(a.solved_at).getTime() : 0;
      const db = b.solved_at ? new Date(b.solved_at).getTime() : 0;
      return db - da;
    })
    .slice(0, 10);

  return (
    <Card variant="glass">
      <h3 className="mb-4 text-sm font-medium text-zinc-400">Recent Activity</h3>
      {recent.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-600">
          No activity yet. Start solving!
        </p>
      ) : (
        <div className="space-y-3">
          {recent.map((item) => (
            <div
              key={item.problem_id}
              className="flex items-center justify-between rounded-lg border border-zinc-800/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {item.status === 'solved' ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Circle className="h-4 w-4 text-amber-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {item.title || item.slug || 'Problem'}
                  </p>
                  {item.solved_at && (
                    <p className="text-xs text-zinc-500">
                      {formatDistanceToNow(new Date(item.solved_at), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
              {item.difficulty && (
                <Badge variant={item.difficulty as 'easy' | 'medium' | 'hard'}>
                  {item.difficulty}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
