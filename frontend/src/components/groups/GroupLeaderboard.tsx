'use client';

import { Card } from '@/components/ui/Card';
import { Trophy, Flame } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PokeButton } from '@/components/poke/PokeButton';
import type { LeaderboardEntry } from '@/lib/types';
import Link from 'next/link';

interface GroupLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  groupId?: string;
}

export function GroupLeaderboard({ entries, currentUserId, groupId }: GroupLeaderboardProps) {
  return (
    <Card padding={false}>
      <div className="border-b border-zinc-800 px-6 py-4">
        <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Trophy className="h-4 w-4 text-amber-400" />
          Leaderboard
        </h3>
      </div>
      <div className="divide-y divide-zinc-800/50">
        {entries.map((entry, i) => (
          <div
            key={entry.userId}
            className={cn(
              'flex items-center gap-4 px-6 py-3.5 transition-colors',
              entry.userId === currentUserId && 'bg-emerald-500/5'
            )}
          >
            {/* Rank */}
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                i === 0 && 'bg-amber-500/20 text-amber-400',
                i === 1 && 'bg-zinc-400/20 text-zinc-300',
                i === 2 && 'bg-orange-500/20 text-orange-400',
                i > 2 && 'text-zinc-500'
              )}
            >
              {i + 1}
            </span>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <Link href={`/user/${entry.userId}`} className={cn(
                'truncate text-sm font-medium block hover:text-emerald-400 transition-colors',
                entry.userId === currentUserId ? 'text-emerald-400' : 'text-zinc-200'
              )}>
                {entry.displayName}
                {entry.userId === currentUserId && (
                  <span className="ml-2 text-xs text-zinc-500">(you)</span>
                )}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-zinc-400">
                {entry.solvedCount} solved
              </span>
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="h-3 w-3" />
                {entry.currentStreak}
              </span>
            </div>

            {/* Poke */}
            {currentUserId && entry.userId !== currentUserId && (
              <PokeButton
                toUserId={entry.userId}
                toName={entry.displayName}
                groupId={groupId}
              />
            )}

            {/* Score */}
            <span className="w-16 text-right text-sm font-bold text-zinc-300">
              {entry.score}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
