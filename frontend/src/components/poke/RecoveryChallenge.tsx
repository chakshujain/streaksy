'use client';

import { useEffect, useState } from 'react';
import { pokesApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Zap, Target } from 'lucide-react';
import Link from 'next/link';

interface Challenge {
  id: string;
  challenge_type: string;
  target_count: number;
  completed_count: number;
  status: string;
  expires_at: string;
}

export function RecoveryChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    pokesApi.activeChallenge()
      .then(({ data }) => {
        if (data.challenge) setChallenge(data.challenge);
      })
      .catch(() => {});
  }, []);

  if (!challenge || challenge.status !== 'active') return null;

  const progress = Math.round((challenge.completed_count / challenge.target_count) * 100);
  const remaining = challenge.target_count - challenge.completed_count;

  return (
    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 flex-shrink-0">
          <Zap className="h-5 w-5 text-orange-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-orange-300">Recovery Challenge</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Your streak broke! Solve {challenge.target_count} problems today to prove you&apos;re back.
          </p>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-zinc-500">{challenge.completed_count} / {challenge.target_count} solved</span>
              <span className="text-orange-400">{remaining} to go</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link
            href="/problems"
            className="inline-flex items-center gap-1.5 mt-3 rounded-lg bg-orange-500/15 px-3 py-1.5 text-xs font-medium text-orange-300 hover:bg-orange-500/25 transition-colors"
          >
            <Target className="h-3 w-3" /> Solve a Problem
          </Link>
        </div>
      </div>
    </Card>
  );
}
