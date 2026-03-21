'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useBookmarks, type Bookmark } from '@/hooks/useBookmarks';
import { cn } from '@/lib/cn';
import {
  Bookmark as BookmarkIcon,
  BookOpen,
  GraduationCap,
  Puzzle,
  Map,
  Search,
  Trash2,
  X,
} from 'lucide-react';

const typeConfig: Record<Bookmark['type'], { label: string; icon: React.ElementType; color: string; badgeBg: string }> = {
  problem: { label: 'Problems', icon: BookOpen, color: 'text-blue-400', badgeBg: 'bg-blue-500/10 text-blue-400' },
  lesson: { label: 'Lessons', icon: GraduationCap, color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-400' },
  pattern: { label: 'Patterns', icon: Puzzle, color: 'text-purple-400', badgeBg: 'bg-purple-500/10 text-purple-400' },
  roadmap: { label: 'Roadmaps', icon: Map, color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-400' },
};

const typeOrder: Bookmark['type'][] = ['problem', 'lesson', 'pattern', 'roadmap'];

function getBookmarkHref(bookmark: Bookmark): string {
  switch (bookmark.type) {
    case 'problem':
      return `/problems/${bookmark.slug}`;
    case 'lesson':
      return bookmark.topicSlug
        ? `/learn/${bookmark.topicSlug}/${bookmark.slug}`
        : `/learn`;
    case 'pattern':
      return `/patterns/${bookmark.slug}`;
    case 'roadmap':
      return `/roadmaps/${bookmark.slug}`;
    default:
      return '/';
  }
}

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Bookmark['type'] | 'all'>('all');

  const filtered = useMemo(() => {
    let items = bookmarks;
    if (activeFilter !== 'all') {
      items = items.filter((b) => b.type === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (b) => b.title.toLowerCase().includes(q) || b.type.includes(q)
      );
    }
    return items;
  }, [bookmarks, search, activeFilter]);

  const grouped = useMemo(() => {
    const map = new Map<Bookmark['type'], Bookmark[]>();
    for (const b of filtered) {
      const list = map.get(b.type) || [];
      list.push(b);
      map.set(b.type, list);
    }
    return map;
  }, [filtered]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of bookmarks) {
      counts[b.type] = (counts[b.type] || 0) + 1;
    }
    return counts;
  }, [bookmarks]);

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <BookmarkIcon className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Bookmarks</h1>
              <p className="text-sm text-zinc-500">
                {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        {bookmarks.length > 0 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  activeFilter === 'all'
                    ? 'bg-zinc-700 text-zinc-200'
                    : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                )}
              >
                All ({bookmarks.length})
              </button>
              {typeOrder.map((type) => {
                const count = typeCounts[type] || 0;
                if (count === 0) return null;
                const cfg = typeConfig[type];
                return (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                      activeFilter === type
                        ? 'bg-zinc-700 text-zinc-200'
                        : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    {cfg.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bookmarks grouped by type */}
        {bookmarks.length === 0 ? (
          <Card>
            <EmptyState
              icon={<BookmarkIcon className="h-12 w-12" />}
              title="No bookmarks yet"
              description="Bookmark problems, lessons, and patterns for quick access later."
              action={
                <Link
                  href="/problems"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  Browse Problems
                </Link>
              }
            />
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Search className="h-10 w-10" />}
              title="No results"
              description="Try a different search or filter."
            />
          </Card>
        ) : (
          <div className="space-y-8">
            {typeOrder.map((type) => {
              const items = grouped.get(type);
              if (!items || items.length === 0) return null;
              const cfg = typeConfig[type];
              const Icon = cfg.icon;

              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={cn('h-4 w-4', cfg.color)} />
                    <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
                      {cfg.label}
                    </h2>
                    <span className="text-xs text-zinc-600">({items.length})</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {items.map((bookmark) => (
                      <Card key={bookmark.id} className="group relative">
                        <Link
                          href={getBookmarkHref(bookmark)}
                          className="block"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">
                                {bookmark.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', cfg.badgeBg)}>
                                  {cfg.label.slice(0, -1)}
                                </span>
                                {bookmark.difficulty && (
                                  <Badge variant={bookmark.difficulty}>{bookmark.difficulty}</Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-600 mt-1.5">
                                Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all"
                          title="Remove bookmark"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
