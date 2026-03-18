'use client';

import { cn } from '@/lib/cn';

interface ProblemFiltersProps {
  difficulty: string;
  onDifficultyChange: (d: string) => void;
  tag: string;
  onTagChange: (t: string) => void;
  availableTags: string[];
}

const difficulties = ['all', 'easy', 'medium', 'hard'];

export function ProblemFilters({
  difficulty,
  onDifficultyChange,
  tag,
  onTagChange,
  availableTags,
}: ProblemFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Difficulty pills */}
      <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => onDifficultyChange(d)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
              difficulty === d
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Tag select */}
      {availableTags.length > 0 && (
        <select
          value={tag}
          onChange={(e) => onTagChange(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">All tags</option>
          {availableTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
