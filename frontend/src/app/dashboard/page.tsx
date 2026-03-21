'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ContributionHeatmap } from '@/components/dashboard/ContributionHeatmap';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useDashboardStore, useAuthStore } from '@/lib/store';
import { useAsync } from '@/hooks/useAsync';
import {
  progressApi,
  groupsApi,
  leaderboardApi,
  feedApi,
  insightsApi,
  badgesApi,
  roomsApi,
  dailyApi,
} from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/ui/PageTransition';
import { cn } from '@/lib/cn';
import {
  Flame,
  Target,
  CheckCircle,
  Calendar,
  TrendingUp,
  Code2,
  Swords,
  BookOpen,
  Users,
  Crown,
  Heart,
  MessageCircle,
  ArrowRight,
  Trophy,
  Award,
  Zap,
  Radio,
  Map,
} from 'lucide-react';
import { RecoveryChallenge } from '@/components/poke/RecoveryChallenge';
import { PowerupsWidget } from '@/components/dashboard/PowerupsWidget';
import { PrepProgressWidget } from '@/components/dashboard/PrepProgressWidget';
import { HelpTooltip } from '@/components/onboarding/HelpTooltip';
import { formatDistanceToNow } from 'date-fns';
import type { ProblemProgress, Group, FeedEvent, LeaderboardEntry, UserRoadmap } from '@/lib/types';

/* ── helpers ─────────────────────────────────────────── */

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

function weeklySolveCount(progress: ProblemProgress[]): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return progress.filter(
    (p) => p.status === 'solved' && p.solved_at && new Date(p.solved_at) >= weekAgo
  ).length;
}

function initials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/* ── skeleton ────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-56" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-14 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}

/* ── widget section components ────────────────────────── */

function StatsSection({
  currentStreak,
  longestStreak,
  totalSolved,
  activeDays,
  weeklySolves,
  insightsLoading,
  progressLoading,
}: {
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
  activeDays: number;
  weeklySolves: number;
  insightsLoading: boolean;
  progressLoading: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 h-full">
      {/* Current Streak */}
      <Card variant="glass" className="group relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-xl p-3 bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/10 transition-transform duration-300 group-hover:scale-110">
            <Flame className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Current Streak</p>
            <p className="mt-0.5 text-3xl font-bold text-zinc-100 tracking-tight">
              {currentStreak}
              <span className="ml-1.5 text-sm font-normal text-zinc-600">days</span>
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Best: {longestStreak}d</p>
          </div>
        </div>
      </Card>

      {/* Problems Solved */}
      <Card variant="glass" className="group relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
        <div className="relative flex items-center gap-4">
          <div className="rounded-xl p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Problems Solved</p>
            <p className="mt-0.5 text-3xl font-bold text-zinc-100 tracking-tight">{totalSolved}</p>
          </div>
        </div>
      </Card>

      {/* Active Days */}
      <Card variant="glass" className="group relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
        <div className="relative flex items-center gap-4">
          <div className="rounded-xl p-3 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-500/10 transition-transform duration-300 group-hover:scale-110">
            <Calendar className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Active Days</p>
            <p className="mt-0.5 text-3xl font-bold text-zinc-100 tracking-tight">
              {insightsLoading ? <Skeleton className="inline-block h-8 w-10" /> : activeDays}
            </p>
          </div>
        </div>
      </Card>

      {/* Weekly Solves */}
      <Card variant="glass" className="group relative overflow-hidden hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
        <div className="relative flex items-center gap-4">
          <div className="rounded-xl p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/10 transition-transform duration-300 group-hover:scale-110">
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">This Week</p>
            <p className="mt-0.5 text-3xl font-bold text-zinc-100 tracking-tight">
              {progressLoading ? <Skeleton className="inline-block h-8 w-10" /> : weeklySolves}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function QuickActionsSection() {
  return (
    <Card variant="glass" padding={false} className="p-3">
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Solve a Problem', href: '/problems', icon: Code2, color: 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/15 text-emerald-400 hover:bg-emerald-500/10' },
          { label: 'Start a Room', href: '/rooms', icon: Swords, color: 'from-purple-500/20 to-fuchsia-500/10 border-purple-500/15 text-purple-400 hover:bg-purple-500/10' },
          { label: 'Review Flashcards', href: '/revision', icon: BookOpen, color: 'from-amber-500/20 to-orange-500/10 border-amber-500/15 text-amber-400 hover:bg-amber-500/10' },
          { label: 'Join a Group', href: '/groups', icon: Users, color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/15 text-blue-400 hover:bg-blue-500/10' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              'flex items-center gap-2 rounded-xl border bg-gradient-to-br px-4 py-2.5 text-sm font-medium transition-all duration-200',
              action.color
            )}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}

function DailyProblemsSection({
  dailyLoading,
  dailyProblems,
}: {
  dailyLoading: boolean;
  dailyProblems: Array<{ id: string; title: string; slug: string; difficulty: string; sheet_name: string | null }> | null;
}) {
  return (
    <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
            <Calendar className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-100">Today&apos;s Problems</h2>
              <HelpTooltip id="daily" text="We pick 4 problems daily based on your progress. Solve these to stay on track!" />
            </div>
            <p className="text-xs text-zinc-500">Curated for you based on your progress</p>
          </div>
        </div>
      </div>

      {dailyLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : dailyProblems && dailyProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {dailyProblems.map((p, i) => (
            <Link key={p.id} href={`/problems/${p.slug}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-[10px] font-bold text-zinc-400 group-hover:bg-emerald-500/15 group-hover:text-emerald-400 transition-colors">
                  {i + 1}
                </span>
                <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty}</Badge>
              </div>
              <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">{p.title}</p>
              {p.sheet_name && <p className="text-[10px] text-zinc-600 mt-1 truncate">{p.sheet_name}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 text-center py-4">No problems to suggest — you&apos;re crushing it!</p>
      )}
    </Card>
  );
}

function GroupsSection({
  groupsLoading,
  groups,
}: {
  groupsLoading: boolean;
  groups: Group[] | null;
}) {
  return (
    <Card variant="glass" className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">My Groups</h3>
        </div>
        <Link href="/groups" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {groupsLoading ? (
        <div className="space-y-3 flex-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : !groups || groups.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <Users className="h-8 w-8 text-zinc-700 mb-2" />
          <p className="text-sm text-zinc-500">No groups yet</p>
          <Link href="/groups" className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            Join one!
          </Link>
        </div>
      ) : (
        <div className="space-y-2 flex-1">
          {groups.slice(0, 3).map((g) => (
            <Link
              key={g.id}
              href={`/groups/${g.id}`}
              className="flex items-center justify-between rounded-xl border border-zinc-800/50 px-3 py-2.5 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-500/10 text-xs font-bold text-blue-400 border border-blue-500/10">
                  {g.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200 truncate max-w-[120px]">{g.name}</p>
                  <p className="text-[11px] text-zinc-500">
                    {g.members ? `${g.members.length} members` : g.invite_code}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

function LeaderboardSection({
  lbLoading,
  leaderboard,
  firstGroupId,
}: {
  lbLoading: boolean;
  leaderboard: LeaderboardEntry[] | null;
  firstGroupId: string | null;
}) {
  return (
    <Card variant="glass" className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
            <Crown className="h-4 w-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">Leaderboard</h3>
        </div>
        {firstGroupId && (
          <Link href={`/groups/${firstGroupId}`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
            Full board <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      {lbLoading ? (
        <div className="space-y-3 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-xl" />
          ))}
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <Trophy className="h-8 w-8 text-zinc-700 mb-2" />
          <p className="text-sm text-zinc-500">Join a group to compete</p>
        </div>
      ) : (
        <div className="space-y-1.5 flex-1">
          {leaderboard.slice(0, 5).map((entry, idx) => (
            <div
              key={entry.userId}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 transition-colors',
                idx === 0 && 'bg-amber-500/5 border border-amber-500/10'
              )}
            >
              <span className={cn(
                'w-5 text-center text-xs font-bold',
                idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-400' : idx === 2 ? 'text-orange-400' : 'text-zinc-600'
              )}>
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <Link href={`/user/${entry.userId}`} className="text-sm font-medium text-zinc-200 truncate hover:text-emerald-400 transition-colors block">{entry.displayName}</Link>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 shrink-0">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  {entry.solvedCount}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-400" />
                  {entry.currentStreak}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function FeedSection({
  feedLoading,
  feedEvents,
}: {
  feedLoading: boolean;
  feedEvents: FeedEvent[] | null;
}) {
  return (
    <Card variant="glass" className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Zap className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">Feed</h3>
        </div>
        <Link href="/feed" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {feedLoading ? (
        <div className="space-y-3 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : !feedEvents || feedEvents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <Zap className="h-8 w-8 text-zinc-700 mb-2" />
          <p className="text-sm text-zinc-500">No feed activity yet</p>
        </div>
      ) : (
        <div className="space-y-1 flex-1">
          {feedEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2.5 rounded-xl px-2 py-2 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">
                {initials(event.display_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300 leading-snug">
                  <Link href={`/user/${event.user_id}`} className="font-medium hover:text-emerald-400 transition-colors">{event.display_name}</Link>{' '}
                  <span className="text-zinc-500">{event.title}</span>
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-600">
                  <span>{formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</span>
                  {event.like_count > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Heart className="h-3 w-3" /> {event.like_count}
                    </span>
                  )}
                  {event.comment_count > 0 && (
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="h-3 w-3" /> {event.comment_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function HeatmapSection({
  progressLoading,
  progressData,
}: {
  progressLoading: boolean;
  progressData: ProblemProgress[] | null;
}) {
  return (
    <div className="h-full">
      {progressLoading ? (
        <Skeleton className="h-48 rounded-2xl" />
      ) : (
        <ContributionHeatmap progress={progressData || []} />
      )}
    </div>
  );
}

function BadgesDifficultySection({
  badgesLoading,
  badges,
  insightsLoading,
  difficultyBreakdown,
  diffTotal,
}: {
  badgesLoading: boolean;
  badges: Array<{ name: string; icon: string; description: string; earned_at: string }> | null;
  insightsLoading: boolean;
  difficultyBreakdown: { easy: number; medium: number; hard: number };
  diffTotal: number;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* My Badges */}
      <Card variant="glass" className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
              <Award className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">Badges</h3>
          </div>
          <Link href="/profile" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {badgesLoading ? (
          <Skeleton className="h-10 rounded-xl" />
        ) : !badges || badges.length === 0 ? (
          <p className="text-xs text-zinc-600 py-2">Solve problems to earn badges!</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {badges.slice(0, 8).map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-800/80 border border-zinc-700/50 px-2.5 py-1 text-xs text-zinc-300"
                title={b.description}
              >
                <span>{b.icon}</span> {b.name}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Difficulty Breakdown */}
      <Card variant="glass" className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10">
            <Target className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">Difficulty</h3>
        </div>
        {insightsLoading ? (
          <Skeleton className="h-10 rounded-xl" />
        ) : (
          <div className="space-y-3">
            {/* Visual bar */}
            <div className="flex h-3 rounded-full overflow-hidden bg-zinc-800/60">
              {difficultyBreakdown.easy > 0 && (
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${(difficultyBreakdown.easy / diffTotal) * 100}%` }}
                />
              )}
              {difficultyBreakdown.medium > 0 && (
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                  style={{ width: `${(difficultyBreakdown.medium / diffTotal) * 100}%` }}
                />
              )}
              {difficultyBreakdown.hard > 0 && (
                <div
                  className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
                  style={{ width: `${(difficultyBreakdown.hard / diffTotal) * 100}%` }}
                />
              )}
            </div>
            {/* Counts */}
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">Easy</span>
                <span className="font-semibold text-emerald-400">{difficultyBreakdown.easy}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-zinc-400">Med</span>
                <span className="font-semibold text-amber-400">{difficultyBreakdown.medium}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-zinc-400">Hard</span>
                <span className="font-semibold text-red-400">{difficultyBreakdown.hard}</span>
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function ActiveRoomsSection({
  activeRooms,
}: {
  activeRooms: Array<{ id: string; name: string; problem_title?: string; status: string }>;
}) {
  return (
    <Card variant="glow" className="border-purple-500/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
          <Radio className="h-4 w-4 text-purple-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-300">Active Rooms</h3>
        <span className="ml-auto flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
      </div>
      <div className="space-y-2">
        {activeRooms.map((room) => (
          <Link
            key={room.id}
            href={`/rooms/${room.id}`}
            className="flex items-center justify-between rounded-xl border border-zinc-800/50 px-4 py-3 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all duration-200"
          >
            <div>
              <p className="text-sm font-medium text-zinc-200">{room.name}</p>
              {room.problem_title && (
                <p className="text-xs text-zinc-500 mt-0.5">{room.problem_title}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={room.status === 'active' ? 'easy' : 'default'}>
                {room.status}
              </Badge>
              <span className="text-xs font-medium text-purple-400">Join</span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function YourRoadmapsSection({ roadmaps }: { roadmaps: UserRoadmap[] }) {
  if (roadmaps.length === 0) {
    return (
      <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
            <Map className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Start a roadmap with your friends</h2>
            <p className="text-xs text-zinc-500">Pick a roadmap, invite friends, crush goals together</p>
          </div>
        </div>
        <Link href="/roadmaps">
          <Button variant="primary" size="md" className="mt-2">
            Explore Roadmaps <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
            <Map className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Your Roadmaps</h2>
            <p className="text-xs text-zinc-500">{roadmaps.length} active</p>
          </div>
        </div>
        <Link href="/roadmaps" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {roadmaps.map((rm) => {
          const pct = rm.durationDays > 0 ? Math.round((rm.completedDays / rm.durationDays) * 100) : 0;
          return (
            <Link
              key={rm.id}
              href={`/roadmaps/${rm.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{rm.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">{rm.name}</h3>
                  <p className="text-[11px] text-zinc-500">Day {rm.completedDays}/{rm.durationDays}</p>
                </div>
                {rm.currentStreak > 0 && (
                  <span className="text-xs font-medium text-orange-400 shrink-0">🔥 {rm.currentStreak}d</span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500/60 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">{pct}% complete</p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function RecentActivitySection({
  progressLoading,
  progressData,
}: {
  progressLoading: boolean;
  progressData: ProblemProgress[] | null;
}) {
  return (
    <div className="h-full">
      {progressLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <RecentActivity progress={progressData || []} />
      )}
    </div>
  );
}

/* ── main page ───────────────────────────────────────── */

export default function DashboardPage() {
  const { streak, solvedCount, loading: statsLoading, fetchStats } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /* data fetching */
  const { data: progressData, loading: progressLoading } = useAsync(
    () => progressApi.get().then((r) => r.data.progress as ProblemProgress[]),
    []
  );

  const { data: groups, loading: groupsLoading } = useAsync(
    () => groupsApi.list().then((r) => (r.data.groups ?? []) as Group[]),
    []
  );

  const firstGroupId = groups?.[0]?.id ?? null;

  const { data: leaderboard, loading: lbLoading } = useAsync(
    () =>
      firstGroupId
        ? leaderboardApi.getGroup(firstGroupId).then((r) => (r.data.leaderboard ?? []) as LeaderboardEntry[])
        : Promise.resolve([] as LeaderboardEntry[]),
    [firstGroupId]
  );

  const { data: feedEvents, loading: feedLoading } = useAsync(
    () => feedApi.getFeed({ limit: 5 }).then((r) => (r.data.events ?? []) as FeedEvent[]),
    []
  );

  const { data: insightsData, loading: insightsLoading } = useAsync(
    () => insightsApi.overview().then((r) => r.data),
    []
  );

  const { data: badges, loading: badgesLoading } = useAsync(
    () => badgesApi.mine().then((r) => r.data.badges ?? []),
    []
  );

  const { data: activeRooms, loading: roomsLoading } = useAsync(
    () => roomsApi.active().then((r) => r.data.rooms ?? []),
    []
  );

  const { data: dailyProblems, loading: dailyLoading } = useAsync(
    () => dailyApi.getProblems(4).then((r) => r.data.problems ?? []),
    []
  );

  const [activeRoadmaps, setActiveRoadmaps] = useState<UserRoadmap[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('streaksy_active_roadmaps');
      if (stored) setActiveRoadmaps(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  /* derived */
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const totalSolved = insightsData?.totalSolved ?? solvedCount;
  const activeDays = insightsData?.totalActiveDays ?? insightsData?.activeDays ?? 0;
  const weeklySolves = progressData ? weeklySolveCount(progressData) : 0;

  const difficultyBreakdown = useMemo(() => {
    const rates = insightsData?.solveRateByDifficulty;
    if (rates) {
      const extract = (v: unknown): number => {
        if (typeof v === 'object' && v !== null && 'count' in v) return Number((v as Record<string, number>).count);
        return Number(v ?? 0);
      };
      return { easy: extract(rates.easy), medium: extract(rates.medium), hard: extract(rates.hard) };
    }
    if (!progressData) return { easy: 0, medium: 0, hard: 0 };
    const solved = progressData.filter((p) => p.status === 'solved');
    return {
      easy: solved.filter((p) => p.difficulty === 'easy').length,
      medium: solved.filter((p) => p.difficulty === 'medium').length,
      hard: solved.filter((p) => p.difficulty === 'hard').length,
    };
  }, [insightsData, progressData]);

  const allLoading = statsLoading && progressLoading;

  if (allLoading) {
    return (
      <AppShell>
        <PageTransition>
          <DashboardSkeleton />
        </PageTransition>
      </AppShell>
    );
  }

  const diffTotal = difficultyBreakdown.easy + difficultyBreakdown.medium + difficultyBreakdown.hard || 1;

  const showRooms = !roomsLoading && activeRooms && activeRooms.length > 0;

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-6">
          {/* ─── Welcome Header ─────────────────────────── */}
          <div className="animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {getGreeting()},{' '}
                <span className="gradient-text">{user?.displayName}</span>
              </h1>
              <span className="text-3xl animate-bounce" style={{ animationDuration: '2s' }}>
                👋
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              {getStreakMessage(currentStreak)}
              {currentStreak > 2 && ' 🔥'}
            </p>
          </div>

          {/* ─── Recovery Challenge ─────────────────────── */}
          <RecoveryChallenge />

          {/* ─── Your Roadmaps ───────────────────────────── */}
          <YourRoadmapsSection roadmaps={activeRoadmaps} />

          {/* ─── Stats ─────────────────────────────────── */}
          <StatsSection
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            totalSolved={totalSolved}
            activeDays={activeDays}
            weeklySolves={weeklySolves}
            insightsLoading={insightsLoading}
            progressLoading={progressLoading}
          />

          {/* ─── Quick Actions ──────────────────────────── */}
          <QuickActionsSection />

          {/* ─── Interview Prep Progress ─────────────────── */}
          <PrepProgressWidget />

          {/* ─── Today's Problems ───────────────────────── */}
          <DailyProblemsSection
            dailyLoading={dailyLoading}
            dailyProblems={dailyProblems}
          />

          {/* ─── Groups + Leaderboard + Feed ────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <GroupsSection
              groupsLoading={groupsLoading}
              groups={groups}
            />
            <LeaderboardSection
              lbLoading={lbLoading}
              leaderboard={leaderboard}
              firstGroupId={firstGroupId}
            />
            <FeedSection
              feedLoading={feedLoading}
              feedEvents={feedEvents}
            />
          </div>

          {/* ─── Heatmap + Badges & Difficulty ──────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <HeatmapSection
                progressLoading={progressLoading}
                progressData={progressData}
              />
            </div>
            <div>
              <BadgesDifficultySection
                badgesLoading={badgesLoading}
                badges={badges}
                insightsLoading={insightsLoading}
                difficultyBreakdown={difficultyBreakdown}
                diffTotal={diffTotal}
              />
            </div>
          </div>

          {/* ─── Power-ups ─────────────────────────────── */}
          <PowerupsWidget />

          {/* ─── Active Rooms (conditional) ─────────────── */}
          {showRooms && (
            <ActiveRoomsSection activeRooms={activeRooms} />
          )}

          {/* ─── Recent Activity ────────────────────────── */}
          <RecentActivitySection
            progressLoading={progressLoading}
            progressData={progressData}
          />
        </div>
      </PageTransition>
    </AppShell>
  );
}
