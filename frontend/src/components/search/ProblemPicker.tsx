'use client';

import { useState, useRef, useEffect } from 'react';
import { problemsApi } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Problem } from '@/lib/types';

interface ProblemPickerProps {
  onSelect: (problem: Problem) => void;
  selectedProblems?: Problem[];
  multiple?: boolean;
  placeholder?: string;
  className?: string;
}

export function ProblemPicker({ onSelect, selectedProblems = [], multiple = false, placeholder, className }: ProblemPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Problem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const { data } = await problemsApi.search(value, 10);
        const filtered = (data.problems as Problem[]).filter(
          (p) => !selectedProblems.some(sp => sp.id === p.id)
        );
        setResults(filtered);
        setOpen(true);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 250);
  };

  const handleSelect = (problem: Problem) => {
    onSelect(problem);
    if (!multiple) {
      setQuery(problem.title);
      setOpen(false);
    } else {
      setQuery('');
      inputRef.current?.focus();
    }
    setResults([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder || 'Search problems...'}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-8 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 animate-spin" />}
        {query && !loading && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Selected pills for multiple mode */}
      {multiple && selectedProblems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedProblems.map(p => (
            <span key={p.id} className="inline-flex items-center gap-1 rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300">
              {p.title}
              <button onClick={() => onSelect(p)} className="text-zinc-500 hover:text-red-400">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden animate-fade-in max-h-64 overflow-y-auto">
          {results.length === 0 && query.length >= 2 && !loading ? (
            <p className="px-4 py-3 text-sm text-zinc-500">No problems found</p>
          ) : (
            results.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors',
                  i === activeIndex ? 'bg-emerald-500/10 text-white' : 'hover:bg-zinc-800/50 text-zinc-200'
                )}
              >
                <span className="text-sm truncate flex-1">{p.title}</span>
                <Badge variant={p.difficulty}>{p.difficulty}</Badge>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
