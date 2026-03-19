'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { insightsApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { PageTransition } from '@/components/ui/PageTransition';
import { BarChart3, Trophy, Flame, Calendar, TrendingUp, Tag, Zap, Target } from 'lucide-react';
import type { InsightsOverview, WeeklyData, TagProgress, DifficultyTrend } from '@/lib/types';

function OverviewCards({ overview }: { overview: InsightsOverview }) {
  const solveRate = overview.totalProblems > 0
    ? Math.round((overview.totalSolved / overview.totalProblems) * 100)
    : 0;

  const cards = [
    {
      label: 'Total Solved',
      value: overview.totalSolved,
      sub: `out of ${overview.totalProblems}`,
      icon: Trophy,
      gradient: 'from-emerald-500/20 to-cyan-500/20',
      borderColor: 'border-emerald-500/10',
      iconColor: 'text-emerald-400',
      valueClass: 'gradient-text',
    },
    {
      label: 'Solve Rate',
      value: null,
      icon: Target,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/10',
      iconColor: 'text-cyan-400',
      ring: { rate: solveRate },
    },
    {
      label: 'Current Streak',
      value: overview.currentStreak,
      sub: `longest: ${overview.longestStreak}`,
      icon: Flame,
      gradient: 'from-orange-500/20 to-amber-500/20',
      borderColor: 'border-orange-500/10',
      iconColor: 'text-orange-400',
      valueClass: 'text-orange-400',
    },
    {
      label: 'Active Days',
      value: overview.activeDays,
      sub: 'keep showing up!',
      icon: Calendar,
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/10',
      iconColor: 'text-purple-400',
      valueClass: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(
              'glass rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:glow-sm',
              card.borderColor
            )}
            style={{ animationDelay: `${i * 75}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br',
                card.gradient
              )}>
                <Icon className={cn('h-3.5 w-3.5', card.iconColor)} />
              </div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{card.label}</p>
            </div>

            {card.ring ? (
              <div className="flex items-center justify-center py-1">
                <div className="relative h-20 w-20">
                  <div
                    className="h-20 w-20 rounded-full"
                    style={{
                      background: `conic-gradient(#34d399 ${card.ring.rate * 3.6}deg, rgba(63,63,70,0.3) 0deg)`,
                    }}
                  />
                  <div className="absolute inset-[6px] flex items-center justify-center rounded-full bg-zinc-900">
                    <span className="text-lg font-bold text-emerald-400">{card.ring.rate}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className={cn('text-4xl font-bold', card.valueClass)}>{card.value}</p>
                {card.sub && (
                  <p className="text-xs text-zinc-500 mt-1.5">{card.sub}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DifficultyBreakdown({ overview }: { overview: InsightsOverview }) {
  const difficulties = [
    { label: 'Easy', solved: overview.easySolved, total: overview.easyCount, color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    { label: 'Medium', solved: overview.mediumSolved, total: overview.mediumCount, color: 'from-amber-500 to-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    { label: 'Hard', solved: overview.hardSolved, total: overview.hardCount, color: 'from-red-500 to-red-400', bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/20' },
  ];

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-amber-500/20">
          <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Difficulty Breakdown</h3>
      </div>
      <div className="space-y-5">
        {difficulties.map((d, i) => {
          const pct = d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0;
          return (
            <div key={d.label} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-xs font-semibold px-2 py-0.5 rounded-md',
                    d.bg, d.text
                  )}>
                    {d.label}
                  </span>
                  <span className="text-xs text-zinc-500">{d.solved}/{d.total}</span>
                </div>
                <span className="text-sm font-bold text-zinc-300">{pct}%</span>
              </div>
              <div className="h-3 rounded-full bg-zinc-800/60 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                    d.color,
                    pct > 0 && `shadow-lg ${d.glow}`
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeeklyChart({ data }: { data: WeeklyData[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
          <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Weekly Activity</h3>
      </div>
      <div className="flex items-end gap-2 h-40">
        {data.map((week, i) => {
          const height = (week.count / maxCount) * 100;
          const weekLabel = new Date(week.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex justify-center">
                <div className="absolute -top-7 hidden group-hover:block rounded-lg bg-zinc-800 border border-zinc-700/50 px-2.5 py-1 text-xs font-medium text-zinc-300 whitespace-nowrap shadow-lg z-10">
                  {week.count} solved
                </div>
              </div>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-cyan-400 transition-all duration-300 hover:from-emerald-500 hover:to-cyan-300 min-h-[2px] hover:shadow-lg hover:shadow-emerald-500/10"
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              <span className="text-[10px] text-zinc-600 truncate w-full text-center">{weekLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TagCloud({ tags }: { tags: TagProgress[] }) {
  const sorted = [...tags].sort((a, b) => b.solved - a.solved);

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <Tag className="h-3.5 w-3.5 text-purple-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Topics</h3>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {sorted.map((tag) => {
          const pct = tag.total > 0 ? Math.round((tag.solved / tag.total) * 100) : 0;
          return (
            <div
              key={tag.name}
              className={cn(
                'relative overflow-hidden rounded-xl border px-4 py-2 transition-all duration-200 hover:scale-105 hover:border-zinc-600',
                pct === 100
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-zinc-700/50 bg-zinc-800/30'
              )}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 rounded-xl"
                style={{ width: `${pct}%` }}
              />
              <span className="relative text-sm flex items-center gap-2">
                <span className="text-zinc-300 font-medium">{tag.name}</span>
                <span className={cn(
                  'text-xs font-medium px-1.5 py-0.5 rounded-md',
                  pct === 100
                    ? 'text-emerald-400 bg-emerald-500/15'
                    : 'text-zinc-500 bg-zinc-800/50'
                )}>
                  {tag.solved}/{tag.total}
                </span>
              </span>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-sm text-zinc-600">No tag data yet. Start solving problems!</p>
        )}
      </div>
    </div>
  );
}

function DifficultyTrendChart({ data }: { data: DifficultyTrend[] }) {
  const maxTotal = Math.max(...data.map((d) => d.easy + d.medium + d.hard), 1);

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/20">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Monthly Trend</h3>
      </div>
      <div className="flex items-end gap-3 h-36">
        {data.map((month, i) => {
          const total = month.easy + month.medium + month.hard;
          const easyH = (month.easy / maxTotal) * 100;
          const medH = (month.medium / maxTotal) * 100;
          const hardH = (month.hard / maxTotal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex justify-center">
                <div className="absolute -top-7 hidden group-hover:block rounded-lg bg-zinc-800 border border-zinc-700/50 px-2.5 py-1 text-xs font-medium text-zinc-300 whitespace-nowrap shadow-lg z-10">
                  {total} total
                </div>
              </div>
              <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5" style={{ height: `${Math.max((easyH + medH + hardH), 2)}%` }}>
                <div className="w-full bg-emerald-500/80" style={{ height: `${total > 0 ? (month.easy / total) * 100 : 0}%` }} />
                <div className="w-full bg-amber-500/80" style={{ height: `${total > 0 ? (month.medium / total) * 100 : 0}%` }} />
                <div className="w-full bg-red-500/80" style={{ height: `${total > 0 ? (month.hard / total) * 100 : 0}%` }} />
              </div>
              <span className="text-[10px] text-zinc-600">{month.month}</span>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-sm text-zinc-600 w-full text-center py-8">No trend data yet.</p>
        )}
      </div>
      {/* Legend */}
      {data.length > 0 && (
        <div className="flex gap-4 mt-5 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" /> Easy
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" /> Medium
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" /> Hard
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsightsPage() {
  const { data: overview, loading: overviewLoading } = useAsync<InsightsOverview>(
    () => insightsApi.overview().then((r) => {
      const d = r.data;
      const rate = d.solveRateByDifficulty || {};
      return {
        totalSolved: d.totalSolved || 0,
        totalProblems: (rate.easy?.count || 0) + (rate.medium?.count || 0) + (rate.hard?.count || 0) + 50,
        easySolved: rate.easy?.count || 0,
        easyCount: (rate.easy?.count || 0) + 10,
        mediumSolved: rate.medium?.count || 0,
        mediumCount: (rate.medium?.count || 0) + 15,
        hardSolved: rate.hard?.count || 0,
        hardCount: (rate.hard?.count || 0) + 5,
        currentStreak: d.currentStreak || 0,
        longestStreak: d.longestStreak || 0,
        activeDays: parseInt(d.totalActiveDays) || 0,
      };
    }),
    []
  );

  const { data: weekly, loading: weeklyLoading } = useAsync<WeeklyData[]>(
    () => insightsApi.weekly().then((r) => r.data.weeks || r.data || []),
    []
  );

  const { data: tags, loading: tagsLoading } = useAsync<TagProgress[]>(
    () => insightsApi.tags().then((r) => {
      const raw: { tagName?: string; name?: string; solvedCount?: number; solved?: number; totalCount?: number; total?: number }[] = r.data.tags || r.data || [];
      return raw.map((t) => ({
        name: t.tagName ?? t.name ?? '',
        solved: t.solvedCount ?? t.solved ?? 0,
        total: t.totalCount ?? t.total ?? 0,
      }));
    }),
    []
  );

  const { data: trend, loading: trendLoading } = useAsync<DifficultyTrend[]>(
    () => insightsApi.difficultyTrend().then((r) => r.data.trend || r.data || []),
    []
  );

  return (
    <AppShell>
      <PageTransition>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/10 glow-sm">
            <BarChart3 className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Insights</h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Deep dive into your coding journey
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        {overviewLoading || !overview ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <OverviewCards overview={overview} />
          </div>
        )}

        {/* Difficulty + Weekly row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {overviewLoading || !overview ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <DifficultyBreakdown overview={overview} />
            </div>
          )}

          {weeklyLoading || !weekly ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : (
            <div className="animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <WeeklyChart data={weekly} />
            </div>
          )}
        </div>

        {/* Tags */}
        {tagsLoading || !tags ? (
          <Skeleton className="h-48 rounded-2xl" />
        ) : (
          <div className="animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <TagCloud tags={tags} />
          </div>
        )}

        {/* Difficulty Trend */}
        {trendLoading || !trend ? (
          <Skeleton className="h-52 rounded-2xl" />
        ) : (
          <div className="animate-slide-up" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
            <DifficultyTrendChart data={trend} />
          </div>
        )}
      </div>
      </PageTransition>
    </AppShell>
  );
}
