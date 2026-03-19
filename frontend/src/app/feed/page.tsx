'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/ui/PageTransition';
import { FeedCard } from '@/components/feed/FeedCard';
import { useAsync } from '@/hooks/useAsync';
import { feedApi } from '@/lib/api';
import { Rss } from 'lucide-react';
import type { FeedEvent } from '@/lib/types';

export default function FeedPage() {
  const [allEvents, setAllEvents] = useState<FeedEvent[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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
    [offset]
  );

  return (
    <AppShell>
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3 animate-slide-up" style={{ animationFillMode: 'both' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/10">
              <Rss className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Activity Feed</h1>
              <p className="text-sm text-zinc-500">See what your peers are up to</p>
            </div>
          </div>

          {loading && offset === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : allEvents.length > 0 ? (
            <div className="space-y-4">
              {allEvents.map((event, i) => (
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
              icon={<Rss className="h-10 w-10" />}
              title="No activity yet"
              description="Join a group and start solving problems to see your feed come alive!"
            />
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
