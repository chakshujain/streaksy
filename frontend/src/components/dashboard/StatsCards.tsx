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
      bg: 'bg-gradient-to-br from-orange-500/20 to-amber-500/10',
      glow: 'shadow-orange-500/20',
      border: 'border-orange-500/10',
    },
    {
      label: 'Longest Streak',
      value: streak?.longestStreak ?? 0,
      suffix: 'days',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10',
      glow: 'shadow-amber-500/20',
      border: 'border-amber-500/10',
    },
    {
      label: 'Problems Solved',
      value: solvedCount,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/10',
      glow: 'shadow-emerald-500/20',
      border: 'border-emerald-500/10',
    },
    {
      label: 'This Week',
      value: '\u2014',
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/10',
      glow: 'shadow-blue-500/20',
      border: 'border-blue-500/10',
    },
  ];

  return (
    <>
      {stats.map((stat) => (
        <Card
          key={stat.label}
          variant="glass"
          className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${stat.glow} hover:border-${stat.border}`}
        >
          {/* Subtle background glow on hover */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative flex items-center gap-4">
            <div className={`rounded-xl p-3 ${stat.bg} border ${stat.border} transition-transform duration-300 group-hover:scale-110`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{stat.label}</p>
              <p className="mt-0.5 text-3xl font-bold text-zinc-100 tracking-tight">
                {stat.value}
                {stat.suffix && (
                  <span className="ml-1.5 text-sm font-normal text-zinc-600">
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
