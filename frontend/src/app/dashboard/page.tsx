'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { ContributionHeatmap } from '@/components/dashboard/ContributionHeatmap';
import { useDashboardStore, useAuthStore } from '@/lib/store';
import { useAsync } from '@/hooks/useAsync';
import {
  progressApi,
  groupsApi,
  leaderboardApi,
  feedApi,
  insightsApi,
  roadmapsApi,
  dailyApi,
} from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
// Badge available for use if needed
// import { Badge } from '@/components/ui/Badge';
import { PageTransition } from '@/components/ui/PageTransition';
import { cn } from '@/lib/cn';
import { useLearnProgress } from '@/hooks/useLearnProgress';
import { useBookmarks, type Bookmark } from '@/hooks/useBookmarks';
import { topics } from '@/lib/learn-data';
import {
  Flame,
  CheckCircle,
  TrendingUp,
  Code2,
  Swords,
  Users,
  Crown,
  Heart,
  MessageCircle,
  ArrowRight,
  Trophy,
  Zap,
  Map,
  Calendar,
  ChevronRight,
  BookOpen,
  CircleDot,
  GraduationCap,
  Bookmark as BookmarkIcon,
  Star,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import type { ProblemProgress, Group, FeedEvent, LeaderboardEntry, UserRoadmap } from '@/lib/types';
import { templatesBySlug } from '@/lib/roadmap-templates';

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
  if (streak < 14) return 'Incredible consistency!';
  return 'Legendary streak!';
}

function initials(name?: string): string {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

interface TodayTask {
  roadmapId: string;
  roadmapName: string;
  roadmapIcon: string;
  dayNumber: number;
  totalDays: number;
  done: boolean;
}

function getTodayTasks(roadmaps: UserRoadmap[]): TodayTask[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tasks: TodayTask[] = [];

  for (const rm of roadmaps) {
    if (rm.status !== 'active') continue;
    const start = new Date(rm.startDate);
    start.setHours(0, 0, 0, 0);
    const diffMs = today.getTime() - start.getTime();
    const dayNumber = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    if (dayNumber < 1 || dayNumber > rm.durationDays) continue;

    tasks.push({
      roadmapId: rm.id,
      roadmapName: rm.name,
      roadmapIcon: rm.icon,
      dayNumber,
      totalDays: rm.durationDays,
      done: rm.completedDays >= dayNumber,
    });
  }
  return tasks;
}

/* ── skeleton ────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-48 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-56 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
}

/* ── stat card ───────────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  sub,
  gradient,
  glow,
  animate,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  gradient: string;
  glow?: string;
  animate?: boolean;
}) {
  return (
    <Card
      variant="glass"
      padding={false}
      className={cn(
        'group relative overflow-hidden p-4 hover:scale-[1.02] hover:shadow-lg transition-all duration-300',
        glow
      )}
    >
      {glow && <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full blur-2xl opacity-30" style={{ background: glow }} />}
      <div className="relative flex items-center gap-3">
        <div className={cn(
          'rounded-xl p-2.5 border transition-transform duration-300 group-hover:scale-110',
          gradient,
          animate && 'animate-pulse'
        )}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">{label}</p>
          <p className="text-2xl font-bold text-zinc-100 tracking-tight leading-tight">{value}</p>
          {sub && <p className="text-[11px] text-zinc-500 truncate">{sub}</p>}
        </div>
      </div>
    </Card>
  );
}

/* ── today's tasks section ───────────────────────────── */

function TodayTasksSection({
  tasks,
  onToggle,
}: {
  tasks: TodayTask[];
  onToggle: (roadmapId: string, dayNumber: number, done: boolean) => void;
}) {
  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  if (totalCount === 0) {
    return (
      <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
            <Calendar className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-zinc-100">Today&apos;s Tasks</h2>
            <p className="text-xs text-zinc-500">Start a roadmap to see today&apos;s tasks</p>
          </div>
          <Link href="/roadmaps">
            <Button variant="primary" size="sm">
              Browse Roadmaps <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
            <Calendar className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Today&apos;s Tasks</h2>
            <p className="text-xs text-zinc-500">
              {doneCount === totalCount ? (
                <span className="text-emerald-400 font-medium">All done! Great job!</span>
              ) : (
                <>{doneCount} of {totalCount} tasks done today</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                pct === 100 ? 'bg-emerald-400' : 'bg-emerald-500/60'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-zinc-400">{pct}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <button
            key={`${task.roadmapId}-${task.dayNumber}`}
            onClick={() => onToggle(task.roadmapId, task.dayNumber, !task.done)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 text-left',
              task.done
                ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10'
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50'
            )}
          >
            <div className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all shrink-0',
              task.done
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-zinc-600 hover:border-zinc-500'
            )}>
              {task.done && <CheckCircle className="h-3.5 w-3.5 text-white" />}
            </div>
            <span className="text-lg shrink-0">{task.roadmapIcon}</span>
            <div className="flex-1 min-w-0">
              <p className={cn(
                'text-sm font-medium truncate',
                task.done ? 'text-zinc-400 line-through' : 'text-zinc-200'
              )}>
                {task.roadmapName}
              </p>
              <p className="text-[11px] text-zinc-500">Day {task.dayNumber} of {task.totalDays}</p>
            </div>
            {task.done && (
              <span className="text-xs font-medium text-emerald-400 shrink-0">Done</span>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ── active roadmaps horizontal scroll ──────────────── */

function ActiveRoadmapsSection({ roadmaps }: { roadmaps: UserRoadmap[] }) {
  if (roadmaps.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-zinc-300">Active Roadmaps</h3>
          <span className="text-xs text-zinc-600">({roadmaps.length})</span>
        </div>
        <Link href="/roadmaps" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          Browse more <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {roadmaps.map((rm) => {
          const pct = rm.durationDays > 0 ? Math.round((rm.completedDays / rm.durationDays) * 100) : 0;
          const today = new Date();
          const start = new Date(rm.startDate);
          const dayNum = Math.max(1, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
          const tmpl = rm.templateSlug ? templatesBySlug[rm.templateSlug] : null;

          return (
            <Link
              key={rm.id}
              href={`/roadmaps/${rm.id}`}
              className="group flex-shrink-0 w-64 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-emerald-500/30 hover:bg-zinc-900/80 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{rm.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                    {rm.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    {tmpl?.category || rm.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400">Day {dayNum}/{rm.durationDays}</span>
                {rm.currentStreak > 0 && (
                  <span className="flex items-center gap-1 text-orange-400 font-medium">
                    <Flame className="h-3 w-3" /> {rm.currentStreak}d
                  </span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500/60 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">{pct}% complete</p>
            </Link>
          );
        })}
        {roadmaps.length < 3 && (
          <Link
            href="/roadmaps"
            className="flex-shrink-0 w-48 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/30 p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/30 hover:bg-zinc-900/50 transition-all duration-200"
          >
            <Map className="h-6 w-6 text-zinc-600" />
            <span className="text-xs text-zinc-500">Browse Roadmaps</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── recent activity / feed section ─────────────────── */

function FeedSection({
  feedLoading,
  feedEvents,
}: {
  feedLoading: boolean;
  feedEvents: FeedEvent[] | null;
}) {
  return (
    <Card variant="glass" className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">Recent Activity</h3>
        </div>
        <Link href="/feed" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {feedLoading ? (
        <div className="space-y-2 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      ) : !feedEvents || feedEvents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <Zap className="h-7 w-7 text-zinc-700 mb-2" />
          <p className="text-xs text-zinc-500">No activity yet</p>
        </div>
      ) : (
        <div className="space-y-0.5 flex-1 overflow-hidden">
          {feedEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 text-[9px] font-bold text-emerald-400 shrink-0 mt-0.5">
                {initials(event.display_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300 leading-snug truncate">
                  <Link href={`/user/${event.user_id}`} className="font-medium hover:text-emerald-400 transition-colors">
                    {event.display_name}
                  </Link>{' '}
                  <span className="text-zinc-500">{event.title}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-600">
                  <span>{formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</span>
                  {event.like_count > 0 && (
                    <span className="flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" /> {event.like_count}</span>
                  )}
                  {event.comment_count > 0 && (
                    <span className="flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" /> {event.comment_count}</span>
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

/* ── quick actions ───────────────────────────────────── */

function QuickActionsSection() {
  const actions = [
    { label: 'Solve a Problem', href: '/problems', icon: Code2, color: 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/15 text-emerald-400 hover:bg-emerald-500/10' },
    { label: 'Create a Room', href: '/rooms', icon: Swords, color: 'from-purple-500/20 to-fuchsia-500/10 border-purple-500/15 text-purple-400 hover:bg-purple-500/10' },
    { label: 'Join a Group', href: '/groups', icon: Users, color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/15 text-blue-400 hover:bg-blue-500/10' },
    { label: 'Browse Roadmaps', href: '/roadmaps', icon: Map, color: 'from-amber-500/20 to-orange-500/10 border-amber-500/15 text-amber-400 hover:bg-amber-500/10' },
    { label: 'Revision Cards', href: '/revision', icon: BookOpen, color: 'from-rose-500/20 to-pink-500/10 border-rose-500/15 text-rose-400 hover:bg-rose-500/10' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            'flex items-center gap-2 rounded-xl border bg-gradient-to-br px-3.5 py-2 text-xs font-medium transition-all duration-200',
            action.color
          )}
        >
          <action.icon className="h-3.5 w-3.5" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}

/* ── groups overview ─────────────────────────────────── */

function GroupsSection({
  groupsLoading,
  groups,
}: {
  groupsLoading: boolean;
  groups: Group[] | null;
}) {
  return (
    <Card variant="glass" className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10">
            <Users className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">My Groups</h3>
        </div>
        <Link href="/groups" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {groupsLoading ? (
        <div className="space-y-2 flex-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : !groups || groups.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
          <Users className="h-7 w-7 text-zinc-700 mb-2" />
          <p className="text-xs text-zinc-500">No groups yet</p>
          <Link href="/groups" className="mt-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            Join or create one
          </Link>
        </div>
      ) : (
        <div className="space-y-1.5 flex-1">
          {groups.slice(0, 4).map((g) => (
            <Link
              key={g.id}
              href={`/groups/${g.id}`}
              className="flex items-center justify-between rounded-lg border border-zinc-800/50 px-3 py-2 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all duration-200"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-500/10 text-xs font-bold text-blue-400 border border-blue-500/10">
                  {g.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-200 truncate max-w-[140px]">{g.name}</p>
                  <p className="text-[10px] text-zinc-500">
                    {g.members ? `${g.members.length} members` : 'Group'}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ── leaderboard peek ────────────────────────────────── */

function LeaderboardSection({
  lbLoading,
  leaderboard,
  firstGroupId,
  userId,
}: {
  lbLoading: boolean;
  leaderboard: LeaderboardEntry[] | null;
  firstGroupId: string | null;
  userId?: string;
}) {
  return (
    <Card variant="glass" className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
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
        <div className="space-y-2 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 rounded-lg" />
          ))}
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
          <Trophy className="h-7 w-7 text-zinc-700 mb-2" />
          <p className="text-xs text-zinc-500">Join a group to compete</p>
        </div>
      ) : (
        <div className="space-y-1 flex-1">
          {leaderboard.slice(0, 5).map((entry, idx) => {
            const isMe = entry.userId === userId;
            return (
              <div
                key={entry.userId}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors',
                  isMe && 'bg-emerald-500/5 border border-emerald-500/10',
                  idx === 0 && !isMe && 'bg-amber-500/5'
                )}
              >
                <span className={cn(
                  'w-4 text-center text-[11px] font-bold',
                  idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-400' : idx === 2 ? 'text-orange-400' : 'text-zinc-600'
                )}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-xs font-medium truncate',
                    isMe ? 'text-emerald-400' : 'text-zinc-200'
                  )}>
                    {entry.displayName} {isMe && '(you)'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 shrink-0">
                  <span className="flex items-center gap-0.5">
                    <CheckCircle className="h-2.5 w-2.5 text-emerald-500" />
                    {entry.solvedCount}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Flame className="h-2.5 w-2.5 text-orange-400" />
                    {entry.currentStreak}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* ── heatmap section ─────────────────────────────────── */

function HeatmapSection({
  progressLoading,
  progressData,
}: {
  progressLoading: boolean;
  progressData: ProblemProgress[] | null;
}) {
  if (progressLoading) {
    return <Skeleton className="h-44 rounded-2xl" />;
  }
  return <ContributionHeatmap progress={progressData || []} />;
}

/* ── difficulty breakdown mini ───────────────────────── */

function DifficultyMini({ breakdown, total }: {
  breakdown: { easy: number; medium: number; hard: number };
  total: number;
}) {
  const safeTotal = total || 1;
  return (
    <Card variant="glass" className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10">
          <CircleDot className="h-3.5 w-3.5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-300">Difficulty Split</h3>
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-zinc-800/60 mb-3">
        {breakdown.easy > 0 && (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700" style={{ width: `${(breakdown.easy / safeTotal) * 100}%` }} />
        )}
        {breakdown.medium > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700" style={{ width: `${(breakdown.medium / safeTotal) * 100}%` }} />
        )}
        {breakdown.hard > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700" style={{ width: `${(breakdown.hard / safeTotal) * 100}%` }} />
        )}
      </div>
      <div className="flex justify-between text-xs">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-500">Easy</span>
          <span className="font-semibold text-emerald-400">{breakdown.easy}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-zinc-500">Med</span>
          <span className="font-semibold text-amber-400">{breakdown.medium}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-zinc-500">Hard</span>
          <span className="font-semibold text-red-400">{breakdown.hard}</span>
        </span>
      </div>
      <Link href="/insights" className="mt-3 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
        Full insights <TrendingUp className="h-3 w-3" />
      </Link>
    </Card>
  );
}

/* ── learn progress section ──────────────────────────── */

function LearnProgressSection({
  totalCompleted,
  totalLessons,
  topicsInProgress,
  getTopicProgress,
}: {
  totalCompleted: number;
  totalLessons: number;
  topicsInProgress: { topicSlug: string; topicName: string; nextLesson: { slug: string; title: string } | null }[];
  getTopicProgress: (slug: string) => { completed: number; total: number };
}) {
  if (topicsInProgress.length === 0) return null;

  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-zinc-300">Learning Progress</h3>
          <span className="text-xs text-zinc-600">{totalCompleted}/{totalLessons} lessons</span>
        </div>
        <Link href="/learn" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          Learn Hub <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mb-3">
        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-cyan-500/60 transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="text-[10px] text-zinc-600 mt-1">{overallPct}% overall</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {topicsInProgress.map((tp) => {
          const topic = topics.find((t) => t.slug === tp.topicSlug);
          const prog = getTopicProgress(tp.topicSlug);
          const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
          return (
            <Link
              key={tp.topicSlug}
              href={tp.nextLesson ? `/learn/${tp.topicSlug}/${tp.nextLesson.slug}` : `/learn/${tp.topicSlug}`}
              className="group flex-shrink-0 w-56 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-cyan-500/30 hover:bg-zinc-900/80 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{topic?.icon || '📚'}</span>
                <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                  {tp.topicName}
                </h4>
              </div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-zinc-400">{prog.completed}/{prog.total} lessons</span>
                <span className="text-cyan-400 font-medium">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-cyan-500/60 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {tp.nextLesson && (
                <p className="text-[10px] text-zinc-500 truncate">
                  Next: {tp.nextLesson.title}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ── daily challenge card ───────────────────────────── */

function DailyChallengeCard({
  dailyProblem,
  dailyLoading,
}: {
  dailyProblem: { title: string; slug: string; difficulty: string } | null;
  dailyLoading: boolean;
}) {
  if (dailyLoading) {
    return (
      <Card variant="glass" className="border-yellow-500/10 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/15">
            <Star className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </Card>
    );
  }

  if (!dailyProblem) return null;

  const diffColor =
    dailyProblem.difficulty === 'easy'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
      : dailyProblem.difficulty === 'medium'
        ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
        : 'bg-red-500/15 text-red-400 border-red-500/20';

  return (
    <Card className="border-yellow-500/10 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/15">
          <Star className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-base font-semibold text-zinc-100">Daily Challenge</h2>
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full border', diffColor)}>
              {dailyProblem.difficulty}
            </span>
          </div>
          <p className="text-xs text-zinc-400 truncate">{dailyProblem.title}</p>
        </div>
        <Link href={`/problems/${dailyProblem.slug}`}>
          <Button variant="primary" size="sm">
            Solve <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

/* ── bookmarks quick access ─────────────────────────── */

function BookmarksSection({ bookmarks }: { bookmarks: Bookmark[] }) {
  const recent = bookmarks
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
    .slice(0, 3);

  if (recent.length === 0) return null;

  const typeIcon: Record<Bookmark['type'], string> = {
    problem: '💻',
    lesson: '📖',
    pattern: '🧩',
    roadmap: '🗺️',
  };

  const getHref = (b: Bookmark): string => {
    switch (b.type) {
      case 'problem': return `/problems/${b.slug}`;
      case 'lesson': return b.topicSlug ? `/learn/${b.topicSlug}/${b.slug}` : `/learn`;
      case 'pattern': return `/patterns/${b.slug}`;
      case 'roadmap': return `/roadmaps/${b.slug}`;
      default: return '#';
    }
  };

  return (
    <Card variant="glass">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10">
            <BookmarkIcon className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">Bookmarks</h3>
        </div>
        <Link href="/bookmarks" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-1.5">
        {recent.map((b) => (
          <Link
            key={b.id}
            href={getHref(b)}
            className="flex items-center gap-2.5 rounded-lg border border-zinc-800/50 px-3 py-2 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all duration-200"
          >
            <span className="text-sm">{typeIcon[b.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{b.title}</p>
              <p className="text-[10px] text-zinc-500 capitalize">{b.type}</p>
            </div>
            <ChevronRight className="h-3 w-3 text-zinc-600" />
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════════ */
/* ── MAIN PAGE ─────────────────────────────────────── */
/* ══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const { streak, solvedCount, loading: statsLoading, fetchStats } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /* ── API data ─── */
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

  const { data: insightsData } = useAsync(
    () => insightsApi.overview().then((r) => r.data),
    []
  );

  /* ── Roadmaps from localStorage ─── */
  const [activeRoadmaps, setActiveRoadmaps] = useState<UserRoadmap[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('streaksy_active_roadmaps');
      if (stored) setActiveRoadmaps(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  /* ── Today's tasks ─── */
  const todayTasks = useMemo(() => getTodayTasks(activeRoadmaps), [activeRoadmaps]);

  const handleToggleTask = useCallback(async (roadmapId: string, dayNumber: number, done: boolean) => {
    try {
      await roadmapsApi.updateProgress(roadmapId, dayNumber, done);
      // Optimistic update
      setActiveRoadmaps((prev) =>
        prev.map((rm) =>
          rm.id === roadmapId
            ? { ...rm, completedDays: done ? Math.max(rm.completedDays, dayNumber) : Math.min(rm.completedDays, dayNumber - 1) }
            : rm
        )
      );
    } catch {
      /* silently fail */
    }
  }, []);

  /* ── Derived stats ─── */
  const currentStreak = streak?.currentStreak ?? 0;
  const longestStreak = streak?.longestStreak ?? 0;
  const streakPoints = streak?.points ?? 0;
  const totalSolved = insightsData?.totalSolved ?? solvedCount;

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

  const diffTotal = difficultyBreakdown.easy + difficultyBreakdown.medium + difficultyBreakdown.hard;

  /* ── Learn progress ─── */
  const { getAllProgress, getTopicProgress } = useLearnProgress();
  const learnData = useMemo(() => getAllProgress(), [getAllProgress]);

  /* ── Daily challenge ─── */
  const { data: dailyData, loading: dailyLoading } = useAsync(
    () => dailyApi.getToday().then((r) => {
      const problems = r.data.problems ?? r.data.daily ?? [];
      if (Array.isArray(problems) && problems.length > 0) {
        const p = problems[0];
        return { title: p.title, slug: p.slug, difficulty: p.difficulty } as { title: string; slug: string; difficulty: string };
      }
      return null;
    }).catch(() => null),
    []
  );

  /* ── Bookmarks ─── */
  const { bookmarks } = useBookmarks();

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

  const todayStr = format(new Date(), 'EEEE, MMMM d, yyyy');

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-5">

          {/* ═══ Section 1: Greeting + Date ═══ */}
          <div className="animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
                {getGreeting()},{' '}
                <span className="gradient-text">{user?.displayName}</span>
              </h1>
            </div>
            <p className="mt-1 text-sm text-zinc-500 flex items-center gap-2">
              <span>{todayStr}</span>
              <span className="text-zinc-700">|</span>
              <span>{getStreakMessage(currentStreak)}</span>
            </p>
          </div>

          {/* ═══ Section 1b: Stats Row ═══ */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Flame className="h-4 w-4 text-orange-400" />}
              label="Current Streak"
              value={<>{currentStreak}<span className="ml-1 text-sm font-normal text-zinc-500">days</span></>}
              sub={`Best: ${longestStreak}d`}
              gradient="bg-gradient-to-br from-orange-500/20 to-amber-500/10 border-orange-500/10"
              glow="rgba(249,115,22,0.3)"
              animate={currentStreak > 0}
            />
            <StatCard
              icon={<CheckCircle className="h-4 w-4 text-emerald-400" />}
              label="Problems Solved"
              value={totalSolved}
              sub={diffTotal > 0 ? `${difficultyBreakdown.easy}E / ${difficultyBreakdown.medium}M / ${difficultyBreakdown.hard}H` : undefined}
              gradient="bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border-emerald-500/10"
            />
            <StatCard
              icon={<Map className="h-4 w-4 text-purple-400" />}
              label="Active Roadmaps"
              value={activeRoadmaps.filter((r) => r.status === 'active').length}
              sub={activeRoadmaps.length > 0 ? `${todayTasks.filter((t) => t.done).length}/${todayTasks.length} tasks today` : 'Start one!'}
              gradient="bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border-purple-500/10"
            />
            <StatCard
              icon={<Trophy className="h-4 w-4 text-amber-400" />}
              label="Streak Points"
              value={streakPoints}
              sub="Earn by staying consistent"
              gradient="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/10"
            />
          </div>

          {/* ═══ Section 1c: Daily Challenge ═══ */}
          <div className="animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'both' }}>
            <DailyChallengeCard dailyProblem={dailyData ?? null} dailyLoading={dailyLoading} />
          </div>

          {/* ═══ Section 2: Today's Tasks ═══ */}
          <TodayTasksSection tasks={todayTasks} onToggle={handleToggleTask} />

          {/* ═══ Section 3: Active Roadmaps (horizontal scroll) ═══ */}
          <ActiveRoadmapsSection roadmaps={activeRoadmaps} />

          {/* ═══ Section 3b: Learning Progress ═══ */}
          <div className="animate-slide-up" style={{ animationDelay: '160ms', animationFillMode: 'both' }}>
            <LearnProgressSection
              totalCompleted={learnData.totalCompleted}
              totalLessons={learnData.totalLessons}
              topicsInProgress={learnData.topicsInProgress}
              getTopicProgress={getTopicProgress}
            />
          </div>

          {/* ═══ Section 4 + 5: Feed + Quick Actions | Groups + Leaderboard ═══ */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left: Feed + Quick Actions + Bookmarks */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <FeedSection feedLoading={feedLoading} feedEvents={feedEvents} />
              <QuickActionsSection />
              <div className="animate-slide-up" style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
                <BookmarksSection bookmarks={bookmarks} />
              </div>
            </div>

            {/* Middle: Groups */}
            <div className="lg:col-span-4">
              <GroupsSection groupsLoading={groupsLoading} groups={groups} />
            </div>

            {/* Right: Leaderboard + Difficulty */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <LeaderboardSection
                lbLoading={lbLoading}
                leaderboard={leaderboard}
                firstGroupId={firstGroupId}
                userId={user?.id}
              />
              <DifficultyMini breakdown={difficultyBreakdown} total={diffTotal} />
            </div>
          </div>

          {/* ═══ Section 7: Contribution Heatmap ═══ */}
          <HeatmapSection
            progressLoading={progressLoading}
            progressData={progressData}
          />

        </div>
      </PageTransition>
    </AppShell>
  );
}
