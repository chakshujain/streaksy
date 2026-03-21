'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/ui/PageTransition';
import { useAuthStore } from '@/lib/store';
import { Trophy, Medal, Flame, Map } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/*  Hardcoded leaderboard data (will come from API)                    */
/* ------------------------------------------------------------------ */
const mockUsers = [
  { id: '1', name: 'Alex Chen', streakPoints: 4200, longestStreak: 42, activeRoadmaps: 3 },
  { id: '2', name: 'Sarah Kim', streakPoints: 3850, longestStreak: 38, activeRoadmaps: 2 },
  { id: '3', name: 'Raj Patel', streakPoints: 3600, longestStreak: 35, activeRoadmaps: 4 },
  { id: '4', name: 'Emily Davis', streakPoints: 3100, longestStreak: 31, activeRoadmaps: 2 },
  { id: '5', name: 'Michael Lee', streakPoints: 2800, longestStreak: 28, activeRoadmaps: 1 },
  { id: '6', name: 'Priya Sharma', streakPoints: 2500, longestStreak: 25, activeRoadmaps: 3 },
  { id: '7', name: 'James Wilson', streakPoints: 2200, longestStreak: 22, activeRoadmaps: 2 },
  { id: '8', name: 'Anna Lopez', streakPoints: 1900, longestStreak: 19, activeRoadmaps: 1 },
  { id: '9', name: 'David Brown', streakPoints: 1600, longestStreak: 16, activeRoadmaps: 2 },
  { id: '10', name: 'Maria Garcia', streakPoints: 1300, longestStreak: 13, activeRoadmaps: 1 },
];

const rankColors: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-zinc-300',
  3: 'text-amber-600',
};

const rankBg: Record<number, string> = {
  1: 'bg-amber-500/10 border-amber-500/20',
  2: 'bg-zinc-500/10 border-zinc-500/20',
  3: 'bg-amber-700/10 border-amber-700/20',
};

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'global' | 'groups'>('global');
  const { user } = useAuthStore();

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Trophy className="h-6 w-6 text-amber-400" />
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            </div>
            <p className="text-sm text-zinc-400">See who is crushing it. Climb the ranks.</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(['global', 'groups'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === t
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {t === 'global' ? 'Global' : 'My Groups'}
              </button>
            ))}
          </div>

          {tab === 'global' ? (
            <Card padding={false}>
              {/* Table header */}
              <div className="grid grid-cols-[60px_1fr_120px_120px_100px] gap-4 px-6 py-3 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <span>Rank</span>
                <span>User</span>
                <span className="text-right">Streak Points</span>
                <span className="text-right">Longest Streak</span>
                <span className="text-right">Roadmaps</span>
              </div>

              {/* Rows */}
              {mockUsers.map((u, i) => {
                const rank = i + 1;
                const isMe = user?.id === u.id;
                return (
                  <div
                    key={u.id}
                    className={cn(
                      'grid grid-cols-[60px_1fr_120px_120px_100px] gap-4 px-6 py-4 items-center transition-colors',
                      isMe ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : 'hover:bg-zinc-800/30',
                      i < mockUsers.length - 1 && 'border-b border-zinc-800/50'
                    )}
                  >
                    {/* Rank */}
                    <div>
                      {rank <= 3 ? (
                        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${rankBg[rank]}`}>
                          <Medal className={`h-4 w-4 ${rankColors[rank]}`} />
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-zinc-400 pl-2">#{rank}</span>
                      )}
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-semibold text-emerald-400">
                        {u.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className={cn('text-sm font-medium', isMe ? 'text-emerald-400' : 'text-white')}>
                        {u.name} {isMe && <span className="text-xs text-zinc-500">(you)</span>}
                      </span>
                    </div>

                    {/* Streak Points */}
                    <div className="text-right">
                      <span className="text-sm font-semibold text-amber-400">{u.streakPoints.toLocaleString()}</span>
                    </div>

                    {/* Longest Streak */}
                    <div className="text-right flex items-center justify-end gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-400" />
                      <span className="text-sm text-zinc-300">{u.longestStreak}d</span>
                    </div>

                    {/* Active Roadmaps */}
                    <div className="text-right flex items-center justify-end gap-1">
                      <Map className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-sm text-zinc-300">{u.activeRoadmaps}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
          ) : (
            <Card className="text-center py-16">
              <Trophy className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">Group Leaderboards</h3>
              <p className="text-sm text-zinc-500">Join a group and start a roadmap together to see group rankings here.</p>
            </Card>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
