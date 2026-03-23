'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageTransition } from '@/components/ui/PageTransition';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { dailyApi, streaksApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { AIDailyBrief } from '@/components/ai/AIDailyBrief';
import {
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Flame,
  ArrowRight,
  Users,
  Star,
  Calendar,
  ChevronRight,
} from 'lucide-react';

/* ── Types ──────────────────────────────────────────── */

interface DailyProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  url: string | null;
  youtube_url: string | null;
  sheet_name: string | null;
}

interface DailyResponse {
  problems: DailyProblem[];
  date: string;
}

/* ── Helpers ─────────────────────────────────────────── */

function getTimeUntilMidnightUTC(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0
  ));
  const diff = midnight.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function getDayLabel(daysAgo: number): string {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getDateForDaysAgo(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

const difficultyPoints: Record<string, number> = {
  easy: 10,
  medium: 20,
  hard: 35,
};

const difficultyVariant = (d: string): 'easy' | 'medium' | 'hard' | 'default' => {
  if (d === 'easy' || d === 'medium' || d === 'hard') return d;
  return 'default';
};

/* ── Countdown Hook ──────────────────────────────────── */

function useCountdown() {
  const [time, setTime] = useState(getTimeUntilMidnightUTC);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnightUTC());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

/* ── Page ────────────────────────────────────────────── */

export default function DailyChallengePage() {
  const countdown = useCountdown();

  // Fetch today's challenge (primary problem is first)
  const { data: todayData, loading: todayLoading } = useAsync<DailyResponse>(
    async () => {
      const res = await dailyApi.getProblems(4);
      return res.data;
    },
    []
  );

  // Fetch streak info
  const { data: streakData } = useAsync(
    async () => {
      const res = await streaksApi.get();
      return res.data;
    },
    []
  );

  const todayProblem = todayData?.problems?.[0] ?? null;
  const allProblems = todayData?.problems ?? [];

  // Simulated solved count for social proof (deterministic based on date)
  const solvedToday = useMemo(() => {
    const dateStr = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
      hash |= 0;
    }
    return 42 + Math.abs(hash % 150);
  }, []);

  // Simulated week data for the streak tracker
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const daysAgo = 6 - i;
      const date = getDateForDaysAgo(daysAgo);
      // Simulate some solved days for visual demo
      const solved = daysAgo === 0 ? false : daysAgo < 4 ? true : daysAgo === 5;
      return { date, daysAgo, solved, label: getDayLabel(daysAgo) };
    });
  }, []);

  const currentDailyStreak = streakData?.currentStreak ?? 0;
  const bestDailyStreak = streakData?.longestStreak ?? 0;

  // Past challenges — show the remaining 3 problems as "past" plus filler
  const pastChallenges = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const daysAgo = i + 1;
      const problem = allProblems[i % allProblems.length];
      const solved = daysAgo < 4 || daysAgo === 5;
      return {
        daysAgo,
        date: getDayLabel(daysAgo),
        problem: problem ?? null,
        solved,
      };
    });
  }, [allProblems]);

  // Mock leaderboard
  const topSolvers = useMemo(() => {
    const names = [
      'Alex C.', 'Priya M.', 'Jordan K.', 'Sam R.', 'Taylor W.',
      'Morgan L.', 'Casey D.', 'Riley S.', 'Quinn B.', 'Avery N.',
    ];
    return names.map((name, i) => ({
      rank: i + 1,
      name,
      streak: Math.max(30 - i * 3 - Math.floor(Math.random() * 2), 1),
    }));
  }, []);

  return (
    <AppShell>
      <PageTransition>
        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
          {/* ── Header ── */}
          <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">Daily Challenge</h1>
                <p className="text-sm text-zinc-500">Solve today&apos;s problem to keep your streak alive</p>
              </div>
            </div>
          </div>

          {/* ── AI Daily Brief ── */}
          <div className="animate-slide-up" style={{ animationDelay: '25ms' }}>
            <AIDailyBrief />
          </div>

          {/* ── Hero Card: Today's Challenge ── */}
          <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
            {todayLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : todayProblem ? (
              <Card
                variant="glow"
                className="relative overflow-hidden border-amber-500/20"
              >
                {/* Background glow */}
                <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-amber-500/5 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />

                <div className="relative space-y-6">
                  {/* Top row: date & countdown */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-400">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono text-sm tabular-nums">
                        {String(countdown.hours).padStart(2, '0')}:
                        {String(countdown.minutes).padStart(2, '0')}:
                        {String(countdown.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-zinc-600">remaining</span>
                    </div>
                  </div>

                  {/* Problem info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl font-bold text-zinc-100">
                        {todayProblem.title}
                      </h2>
                      <Badge variant={difficultyVariant(todayProblem.difficulty)}>
                        {todayProblem.difficulty}
                      </Badge>
                    </div>
                    {todayProblem.sheet_name && (
                      <p className="text-sm text-zinc-500">
                        From: <span className="text-zinc-400">{todayProblem.sheet_name}</span>
                      </p>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span className="text-amber-400 font-semibold">
                        +{difficultyPoints[todayProblem.difficulty] ?? 10} pts
                      </span>
                      <span className="text-zinc-600">bonus</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-zinc-500" />
                      <span className="text-zinc-400">{solvedToday}</span>
                      <span className="text-zinc-600">solved today</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3">
                    <Link href={`/problems/${todayProblem.slug}`}>
                      <Button variant="gradient" size="lg" className="gap-2">
                        Accept Challenge
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    {todayProblem.url && (
                      <a
                        href={todayProblem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        Open on LeetCode
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <p className="text-zinc-500 text-center py-8">
                  No daily challenge available. Start solving problems to get personalized daily challenges!
                </p>
              </Card>
            )}
          </div>

          {/* ── Additional Today's Problems ── */}
          {allProblems.length > 1 && (
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wider">
                More for Today
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {allProblems.slice(1).map((p) => (
                  <Link key={p.id} href={`/problems/${p.slug}`}>
                    <Card className="hover:border-zinc-700 cursor-pointer transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-emerald-400 transition-colors">
                            {p.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={difficultyVariant(p.difficulty)}>
                              {p.difficulty}
                            </Badge>
                            <span className="text-xs text-zinc-600">
                              +{difficultyPoints[p.difficulty] ?? 10} pts
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── Left Column: Streak Tracker + Past Challenges ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* ── Daily Streak Tracker ── */}
              <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
                <Card>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-400" />
                        Daily Streak
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-zinc-500">Current: </span>
                          <span className="font-bold text-orange-400">{currentDailyStreak}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Best: </span>
                          <span className="font-bold text-amber-400">{bestDailyStreak}</span>
                        </div>
                      </div>
                    </div>

                    {/* Week View */}
                    <div className="flex items-center justify-between gap-2">
                      {weekDays.map((day) => (
                        <div
                          key={day.date}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <span className="text-[11px] text-zinc-600 font-medium">
                            {day.daysAgo === 0 ? 'Today' : new Date(day.date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                              day.daysAgo === 0
                                ? 'border-2 border-dashed border-amber-500/40 bg-amber-500/5'
                                : day.solved
                                ? 'bg-emerald-500/15 border border-emerald-500/30'
                                : 'bg-red-500/10 border border-red-500/20'
                            )}
                          >
                            {day.daysAgo === 0 ? (
                              <Zap className="h-4 w-4 text-amber-400" />
                            ) : day.solved ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400/60" />
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-600">
                            {new Date(day.date + 'T12:00:00Z').getDate()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* ── Past Challenges ── */}
              <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wider">
                  Past 7 Days
                </h3>
                <div className="space-y-2">
                  {pastChallenges.map((entry) => (
                    <Card
                      key={entry.daysAgo}
                      className={cn(
                        'transition-all',
                        !entry.solved && 'opacity-60'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {/* Status indicator */}
                        <div
                          className={cn(
                            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg',
                            entry.solved
                              ? 'bg-emerald-500/15'
                              : 'bg-zinc-800'
                          )}
                        >
                          {entry.solved ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-zinc-600" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-zinc-300 truncate">
                              {entry.problem?.title ?? 'Challenge'}
                            </span>
                            {entry.problem && (
                              <Badge variant={difficultyVariant(entry.problem.difficulty)}>
                                {entry.problem.difficulty}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-zinc-600 mt-0.5">{entry.date}</p>
                        </div>

                        {/* Points */}
                        <div className="flex-shrink-0 text-right">
                          {entry.solved ? (
                            <span className="text-sm font-medium text-emerald-400">
                              +{difficultyPoints[entry.problem?.difficulty ?? 'easy'] ?? 10} pts
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-600">Missed</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column: Leaderboard ── */}
            <div className="animate-slide-up" style={{ animationDelay: '250ms' }}>
              <Card>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    Top Streakers
                  </h3>
                  <p className="text-xs text-zinc-600">Longest daily challenge streaks</p>

                  <div className="space-y-1">
                    {topSolvers.map((solver) => (
                      <div
                        key={solver.rank}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                          solver.rank <= 3 ? 'bg-zinc-800/50' : ''
                        )}
                      >
                        {/* Rank */}
                        <span
                          className={cn(
                            'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold',
                            solver.rank === 1
                              ? 'bg-amber-500/20 text-amber-400'
                              : solver.rank === 2
                              ? 'bg-zinc-400/20 text-zinc-300'
                              : solver.rank === 3
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'text-zinc-600'
                          )}
                        >
                          {solver.rank}
                        </span>

                        {/* Name */}
                        <span className="text-sm text-zinc-300 flex-1 truncate">
                          {solver.name}
                        </span>

                        {/* Streak */}
                        <div className="flex items-center gap-1 text-sm">
                          <Flame className="h-3.5 w-3.5 text-orange-400" />
                          <span className="font-medium text-orange-400 tabular-nums">
                            {solver.streak}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/leaderboard"
                    className="flex items-center justify-center gap-1 text-sm text-zinc-500 hover:text-emerald-400 transition-colors pt-2"
                  >
                    View Full Leaderboard
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
