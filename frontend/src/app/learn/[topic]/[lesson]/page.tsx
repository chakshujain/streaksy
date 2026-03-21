'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { topics, type LessonStep } from '@/lib/learn-data';
import { cn } from '@/lib/cn';
import CodeTabs from '@/components/patterns/CodeTabs';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Construction,
  ArrowRight,
  BookOpen,
  Brain,
  RotateCcw,
} from 'lucide-react';
import { useLearnProgress } from '@/hooks/useLearnProgress';
import { BookmarkButton } from '@/components/ui/BookmarkButton';

const difficultyColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-green-500/15', text: 'text-green-400' },
  intermediate: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-500/15', text: 'text-red-400' },
};

/* ── Visual Components ─────────────────────────────────────────────────── */

function ComparisonVisual({ data }: { data: NonNullable<LessonStep['comparison']> }) {
  return (
    <div className="rounded-xl border border-zinc-700/50 overflow-hidden">
      {/* Headers */}
      <div className="grid grid-cols-2">
        <div className={cn('px-4 py-2 text-center text-xs font-bold uppercase tracking-wider', data.leftColor === 'red' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400')}>
          {data.leftTitle}
        </div>
        <div className={cn('px-4 py-2 text-center text-xs font-bold uppercase tracking-wider border-l border-zinc-700/50', data.rightColor === 'red' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400')}>
          {data.rightTitle}
        </div>
      </div>
      {/* Rows */}
      {data.items.map((item, i) => (
        <div key={i} className="grid grid-cols-2 border-t border-zinc-800/50">
          <div className="px-4 py-2.5 text-xs text-zinc-300">{item.left}</div>
          <div className="px-4 py-2.5 text-xs text-zinc-300 border-l border-zinc-800/50">{item.right}</div>
        </div>
      ))}
    </div>
  );
}

function FlowVisual({ steps }: { steps: NonNullable<LessonStep['flow']> }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-4 py-3 text-center min-w-[100px]">
            {step.icon && <span className="text-lg block mb-1">{step.icon}</span>}
            <p className="text-xs font-semibold text-zinc-200">{step.label}</p>
            {step.description && <p className="text-[10px] text-zinc-500 mt-0.5">{step.description}</p>}
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="h-4 w-4 text-emerald-500/50 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

function TableVisual({ data }: { data: NonNullable<LessonStep['table']> }) {
  return (
    <div className="rounded-xl border border-zinc-700/50 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-zinc-800/50">
            {data.headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-zinc-300 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className="border-t border-zinc-800/30">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-zinc-400">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardsVisual({ cards }: { cards: NonNullable<LessonStep['cards']> }) {
  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    blue: 'border-blue-500/20 bg-blue-500/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
    red: 'border-red-500/20 bg-red-500/5',
    purple: 'border-purple-500/20 bg-purple-500/5',
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <div key={i} className={cn('rounded-xl border p-4', colorMap[card.color || 'emerald'] || colorMap.emerald)}>
          <div className="flex items-center gap-2 mb-1.5">
            {card.icon && <span className="text-base">{card.icon}</span>}
            <p className="text-sm font-semibold text-zinc-200">{card.title}</p>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

function DiagramVisual({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-950 p-4 overflow-x-auto">
      <pre className="text-xs text-emerald-400/80 font-mono leading-relaxed whitespace-pre">{text}</pre>
    </div>
  );
}

/* ── Step Section ──────────────────────────────────────────────────────── */

function StepSection({ step, index }: { step: LessonStep; index: number }) {
  return (
    <section className="space-y-4">
      {/* Step heading */}
      <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-xs font-bold text-emerald-400">
          {index + 1}
        </span>
        {step.title}
      </h2>

      {/* Content — short paragraphs */}
      {step.content.split('\n\n').map((paragraph, i) => (
        <p key={i} className="text-sm text-zinc-300 leading-relaxed">
          {paragraph}
        </p>
      ))}

      {/* Bullet points */}
      {step.bullets && step.bullets.length > 0 && (
        <ul className="space-y-1.5 ml-1">
          {step.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="text-emerald-400 mt-1 text-xs">●</span>
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Analogy callout */}
      {step.analogy && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3">
          <Lightbulb className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-400 mb-1">Think of it like this</p>
            <p className="text-sm text-zinc-300">{step.analogy}</p>
          </div>
        </div>
      )}

      {/* Visual: Comparison */}
      {step.comparison && <ComparisonVisual data={step.comparison} />}

      {/* Visual: Flow */}
      {step.flow && <FlowVisual steps={step.flow} />}

      {/* Visual: Table */}
      {step.table && <TableVisual data={step.table} />}

      {/* Visual: Cards */}
      {step.cards && <CardsVisual cards={step.cards} />}

      {/* Visual: Diagram */}
      {step.diagram && <DiagramVisual text={step.diagram} />}

      {/* Code tabs */}
      {step.code && step.code.length > 0 && (
        <CodeTabs codes={step.code} />
      )}

      {/* Key takeaway */}
      {step.keyTakeaway && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-emerald-300">{step.keyTakeaway}</p>
        </div>
      )}
    </section>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────── */

export default function LessonPage() {
  const params = useParams();
  const topicSlug = params.topic as string;
  const lessonSlug = params.lesson as string;
  const { isComplete, markComplete, getCompletionDate } = useLearnProgress();

  const topic = topics.find((t) => t.slug === topicSlug);
  if (!topic) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-zinc-400 text-lg">Topic not found.</p>
          <Link href="/learn" className="mt-4 text-sm text-emerald-400 hover:underline">
            Back to Learning Hub
          </Link>
        </div>
      </AppShell>
    );
  }

  const lessonIndex = topic.lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = topic.lessons[lessonIndex];

  if (!lesson) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-zinc-400 text-lg">Lesson not found.</p>
          <Link href={`/learn/${topic.slug}`} className="mt-4 text-sm text-emerald-400 hover:underline">
            Back to {topic.name}
          </Link>
        </div>
      </AppShell>
    );
  }

  const prevLesson = lessonIndex > 0 ? topic.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < topic.lessons.length - 1 ? topic.lessons[lessonIndex + 1] : null;
  const dc = difficultyColors[lesson.difficulty];
  const hasContent = lesson.steps.length > 0;

  const completed = isComplete(topicSlug, lessonSlug);
  const completionDate = getCompletionDate(topicSlug, lessonSlug);

  return (
    <AppShell>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/learn" className="hover:text-zinc-300 transition-colors">Learn</Link>
          <span>/</span>
          <Link href={`/learn/${topic.slug}`} className="hover:text-zinc-300 transition-colors">{topic.name}</Link>
          <span>/</span>
          <span className="text-zinc-400 truncate">{lesson.title}</span>
        </div>

        {/* Lesson header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{lesson.icon}</span>
            <div className="flex items-center gap-2">
              <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', dc.bg, dc.text)}>
                {lesson.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                <Clock className="h-3 w-3" /> {lesson.duration}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-100">{lesson.title}</h1>
            <BookmarkButton
              item={{
                id: `lesson-${topicSlug}-${lessonSlug}`,
                type: 'lesson',
                title: lesson.title,
                slug: lessonSlug,
                topicSlug,
                difficulty: lesson.difficulty,
              }}
              size="sm"
            />
          </div>
          <p className="mt-2 text-sm text-zinc-400">{lesson.description}</p>
        </div>

        {/* Content or Coming Soon */}
        {!hasContent ? (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <Construction className="h-12 w-12 text-zinc-600 mb-4" />
            <h2 className="text-lg font-semibold text-zinc-300">Coming Soon</h2>
            <p className="mt-2 text-sm text-zinc-500 max-w-md">
              We&apos;re working on this lesson. Check back soon!
            </p>
            <Link
              href={`/learn/${topic.slug}`}
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to {topic.name}
            </Link>
          </Card>
        ) : (
          <>
            {/* Steps */}
            <div className="space-y-10">
              {lesson.steps.map((step, i) => (
                <StepSection key={i} step={step} index={i} />
              ))}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

            {/* Common Mistakes */}
            {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" /> Common Mistakes
                </h2>
                {lesson.commonMistakes.map((item, i) => (
                  <div key={i} className="rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                    <p className="text-sm font-medium text-red-400 mb-1">❌ {item.mistake}</p>
                    <p className="text-xs text-zinc-400">{item.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Practice Questions */}
            {lesson.practiceQuestions && lesson.practiceQuestions.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-400" /> Practice Questions
                </h2>
                <Card>
                  <ul className="space-y-2.5">
                    {lesson.practiceQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-bold text-blue-400 mt-0.5">
                          {i + 1}
                        </span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {/* Mark Complete */}
            <div className="pt-2">
              {completed ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
                    <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-300">Completed</p>
                      {completionDate && (
                        <p className="text-xs text-emerald-400/70 mt-0.5">
                          {new Date(completionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* What's Next? suggestions */}
                  <div className="mt-4 animate-slide-up rounded-xl border border-zinc-800/50 bg-zinc-800/30 p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-cyan-400" />
                      What&apos;s Next?
                    </h3>

                    <div className="space-y-2">
                      {nextLesson && (
                        <Link
                          href={`/learn/${topicSlug}/${nextLesson.slug}`}
                          className="flex items-center gap-3 rounded-lg border border-zinc-700/40 bg-zinc-900/40 px-3 py-2.5 hover:border-emerald-500/30 hover:bg-zinc-800/50 transition-all group"
                        >
                          <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-500">Next lesson</p>
                            <p className="text-sm text-zinc-300 truncate group-hover:text-emerald-300 transition-colors">{nextLesson.title}</p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                        </Link>
                      )}

                      <Link
                        href="/problems"
                        className="flex items-center gap-3 rounded-lg border border-zinc-700/40 bg-zinc-900/40 px-3 py-2.5 hover:border-cyan-500/30 hover:bg-zinc-800/50 transition-all group"
                      >
                        <Brain className="h-4 w-4 text-cyan-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-500">Practice problems</p>
                          <p className="text-sm text-zinc-300 group-hover:text-cyan-300 transition-colors">Solve related problems</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                      </Link>

                      <Link
                        href="/revision"
                        className="flex items-center gap-3 rounded-lg border border-zinc-700/40 bg-zinc-900/40 px-3 py-2.5 hover:border-amber-500/30 hover:bg-zinc-800/50 transition-all group"
                      >
                        <RotateCcw className="h-4 w-4 text-amber-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-500">Create revision note</p>
                          <p className="text-sm text-zinc-300 group-hover:text-amber-300 transition-colors">Save key takeaways for review</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => markComplete(topicSlug, lessonSlug)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3.5 text-sm font-semibold text-white hover:from-emerald-500 hover:to-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle className="h-5 w-5" />
                  Mark as Complete
                </button>
              )}
            </div>
          </>
        )}

        {/* Prev / Next */}
        <div className="flex items-center justify-between pt-4">
          {prevLesson ? (
            <Link
              href={`/learn/${topic.slug}/${prevLesson.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-800/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Previous</p>
                <p className="font-medium truncate max-w-[200px]">{prevLesson.title}</p>
              </div>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link
              href={`/learn/${topic.slug}/${nextLesson.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-800/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Next</p>
                <p className="font-medium truncate max-w-[200px]">{nextLesson.title}</p>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </AppShell>
  );
}
