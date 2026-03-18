'use client';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Flame, CheckCircle, Trophy, TrendingUp } from 'lucide-react';
import type { Streak } from '@/lib/types';

interface StatsCardsProps {
  streak: Streak | null;
  solvedCount: number;
  loading: boolean;
}

export function StatsCards({ streak, solvedCount, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </>
    );
  }

  const stats = [
    {
      label: 'Current Streak',
      value: streak?.currentStreak ?? 0,
      suffix: 'days',
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Longest Streak',
      value: streak?.longestStreak ?? 0,
      suffix: 'days',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Problems Solved',
      value: solvedCount,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'This Week',
      value: '\u2014',
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.label} variant="glass" className="hover:glow-sm transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className={`rounded-xl p-2.5 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-100">
                {stat.value}
                {stat.suffix && (
                  <span className="ml-1 text-sm font-normal text-zinc-500">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
