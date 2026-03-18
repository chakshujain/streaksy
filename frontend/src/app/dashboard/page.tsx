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

  return (
    <AppShell>
      <div className="space-y-8 animate-slide-up">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold">
            {getGreeting()},{' '}
            <span className="gradient-text">{user?.displayName}</span> 👋
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {getStreakMessage(currentStreak)}
            {currentStreak > 2 && ' 🔥'}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Stats Cards - full width on bento style */}
          <StatsCards streak={streak} solvedCount={solvedCount} loading={statsLoading} />
        </div>

        {/* Streak + Quick Stats row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Streak Highlight */}
          <Card
            variant={currentStreak > 0 ? 'glow' : 'glass'}
            className={currentStreak > 0 ? 'animate-glow-pulse lg:col-span-1' : 'lg:col-span-1'}
          >
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <span className="text-4xl mb-2">🔥</span>
              <p className="text-5xl font-bold gradient-text">
                {currentStreak}
              </p>
              <p className="mt-1 text-sm text-zinc-400">day streak</p>
              {currentStreak > 0 && (
                <p className="mt-3 text-xs text-emerald-400/80">
                  Longest: {streak?.longestStreak ?? 0} days
                </p>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card variant="glass" className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-medium text-zinc-400">Quick Stats 📊</h3>
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
            {/* Progress bar */}
            {quickStats.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((quickStats.solved / quickStats.total) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                    style={{ width: `${(quickStats.solved / quickStats.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Heatmap */}
        {progressLoading ? (
          <Skeleton className="h-48" />
        ) : (
          <ContributionHeatmap progress={progressData || []} />
        )}

        {/* Recent Activity */}
        {progressLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <RecentActivity progress={progressData || []} />
        )}
      </div>
    </AppShell>
  );
}
