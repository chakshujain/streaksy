'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { RevisionNote } from '@/lib/types';
import { revisionApi } from '@/lib/api';
import { Eye, Check, RotateCcw, ChevronRight } from 'lucide-react';

interface RevisionQuizProps {
  cards: RevisionNote[];
  onComplete: () => void;
}

export function RevisionQuiz({ cards, onComplete }: RevisionQuizProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (cards.length === 0) return null;

  const card = cards[index];
  const isLast = index === cards.length - 1;

  const handleNext = async (gotIt: boolean) => {
    if (gotIt) {
      revisionApi.markRevised(card.id).catch(() => {});
    }
    setRevealed(false);
    if (isLast) {
      onComplete();
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500">{index + 1}/{cards.length}</span>
      </div>

      {/* Card */}
      <Card className="min-h-[300px] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">{card.problem_title}</h2>
          {card.problem_difficulty && (
            <Badge variant={card.problem_difficulty as 'easy' | 'medium' | 'hard'}>
              {card.problem_difficulty}
            </Badge>
          )}
        </div>

        <p className="text-sm text-zinc-400 mb-4">
          Try to recall the key takeaway, approach, and complexity for this problem.
        </p>

        {revealed ? (
          <div className="flex-1 space-y-4 animate-slide-up">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Key Takeaway</p>
              <p className="text-sm text-zinc-200">{card.key_takeaway}</p>
            </div>
            {card.approach && (
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Approach</p>
                <p className="text-sm text-zinc-200">{card.approach}</p>
              </div>
            )}
            <div className="flex gap-6">
              {card.time_complexity && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Time</p>
                  <p className="text-sm text-emerald-400">{card.time_complexity}</p>
                </div>
              )}
              {card.space_complexity && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Space</p>
                  <p className="text-sm text-cyan-400">{card.space_complexity}</p>
                </div>
              )}
            </div>
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {card.tags.map((t) => (
                  <span key={t} className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">{t}</span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Button onClick={() => setRevealed(true)} variant="secondary" className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> Reveal Answer
            </Button>
          </div>
        )}

        {revealed && (
          <div className="flex justify-between mt-6 pt-4 border-t border-zinc-800">
            <Button onClick={() => handleNext(false)} variant="ghost" className="flex items-center gap-1.5">
              <RotateCcw className="h-4 w-4" /> Review Again
            </Button>
            <Button onClick={() => handleNext(true)} className="flex items-center gap-1.5">
              <Check className="h-4 w-4" /> Got It <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
