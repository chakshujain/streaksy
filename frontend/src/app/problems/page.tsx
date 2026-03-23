'use client';

import { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ProblemTable } from '@/components/problems/ProblemTable';
import { ProblemFilters } from '@/components/problems/ProblemFilters';
import { SheetSelector } from '@/components/problems/SheetSelector';
import { SheetUpload } from '@/components/problems/SheetUpload';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/ui/PageTransition';
import { useAsync } from '@/hooks/useAsync';
import { problemsApi, progressApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { Problem, ProblemProgress, Sheet } from '@/lib/types';
import { Upload, ChevronDown, ChevronUp, BookOpen, CheckCircle2, Target, Puzzle } from 'lucide-react';
import { HelpTooltip } from '@/components/onboarding/HelpTooltip';

export default function ProblemsPage() {
  const [selectedSheet, setSelectedSheet] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [tag, setTag] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [page, setPage] = useState(0);
  const LIMIT = 50;

  const { data: sheets, loading: sheetsLoading, refetch: refetchSheets } = useAsync<Sheet[]>(
    () => problemsApi.getSheets().then((r) => r.data.sheets),
    []
  );

  const difficultyFilter = difficulty !== 'all' ? difficulty : undefined;

  const { data: problemsData, loading: problemsLoading } = useAsync<{ problems: Problem[]; total: number }>(
    () =>
      selectedSheet === 'all'
        ? problemsApi.list({ difficulty: difficultyFilter, limit: LIMIT, offset: page * LIMIT })
            .then((r) => ({ problems: r.data.problems, total: r.data.total || r.data.problems?.length || 0 }))
        : problemsApi.getSheetProblems(selectedSheet).then((r) => ({ problems: r.data.problems, total: r.data.problems?.length || 0 })),
    [selectedSheet, difficultyFilter, page]
  );

  const problems = problemsData?.problems ?? null;

  const { data: progress } = useAsync<ProblemProgress[]>(
    () => progressApi.get().then((r) => r.data.progress),
    []
  );

  const progressMap = useMemo(() => {
    const map = new Map<string, ProblemProgress>();
    (progress || []).forEach((p) => map.set(p.problem_id, p));
    return map;
  }, [progress]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    (problems || []).forEach((p) => p.tags?.forEach((t) => tags.add(t.name)));
    return Array.from(tags).sort();
  }, [problems]);

  const filtered = useMemo(() => {
    let list = problems || [];
    if (difficulty !== 'all') {
      list = list.filter((p) => p.difficulty === difficulty);
    }
    if (tag !== 'all') {
      list = list.filter((p) => p.tags?.some((t) => t.name === tag));
    }
    return list;
  }, [problems, difficulty, tag]);

  const filteredProblems = filtered;

  const loading = sheetsLoading || problemsLoading;
  const solvedCount = filteredProblems.filter((p) => progressMap.get(p.id)?.status === 'solved').length;
  const solvePercent = filteredProblems.length > 0 ? Math.round((solvedCount / filteredProblems.length) * 100) : 0;

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/10 glow-sm">
                <BookOpen className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Problems</h1>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Browse and track your progress across problem sets
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpload(!showUpload)}
              className={cn(
                'gap-2 rounded-xl border border-zinc-800 transition-all duration-200',
                showUpload && 'border-emerald-500/30 bg-emerald-500/5'
              )}
            >
              <Upload className="h-4 w-4" />
              Upload Sheet
              {showUpload ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>

          {/* Sheet Upload */}
          {showUpload && (
            <div className="animate-scale-in">
              <SheetUpload onSuccess={refetchSheets} />
            </div>
          )}

          {/* Extension prompt */}
          <div className="animate-slide-up rounded-xl border border-violet-500/10 bg-violet-500/5 px-4 py-3 flex items-center gap-3" style={{ animationDelay: '40ms', animationFillMode: 'both' }}>
            <Puzzle className="h-4 w-4 text-violet-400 shrink-0" />
            <p className="text-xs text-zinc-400 flex-1">
              Install the <a href="/extension" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Chrome Extension</a> to auto-sync your LeetCode submissions — no manual tracking needed.
            </p>
          </div>

          {/* Sheet tabs */}
          {!sheetsLoading && sheets && (
            <div className="animate-slide-up flex items-center gap-2" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
              <SheetSelector
                sheets={sheets}
                selected={selectedSheet}
                onSelect={(s) => { setSelectedSheet(s); setPage(0); }}
              />
              <HelpTooltip id="sheets" text="Switch between curated problem sheets. Each sheet is a focused set of problems for interview prep." />
            </div>
          )}

          {/* Filters */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <ProblemFilters
              difficulty={difficulty}
              onDifficultyChange={(d) => { setDifficulty(d); setPage(0); }}
              tag={tag}
              onTagChange={(t) => { setTag(t); setPage(0); }}
              availableTags={allTags}
            />
          </div>

          {/* Progress bar */}
          {!loading && filteredProblems.length > 0 && (
            <div className="glass rounded-2xl p-4 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-6 text-sm text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="font-medium text-zinc-300">{filteredProblems.length}</span> problems
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="font-medium text-emerald-400">{solvedCount}</span> solved
                  </span>
                </div>
                <span className={cn(
                  'text-sm font-bold px-2.5 py-0.5 rounded-lg',
                  solvePercent === 100
                    ? 'text-emerald-300 bg-emerald-500/15'
                    : 'text-emerald-400 bg-emerald-500/10'
                )}>
                  {solvePercent}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-800/80 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 transition-all duration-1000 ease-out',
                    solvePercent > 0 && 'glow-sm'
                  )}
                  style={{ width: `${solvePercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Table */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : (
              <ProblemTable problems={filteredProblems} progressMap={progressMap} />
            )}
          </div>

          {/* Pagination */}
          {problemsData && problemsData.total > LIMIT && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                Showing {page * LIMIT + 1}-{Math.min((page + 1) * LIMIT, problemsData.total)} of {problemsData.total}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                  Previous
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * LIMIT >= problemsData.total}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
