'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { NotesList } from '@/components/notes/NotesList';
import { CommentThread } from '@/components/discussion/CommentThread';
import { RevisionForm } from '@/components/revision/RevisionForm';
import { useAsync } from '@/hooks/useAsync';
import { problemsApi, notesApi, revisionApi, progressApi } from '@/lib/api';
import { YouTubePlayer } from '@/components/problems/YouTubePlayer';
import { PeerSolutions } from '@/components/problems/PeerSolutions';
import { RatingSection } from '@/components/problems/RatingSection';
import { AIHintsPanel } from '@/components/ai/AIHintsPanel';
import { AIExplanationPanel } from '@/components/ai/AIExplanationPanel';
import { AICodeReviewPanel } from '@/components/ai/AICodeReviewPanel';
import { AIDiscussionSummary } from '@/components/ai/AIDiscussionSummary';
import { AINoteEnhancer } from '@/components/ai/AINoteEnhancer';
import { ExternalLink, RotateCcw, X, Sparkles, Loader2, CheckCircle2, Circle, Clock, ArrowRight, Brain, BookOpen, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import type { Problem, Note, RevisionNote, ProblemProgress } from '@/lib/types';
import { cn } from '@/lib/cn';
import { BookmarkButton } from '@/components/ui/BookmarkButton';

/* ── Tag-to-content mapping for contextual suggestions ──────────────────── */

const tagToPattern: Record<string, { name: string; slug: string }> = {
  'Two Pointers': { name: 'Two Pointers', slug: 'two-pointers' },
  'Sliding Window': { name: 'Sliding Window', slug: 'sliding-window' },
  'Binary Search': { name: 'Binary Search', slug: 'binary-search' },
  'Stack': { name: 'Stack', slug: 'stack' },
  'Monotonic Stack': { name: 'Monotonic Stack', slug: 'monotonic-stack' },
  'Linked List': { name: 'Linked List', slug: 'linked-list' },
  'Fast & Slow Pointers': { name: 'Fast & Slow Pointers', slug: 'fast-slow-pointers' },
  'Tree': { name: 'Tree BFS/DFS', slug: 'tree-bfs' },
  'BFS': { name: 'BFS', slug: 'tree-bfs' },
  'DFS': { name: 'DFS', slug: 'tree-dfs' },
  'Graph': { name: 'Graph BFS/DFS', slug: 'graph-bfs' },
  'Backtracking': { name: 'Backtracking', slug: 'backtracking' },
  'Dynamic Programming': { name: 'Dynamic Programming', slug: 'dynamic-programming' },
  'Greedy': { name: 'Greedy', slug: 'greedy' },
  'Heap': { name: 'Top K / Heap', slug: 'top-k-heap' },
  'Trie': { name: 'Trie', slug: 'trie' },
  'Bit Manipulation': { name: 'Bit Manipulation', slug: 'bit-manipulation' },
  'Union Find': { name: 'Union Find', slug: 'union-find' },
  'Intervals': { name: 'Intervals', slug: 'intervals' },
};

const tagToLearnTopic: Record<string, { name: string; slug: string }> = {
  'Database': { name: 'Databases', slug: 'databases' },
  'SQL': { name: 'Databases', slug: 'databases' },
  'System Design': { name: 'System Design', slug: 'system-design' },
  'OOP': { name: 'Object-Oriented Programming', slug: 'oops' },
  'Multithreading': { name: 'Multithreading', slug: 'multithreading' },
  'Concurrency': { name: 'Multithreading', slug: 'multithreading' },
};

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [notesTab, setNotesTab] = useState<'personal' | 'group'>('personal');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { data: problem, loading } = useAsync<Problem>(
    () => problemsApi.getBySlug(slug).then((r) => r.data.problem),
    [slug]
  );

  const {
    data: personalNotes,
    loading: notesLoading,
    refetch: refetchNotes,
  } = useAsync<Note[]>(
    () =>
      problem
        ? notesApi.getPersonal(problem.id).then((r) => r.data.notes)
        : Promise.resolve([]),
    [problem?.id]
  );

  const { data: revision, refetch: refetchRevision } = useAsync<RevisionNote | null>(
    () =>
      problem
        ? revisionApi.get(problem.id).then((r) => r.data.note)
        : Promise.resolve(null),
    [problem?.id]
  );

  const { data: progress, refetch: refetchProgress } = useAsync<ProblemProgress[]>(
    () => progressApi.get().then((r) => r.data.progress),
    []
  );

  const currentStatus = problem ? (progress?.find(p => p.problem_id === problem.id)?.status || 'not_started') : 'not_started';
  const isSolved = currentStatus === 'solved';

  const handleStatusChange = async (newStatus: 'not_started' | 'attempted' | 'solved') => {
    if (!problem || statusUpdating) return;
    setStatusUpdating(true);
    try {
      await progressApi.updateStatus(problem.id, newStatus);
      refetchProgress();
    } catch {
      // handled by interceptor
    } finally {
      setStatusUpdating(false);
    }
  };


  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-40" />
        </div>
      </AppShell>
    );
  }

  if (!problem) {
    return (
      <AppShell>
        <p className="text-zinc-500">Problem not found.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-100">{problem.title}</h1>
            <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
            <BookmarkButton
              item={{
                id: `problem-${slug}`,
                type: 'problem',
                title: problem.title,
                slug,
                difficulty: problem.difficulty,
              }}
              size="sm"
            />
          </div>
          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300"
            >
              Open on LeetCode
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {problem.tags && problem.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {problem.tags.map((tag) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Problem Status Toggle */}
        {problem && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 mr-1">Status:</span>
            {([
              { value: 'not_started' as const, label: 'Not Started', icon: Circle, color: 'zinc' },
              { value: 'attempted' as const, label: 'Attempted', icon: Clock, color: 'yellow' },
              { value: 'solved' as const, label: 'Solved', icon: CheckCircle2, color: 'emerald' },
            ]).map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => handleStatusChange(value)}
                disabled={statusUpdating}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 disabled:opacity-50',
                  currentStatus === value
                    ? color === 'emerald' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                      color === 'yellow' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                      'bg-zinc-700/50 border-zinc-600 text-zinc-300'
                    : 'border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Solved — What's Next suggestions */}
        {isSolved && (
          <div className="animate-slide-up flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800/50 bg-zinc-800/30 px-4 py-3">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 mr-1">
              <Lightbulb className="h-3.5 w-3.5 text-emerald-400" /> Nice solve!
            </span>
            <button
              onClick={() => setShowRevisionForm(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-900/50 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-amber-500/30 hover:text-amber-300 transition-all"
            >
              <RotateCcw className="h-3 w-3 text-amber-400" />
              Save your approach
            </button>
            {problem.tags?.map((tag) => {
              const matched = tagToPattern[tag.name];
              if (!matched) return null;
              return (
                <Link
                  key={tag.id}
                  href={`/patterns/${matched.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-900/50 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-cyan-500/30 hover:text-cyan-300 transition-all"
                >
                  <Brain className="h-3 w-3 text-cyan-400" />
                  Learn {matched.name} pattern
                </Link>
              );
            }).filter(Boolean).slice(0, 2)}
          </div>
        )}

        {/* Related Content */}
        {problem.tags && problem.tags.length > 0 && (() => {
          const relatedPatterns = problem.tags
            .map((tag) => tagToPattern[tag.name])
            .filter((v): v is { name: string; slug: string } => !!v);
          const relatedTopics = problem.tags
            .map((tag) => tagToLearnTopic[tag.name])
            .filter((v): v is { name: string; slug: string } => !!v);
          const uniquePatterns = relatedPatterns.filter((p, i, a) => a.findIndex(x => x.slug === p.slug) === i);
          const uniqueTopics = relatedTopics.filter((t, i, a) => a.findIndex(x => x.slug === t.slug) === i);

          if (uniquePatterns.length === 0 && uniqueTopics.length === 0) return null;

          return (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Related:</span>
              {uniquePatterns.slice(0, 3).map((p) => (
                <Link
                  key={p.slug}
                  href={`/patterns/${p.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  <Brain className="h-3 w-3" />
                  {p.name}
                  <ArrowRight className="h-3 w-3 opacity-50" />
                </Link>
              ))}
              {uniqueTopics.slice(0, 2).map((t) => (
                <Link
                  key={t.slug}
                  href={`/learn/${t.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  <BookOpen className="h-3 w-3" />
                  {t.name}
                  <ArrowRight className="h-3 w-3 opacity-50" />
                </Link>
              ))}
            </div>
          );
        })()}

        {/* Video Solution */}
        {problem.youtube_url && (
          <YouTubePlayer url={problem.youtube_url} title={problem.video_title || undefined} />
        )}

        {/* Revision Note section */}
        {isSolved && (
          <div>
            {showRevisionForm ? (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-zinc-200">
                    {revision ? 'Edit Revision Note' : 'Add Revision Note'}
                  </h2>
                  <button onClick={() => setShowRevisionForm(false)} className="text-zinc-500 hover:text-zinc-300">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <RevisionForm
                  problemId={problem.id}
                  existing={revision}
                  onSaved={() => { setShowRevisionForm(false); refetchRevision(); }}
                  onCancel={() => setShowRevisionForm(false)}
                />
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowRevisionForm(true)}
                    className="flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {revision ? 'Edit Revision Note' : 'Add Revision Note'}
                  </Button>
                  {!revision && (
                    <button
                      onClick={async () => {
                        setAiGenerating(true);
                        setAiError('');
                        try {
                          await revisionApi.generateAI(problem.id);
                          setShowRevisionForm(true);
                        } catch (err: unknown) {
                          const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate AI notes';
                          setAiError(message);
                        } finally {
                          setAiGenerating(false);
                        }
                      }}
                      disabled={aiGenerating}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400 hover:bg-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {aiGenerating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      {aiGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                  )}
                  {revision && (
                    <span className="text-xs text-zinc-500">
                      Revised {revision.revision_count} times
                    </span>
                  )}
                </div>
                {aiError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{aiError}</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* AI Tools Section */}
        {problem && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">AI Tools</h2>
            <div className="flex flex-wrap gap-2">
              <AIHintsPanel problemId={problem.id} />
              <AIExplanationPanel problemId={problem.id} />
              {isSolved && <AICodeReviewPanel problemId={problem.id} />}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-zinc-200">Notes</h2>
            <div className="flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
              {(['personal', 'group'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setNotesTab(tab)}
                  className={cn(
                    'rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors',
                    notesTab === tab
                      ? 'bg-zinc-700 text-zinc-100'
                      : 'text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {notesTab === 'personal' && (
            <>
              <NoteEditor
                problemId={problem.id}
                visibility="personal"
                onSaved={refetchNotes}
              />
              {notesLoading ? (
                <Skeleton className="h-24" />
              ) : (
                <>
                  <NotesList
                    notes={personalNotes || []}
                    canDelete
                    onDeleted={refetchNotes}
                  />
                  {personalNotes && personalNotes.length > 0 && (
                    <div className="mt-2">
                      <AINoteEnhancer
                        noteId={personalNotes[0].id}
                        onApply={(content) => {
                          notesApi.update(personalNotes[0].id, content).then(() => refetchNotes());
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {notesTab === 'group' && (
            <Card>
              <p className="text-sm text-zinc-500">
                Select a group to view shared notes for this problem.
              </p>
            </Card>
          )}
        </div>

        {/* Community Rating & Company Tags */}
        {problem && <RatingSection problemId={problem.id} />}

        {/* Discussion Section */}
        <div className="space-y-3">
          <AIDiscussionSummary problemSlug={slug} />
          <CommentThread problemSlug={slug} />
        </div>

        {/* Peer Solutions */}
        {problem && (
          <PeerSolutions problemId={problem.id} />
        )}
      </div>
    </AppShell>
  );
}
