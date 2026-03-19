'use client';

import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface HelpTooltipProps {
  id: string;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const posClasses: Record<string, string> = {
  top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  right: 'left-full ml-2 top-1/2 -translate-y-1/2',
};

export function HelpTooltip({ id, text, position = 'top' }: HelpTooltipProps) {
  const storageKey = `streaksy_help_${id}`;
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !!localStorage.getItem(storageKey);
  });
  const [hover, setHover] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        onClick={() => {
          localStorage.setItem(storageKey, 'true');
          setDismissed(true);
        }}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 animate-pulse hover:animate-none transition-all"
      >
        <HelpCircle className="h-3 w-3" />
      </button>
      {hover && (
        <div
          className={cn(
            'absolute z-50 w-48 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-xs text-zinc-300 shadow-lg animate-fade-in',
            posClasses[position]
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
}
