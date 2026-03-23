'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/ui/PageTransition';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/lib/store';
import { groupsApi, leaderboardApi } from '@/lib/api';
import { Trophy, Medal, Flame, Map, AlertCircle, Users } from 'lucide-react';
import { cn } from '@/lib/cn';

interface LeaderboardUser {
  userId: string;
  displayName: string;
  display_name?: string;
  solvedCount: number;
  solved_count?: number;
  currentStreak: number;
  current_streak?: number;
  longestStreak: number;
  longest_streak?: number;
  activeRoadmaps?: number;
  active_roadmaps?: number;
}

interface GroupOption {
  id: string;
  name: string;
  members?: { user_id: string }[];
}

interface GroupRanking {
  id: string;
  name: string;
  memberCount: number;
  totalPoints: number;
}

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

function normalizeUser(u: Record<string, unknown>): LeaderboardUser {
  return {
    userId: (u.userId || u.user_id || u.id || '') as string,
    displayName: (u.displayName || u.display_name || u.name || 'Anonymous') as string,
    solvedCount: (u.solvedCount || u.solved_count || u.streakPoints || u.streak_points || 0) as number,
    currentStreak: (u.currentStreak || u.current_streak || 0) as number,
    longestStreak: (u.longestStreak || u.longest_streak || 0) as number,
    activeRoadmaps: (u.activeRoadmaps || u.active_roadmaps || 0) as number,
  };
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'global' | 'groups' | 'mygroups'>('global');
  const { user } = useAuthStore();

  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [groupRankings, setGroupRankings] = useState<GroupRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupsLoading, setGroupsLoading] = useState(false);

  // Fetch groups for the mygroups / groups tab
  useEffect(() => {
    if (tab === 'mygroups' || tab === 'groups') {
      setGroupsLoading(true);
      groupsApi
        .list()
        .then(({ data }) => {
          const g = (data.groups || data || []) as GroupOption[];
          setGroups(g);
          if (tab === 'mygroups' && g.length > 0 && !selectedGroupId) {
            setSelectedGroupId(g[0].id);
          }
        })
        .catch(() => setGroups([]))
        .finally(() => setGroupsLoading(false));
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch leaderboard data
  useEffect(() => {
    if (tab === 'global') {
      setLoading(true);
      setError('');
      groupsApi
        .list()
        .then(async ({ data }) => {
          const g = (data.groups || data || []) as GroupOption[];
          if (g.length === 0) {
            setLeaderboard([]);
            return;
          }
          // Aggregate leaderboards from all groups
          const allEntries: LeaderboardUser[] = [];
          const seen = new Set<string>();
          for (const group of g.slice(0, 5)) {
            try {
              const { data: lbData } = await leaderboardApi.getGroup(group.id);
              const entries = (lbData.leaderboard || lbData || []) as Record<string, unknown>[];
              for (const entry of entries) {
                const normalized = normalizeUser(entry);
                if (!seen.has(normalized.userId)) {
                  seen.add(normalized.userId);
                  allEntries.push(normalized);
                }
              }
            } catch {
              // Skip group on error
            }
          }
          allEntries.sort((a, b) => b.solvedCount - a.solvedCount);
          setLeaderboard(allEntries);
        })
        .catch(() => {
          setError('Could not load leaderboard data.');
          setLeaderboard([]);
        })
        .finally(() => setLoading(false));
    } else if (tab === 'groups') {
      // Groups tab: rank groups by total streak points
      setLoading(true);
      setError('');
      groupsApi
        .list()
        .then(async ({ data }) => {
          const g = (data.groups || data || []) as GroupOption[];
          if (g.length === 0) {
            setGroupRankings([]);
            return;
          }
          const rankings: GroupRanking[] = [];
          for (const group of g) {
            try {
              const { data: lbData } = await leaderboardApi.getGroup(group.id);
              const entries = (lbData.leaderboard || lbData || []) as Record<string, unknown>[];
              const totalPoints = entries.reduce((sum, entry) => {
                const normalized = normalizeUser(entry);
                return sum + normalized.solvedCount;
              }, 0);
              rankings.push({
                id: group.id,
                name: group.name,
                memberCount: entries.length,
                totalPoints,
              });
            } catch {
              rankings.push({
                id: group.id,
                name: group.name,
                memberCount: 0,
                totalPoints: 0,
              });
            }
          }
          rankings.sort((a, b) => b.totalPoints - a.totalPoints);
          setGroupRankings(rankings);
        })
        .catch(() => {
          setError('Could not load group rankings.');
          setGroupRankings([]);
        })
        .finally(() => setLoading(false));
    } else if (tab === 'mygroups' && selectedGroupId) {
      setLoading(true);
      setError('');
      leaderboardApi
        .getGroup(selectedGroupId)
        .then(({ data }) => {
          const entries = (data.leaderboard || data || []) as Record<string, unknown>[];
          setLeaderboard(entries.map(normalizeUser));
        })
        .catch(() => {
          setError('Could not load group leaderboard.');
          setLeaderboard([]);
        })
        .finally(() => setLoading(false));
    }
  }, [tab, selectedGroupId]);

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
            {([
              { key: 'global' as const, label: 'Global' },
              { key: 'groups' as const, label: 'Groups' },
              { key: 'mygroups' as const, label: 'My Groups' },
            ]).map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.key
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Group selector for mygroups tab */}
          {tab === 'mygroups' && groups.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedGroupId === g.id
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Loading */}
          {(loading || groupsLoading) ? (
            <Card padding={false}>
              <div className="px-6 py-3 border-b border-zinc-800">
                <Skeleton className="h-4 w-full" />
              </div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-6 py-4 border-b border-zinc-800/50">
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </Card>
          ) : tab === 'groups' ? (
            // Groups ranking view
            groupRankings.length === 0 ? (
              <Card className="text-center py-16">
                <Trophy className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-zinc-400 mb-2">Group Rankings</h3>
                <p className="text-sm text-zinc-500">Join a group to see group rankings here.</p>
              </Card>
            ) : (
              <Card padding={false}>
                {/* Table header */}
                <div className="grid grid-cols-[60px_1fr_120px_120px] gap-4 px-6 py-3 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  <span>Rank</span>
                  <span>Group</span>
                  <span className="text-right">Members</span>
                  <span className="text-right">Total Points</span>
                </div>

                {/* Rows */}
                {groupRankings.map((g, i) => {
                  const rank = i + 1;
                  return (
                    <div
                      key={g.id}
                      className={cn(
                        'grid grid-cols-[60px_1fr_120px_120px] gap-4 px-6 py-4 items-center transition-colors hover:bg-zinc-800/30',
                        i < groupRankings.length - 1 && 'border-b border-zinc-800/50'
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

                      {/* Group */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-semibold text-emerald-400">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-white">{g.name}</span>
                      </div>

                      {/* Members */}
                      <div className="text-right">
                        <span className="text-sm text-zinc-300">{g.memberCount}</span>
                      </div>

                      {/* Total Points */}
                      <div className="text-right">
                        <span className="text-sm font-semibold text-amber-400">{g.totalPoints.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </Card>
            )
          ) : tab === 'mygroups' && groups.length === 0 ? (
            <Card className="text-center py-16">
              <Trophy className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">Group Leaderboards</h3>
              <p className="text-sm text-zinc-500">Join a group and start a roadmap together to see group rankings here.</p>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card className="text-center py-16">
              <Trophy className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">No data available</h3>
              <p className="text-sm text-zinc-500">Join a group and start solving problems to appear on the leaderboard.</p>
            </Card>
          ) : (
            <Card padding={false}>
              {/* Table header */}
              <div className="grid grid-cols-[60px_1fr_120px_120px_100px] gap-4 px-6 py-3 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <span>Rank</span>
                <span>User</span>
                <span className="text-right">Solved</span>
                <span className="text-right">Streak</span>
                <span className="text-right">Roadmaps</span>
              </div>

              {/* Rows */}
              {leaderboard.map((u, i) => {
                const rank = i + 1;
                const isMe = user?.id === u.userId;
                return (
                  <div
                    key={u.userId || i}
                    className={cn(
                      'grid grid-cols-[60px_1fr_120px_120px_100px] gap-4 px-6 py-4 items-center transition-colors',
                      isMe ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500' : 'hover:bg-zinc-800/30',
                      i < leaderboard.length - 1 && 'border-b border-zinc-800/50'
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
                        {(u.displayName || '?').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className={cn('text-sm font-medium', isMe ? 'text-emerald-400' : 'text-white')}>
                        {u.displayName} {isMe && <span className="text-xs text-zinc-500">(you)</span>}
                      </span>
                    </div>

                    {/* Solved */}
                    <div className="text-right">
                      <span className="text-sm font-semibold text-amber-400">{u.solvedCount.toLocaleString()}</span>
                    </div>

                    {/* Streak */}
                    <div className="text-right flex items-center justify-end gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-400" />
                      <span className="text-sm text-zinc-300">{u.currentStreak}d</span>
                    </div>

                    {/* Active Roadmaps */}
                    <div className="text-right flex items-center justify-end gap-1">
                      <Map className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="text-sm text-zinc-300">{u.activeRoadmaps || 0}</span>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
