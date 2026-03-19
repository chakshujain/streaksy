'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/ui/PageTransition';
import { RevisionCard } from '@/components/revision/RevisionCard';
import { RevisionQuiz } from '@/components/revision/RevisionQuiz';
import { RevisionForm } from '@/components/revision/RevisionForm';
import { useAsync } from '@/hooks/useAsync';
import { revisionApi } from '@/lib/api';
import { BookOpen, Brain, Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { RevisionNote } from '@/lib/types';

export default function RevisionPage() {
  const [mode, setMode] = useState<'browse' | 'quiz'>('browse');
  const [tagFilter, setTagFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<RevisionNote | null>(null);

  const { data: notes, loading, refetch } = useAsync<RevisionNote[]>(
    () => revisionApi.list({
      tag: tagFilter || undefined,
      difficulty: difficultyFilter || undefined,
    }).then((r) => r.data.notes),
    [tagFilter, difficultyFilter]
  );

  const { data: quizCards, loading: quizLoading } = useAsync<RevisionNote[]>(
    () => mode === 'quiz' ? revisionApi.quiz(10).then((r) => r.data.cards) : Promise.resolve([]),
    [mode]
  );

  const filteredNotes = notes?.filter((n) =>
    !searchQuery || n.problem_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.key_takeaway.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Collect unique tags
  const allTags = Array.from(new Set(notes?.flatMap((n) => n.tags || []) || []));

  return (
    <AppShell>
      <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/10 glow-sm">
              <BookOpen className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Revision Hub</h1>
              <p className="text-sm text-zinc-500 mt-0.5">
                Review key takeaways from problems you&apos;ve solved
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
              {(['browse', 'quiz'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    'rounded-md px-4 py-1.5 text-xs font-medium capitalize transition-all duration-200 flex items-center gap-1.5',
                    mode === m
                      ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  {m === 'browse' ? <BookOpen className="h-3.5 w-3.5" /> : <Brain className="h-3.5 w-3.5" />}
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editing modal/overlay */}
        {editingNote && (
          <div className="animate-scale-in">
            <Card>
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">
                Edit: {editingNote.problem_title}
              </h2>
              <RevisionForm
                problemId={editingNote.problem_id}
                existing={editingNote}
                onSaved={() => { setEditingNote(null); refetch(); }}
                onCancel={() => setEditingNote(null)}
              />
            </Card>
          </div>
        )}

        {/* Quiz mode */}
        {mode === 'quiz' && (
          <div className="animate-fade-in">
            {quizLoading ? (
              <div className="space-y-4 max-w-2xl mx-auto">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-[300px] rounded-2xl" />
              </div>
            ) : quizCards && quizCards.length > 0 ? (
              <RevisionQuiz
                cards={quizCards}
                onComplete={() => { setMode('browse'); refetch(); }}
              />
            ) : (
              <EmptyState
                icon={<Brain className="h-10 w-10" />}
                title="No revision notes yet"
                description="Add revision notes to problems you've solved to start a quiz."
                action={<Button onClick={() => setMode('browse')}>Browse Notes</Button>}
              />
            )}
          </div>
        )}

        {/* Browse mode */}
        {mode === 'browse' && !editingNote && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 animate-slide-up" style={{ animationDelay: '75ms', animationFillMode: 'both' }}>
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 pl-10 pr-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-zinc-500" />
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(difficultyFilter === d ? '' : d)}
                    className={cn(
                      'rounded-lg border px-2.5 py-1 text-xs font-medium capitalize transition-all duration-200',
                      difficultyFilter === d
                        ? d === 'easy' ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                          : d === 'medium' ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                          : 'border-red-500/30 bg-red-500/15 text-red-400'
                        : 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {allTags.length > 0 && (
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}

              {(difficultyFilter || tagFilter) && (
                <button
                  onClick={() => { setDifficultyFilter(''); setTagFilter(''); }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors duration-200"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>

            {/* Notes grid */}
            <div className="animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
                </div>
              ) : filteredNotes && filteredNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNotes.map((note, i) => (
                    <div
                      key={note.id}
                      className="animate-slide-up transition-transform duration-200 hover:scale-[1.02]"
                      style={{ animationDelay: `${150 + i * 50}ms`, animationFillMode: 'both' }}
                    >
                      <RevisionCard
                        note={note}
                        onClick={() => setEditingNote(note)}
                        onDelete={refetch}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<BookOpen className="h-10 w-10" />}
                  title="No revision notes"
                  description="When you solve a problem, add a revision note to remember the key takeaway."
                />
              )}
            </div>
          </>
        )}
      </div>
      </PageTransition>
    </AppShell>
  );
}
