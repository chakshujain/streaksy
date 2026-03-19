'use client';

import { useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ContributionHeatmap } from '@/components/dashboard/ContributionHeatmap';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useDashboardStore, useAuthStore } from '@/lib/store';
import { useAsync } from '@/hooks/useAsync';
import { progressApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { Flame, Target, BarChart3 } from 'lucide-react';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start solving to build your streak!';
  if (streak < 3) return 'Keep going, you\'re building momentum!';
  if (streak < 7) return 'You\'re on fire! Keep it up!';
  if (streak < 14) return 'Incredible consistency! You\'re unstoppable!';
  return 'Legendary streak! You\'re a machine!';
}

export default function DashboardPage() {
  const { streak, solvedCount, loading: statsLoading, fetchStats } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const {
    data: progressData,
    loading: progressLoading,
  } = useAsync(
    () => progressApi.get().then((r) => r.data.progress),
    []
  );

  const quickStats = useMemo(() => {
    if (!progressData) return { solved: 0, attempted: 0, total: 0 };
    const solved = progressData.filter((p: { status: string }) => p.status === 'solved').length;
    const attempted = progressData.filter((p: { status: string }) => p.status === 'attempted').length;
    return { solved, attempted, total: progressData.length };
  }, [progressData]);

  const currentStreak = streak?.currentStreak ?? 0;
  const solvedPercent = quickStats.total > 0 ? Math.round((quickStats.solved / quickStats.total) * 100) : 0;
  const attemptedPercent = quickStats.total > 0 ? Math.round((quickStats.attempted / quickStats.total) * 100) : 0;

  return (
    <AppShell>
      <div className="space-y-8 animate-slide-up">
        {/* Greeting */}
        <div className="animate-slide-up">
          <div className="flex items-baseline gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()},{' '}
              <span className="gradient-text">{user?.displayName}</span>
            </h1>
            <span className="text-3xl animate-bounce" style={{ animationDuration: '2s' }}>👋</span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {getStreakMessage(currentStreak)}
            {currentStreak > 2 && ' 🔥'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <StatsCards streak={streak} solvedCount={solvedCount} loading={statsLoading} />
        </div>

        {/* Streak + Quick Stats row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Streak Highlight */}
          <Card
            variant={currentStreak > 0 ? 'glow' : 'glass'}
            className={cn(
              'relative overflow-hidden lg:col-span-1',
              currentStreak > 0 && 'animate-glow-pulse'
            )}
          >
            {/* Background decoration */}
            {currentStreak > 0 && (
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-orange-500/5 blur-2xl" />
            )}
            <div className="relative flex flex-col items-center justify-center py-4 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/10">
                <Flame className="h-7 w-7 text-orange-400" />
              </div>
              <p className="text-5xl font-bold gradient-text">
                {currentStreak}
              </p>
              <p className="mt-1 text-sm text-zinc-400">day streak</p>
              {currentStreak > 0 && (
                <div className="mt-3 flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1">
                  <Target className="h-3 w-3 text-emerald-400" />
                  <p className="text-xs font-medium text-emerald-400">
                    Longest: {streak?.longestStreak ?? 0} days
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card variant="glass" className="relative overflow-hidden lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                <BarChart3 className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-300">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">{quickStats.solved}</p>
                <p className="text-xs text-zinc-500 mt-1">Solved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-400">{quickStats.attempted}</p>
                <p className="text-xs text-zinc-500 mt-1">Attempted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-zinc-300">{quickStats.total}</p>
                <p className="text-xs text-zinc-500 mt-1">Total</p>
              </div>
            </div>
            {/* Progress bars */}
            {quickStats.total > 0 && (
              <div className="mt-5 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                    <span className="text-zinc-400 font-medium">Solved</span>
                    <span className="text-emerald-400 font-medium">{solvedPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      style={{ width: `${solvedPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                    <span className="text-zinc-400 font-medium">Attempted</span>
                    <span className="text-amber-400 font-medium">{attemptedPercent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out delay-300"
                      style={{ width: `${attemptedPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Heatmap */}
        <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
          {progressLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <ContributionHeatmap progress={progressData || []} />
          )}
        </div>

        {/* Recent Activity */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          {progressLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <RecentActivity progress={progressData || []} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
