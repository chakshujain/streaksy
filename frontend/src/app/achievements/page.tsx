'use client';

import { useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/ui/PageTransition';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { badgesApi, streaksApi, insightsApi } from '@/lib/api';
import { Award, Lock, Calendar, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { UserBadge } from '@/lib/types';

// ── Rarity tiers ──
type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

const rarityColors: Record<Rarity, { badge: string; text: string; border: string; glow: string }> = {
  Common: {
    badge: 'bg-zinc-500/10 border-zinc-500/30',
    text: 'text-zinc-400',
    border: 'border-zinc-600/30',
    glow: '',
  },
  Rare: {
    badge: 'bg-blue-500/10 border-blue-500/30',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: '',
  },
  Epic: {
    badge: 'bg-purple-500/10 border-purple-500/30',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: '',
  },
  Legendary: {
    badge: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_-4px_rgba(245,158,11,0.4)] animate-pulse',
  },
};

// ── Badge definitions ──
interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: Rarity;
  target: number;
  progressKey: string; // key into user stats
}

const BADGE_DEFINITIONS: BadgeDef[] = [
  // Streak Badges
  { id: 'streak-1',   name: 'First Step',      description: 'Achieve a 1-day streak',   icon: '👣', category: 'Streak',          rarity: 'Common',    target: 1,   progressKey: 'currentStreak' },
  { id: 'streak-7',   name: 'Week Warrior',     description: 'Maintain a 7-day streak',  icon: '🔥', category: 'Streak',          rarity: 'Rare',      target: 7,   progressKey: 'currentStreak' },
  { id: 'streak-14',  name: 'Fortnight Fury',   description: 'Keep a 14-day streak',     icon: '⚡', category: 'Streak',          rarity: 'Epic',      target: 14,  progressKey: 'currentStreak' },
  { id: 'streak-30',  name: 'Monthly Master',   description: 'Sustain a 30-day streak',  icon: '👑', category: 'Streak',          rarity: 'Epic',      target: 30,  progressKey: 'currentStreak' },
  { id: 'streak-100', name: 'Century Club',     description: 'Reach a 100-day streak',   icon: '💎', category: 'Streak',          rarity: 'Legendary', target: 100, progressKey: 'currentStreak' },

  // Problem Solving
  { id: 'solve-1',    name: 'First Blood',      description: 'Solve your first problem',     icon: '🎯', category: 'Problem Solving', rarity: 'Common',    target: 1,   progressKey: 'totalSolved' },
  { id: 'solve-10',   name: 'Double Digits',    description: 'Solve 10 problems',            icon: '🏅', category: 'Problem Solving', rarity: 'Rare',      target: 10,  progressKey: 'totalSolved' },
  { id: 'solve-50',   name: 'Problem Crusher',  description: 'Solve 50 problems',            icon: '🏆', category: 'Problem Solving', rarity: 'Epic',      target: 50,  progressKey: 'totalSolved' },
  { id: 'solve-100',  name: 'Centurion',        description: 'Solve 100 problems',           icon: '⭐', category: 'Problem Solving', rarity: 'Epic',      target: 100, progressKey: 'totalSolved' },
  { id: 'solve-500',  name: 'Problem Machine',  description: 'Solve 500 problems',           icon: '🤖', category: 'Problem Solving', rarity: 'Legendary', target: 500, progressKey: 'totalSolved' },

  // Roadmap
  { id: 'road-start', name: 'Trailblazer',      description: 'Start your first roadmap',            icon: '🗺️', category: 'Roadmaps', rarity: 'Common',    target: 1, progressKey: 'roadmapsStarted' },
  { id: 'road-fin',   name: 'Finisher',         description: 'Complete your first roadmap',          icon: '🏁', category: 'Roadmaps', rarity: 'Rare',      target: 1, progressKey: 'roadmapsCompleted' },
  { id: 'road-multi', name: 'Multi-Tasker',     description: 'Have 3 active roadmaps simultaneously',icon: '🔀', category: 'Roadmaps', rarity: 'Epic',      target: 3, progressKey: 'activeRoadmaps' },
  { id: 'road-5',     name: 'Goal Getter',      description: 'Complete 5 roadmaps',                 icon: '🎖️', category: 'Roadmaps', rarity: 'Legendary', target: 5, progressKey: 'roadmapsCompleted' },

  // Social
  { id: 'soc-join',   name: 'Team Player',      description: 'Join a group',          icon: '👥', category: 'Social', rarity: 'Common', target: 1, progressKey: 'groupsJoined' },
  { id: 'soc-create', name: 'Squad Leader',     description: 'Create a group',        icon: '🛡️', category: 'Social', rarity: 'Rare',   target: 1, progressKey: 'groupsCreated' },
  { id: 'soc-poke',   name: 'Poke Master',      description: 'Poke 10 people',        icon: '👆', category: 'Social', rarity: 'Epic',   target: 10, progressKey: 'pokesSent' },
  { id: 'soc-war',    name: 'War Hero',         description: 'Win a war room',        icon: '⚔️', category: 'Social', rarity: 'Epic',   target: 1, progressKey: 'warRoomsWon' },

  // Learning
  { id: 'learn-1',    name: 'Curious Mind',     description: 'Complete 1 lesson',        icon: '📖', category: 'Learning', rarity: 'Common', target: 1,  progressKey: 'lessonsCompleted' },
  { id: 'learn-10',   name: 'Scholar',          description: 'Complete 10 lessons',      icon: '🎓', category: 'Learning', rarity: 'Rare',   target: 10, progressKey: 'lessonsCompleted' },
  { id: 'learn-pat',  name: 'Pattern Pro',      description: 'View all 19 DSA patterns', icon: '🧩', category: 'Learning', rarity: 'Epic',   target: 19, progressKey: 'patternsViewed' },
];

const CATEGORIES = ['Streak', 'Problem Solving', 'Roadmaps', 'Social', 'Learning'];

const categoryIcons: Record<string, string> = {
  'Streak': '🔥',
  'Problem Solving': '🎯',
  'Roadmaps': '🗺️',
  'Social': '👥',
  'Learning': '📖',
};

// Map backend badge names to our local definitions for matching
function matchBadge(backendName: string, localBadges: BadgeDef[]): BadgeDef | undefined {
  // Try exact name match first
  const exact = localBadges.find((b) => b.name.toLowerCase() === backendName.toLowerCase());
  if (exact) return exact;
  return undefined;
}

function iconForBackendBadge(icon: string): string {
  const map: Record<string, string> = {
    trophy: '🏆', star: '⭐', award: '🎖️', crown: '👑',
    flame: '🔥', zap: '⚡', target: '🎯', shield: '🛡️',
    users: '👥', 'book-open': '📖',
  };
  return map[icon] || '🏅';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AchievementsPage() {
  // Fetch user's earned badges from backend
  const { data: myBadges, loading: loadingMine } = useAsync<UserBadge[]>(
    () => badgesApi.mine().then((r) => r.data.badges),
    []
  );
  const { data: allBackendBadges, loading: loadingAll } = useAsync<{ id: string; name: string; description: string; icon: string; category: string }[]>(
    () => badgesApi.list().then((r) => r.data.badges),
    []
  );
  // Fetch stats for progress display
  const { data: streak } = useAsync<{ currentStreak: number; longestStreak: number; points: number }>(
    () => streaksApi.get().then((r) => r.data),
    []
  );
  const { data: insights } = useAsync<{ totalSolved: number }>(
    () => insightsApi.overview().then((r) => r.data),
    []
  );

  const loading = loadingMine || loadingAll;

  // Build progress stats from available data
  const userStats = useMemo(() => ({
    currentStreak: Math.max(streak?.currentStreak || 0, streak?.longestStreak || 0),
    totalSolved: insights?.totalSolved || 0,
    // These require backend data we may not have; default to 0
    roadmapsStarted: 0,
    roadmapsCompleted: 0,
    activeRoadmaps: 0,
    groupsJoined: 0,
    groupsCreated: 0,
    pokesSent: 0,
    warRoomsWon: 0,
    lessonsCompleted: 0,
    patternsViewed: 0,
  }), [streak, insights]);

  // Build the earned set from backend badges
  const earnedMap = useMemo(() => {
    const map = new Map<string, { earnedAt: string }>();
    if (!myBadges) return map;
    for (const mb of myBadges) {
      // Match by name to our local definitions
      const local = matchBadge(mb.name, BADGE_DEFINITIONS);
      if (local) {
        map.set(local.id, { earnedAt: mb.earned_at });
      }
      // Also store by backend badge name for fallback
      map.set(`backend:${mb.name}`, { earnedAt: mb.earned_at });
    }
    return map;
  }, [myBadges]);

  // Merged badge list: local definitions + any backend badges not in our local list
  const allBadges = useMemo(() => {
    const localIds = new Set(BADGE_DEFINITIONS.map((b) => b.name.toLowerCase()));
    const extras: BadgeDef[] = [];
    if (allBackendBadges) {
      for (const bb of allBackendBadges) {
        if (!localIds.has(bb.name.toLowerCase())) {
          extras.push({
            id: `backend:${bb.name}`,
            name: bb.name,
            description: bb.description,
            icon: iconForBackendBadge(bb.icon),
            category: bb.category || 'Other',
            rarity: 'Common',
            target: 1,
            progressKey: '',
          });
        }
      }
    }
    return [...BADGE_DEFINITIONS, ...extras];
  }, [allBackendBadges]);

  // Stats
  const totalBadges = allBadges.length;
  const earnedCount = allBadges.filter((b) => {
    if (earnedMap.has(b.id)) return true;
    if (earnedMap.has(`backend:${b.name}`)) return true;
    // Check progress-based earning
    const progress = userStats[b.progressKey as keyof typeof userStats] ?? 0;
    return progress >= b.target;
  }).length;

  const completionPct = totalBadges > 0 ? Math.round((earnedCount / totalBadges) * 100) : 0;

  // Rarity score: Common=1, Rare=2, Epic=4, Legendary=8
  const rarityWeights: Record<Rarity, number> = { Common: 1, Rare: 2, Epic: 4, Legendary: 8 };
  const rarityScore = allBadges.reduce((sum, b) => {
    const isEarned = earnedMap.has(b.id) || earnedMap.has(`backend:${b.name}`) ||
      ((userStats[b.progressKey as keyof typeof userStats] ?? 0) >= b.target);
    return sum + (isEarned ? rarityWeights[b.rarity] : 0);
  }, 0);

  // Helper to check if badge is earned
  const isBadgeEarned = (b: BadgeDef) => {
    if (earnedMap.has(b.id)) return true;
    if (earnedMap.has(`backend:${b.name}`)) return true;
    const progress = userStats[b.progressKey as keyof typeof userStats] ?? 0;
    return progress >= b.target;
  };

  // Get earned date
  const getEarnedDate = (b: BadgeDef): string | null => {
    const e = earnedMap.get(b.id) || earnedMap.get(`backend:${b.name}`);
    return e?.earnedAt || null;
  };

  // Get current progress for a badge
  const getProgress = (b: BadgeDef): number => {
    if (!b.progressKey) return isBadgeEarned(b) ? b.target : 0;
    const val = userStats[b.progressKey as keyof typeof userStats] ?? 0;
    return Math.min(val, b.target);
  };

  // Recent achievements (latest 5)
  const recentAchievements = useMemo(() => {
    if (!myBadges) return [];
    return [...myBadges]
      .sort((a, b) => new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime())
      .slice(0, 5);
  }, [myBadges]);

  // Grouped by category
  const categories = useMemo(() => {
    const allCats = [...CATEGORIES];
    for (const b of allBadges) {
      if (!allCats.includes(b.category)) allCats.push(b.category);
    }
    return allCats;
  }, [allBadges]);

  if (loading) {
    return (
      <AppShell>
        <PageTransition>
          <div className="space-y-6">
            <Skeleton className="h-10 w-56 rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
              <Skeleton className="h-28 rounded-2xl" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </PageTransition>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/10 glow-sm">
              <Award className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Achievements</h1>
              <p className="mt-0.5 text-sm text-zinc-500">Track your badges and milestones</p>
            </div>
          </div>

          {/* Stats Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <Award className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{earnedCount}<span className="text-sm font-normal text-zinc-500">/{totalBadges}</span></p>
                <p className="text-xs text-zinc-500">Badges Earned</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                <TrendingUp className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{completionPct}%</p>
                <p className="text-xs text-zinc-500">Completion</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <Star className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-100">{rarityScore}</p>
                <p className="text-xs text-zinc-500">Rarity Score</p>
              </div>
            </Card>
          </div>

          {/* Recent Achievements Timeline */}
          {recentAchievements.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              <Card>
                <h2 className="text-lg font-semibold text-zinc-200 mb-4">Recent Achievements</h2>
                <div className="space-y-3">
                  {recentAchievements.map((badge, i) => {
                    const localDef = matchBadge(badge.name, BADGE_DEFINITIONS);
                    return (
                      <div
                        key={badge.badge_id + i}
                        className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3 animate-slide-up"
                        style={{ animationDelay: `${150 + i * 50}ms`, animationFillMode: 'both' }}
                      >
                        <span className="text-2xl">{localDef?.icon || iconForBackendBadge(badge.icon)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200">{badge.name}</p>
                          <p className="text-xs text-zinc-500 truncate">{badge.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 shrink-0">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(badge.earned_at)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* Badge Categories */}
          {categories.map((cat, catIdx) => {
            const catBadges = allBadges.filter((b) => b.category === cat);
            if (catBadges.length === 0) return null;
            const catEarned = catBadges.filter(isBadgeEarned).length;
            const catPct = Math.round((catEarned / catBadges.length) * 100);

            return (
              <div
                key={cat}
                className="animate-slide-up"
                style={{ animationDelay: `${150 + catIdx * 75}ms`, animationFillMode: 'both' }}
              >
                <Card>
                  {/* Category Header with Progress */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{categoryIcons[cat] || '🏅'}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-zinc-200">{cat}</h2>
                        <p className="text-xs text-zinc-500">{catEarned}/{catBadges.length} earned</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-zinc-400">{catPct}%</span>
                  </div>

                  {/* Category Progress Bar */}
                  <div className="h-1.5 rounded-full bg-zinc-800 mb-6 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
                      style={{ width: `${catPct}%` }}
                    />
                  </div>

                  {/* Badge Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catBadges.map((badge) => {
                      const earned = isBadgeEarned(badge);
                      const progress = getProgress(badge);
                      const earnedDate = getEarnedDate(badge);
                      const progressPct = Math.round((progress / badge.target) * 100);
                      const rStyle = rarityColors[badge.rarity];

                      return (
                        <div
                          key={badge.id}
                          className={cn(
                            'relative rounded-xl border p-4 transition-all duration-300',
                            earned
                              ? cn(rStyle.badge, 'hover:scale-[1.02]', badge.rarity === 'Legendary' && rStyle.glow)
                              : 'border-zinc-800 bg-zinc-900/30'
                          )}
                        >
                          {/* Rarity Tag */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={cn(
                              'text-3xl transition-all duration-300',
                              !earned && 'grayscale opacity-50'
                            )}>
                              {badge.icon}
                            </span>
                            <span className={cn(
                              'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                              earned ? rStyle.text : 'text-zinc-600',
                              earned ? rStyle.border : 'border-zinc-700'
                            )}>
                              {badge.rarity}
                            </span>
                          </div>

                          {/* Name & Description */}
                          <h3 className={cn(
                            'text-sm font-semibold mb-1',
                            earned ? 'text-zinc-100' : 'text-zinc-500'
                          )}>
                            {badge.name}
                          </h3>
                          <p className={cn(
                            'text-xs mb-3 leading-relaxed',
                            earned ? 'text-zinc-400' : 'text-zinc-600'
                          )}>
                            {badge.description}
                          </p>

                          {/* Progress Bar */}
                          {!earned && badge.progressKey && (
                            <div className="mb-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-zinc-600">{progress}/{badge.target}</span>
                                <span className="text-[10px] text-zinc-600">{progressPct}%</span>
                              </div>
                              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 to-cyan-500/70 transition-all duration-500"
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Earned Date or Lock */}
                          <div className="flex items-center gap-1.5 mt-2">
                            {earned ? (
                              <>
                                <Calendar className="h-3 w-3 text-emerald-500/70" />
                                <span className="text-[10px] text-emerald-500/70">
                                  {earnedDate ? formatDate(earnedDate) : 'Earned'}
                                </span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3 text-zinc-600" />
                                <span className="text-[10px] text-zinc-600">Locked</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </PageTransition>
    </AppShell>
  );
}
