'use client';

import { useEffect, useState } from 'react';
import { pokesApi } from '@/lib/api';
import { AlertTriangle, Flame, X } from 'lucide-react';
import Link from 'next/link';

interface StreakRisk {
  atRisk: boolean;
  currentStreak: number;
  hoursLeft: number;
  message: string;
}

export function StreakRiskBanner() {
  const [risk, setRisk] = useState<StreakRisk | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    pokesApi.streakRisk()
      .then(({ data }) => {
        if (data.risk?.atRisk) setRisk(data.risk);
      })
      .catch(() => {});
  }, []);

  if (!risk || dismissed) return null;

  return (
    <div className="mx-auto max-w-6xl px-8 mt-4">
      <div className="relative flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 animate-slide-up">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 flex-shrink-0">
          <Flame className="h-5 w-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-amber-300">
              Streak at Risk!
            </span>
          </div>
          <p className="text-sm text-amber-400/80 mt-0.5">{risk.message}</p>
        </div>
        <Link
          href="/problems"
          className="flex-shrink-0 rounded-lg bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/30 transition-colors"
        >
          Solve Now
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-500/50 hover:text-amber-400 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
