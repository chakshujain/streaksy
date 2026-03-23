'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { notificationsApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useRouter } from 'next/navigation';
import { Bell, Check, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/cn';
import type { Notification } from '@/lib/types';

function getNotificationLink(n: Notification): string | null {
  const { type, data } = n;
  switch (type) {
    case 'poke':
    case 'friend_request':
    case 'friend_accepted':
      return '/friends';
    case 'group_join':
    case 'group_activity':
      return data?.groupId ? `/groups/${data.groupId}` : '/groups';
    case 'room_join':
    case 'room_start':
    case 'room_end':
    case 'room_solve':
      return data?.roomId ? `/rooms/${data.roomId}` : '/rooms';
    case 'badge_earned':
    case 'streak_milestone':
      return '/achievements';
    case 'roadmap_complete':
    case 'roadmap_started':
    case 'roadmap_streak':
    case 'roadmap_reminder':
      return data?.roadmapId ? `/roadmaps/${data.roadmapId}` : '/roadmaps';
    case 'lagging_behind':
    case 'friend_solving':
    case 'inactivity_warning':
      return '/dashboard';
    default:
      return '/notifications';
  }
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchUnread = async () => {
    try {
      const { data } = await notificationsApi.unreadCount();
      setUnreadCount(data.count);
    } catch {}
  };

  const fetchList = async () => {
    try {
      const { data } = await notificationsApi.list({ limit: 10 });
      setNotifications(data.notifications);
    } catch {}
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real-time notifications via WebSocket
  useEffect(() => {
    try {
      const socket = getSocket();
      if (!socket.connected) socket.connect();

      socket.on('notification', () => {
        // Increment unread count and refresh the list
        setUnreadCount(prev => prev + 1);
        fetchList();
      });

      return () => {
        socket.off('notification');
      };
    } catch {}
  }, []);

  useEffect(() => {
    if (open) fetchList();
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    const prevCount = unreadCount;
    const prevNotifications = notifications;
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      setUnreadCount(prevCount);
      setNotifications(prevNotifications);
    }
  };

  const markRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(notifications.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch {
      // Silently handle
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-[80vh] rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <span className="text-sm font-semibold text-zinc-200">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300">
                <Check className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">No notifications</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.read_at) markRead(n.id);
                    const link = getNotificationLink(n);
                    if (link) {
                      setOpen(false);
                      router.push(link);
                    }
                  }}
                  className={cn(
                    'w-full px-4 py-3 text-left border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30',
                    !n.read_at && 'bg-emerald-500/5'
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!n.read_at && <div className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{n.title}</p>
                      {n.body && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-zinc-600 mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 border-t border-zinc-800 px-4 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200"
          >
            View all notifications
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
