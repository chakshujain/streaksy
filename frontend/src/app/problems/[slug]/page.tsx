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
import { ExternalLink, RotateCcw, X, Sparkles, Loader2 } from 'lucide-react';
import type { Problem, Note, RevisionNote, ProblemProgress } from '@/lib/types';
import { cn } from '@/lib/cn';

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [notesTab, setNotesTab] = useState<'personal' | 'group'>('personal');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

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

  const { data: progress } = useAsync<ProblemProgress[]>(
    () => progressApi.get().then((r) => r.data.progress),
    []
  );

  const isSolved = problem && progress?.some(
    (p) => p.problem_id === problem.id && p.status === 'solved'
  );

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
                <NotesList
                  notes={personalNotes || []}
                  canDelete
                  onDeleted={refetchNotes}
                />
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
        <CommentThread problemSlug={slug} />

        {/* Peer Solutions */}
        {problem && (
          <PeerSolutions problemId={problem.id} />
        )}
      </div>
    </AppShell>
  );
}
