'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { insightsApi } from '@/lib/api';
import type { InsightsOverview, WeeklyData, TagProgress, DifficultyTrend } from '@/lib/types';

function OverviewCards({ overview }: { overview: InsightsOverview }) {
  const solveRate = overview.totalProblems > 0
    ? Math.round((overview.totalSolved / overview.totalProblems) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Solved */}
      <Card variant="glass" className="text-center">
        <p className="text-sm text-zinc-500 mb-2">Total Solved 💪</p>
        <p className="text-5xl font-bold gradient-text">{overview.totalSolved}</p>
        <p className="text-xs text-zinc-500 mt-2">out of {overview.totalProblems}</p>
      </Card>

      {/* Solve Rate Ring */}
      <Card variant="glass" className="flex flex-col items-center justify-center">
        <p className="text-sm text-zinc-500 mb-3">Solve Rate 🎯</p>
        <div className="relative h-24 w-24">
          <div
            className="h-24 w-24 rounded-full"
            style={{
              background: `conic-gradient(#34d399 ${solveRate * 3.6}deg, rgba(63,63,70,0.3) 0deg)`,
            }}
          />
          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-zinc-900">
            <span className="text-xl font-bold text-emerald-400">{solveRate}%</span>
          </div>
        </div>
      </Card>

      {/* Current Streak */}
      <Card variant="glow" className="text-center">
        <p className="text-sm text-zinc-500 mb-2">Current Streak 🔥</p>
        <p className="text-5xl font-bold text-orange-400">{overview.currentStreak}</p>
        <p className="text-xs text-zinc-500 mt-2">longest: {overview.longestStreak}</p>
      </Card>

      {/* Active Days */}
      <Card variant="glass" className="text-center">
        <p className="text-sm text-zinc-500 mb-2">Active Days 📅</p>
        <p className="text-5xl font-bold text-cyan-400">{overview.activeDays}</p>
        <p className="text-xs text-zinc-500 mt-2">keep showing up!</p>
      </Card>
    </div>
  );
}

function DifficultyBreakdown({ overview }: { overview: InsightsOverview }) {
  const difficulties = [
    { label: 'Easy', solved: overview.easySolved, total: overview.easyCount, color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    { label: 'Medium', solved: overview.mediumSolved, total: overview.mediumCount, color: 'from-amber-500 to-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    { label: 'Hard', solved: overview.hardSolved, total: overview.hardCount, color: 'from-red-500 to-red-400', bg: 'bg-red-500/10', text: 'text-red-400' },
  ];

  return (
    <Card variant="glass">
      <h3 className="mb-6 text-lg font-semibold text-zinc-200">Difficulty Breakdown 📊</h3>
      <div className="space-y-5">
        {difficulties.map((d) => {
          const pct = d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0;
          return (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${d.text}`}>{d.label}</span>
                  <span className="text-xs text-zinc-500">{d.solved}/{d.total}</span>
                </div>
                <span className="text-sm font-semibold text-zinc-300">{pct}%</span>
              </div>
              <div className="h-3 rounded-full bg-zinc-800/60 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${d.color} transition-all duration-1000`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function WeeklyChart({ data }: { data: WeeklyData[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card variant="glass">
      <h3 className="mb-6 text-lg font-semibold text-zinc-200">Weekly Activity 📈</h3>
      <div className="flex items-end gap-2 h-40">
        {data.map((week, i) => {
          const height = (week.count / maxCount) * 100;
          const weekLabel = new Date(week.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex justify-center">
                <div className="absolute -top-6 hidden group-hover:block rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 whitespace-nowrap">
                  {week.count} solved
                </div>
              </div>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-cyan-500 transition-all duration-300 hover:opacity-80 min-h-[2px]"
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              <span className="text-[10px] text-zinc-600 truncate w-full text-center">{weekLabel}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function TagCloud({ tags }: { tags: TagProgress[] }) {
  const sorted = [...tags].sort((a, b) => b.solved - a.solved);

  return (
    <Card variant="glass">
      <h3 className="mb-6 text-lg font-semibold text-zinc-200">Topics 🏷️</h3>
      <div className="flex flex-wrap gap-3">
        {sorted.map((tag) => {
          const pct = tag.total > 0 ? Math.round((tag.solved / tag.total) * 100) : 0;
          return (
            <div
              key={tag.name}
              className="relative overflow-hidden rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-2"
            >
              <div
                className="absolute inset-0 bg-emerald-500/10 rounded-full"
                style={{ width: `${pct}%` }}
              />
              <span className="relative text-sm">
                <span className="text-zinc-300 font-medium">{tag.name}</span>
                <span className="ml-2 text-xs text-zinc-500">{tag.solved}/{tag.total}</span>
              </span>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-sm text-zinc-600">No tag data yet. Start solving problems!</p>
        )}
      </div>
    </Card>
  );
}

function DifficultyTrendChart({ data }: { data: DifficultyTrend[] }) {
  const maxTotal = Math.max(...data.map((d) => d.easy + d.medium + d.hard), 1);

  return (
    <Card variant="glass">
      <h3 className="mb-6 text-lg font-semibold text-zinc-200">Monthly Trend 📉</h3>
      <div className="flex items-end gap-3 h-36">
        {data.map((month, i) => {
          const total = month.easy + month.medium + month.hard;
          const easyH = (month.easy / maxTotal) * 100;
          const medH = (month.medium / maxTotal) * 100;
          const hardH = (month.hard / maxTotal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex justify-center">
                <div className="absolute -top-6 hidden group-hover:block rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 whitespace-nowrap">
                  {total} total
                </div>
              </div>
              <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden" style={{ height: `${Math.max((easyH + medH + hardH), 2)}%` }}>
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
        <div className="flex gap-4 mt-4 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500/80" /> Easy
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="h-2.5 w-2.5 rounded-sm bg-amber-500/80" /> Medium
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="h-2.5 w-2.5 rounded-sm bg-red-500/80" /> Hard
          </div>
        </div>
      )}
    </Card>
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
    () => insightsApi.tags().then((r) => r.data.tags || r.data || []),
    []
  );

  const { data: trend, loading: trendLoading } = useAsync<DifficultyTrend[]>(
    () => insightsApi.difficultyTrend().then((r) => r.data.trend || r.data || []),
    []
  );

  return (
    <AppShell>
      <div className="space-y-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Insights</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Deep dive into your coding journey 🚀
          </p>
        </div>

        {/* Overview Cards */}
        {overviewLoading || !overview ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        ) : (
          <OverviewCards overview={overview} />
        )}

        {/* Difficulty + Weekly row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {overviewLoading || !overview ? (
            <Skeleton className="h-64" />
          ) : (
            <DifficultyBreakdown overview={overview} />
          )}

          {weeklyLoading || !weekly ? (
            <Skeleton className="h-64" />
          ) : (
            <WeeklyChart data={weekly} />
          )}
        </div>

        {/* Tags */}
        {tagsLoading || !tags ? (
          <Skeleton className="h-48" />
        ) : (
          <TagCloud tags={tags} />
        )}

        {/* Difficulty Trend */}
        {trendLoading || !trend ? (
          <Skeleton className="h-52" />
        ) : (
          <DifficultyTrendChart data={trend} />
        )}
      </div>
    </AppShell>
  );
}
