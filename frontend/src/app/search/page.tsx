'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageTransition } from '@/components/ui/PageTransition';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import { Search, X, Clock, ArrowRight, BookOpen, Map, GraduationCap, Puzzle, Sparkles } from 'lucide-react';
import { roadmapTemplates } from '@/lib/roadmap-templates';
import { topics } from '@/lib/learn-data';
import { patterns } from '@/lib/patterns-data';
import { problemsApi } from '@/lib/api';
import type { Problem } from '@/lib/types';

// ── Types ──

type SearchCategory = 'all' | 'problems' | 'roadmaps' | 'learn' | 'patterns';

interface SearchResult {
  type: 'problem' | 'roadmap' | 'learn' | 'pattern';
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

const RECENT_KEY = 'streaksy_recent_searches';
const MAX_RECENT = 10;

const categoryTabs: { key: SearchCategory; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All', icon: Sparkles },
  { key: 'problems', label: 'Problems', icon: BookOpen },
  { key: 'roadmaps', label: 'Roadmaps', icon: Map },
  { key: 'learn', label: 'Learn', icon: GraduationCap },
  { key: 'patterns', label: 'Patterns', icon: Puzzle },
];

const difficultyColor: Record<string, string> = {
  easy: 'text-emerald-400 bg-emerald-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  hard: 'text-red-400 bg-red-500/10',
  beginner: 'text-emerald-400 bg-emerald-500/10',
  intermediate: 'text-amber-400 bg-amber-500/10',
  advanced: 'text-red-400 bg-red-500/10',
};

// ── Helpers ──

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  const recent = getRecentSearches().filter((s) => s !== query);
  recent.unshift(query);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RECENT_KEY);
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-emerald-400 font-semibold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

// ── Build static results ──

function buildLearnResults(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const topic of topics) {
    for (const lesson of topic.lessons) {
      results.push({
        type: 'learn',
        title: lesson.title,
        subtitle: `${topic.name} · ${lesson.duration}`,
        href: `/learn/${topic.slug}/${lesson.slug}`,
        icon: lesson.icon,
        badge: lesson.difficulty,
        badgeColor: difficultyColor[lesson.difficulty],
      });
    }
  }
  return results;
}

function buildRoadmapResults(): SearchResult[] {
  return roadmapTemplates.map((t) => ({
    type: 'roadmap' as const,
    title: t.name,
    subtitle: `${t.category} · ${t.duration} days`,
    href: `/roadmaps/start/${t.slug}`,
    icon: t.icon,
    badge: t.difficulty,
    badgeColor: difficultyColor[t.difficulty],
  }));
}

function buildPatternResults(): SearchResult[] {
  return patterns.map((p) => ({
    type: 'pattern' as const,
    title: p.name,
    subtitle: p.category,
    href: `/patterns/${p.slug}`,
    icon: p.icon,
    badge: 'pattern',
    badgeColor: 'text-purple-400 bg-purple-500/10',
  }));
}

const staticLearn = buildLearnResults();
const staticRoadmaps = buildRoadmapResults();
const staticPatterns = buildPatternResults();

// ── Component ──

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [, setProblemsLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Autofocus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) {
        saveRecentSearch(query.trim());
        setRecentSearches(getRecentSearches());
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Load problems once
  useEffect(() => {
    let cancelled = false;
    problemsApi
      .list({ limit: 1000 })
      .then((r) => {
        if (!cancelled) {
          setProblems(r.data.problems || []);
          setProblemsLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setProblemsLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  // Build problem results
  const problemResults = useMemo<SearchResult[]>(() => {
    return problems.map((p) => ({
      type: 'problem' as const,
      title: p.title,
      subtitle: p.tags?.map((t) => t.name).join(', ') || 'Problem',
      href: `/problems/${p.slug}`,
      icon: '📝',
      badge: p.difficulty,
      badgeColor: difficultyColor[p.difficulty],
    }));
  }, [problems]);

  // Filter results
  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return [];

    const filter = (items: SearchResult[]) =>
      items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q)
      );

    if (category === 'problems') return filter(problemResults);
    if (category === 'roadmaps') return filter(staticRoadmaps);
    if (category === 'learn') return filter(staticLearn);
    if (category === 'patterns') return filter(staticPatterns);

    // "All" tab — combine and limit per category
    const p = filter(problemResults).slice(0, 5);
    const r = filter(staticRoadmaps).slice(0, 5);
    const l = filter(staticLearn).slice(0, 5);
    const pat = filter(staticPatterns).slice(0, 5);
    return [...p, ...r, ...l, ...pat];
  }, [debouncedQuery, category, problemResults]);

  // Group results by type for "all" tab
  const groupedResults = useMemo(() => {
    if (category !== 'all') return null;
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    }
    return groups;
  }, [results, category]);

  const typeLabels: Record<string, string> = {
    problem: 'Problems',
    roadmap: 'Roadmaps',
    learn: 'Learn',
    pattern: 'Patterns',
  };

  const typeIcons: Record<string, React.ElementType> = {
    problem: BookOpen,
    roadmap: Map,
    learn: GraduationCap,
    pattern: Puzzle,
  };

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const suggestions = [
    'Two Pointers',
    'Binary Search',
    'System Design',
    'Databases',
    'Learn OOP',
    '100 Days of Code',
  ];

  const showEmpty = debouncedQuery.trim() && results.length === 0;
  const showRecent = !debouncedQuery.trim() && recentSearches.length > 0;
  const showSuggestions = !debouncedQuery.trim() && recentSearches.length === 0;

  return (
    <AppShell>
      <PageTransition>
        <div className="mx-auto max-w-3xl px-4 py-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-zinc-100 mb-6">Search</h1>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problems, roadmaps, lessons, patterns..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 py-4 pl-14 pr-12 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 backdrop-blur-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {categoryTabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200',
                  category === key
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800/40 hover:text-zinc-300 hover:border-zinc-700'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Recent Searches */}
          {showRecent && (
            <Card className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </h3>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700/60 hover:text-zinc-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Suggestions (when no recent searches and no query) */}
          {showSuggestions && (
            <Card className="mb-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Try searching for
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700/60 hover:text-zinc-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Results */}
          {debouncedQuery.trim() && results.length > 0 && (
            <div className="space-y-4">
              {category === 'all' && groupedResults ? (
                // Grouped view
                Object.entries(groupedResults).map(([type, items]) => {
                  const TypeIcon = typeIcons[type] || BookOpen;
                  return (
                    <div key={type}>
                      <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <TypeIcon className="h-4 w-4" />
                        {typeLabels[type] || type}
                      </h3>
                      <Card padding={false} className="divide-y divide-zinc-800/50">
                        {items.map((item) => (
                          <ResultRow key={item.href} item={item} query={debouncedQuery} />
                        ))}
                      </Card>
                    </div>
                  );
                })
              ) : (
                // Flat list for specific category
                <Card padding={false} className="divide-y divide-zinc-800/50">
                  {results.map((item) => (
                    <ResultRow key={item.href} item={item} query={debouncedQuery} />
                  ))}
                </Card>
              )}
            </div>
          )}

          {/* Empty State */}
          {showEmpty && (
            <Card className="text-center py-12">
              <Search className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg mb-2">
                No results for &ldquo;{debouncedQuery}&rdquo;
              </p>
              <p className="text-zinc-600 text-sm">
                Try a different search term or browse by category
              </p>
            </Card>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}

// ── Result Row ──

function ResultRow({ item, query }: { item: SearchResult; query: string }) {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors group"
    >
      <span className="text-lg flex-shrink-0">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">
          {highlightMatch(item.title, query)}
        </p>
        <p className="text-xs text-zinc-500 truncate mt-0.5">
          {highlightMatch(item.subtitle, query)}
        </p>
      </div>
      {item.badge && (
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize flex-shrink-0',
            item.badgeColor || 'text-zinc-400 bg-zinc-800'
          )}
        >
          {item.badge}
        </span>
      )}
      <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
    </Link>
  );
}
