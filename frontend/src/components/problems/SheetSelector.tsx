'use client';

import { cn } from '@/lib/cn';
import type { Sheet } from '@/lib/types';

interface SheetSelectorProps {
  sheets: Sheet[];
  selected: string;
  onSelect: (slug: string) => void;
}

export function SheetSelector({ sheets, selected, onSelect }: SheetSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
          selected === 'all'
            ? 'bg-emerald-600 text-white'
            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
        )}
      >
        All Problems
      </button>
      {sheets.map((sheet) => (
        <button
          key={sheet.slug}
          onClick={() => onSelect(sheet.slug)}
          className={cn(
            'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            selected === sheet.slug
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          )}
        >
          {sheet.name}
        </button>
      ))}
    </div>
  );
}
