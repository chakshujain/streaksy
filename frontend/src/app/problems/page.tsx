'use client';

import { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ProblemTable } from '@/components/problems/ProblemTable';
import { ProblemFilters } from '@/components/problems/ProblemFilters';
import { SheetSelector } from '@/components/problems/SheetSelector';
import { SheetUpload } from '@/components/problems/SheetUpload';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useAsync } from '@/hooks/useAsync';
import { problemsApi, progressApi } from '@/lib/api';
import type { Problem, ProblemProgress, Sheet } from '@/lib/types';
import { Upload, ChevronDown, ChevronUp } from 'lucide-react';

export default function ProblemsPage() {
  const [selectedSheet, setSelectedSheet] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [tag, setTag] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const { data: sheets, loading: sheetsLoading, refetch: refetchSheets } = useAsync<Sheet[]>(
    () => problemsApi.getSheets().then((r) => r.data.sheets),
    []
  );

  const { data: problems, loading: problemsLoading } = useAsync<Problem[]>(
    () =>
      selectedSheet === 'all'
        ? problemsApi.list().then((r) => r.data.problems)
        : problemsApi.getSheetProblems(selectedSheet).then((r) => r.data.problems),
    [selectedSheet]
  );

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

  const loading = sheetsLoading || problemsLoading;
  const solvedCount = filtered.filter((p) => progressMap.get(p.id)?.status === 'solved').length;
  const solvePercent = filtered.length > 0 ? Math.round((solvedCount / filtered.length) * 100) : 0;

  return (
    <AppShell>
      <div className="space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Problems</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Browse and track your progress across problem sets.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Sheet
            {showUpload ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>

        {/* Sheet Upload */}
        {showUpload && (
          <div className="animate-slide-up">
            <SheetUpload onSuccess={refetchSheets} />
          </div>
        )}

        {/* Sheet tabs */}
        {!sheetsLoading && sheets && (
          <SheetSelector
            sheets={sheets}
            selected={selectedSheet}
            onSelect={setSelectedSheet}
          />
        )}

        {/* Filters */}
        <ProblemFilters
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          tag={tag}
          onTagChange={setTag}
          availableTags={allTags}
        />

        {/* Progress bar */}
        {!loading && filtered.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-6 text-sm text-zinc-500">
                <span>
                  <span className="font-medium text-zinc-300">{filtered.length}</span> problems
                </span>
                <span>
                  <span className="font-medium text-emerald-400">{solvedCount}</span> solved
                </span>
              </div>
              <span className="text-sm font-semibold text-emerald-400">{solvePercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${solvePercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : (
          <ProblemTable problems={filtered} progressMap={progressMap} />
        )}
      </div>
    </AppShell>
  );
}
