'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageTransition } from '@/components/ui/PageTransition';
import { PokeButton } from '@/components/poke/PokeButton';
import { useAsync } from '@/hooks/useAsync';
import { authApi, feedApi, badgesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/cn';
import {
  Flame, CheckCircle, Calendar, Trophy, MapPin, Github, Linkedin,
  ExternalLink, Code2, Zap, Target, Award,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import type { PublicProfile, FeedEvent } from '@/lib/types';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.id === userId;

  const { data: profile, loading } = useAsync<PublicProfile>(
    () => authApi.getPublicProfile(userId).then((r) => r.data.profile),
    [userId]
  );

  const { data: feedEvents, loading: feedLoading } = useAsync<FeedEvent[]>(
    () => feedApi.getUserFeed(userId, { limit: 10 }).then((r) => r.data.events ?? []),
    [userId]
  );

  const { data: allBadges } = useAsync<{ id: string; name: string; description: string; icon: string; category: string }[]>(
    () => badgesApi.list().then((r) => r.data.badges),
    []
  );

  if (loading) {
    return (
      <AppShell>
        <PageTransition>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </PageTransition>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell>
        <PageTransition>
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg text-zinc-400">User not found</p>
            <Link href="/dashboard" className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </PageTransition>
      </AppShell>
    );
  }

  const initials = (profile.displayName || '?')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const badgeIconMap: Record<string, string> = {
    trophy: '\u{1F3C6}',
    star: '\u{2B50}',
    award: '\u{1F396}\u{FE0F}',
    crown: '\u{1F451}',
    flame: '\u{1F525}',
    zap: '\u{26A1}',
    target: '\u{1F3AF}',
    shield: '\u{1F6E1}\u{FE0F}',
    users: '\u{1F465}',
    'book-open': '\u{1F4D6}',
  };

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="h-24 w-24 rounded-full object-cover border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/10"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/20 text-2xl font-bold text-emerald-400 shadow-lg shadow-emerald-500/10">
                    {initials}
                  </div>
                )}

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                    <h1 className="text-2xl font-bold text-zinc-100">{profile.displayName}</h1>
                    {!isOwnProfile && (
                      <PokeButton toUserId={userId} toName={profile.displayName} size="sm" />
                    )}
                  </div>

                  {profile.bio && (
                    <p className="mt-2 text-sm text-zinc-400 max-w-lg">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                    {profile.location && (
                      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.location}
                      </span>
                    )}
                    {profile.githubUrl && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <Github className="h-3.5 w-3.5" />
                        GitHub
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {profile.linkedinUrl && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                        LinkedIn
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                      <Calendar className="h-3.5 w-3.5" />
                      Joined {format(new Date(profile.joinedAt), 'MMM yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '75ms', animationFillMode: 'both' }}>
            <Card variant="glass" className="group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl p-2.5 bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Current Streak</p>
                  <p className="text-2xl font-bold text-zinc-100">{profile.currentStreak}<span className="ml-1 text-xs font-normal text-zinc-600">days</span></p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Longest Streak</p>
                  <p className="text-2xl font-bold text-zinc-100">{profile.longestStreak}<span className="ml-1 text-xs font-normal text-zinc-600">days</span></p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl p-2.5 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/10 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total Solved</p>
                  <p className="text-2xl font-bold text-zinc-100">{profile.totalSolved}</p>
                </div>
              </div>
            </Card>

            <Card variant="glass" className="group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="rounded-xl p-2.5 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Member Since</p>
                  <p className="text-lg font-bold text-zinc-100">{format(new Date(profile.joinedAt), 'MMM yyyy')}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Badges */}
          {allBadges && allBadges.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15">
                    <Award className="h-4 w-4 text-amber-400" />
                  </div>
                  <h2 className="text-base font-semibold text-zinc-200">
                    Badges ({profile.badges.length}/{allBadges.length})
                  </h2>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {allBadges.map((b) => {
                    const earned = profile.badges.some((mb) => mb.name === b.name);
                    return (
                      <div
                        key={b.id}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200',
                          earned
                            ? 'border-emerald-500/30 bg-emerald-500/10 hover:scale-105'
                            : 'border-zinc-800 bg-zinc-900/30 opacity-40'
                        )}
                        title={b.description}
                      >
                        <span className="text-xl">{badgeIconMap[b.icon] || '\u{1F3C5}'}</span>
                        <span className={cn('text-[10px] font-medium leading-tight', earned ? 'text-zinc-200' : 'text-zinc-500')}>
                          {b.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <div className="animate-slide-up" style={{ animationDelay: '225ms', animationFillMode: 'both' }}>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15">
                  <Zap className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="text-base font-semibold text-zinc-200">Recent Activity</h2>
              </div>

              {feedLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-xl" />
                  ))}
                </div>
              ) : !feedEvents || feedEvents.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-2">
                  {feedEvents.map((event) => {
                    const eventIcons: Record<string, { icon: typeof Code2; color: string }> = {
                      solve: { icon: Code2, color: 'text-emerald-400' },
                      streak_milestone: { icon: Flame, color: 'text-orange-400' },
                      badge_earned: { icon: Trophy, color: 'text-amber-400' },
                      challenge_complete: { icon: Target, color: 'text-cyan-400' },
                    };
                    const iconInfo = eventIcons[event.event_type] || { icon: Zap, color: 'text-zinc-400' };
                    const IconComp = iconInfo.icon;
                    const metadata = event.metadata || {};

                    return (
                      <div key={event.id} className="flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-800/30 transition-colors">
                        <div className={cn('mt-0.5 rounded-lg p-1.5 bg-zinc-800/50')}>
                          <IconComp className={cn('h-4 w-4', iconInfo.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-300">{event.title}</p>
                          {event.description && (
                            <p className="text-xs text-zinc-500 mt-0.5">{event.description}</p>
                          )}
                          {'problemSlug' in metadata && (
                            <Link
                              href={`/problems/${String(metadata.problemSlug)}`}
                              className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                              <Code2 className="h-3 w-3" />
                              {String(metadata.problemTitle || metadata.problemSlug)}
                              {'difficulty' in metadata && (
                                <Badge variant={String(metadata.difficulty) as 'easy' | 'medium' | 'hard'} className="ml-1 text-[9px]">
                                  {String(metadata.difficulty)}
                                </Badge>
                              )}
                            </Link>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-600 shrink-0">
                          {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
