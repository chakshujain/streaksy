'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { insightsApi, feedApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { PageTransition } from '@/components/ui/PageTransition';
import { BarChart3, Trophy, Flame, Calendar, TrendingUp, Tag, Zap, Target, Activity, Award, Users } from 'lucide-react';
import type { InsightsOverview, WeeklyData, TagProgress, DifficultyTrend, FeedEvent } from '@/lib/types';
import { useMemo } from 'react';
import Link from 'next/link';

/* ─── Helpers ─── */

function animDelay(i: number, base = 0) {
  return { animationDelay: `${base + i * 75}ms`, animationFillMode: 'both' as const };
}

/* ─── Your Stats Summary ─── */

function StatsSummary({ overview, weekly }: { overview: InsightsOverview; weekly: WeeklyData[] }) {
  const totalWeekly = weekly.reduce((s, w) => s + w.count, 0);
  const avgPerWeek = weekly.length > 0 ? (totalWeekly / weekly.length).toFixed(1) : '0';

  const difficulties = [
    { label: 'Easy', count: overview.easySolved },
    { label: 'Medium', count: overview.mediumSolved },
    { label: 'Hard', count: overview.hardSolved },
  ];
  const favorite = difficulties.reduce((a, b) => (b.count > a.count ? b : a));

  const stats = [
    { label: 'Avg / Week', value: avgPerWeek, icon: Activity, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/20' },
    { label: 'Favorite Difficulty', value: favorite.label, icon: Award, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/20' },
    { label: 'Problems / Active Day', value: overview.activeDays > 0 ? (overview.totalSolved / overview.activeDays).toFixed(1) : '0', icon: Zap, color: 'text-purple-400', bg: 'from-purple-500/20 to-pink-500/20' },
  ];

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Your Stats</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50 p-3.5 animate-slide-up" style={animDelay(i)}>
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br shrink-0', s.bg)}>
                <Icon className={cn('h-4 w-4', s.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-zinc-100 truncate">{s.value}</p>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Overview Cards ─── */

function OverviewCards({ overview }: { overview: InsightsOverview }) {
  const cards = [
    {
      label: 'Total Solved',
      value: overview.totalSolved,
      sub: `${overview.easySolved}E / ${overview.mediumSolved}M / ${overview.hardSolved}H`,
      icon: Trophy,
      gradient: 'from-emerald-500/20 to-cyan-500/20',
      borderColor: 'border-emerald-500/10',
      iconColor: 'text-emerald-400',
      valueClass: 'gradient-text',
    },
    {
      label: 'Difficulty Split',
      value: null,
      icon: Target,
      gradient: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/10',
      iconColor: 'text-cyan-400',
      donut: true,
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
      fireEffect: overview.currentStreak >= 3,
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
              card.borderColor,
              card.fireEffect && 'animate-pulse-glow'
            )}
            style={animDelay(i)}
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

            {card.donut ? (
              <div className="flex items-center justify-center py-1">
                <div className="relative h-20 w-20">
                  <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                    {/* background ring */}
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(63,63,70,0.3)" strokeWidth="3" />
                    {/* easy arc */}
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke="#34d399" strokeWidth="3"
                      strokeDasharray={`${overview.easyPercentage * 0.974} ${97.4 - overview.easyPercentage * 0.974}`}
                      strokeDashoffset="0"
                      className="transition-all duration-1000"
                    />
                    {/* medium arc */}
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke="#f59e0b" strokeWidth="3"
                      strokeDasharray={`${overview.mediumPercentage * 0.974} ${97.4 - overview.mediumPercentage * 0.974}`}
                      strokeDashoffset={`${-(overview.easyPercentage * 0.974)}`}
                      className="transition-all duration-1000"
                    />
                    {/* hard arc */}
                    <circle
                      cx="18" cy="18" r="15.5" fill="none"
                      stroke="#ef4444" strokeWidth="3"
                      strokeDasharray={`${overview.hardPercentage * 0.974} ${97.4 - overview.hardPercentage * 0.974}`}
                      strokeDashoffset={`${-((overview.easyPercentage + overview.mediumPercentage) * 0.974)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-zinc-300">{overview.totalSolved}</span>
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

/* ─── Difficulty Breakdown ─── */

function DifficultyBreakdown({ overview }: { overview: InsightsOverview }) {
  const difficulties = [
    { label: 'Easy', solved: overview.easySolved, percentage: overview.easyPercentage, color: 'from-emerald-500 to-emerald-400', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
    { label: 'Medium', solved: overview.mediumSolved, percentage: overview.mediumPercentage, color: 'from-amber-500 to-amber-400', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    { label: 'Hard', solved: overview.hardSolved, percentage: overview.hardPercentage, color: 'from-red-500 to-red-400', bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/20' },
  ];

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-amber-500/20">
          <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Difficulty Breakdown</h3>
      </div>

      {/* Visual distribution bar */}
      <div className="flex h-4 rounded-full overflow-hidden mb-6 bg-zinc-800/60">
        {difficulties.map((d) => (
          <div
            key={d.label}
            className={cn('h-full bg-gradient-to-r transition-all duration-1000 first:rounded-l-full last:rounded-r-full', d.color)}
            style={{ width: `${d.percentage}%` }}
          />
        ))}
      </div>

      <div className="space-y-5">
        {difficulties.map((d, i) => (
          <div key={d.label} className="animate-slide-up" style={animDelay(i)}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md', d.bg, d.text)}>
                  {d.label}
                </span>
                <span className="text-sm font-medium text-zinc-300">{d.solved} solved</span>
              </div>
              <span className="text-sm font-bold text-zinc-300">{d.percentage}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-zinc-800/60 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out',
                  d.color,
                  d.percentage > 0 && `shadow-lg ${d.glow}`
                )}
                style={{ width: `${d.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Weekly Chart (Line Graph) ─── */

function WeeklyChart({ data }: { data: WeeklyData[] }) {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const totalSolved = data.reduce((s, d) => s + d.count, 0);

  // SVG dimensions
  const width = 100; // percentage-based viewBox
  const height = 50;
  const padding = { top: 5, right: 5, bottom: 12, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = data.map((d, i) => ({
    x: padding.left + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padding.top + chartH - (d.count / maxCount) * chartH,
    count: d.count,
    label: new Date(d.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = linePath + ` L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Weekly Activity</h3>
        </div>
        <span className="text-xs text-zinc-500">{totalSolved} total</span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map(pct => (
            <line
              key={pct}
              x1={padding.left} y1={padding.top + chartH * (1 - pct)}
              x2={width - padding.right} y2={padding.top + chartH * (1 - pct)}
              stroke="#27272a" strokeWidth="0.15" strokeDasharray="0.5 0.5"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#weeklyGradient)" opacity="0.3" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="0.8" fill="#10b981" stroke="#09090b" strokeWidth="0.3" />
              {/* Count label above dot */}
              <text x={p.x} y={p.y - 2} textAnchor="middle" className="fill-zinc-400" fontSize="2.5" fontWeight="600">
                {p.count}
              </text>
              {/* Week label below */}
              <text x={p.x} y={padding.top + chartH + 4} textAnchor="middle" className="fill-zinc-600" fontSize="2">
                {p.label}
              </text>
            </g>
          ))}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

/* ─── Tags with Progress Bars ─── */

function TagSection({ tags }: { tags: TagProgress[] }) {
  const sorted = useMemo(() => [...tags].sort((a, b) => b.solved - a.solved), [tags]);
  const maxSolved = Math.max(...sorted.map((t) => t.solved), 1);

  // Split into top tags and remaining
  const topTags = sorted.slice(0, 8);
  const remainingTags = sorted.slice(8);

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Tag className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Topics</h3>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-800/50 rounded-lg px-2.5 py-1">{tags.length} topics</span>
      </div>

      {/* Top tags with progress bars */}
      {topTags.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-5">
          {topTags.map((tag, i) => {
            const barWidth = Math.max((tag.solved / maxSolved) * 100, 6);
            return (
              <div key={tag.name} className="animate-slide-up" style={animDelay(i, 50)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-300 font-medium truncate">{tag.name}</span>
                  <span className="text-xs text-zinc-500 tabular-nums ml-2 shrink-0">{tag.solved}/{tag.total}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-700 ease-out"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Remaining tags as compact pills */}
      {remainingTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-800/50">
          {remainingTags.map((tag) => (
            <div
              key={tag.name}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800/50 bg-zinc-800/20 px-3 py-1.5 transition-colors hover:border-zinc-700"
            >
              <span className="text-xs text-zinc-400">{tag.name}</span>
              <span className="text-[10px] text-zinc-600 tabular-nums">{tag.solved}/{tag.total}</span>
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm text-zinc-600 py-4">No tag data yet. Start solving problems!</p>
      )}
    </div>
  );
}

/* ─── Monthly Trend ─── */

function DifficultyTrendChart({ data }: { data: DifficultyTrend[] }) {
  const maxTotal = Math.max(...data.map((d) => d.easy + d.medium + d.hard), 1);

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-red-500/20">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Monthly Trend</h3>
      </div>

      {data.length > 0 ? (
        <>
          <div className="flex items-end gap-4 flex-1 min-h-[10rem]">
            {data.map((month, i) => {
              const total = month.easy + month.medium + month.hard;
              const barHeight = Math.max((total / maxTotal) * 100, 4);
              const easyFrac = total > 0 ? (month.easy / total) * 100 : 0;
              const medFrac = total > 0 ? (month.medium / total) * 100 : 0;
              const hardFrac = total > 0 ? (month.hard / total) * 100 : 0;
              // Make bars wider when few months
              const barMaxWidth = data.length <= 3 ? 'max-w-[8rem]' : 'max-w-[5rem]';

              return (
                <div key={i} className={cn('flex-1 flex flex-col items-center gap-1.5 group', barMaxWidth, 'mx-auto')}>
                  <span className="text-xs font-semibold text-zinc-400 tabular-nums group-hover:text-zinc-200 transition-colors">
                    {total}
                  </span>
                  <div className="relative w-full flex justify-center flex-1">
                    <div
                      className="w-full rounded-lg overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col-reverse"
                      style={{ height: `${barHeight}%`, marginTop: 'auto' }}
                    >
                      <div className="w-full bg-emerald-500/80" style={{ height: `${easyFrac}%` }} />
                      <div className="w-full bg-amber-500/80" style={{ height: `${medFrac}%` }} />
                      <div className="w-full bg-red-500/80" style={{ height: `${hardFrac}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">{month.month}</span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
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
        </>
      ) : (
        <p className="text-sm text-zinc-600 w-full text-center py-8">No trend data yet.</p>
      )}
    </div>
  );
}

/* ─── Streak Heatmap (GitHub-style) ─── */

function StreakHeatmap({ weekly }: { weekly: WeeklyData[] }) {
  // Build a 7-column x N-row grid from weekly data spread across days
  // We'll create a simplified 5-week x 7-day heatmap from weekly counts
  const maxCount = Math.max(...weekly.map((w) => w.count), 1);

  // Generate cells: spread each week's count across approximate days
  const cells: { date: string; intensity: number }[] = [];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  weekly.forEach((week) => {
    const avgPerDay = week.count / 7;
    for (let d = 0; d < 7; d++) {
      // Simulate daily distribution (weighted toward weekdays)
      const weight = d < 5 ? 1.2 : 0.6;
      const estimated = Math.round(avgPerDay * weight * 10) / 10;
      const intensity = maxCount > 0 ? Math.min(estimated / (maxCount / 7 * 1.2), 1) : 0;
      const weekDate = new Date(week.weekStart);
      weekDate.setDate(weekDate.getDate() + d);
      cells.push({ date: weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), intensity });
    }
  });

  const getColor = (intensity: number) => {
    if (intensity <= 0) return 'bg-zinc-800/40';
    if (intensity < 0.25) return 'bg-emerald-900/60';
    if (intensity < 0.5) return 'bg-emerald-700/70';
    if (intensity < 0.75) return 'bg-emerald-500/80';
    return 'bg-emerald-400';
  };

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20">
            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Activity Heatmap</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-zinc-800/40" />
          <div className="h-3 w-3 rounded-sm bg-emerald-900/60" />
          <div className="h-3 w-3 rounded-sm bg-emerald-700/70" />
          <div className="h-3 w-3 rounded-sm bg-emerald-500/80" />
          <div className="h-3 w-3 rounded-sm bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1.5">
        {/* Day labels */}
        <div className="flex flex-col gap-1.5 pr-2">
          {dayLabels.map((d, i) => (
            <div key={d} className="h-4 flex items-center">
              {i % 2 === 0 && <span className="text-[9px] text-zinc-600">{d}</span>}
            </div>
          ))}
        </div>
        {/* Grid */}
        {weekly.map((_, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1.5 flex-1">
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const cell = cells[weekIdx * 7 + dayIdx];
              return (
                <div
                  key={dayIdx}
                  className={cn(
                    'h-4 rounded-sm transition-colors duration-200 hover:ring-1 hover:ring-zinc-600',
                    cell ? getColor(cell.intensity) : 'bg-zinc-800/40'
                  )}
                  title={cell ? `${cell.date}: activity level ${Math.round(cell.intensity * 100)}%` : ''}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Period Comparison ─── */

function PeriodComparison({ weekly }: { weekly: WeeklyData[] }) {
  if (weekly.length < 2) return null;

  const current = weekly[weekly.length - 1].count;
  const previous = weekly[weekly.length - 2].count;
  const diff = current - previous;
  const pctChange = previous > 0 ? Math.round((diff / previous) * 100) : current > 0 ? 100 : 0;
  const isUp = diff >= 0;

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
          <TrendingUp className="h-3.5 w-3.5 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">vs Last Week</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center flex-1">
          <p className="text-3xl font-bold text-zinc-100">{current}</p>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1">This Week</p>
        </div>
        <div className={cn(
          'flex items-center gap-1 rounded-xl px-3 py-2',
          isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        )}>
          <span className="text-lg font-bold">{isUp ? '+' : ''}{pctChange}%</span>
        </div>
        <div className="text-center flex-1">
          <p className="text-3xl font-bold text-zinc-500">{previous}</p>
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1">Last Week</p>
        </div>
      </div>
      {/* Mini comparison bar */}
      <div className="mt-4 flex gap-2 items-center">
        <div className="flex-1 h-2 rounded-full bg-zinc-800/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
            style={{ width: `${Math.min((current / Math.max(current, previous, 1)) * 100, 100)}%` }}
          />
        </div>
        <div className="flex-1 h-2 rounded-full bg-zinc-800/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-zinc-600 to-zinc-500 transition-all duration-700"
            style={{ width: `${Math.min((previous / Math.max(current, previous, 1)) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Peer Activity ─── */

function PeerActivity({ events, loading }: { events: FeedEvent[] | null; loading: boolean }) {
  if (loading) return <Skeleton className="h-64 rounded-2xl" />;
  if (!events || events.length === 0) return null;

  // Group by user — show what each peer is doing
  const peerMap = new Map<string, { name: string; avatar: string | null; events: FeedEvent[] }>();
  events.forEach(e => {
    if (!peerMap.has(e.user_id)) {
      peerMap.set(e.user_id, { name: e.display_name || 'Unknown', avatar: e.avatar_url || null, events: [] });
    }
    peerMap.get(e.user_id)!.events.push(e);
  });

  const peers = Array.from(peerMap.entries()).slice(0, 6);

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <Users className="h-3.5 w-3.5 text-purple-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">What Your Peers Are Doing</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {peers.map(([userId, peer]) => {
          const initials = peer.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
          const latestEvent = peer.events[0];
          const solveCount = peer.events.filter(e => e.event_type === 'solve').length;

          return (
            <Link key={userId} href={`/user/${userId}`} className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 hover:border-emerald-500/20 hover:bg-zinc-900/50 transition-all duration-200">
              <div className="flex items-center gap-2.5 mb-2">
                {peer.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={peer.avatar} alt="" className="h-8 w-8 rounded-full object-cover border border-zinc-800" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-[10px] font-bold text-emerald-400">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">{peer.name}</p>
                  <p className="text-[10px] text-zinc-600">{solveCount} solves recently</p>
                </div>
              </div>
              <p className="text-xs text-zinc-400 truncate">
                {latestEvent.event_type === 'solve' ? `Solved "${String(latestEvent.metadata?.problemTitle || '')}"` :
                 latestEvent.event_type === 'streak_milestone' ? `${String(latestEvent.metadata?.streakDays || '')} day streak!` :
                 latestEvent.title}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default function InsightsPage() {
  const { data: overview, loading: overviewLoading } = useAsync<InsightsOverview>(
    () => insightsApi.overview().then((r) => {
      const d = r.data;
      const rate = d.solveRateByDifficulty || {};
      return {
        totalSolved: d.totalSolved || 0,
        easySolved: rate.easy?.count || 0,
        easyPercentage: rate.easy?.percentage || 0,
        mediumSolved: rate.medium?.count || 0,
        mediumPercentage: rate.medium?.percentage || 0,
        hardSolved: rate.hard?.count || 0,
        hardPercentage: rate.hard?.percentage || 0,
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

  const { data: peerActivity, loading: peerLoading } = useAsync(
    () => feedApi.getFeed({ limit: 10 }).then((r) => (r.data.events ?? []) as FeedEvent[]),
    []
  );

  const { data: trend, loading: trendLoading } = useAsync<DifficultyTrend[]>(
    () => insightsApi.difficultyTrend().then((r) => r.data.trend || r.data || []),
    []
  );

  return (
    <AppShell>
      <PageTransition>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4 animate-slide-up" style={animDelay(0)}>
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

        {/* Your Stats Summary */}
        {!overviewLoading && overview && !weeklyLoading && weekly ? (
          <div className="animate-slide-up" style={animDelay(0, 25)}>
            <StatsSummary overview={overview} weekly={weekly} />
          </div>
        ) : (
          <Skeleton className="h-28 rounded-2xl" />
        )}

        {/* Overview Cards */}
        {overviewLoading || !overview ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="animate-slide-up" style={animDelay(0, 75)}>
            <OverviewCards overview={overview} />
          </div>
        )}

        {/* Difficulty + Weekly row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {overviewLoading || !overview ? (
            <Skeleton className="h-72 rounded-2xl" />
          ) : (
            <div className="animate-slide-up" style={animDelay(0, 125)}>
              <DifficultyBreakdown overview={overview} />
            </div>
          )}

          {weeklyLoading || !weekly ? (
            <Skeleton className="h-72 rounded-2xl" />
          ) : (
            <div className="animate-slide-up" style={animDelay(0, 150)}>
              <WeeklyChart data={weekly} />
            </div>
          )}
        </div>

        {/* Heatmap + Period Comparison row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {weeklyLoading || !weekly ? (
            <>
              <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
              <Skeleton className="h-48 rounded-2xl" />
            </>
          ) : (
            <>
              <div className="lg:col-span-2 animate-slide-up" style={animDelay(0, 175)}>
                <StreakHeatmap weekly={weekly} />
              </div>
              <div className="animate-slide-up" style={animDelay(0, 200)}>
                <PeriodComparison weekly={weekly} />
              </div>
            </>
          )}
        </div>

        {/* Peer Activity */}
        <div className="animate-slide-up" style={{ animationDelay: '175ms', animationFillMode: 'both' }}>
          <PeerActivity events={peerActivity ?? null} loading={peerLoading} />
        </div>

        {/* Tags */}
        {tagsLoading || !tags ? (
          <Skeleton className="h-48 rounded-2xl" />
        ) : (
          <div className="animate-slide-up" style={animDelay(0, 225)}>
            <TagSection tags={tags} />
          </div>
        )}

        {/* Monthly Trend - full width */}
        {trendLoading || !trend ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : (
          <div className="animate-slide-up" style={animDelay(0, 250)}>
            <DifficultyTrendChart data={trend} />
          </div>
        )}
      </div>
      </PageTransition>
    </AppShell>
  );
}
