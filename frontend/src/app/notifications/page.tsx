'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/ui/PageTransition';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { notificationsApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns';
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Map,
  Users,
  Zap,
  Award,
  Info,
  Swords,
  Flame,
} from 'lucide-react';
import type { Notification } from '@/lib/types';

type FilterType = 'all' | 'roadmap' | 'group' | 'poke' | 'badge' | 'system';

const FILTER_TABS: { key: FilterType; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Bell className="h-3.5 w-3.5" /> },
  { key: 'roadmap', label: 'Roadmap', icon: <Map className="h-3.5 w-3.5" /> },
  { key: 'group', label: 'Group', icon: <Users className="h-3.5 w-3.5" /> },
  { key: 'poke', label: 'Poke', icon: <Zap className="h-3.5 w-3.5" /> },
  { key: 'badge', label: 'Badge', icon: <Award className="h-3.5 w-3.5" /> },
  { key: 'system', label: 'System', icon: <Info className="h-3.5 w-3.5" /> },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case 'roadmap':
    case 'roadmap_complete':
    case 'roadmap_streak':
      return <Map className="h-5 w-5 text-cyan-400" />;
    case 'group':
    case 'group_join':
    case 'group_activity':
      return <Users className="h-5 w-5 text-blue-400" />;
    case 'poke':
    case 'recovery_challenge':
    case 'recovery_complete':
      return <Zap className="h-5 w-5 text-yellow-400" />;
    case 'badge':
    case 'badge_earned':
      return <Award className="h-5 w-5 text-purple-400" />;
    case 'room_join':
    case 'room_start':
    case 'room_end':
    case 'room_solve':
      return <Swords className="h-5 w-5 text-orange-400" />;
    case 'streak':
    case 'streak_milestone':
      return <Flame className="h-5 w-5 text-emerald-400" />;
    default:
      return <Bell className="h-5 w-5 text-zinc-400" />;
  }
}

function getNotificationFilterCategory(type: string): FilterType {
  if (['roadmap', 'roadmap_complete', 'roadmap_streak'].includes(type)) return 'roadmap';
  if (['group', 'group_join', 'group_activity'].includes(type)) return 'group';
  if (['poke', 'recovery_challenge', 'recovery_complete'].includes(type)) return 'poke';
  if (['badge', 'badge_earned'].includes(type)) return 'badge';
  if (['room_join', 'room_start', 'room_end', 'room_solve', 'streak', 'streak_milestone'].includes(type)) return 'system';
  return 'system';
}

function getNotificationLink(n: Notification): string | null {
  const data = n.data || {};
  if (data.roomId) return `/rooms/${data.roomId}`;
  if (data.roadmapId) return `/roadmaps/${data.roadmapId}`;
  if (data.groupId) return `/groups/${data.groupId}`;
  if (data.problemSlug) return `/problems/${data.problemSlug}`;
  return null;
}

interface DateGroup {
  label: string;
  notifications: Notification[];
}

function groupByDate(notifications: Notification[]): DateGroup[] {
  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: [],
  };

  for (const n of notifications) {
    const date = new Date(n.created_at);
    if (isToday(date)) groups['Today'].push(n);
    else if (isYesterday(date)) groups['Yesterday'].push(n);
    else if (isThisWeek(date)) groups['This Week'].push(n);
    else groups['Older'].push(n);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, notifications]) => ({ label, notifications }));
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 50;

  const { loading } = useAsync(
    () =>
      notificationsApi.list({ limit: LIMIT, offset }).then((r) => {
        const items = (r.data.notifications ?? []) as Notification[];
        if (offset === 0) {
          setNotifications(items);
        } else {
          setNotifications((prev) => [...prev, ...items]);
        }
        setHasMore(items.length === LIMIT);
        return items;
      }),
    [offset]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read_at).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((n) => getNotificationFilterCategory(n.type) === filter);
  }, [notifications, filter]);

  const dateGroups = useMemo(() => groupByDate(filteredNotifications), [filteredNotifications]);

  const markRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: n.read_at || new Date().toISOString() } : n))
      );
      try {
        await notificationsApi.markRead(id);
      } catch {
        // revert on error
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read_at: null } : n))
        );
      }
    },
    []
  );

  const markAllRead = useCallback(async () => {
    const prev = notifications;
    setNotifications((ns) => ns.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      setNotifications(prev);
    }
  }, [notifications]);

  const handleNotificationClick = useCallback(
    (n: Notification) => {
      if (!n.read_at) markRead(n.id);
    },
    [markRead]
  );

  return (
    <AppShell>
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Bell className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">Notifications</h1>
                <p className="text-sm text-zinc-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                    : 'All caught up'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-zinc-800 hover:text-emerald-300"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                  filter === tab.key
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:bg-zinc-800/50'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification List */}
          {loading && notifications.length === 0 ? (
            <Card>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card>
              <EmptyState
                icon={<BellOff className="h-12 w-12" />}
                title={filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                description={
                  filter === 'all'
                    ? "When something happens, you'll see it here."
                    : 'Try selecting a different filter.'
                }
              />
            </Card>
          ) : (
            <div className="space-y-6">
              {dateGroups.map((group) => (
                <div key={group.label} className="animate-slide-up">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {group.label}
                  </h3>
                  <Card padding={false}>
                    <div className="divide-y divide-zinc-800/50">
                      {group.notifications.map((n) => {
                        const link = getNotificationLink(n);
                        const content = (
                          <div
                            className={cn(
                              'flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-zinc-800/30',
                              !n.read_at && 'bg-emerald-500/5'
                            )}
                          >
                            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800/50">
                              {getNotificationIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={cn(
                                    'text-sm font-medium',
                                    n.read_at ? 'text-zinc-400' : 'text-zinc-200'
                                  )}
                                >
                                  {n.title}
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {!n.read_at && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        markRead(n.id);
                                      }}
                                      className="rounded p-1 text-zinc-600 transition-colors hover:bg-zinc-700 hover:text-zinc-300"
                                      title="Mark as read"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                  {!n.read_at && (
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                  )}
                                </div>
                              </div>
                              {n.body && (
                                <p
                                  className={cn(
                                    'mt-0.5 text-xs line-clamp-2',
                                    n.read_at ? 'text-zinc-600' : 'text-zinc-500'
                                  )}
                                >
                                  {n.body}
                                </p>
                              )}
                              <p className="mt-1 text-[10px] text-zinc-600">
                                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        );

                        return link ? (
                          <Link
                            key={n.id}
                            href={link}
                            onClick={() => handleNotificationClick(n)}
                            className="block"
                          >
                            {content}
                          </Link>
                        ) : (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className="cursor-default"
                          >
                            {content}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setOffset((prev) => prev + LIMIT)}
                    disabled={loading}
                    className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-50"
                  >
                    {loading ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
