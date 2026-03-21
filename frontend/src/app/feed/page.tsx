'use client';

import { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/ui/PageTransition';
import { FeedCard } from '@/components/feed/FeedCard';
import { useAsync } from '@/hooks/useAsync';
import { feedApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { Rss, Zap, ThumbsUp, MessageCircle } from 'lucide-react';
import { HelpTooltip } from '@/components/onboarding/HelpTooltip';
import { SharePost } from '@/components/feed/SharePost';
import Link from 'next/link';
import type { FeedEvent } from '@/lib/types';

type FilterTab = 'all' | 'solves' | 'streaks';

export default function FeedPage() {
  const [allEvents, setAllEvents] = useState<FeedEvent[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const LIMIT = 20;

  const { loading } = useAsync(
    () => feedApi.getFeed({ limit: LIMIT, offset }).then(r => {
      const newEvents = (r.data.events ?? []) as FeedEvent[];
      if (offset === 0) {
        setAllEvents(newEvents);
      } else {
        setAllEvents(prev => [...prev, ...newEvents]);
      }
      setHasMore(newEvents.length === LIMIT);
      return newEvents;
    }),
    [offset, refreshKey]
  );

  const totalLikes = useMemo(() => allEvents.reduce((sum, e) => sum + (e.like_count || 0), 0), [allEvents]);
  const totalComments = useMemo(() => allEvents.reduce((sum, e) => sum + (e.comment_count || 0), 0), [allEvents]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return allEvents;
    if (filter === 'solves') return allEvents.filter(e => e.event_type === 'solve' || e.event_type === 'submission');
    return allEvents.filter(e => e.event_type === 'streak' || e.event_type === 'streak_milestone');
  }, [allEvents, filter]);

  return (
    <AppShell>
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationFillMode: 'both' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/10">
              <Rss className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold gradient-text">Activity Feed</h1>
                <HelpTooltip id="feed" text="See what your group members are solving. Like and comment to encourage each other!" />
              </div>
              <p className="text-sm text-zinc-500">See what your peers are up to</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 px-5 py-3 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-zinc-300"><strong className="text-zinc-100">{allEvents.length}</strong> activities</span>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-zinc-300"><strong className="text-zinc-100">{totalLikes}</strong> likes</span>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-zinc-300"><strong className="text-zinc-100">{totalComments}</strong> comments</span>
            </div>
          </div>

          {/* Filter tabs + placeholder input */}
          <div className="flex items-center justify-between gap-3 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <div className="flex gap-2">
              {(['all', 'solves', 'streaks'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                    filter === tab
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  {tab === 'all' ? 'All' : tab === 'solves' ? 'Solves' : 'Streaks'}
                </button>
              ))}
            </div>
          </div>

          {/* Share Post */}
          <div className="animate-slide-up" style={{ animationDelay: '160ms', animationFillMode: 'both' }}>
            <SharePost onPost={() => { setOffset(0); setRefreshKey(k => k + 1); }} />
          </div>

          {/* Feed content */}
          {loading && offset === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event, i) => (
                <div
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(i, 10) * 50}ms`, animationFillMode: 'both' }}
                >
                  <FeedCard event={event} />
                </div>
              ))}

              {hasMore && (
                <Button variant="ghost" onClick={() => setOffset(o => o + LIMIT)} loading={loading && offset > 0} className="w-full">
                  Load More
                </Button>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<div className="text-4xl">🔥</div>}
              title="Your feed is empty"
              description="Join a group and start solving problems to see what your peers are up to!"
              action={
                <div className="flex gap-3">
                  <Link href="/groups"><Button>Join a Group</Button></Link>
                  <Link href="/problems"><Button variant="secondary">Solve a Problem</Button></Link>
                </div>
              }
            />
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
