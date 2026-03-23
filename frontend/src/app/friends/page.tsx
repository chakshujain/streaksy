'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { friendsApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  UserPlus,
  Users,
  Search,
  Check,
  X,
  UserMinus,
  Flame,
  Clock,
  Send,
  Inbox,
  Map,
} from 'lucide-react';

type Tab = 'friends' | 'requests' | 'find';

interface Friend {
  friendship_id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  current_streak: number;
  total_points: number;
  last_active: string | null;
  shared_groups?: { id: string; name: string }[];
  active_roadmaps?: { id: string; name: string; template_slug: string | null }[];
  active_rooms?: { id: string; name: string; code: string; status: string }[];
}

interface SearchResult {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  friendship_status: string | null;
  friendship_id: string | null;
}

function Avatar({ name, url, size = 'md' }: { name: string; url: string | null; size?: 'sm' | 'md' }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';
  const sizeClass = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm';

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={cn(sizeClass, 'flex-shrink-0 rounded-full object-cover border border-emerald-500/20')}
      />
    );
  }
  return (
    <div
      className={cn(
        sizeClass,
        'flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 font-semibold text-emerald-400'
      )}
    >
      {initials}
    </div>
  );
}

export default function FriendsPage() {
  const [tab, setTab] = useState<Tab>('friends');

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: 'friends', label: 'Friends', icon: Users },
    { key: 'requests', label: 'Requests', icon: Inbox },
    { key: 'find', label: 'Find Friends', icon: Search },
  ];

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-6">
          {/* Page Header */}
          <div
            className="flex items-start justify-between animate-slide-up"
            style={{ animationDelay: '0ms', animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/10 glow-sm">
                <UserPlus className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Friends</h1>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Connect with friends and crush goals together
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-1 animate-slide-up"
            style={{ animationDelay: '50ms', animationFillMode: 'both' }}
          >
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex-1 justify-center',
                  tab === key
                    ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            {tab === 'friends' && <FriendsTab />}
            {tab === 'requests' && <RequestsTab />}
            {tab === 'find' && <FindFriendsTab />}
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}

function FriendsTab() {
  const { data: friends, loading, refetch } = useAsync<Friend[]>(
    () => friendsApi.listEnriched().then((r) => r.data.friends),
    []
  );
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (friendshipId: string) => {
    setRemoving(friendshipId);
    try {
      await friendsApi.remove(friendshipId);
      refetch();
    } catch {
      // ignore
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <div className="glass rounded-2xl border border-zinc-800/50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/10">
          <Users className="h-8 w-8 text-blue-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-300 mb-1">No friends yet</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Search for users and send them friend requests to start collaborating.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map((friend, i) => (
        <div
          key={friend.friendship_id}
          className="glass rounded-xl border border-zinc-800/50 p-4 flex items-center gap-4 animate-slide-up"
          style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
        >
          <Avatar name={friend.display_name} url={friend.avatar_url} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-zinc-200 truncate">{friend.display_name}</p>
            {friend.bio && (
              <p className="text-xs text-zinc-500 truncate mt-0.5">{friend.bio}</p>
            )}
            <div className="flex items-center gap-3 mt-1">
              {friend.current_streak > 0 && (
                <span className="flex items-center gap-1 text-xs text-orange-400">
                  <Flame className="h-3 w-3" />
                  {friend.current_streak} day streak
                </span>
              )}
              <span className="text-xs text-zinc-600">
                {friend.total_points} pts
              </span>
            </div>
            {((friend.shared_groups?.length ?? 0) > 0 || (friend.active_roadmaps?.length ?? 0) > 0 || (friend.active_rooms?.length ?? 0) > 0) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {friend.shared_groups?.map(g => (
                  <Link key={g.id} href={`/groups/${g.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400 hover:bg-purple-500/20 transition-colors">
                    <Users className="h-2.5 w-2.5" /> {g.name}
                  </Link>
                ))}
                {friend.active_roadmaps?.map(r => (
                  <Link key={r.id} href={`/roadmaps/${r.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                    <Map className="h-2.5 w-2.5" /> {r.name}
                  </Link>
                ))}
                {friend.active_rooms?.map(r => (
                  <Link key={r.id} href={`/rooms/${r.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    {r.name} · Join
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemove(friend.friendship_id)}
            loading={removing === friend.friendship_id}
            className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function RequestsTab() {
  const { data, loading, refetch } = useAsync<{ incoming: Friend[]; outgoing: Friend[] }>(
    () => friendsApi.requests().then((r) => r.data),
    []
  );
  const [acting, setActing] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    setActing(id);
    try {
      await friendsApi.accept(id);
      refetch();
    } catch {
      // ignore
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (id: string) => {
    setActing(id);
    try {
      await friendsApi.reject(id);
      refetch();
    } catch {
      // ignore
    } finally {
      setActing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  const incoming = data?.incoming ?? [];
  const outgoing = data?.outgoing ?? [];

  if (incoming.length === 0 && outgoing.length === 0) {
    return (
      <div className="glass rounded-2xl border border-zinc-800/50 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/10">
          <Inbox className="h-8 w-8 text-amber-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-300 mb-1">No pending requests</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Friend requests you receive or send will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {incoming.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400 flex items-center gap-2 px-1">
            <Inbox className="h-4 w-4" />
            Incoming Requests ({incoming.length})
          </h3>
          {incoming.map((req, i) => (
            <div
              key={req.friendship_id}
              className="glass rounded-xl border border-emerald-500/10 p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              <Avatar name={req.display_name} url={req.avatar_url} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-200 truncate">{req.display_name}</p>
                {req.bio && (
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{req.bio}</p>
                )}
                <p className="text-xs text-zinc-600 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Sent you a request
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAccept(req.friendship_id)}
                  loading={acting === req.friendship_id}
                  className="gap-1.5 rounded-xl"
                >
                  <Check className="h-3.5 w-3.5" />
                  Accept
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReject(req.friendship_id)}
                  disabled={acting === req.friendship_id}
                  className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {outgoing.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400 flex items-center gap-2 px-1">
            <Send className="h-4 w-4" />
            Sent Requests ({outgoing.length})
          </h3>
          {outgoing.map((req, i) => (
            <div
              key={req.friendship_id}
              className="glass rounded-xl border border-zinc-800/50 p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              <Avatar name={req.display_name} url={req.avatar_url} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-200 truncate">{req.display_name}</p>
                {req.bio && (
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{req.bio}</p>
                )}
                <p className="text-xs text-zinc-600 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReject(req.friendship_id)}
                loading={acting === req.friendship_id}
                className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl"
                title="Cancel request"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FindFriendsTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(async () => {
    if (query.trim().length < 2) return;
    setSearching(true);
    try {
      const res = await friendsApi.search(query.trim());
      setResults(res.data.users);
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  }, [query]);

  const handleSend = async (userId: string) => {
    setSending(userId);
    try {
      await friendsApi.sendRequest(userId);
      setSent((prev) => new Set(prev).add(userId));
    } catch {
      // ignore
    } finally {
      setSending(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="friend-search"
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-xl"
          />
        </div>
        <Button
          onClick={handleSearch}
          loading={searching}
          disabled={query.trim().length < 2}
          className="gap-1.5 rounded-xl"
        >
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {results.length > 0 ? (
        <div className="space-y-2">
          {results.map((user, i) => {
            const isFriend = user.friendship_status === 'accepted';
            const isPending = user.friendship_status === 'pending' || sent.has(user.id);

            return (
              <div
                key={user.id}
                className="glass rounded-xl border border-zinc-800/50 p-4 flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
              >
                <Avatar name={user.display_name} url={user.avatar_url} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-200 truncate">{user.display_name}</p>
                  {user.bio && (
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{user.bio}</p>
                  )}
                </div>
                {isFriend ? (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10">
                    <Check className="h-3 w-3" />
                    Friends
                  </span>
                ) : isPending ? (
                  <span className="text-xs text-amber-400 font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10">
                    <Clock className="h-3 w-3" />
                    Pending
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleSend(user.id)}
                    loading={sending === user.id}
                    className="gap-1.5 rounded-xl"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : query.trim().length >= 2 && !searching ? (
        <div className="glass rounded-2xl border border-zinc-800/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-500/10 to-zinc-400/10 border border-zinc-500/10">
            <Search className="h-8 w-8 text-zinc-500/60" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-1">No users found</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Try searching with a different name.
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-zinc-800/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/10">
            <Search className="h-8 w-8 text-blue-400/60" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-300 mb-1">Find friends</h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            Search for users by their display name to send friend requests.
          </p>
        </div>
      )}
    </div>
  );
}
