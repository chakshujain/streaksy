'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { problemsApi } from '@/lib/api';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Problem } from '@/lib/types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Problem[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const { data } = await problemsApi.search(value, 8);
        setResults(data.problems);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
  };

  const handleSelect = (slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/problems/${slug}`);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search problems..."
          className="w-64 rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          onFocus={() => results.length > 0 && setOpen(true)}
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[320px] rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden animate-slide-up">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.slug)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200 truncate">{p.title}</p>
              </div>
              <Badge variant={p.difficulty}>{p.difficulty}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
