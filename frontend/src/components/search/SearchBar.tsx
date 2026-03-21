'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { problemsApi } from '@/lib/api';
import { Search, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { Problem } from '@/lib/types';

const RECENT_KEY = 'streaksy_recent_searches';
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(q: string) {
  const recent = getRecentSearches().filter(s => s !== q);
  recent.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-emerald-400 font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Problem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showRecent, setShowRecent] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Clear debounce timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Global "/" shortcut to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setShowRecent(false);
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const { data } = await problemsApi.search(value, 8);
        setResults(data.problems as Problem[]);
        setOpen(true);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, []);

  const handleSelect = useCallback((slug: string, title: string) => {
    saveRecentSearch(title);
    setOpen(false);
    setShowRecent(false);
    setQuery('');
    router.push(`/problems/${slug}`);
  }, [router]);

  const handleFocus = useCallback(() => {
    if (results.length > 0) {
      setOpen(true);
    } else if (query.trim().length < 2) {
      const recent = getRecentSearches();
      if (recent.length > 0) {
        setShowRecent(true);
      }
    }
  }, [results.length, query]);

  const handleRecentClick = useCallback((term: string) => {
    setShowRecent(false);
    handleChange(term);
    setQuery(term);
  }, [handleChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setShowRecent(false);
      inputRef.current?.blur();
      return;
    }

    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const p = results[activeIndex];
      handleSelect(p.slug, p.title);
    }
  }, [open, results, activeIndex, handleSelect]);

  const recentSearches = getRecentSearches();

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Search problems..."
          className="flex-1 max-w-md w-full rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-10 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 animate-spin" />
        ) : (
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center rounded border border-zinc-700 bg-zinc-800 px-1.5 text-[10px] font-mono text-zinc-500">
            /
          </kbd>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showRecent && !open && recentSearches.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[320px] rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden animate-fade-in">
          <p className="px-4 pt-2.5 pb-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">Recent</p>
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => handleRecentClick(term)}
              className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
              <span className="text-sm text-zinc-300 truncate">{term}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[320px] rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden animate-fade-in max-h-80 overflow-y-auto">
          {results.length === 0 && !loading ? (
            <p className="px-4 py-3 text-sm text-zinc-500">No results found</p>
          ) : (
            results.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.slug, p.title)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  i === activeIndex ? 'bg-emerald-500/10 text-white' : 'hover:bg-zinc-800/50'
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{highlightMatch(p.title, query)}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex gap-1 mt-0.5">
                      {p.tags.slice(0, 3).map(tag => (
                        <span key={tag.id} className="text-[10px] text-zinc-500">{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Badge variant={p.difficulty}>{p.difficulty}</Badge>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
