'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { patterns } from '@/lib/patterns-data';
import { cn } from '@/lib/cn';
import {
  ArrowLeft,
  Brain,
  Target,
  Cog,
  Film,
  Puzzle,
  Code2,
  RotateCcw,
  AlertTriangle,
  Link as LinkIcon,
  BookOpen,
  Lightbulb,
  Clock,
  HardDrive,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';
import SimulationPlayer from '@/components/patterns/SimulationPlayer';
import CodeTabs from '@/components/patterns/CodeTabs';
import { BookmarkButton } from '@/components/ui/BookmarkButton';

/* ------------------------------------------------------------------ */
/*  Color utilities                                                    */
/* ------------------------------------------------------------------ */

const colorMap: Record<string, { badge: string; accent: string; border: string }> = {
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-400',
    accent: 'border-emerald-500/40',
    border: 'border-l-emerald-500',
  },
  blue: {
    badge: 'bg-blue-500/10 text-blue-400',
    accent: 'border-blue-500/40',
    border: 'border-l-blue-500',
  },
  purple: {
    badge: 'bg-purple-500/10 text-purple-400',
    accent: 'border-purple-500/40',
    border: 'border-l-purple-500',
  },
  amber: {
    badge: 'bg-amber-500/10 text-amber-400',
    accent: 'border-amber-500/40',
    border: 'border-l-amber-500',
  },
  red: {
    badge: 'bg-red-500/10 text-red-400',
    accent: 'border-red-500/40',
    border: 'border-l-red-500',
  },
};

/* ------------------------------------------------------------------ */
/*  Section header component                                           */
/* ------------------------------------------------------------------ */

function SectionHeader({
  number,
  emoji,
  title,
  icon: Icon,
}: {
  number: number;
  emoji: string;
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/50 text-xs font-bold text-zinc-400">
        {number}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
      </div>
      <div className="flex-1 h-px bg-zinc-800" />
      <Icon className="h-4 w-4 text-zinc-600" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function PatternDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pattern = patterns.find((p) => p.slug === slug);

  if (!pattern) {
    return (
      <AppShell>
        <p className="text-zinc-500">Pattern not found.</p>
      </AppShell>
    );
  }

  const colors = colorMap[pattern.color] || colorMap.emerald;

  return (
    <AppShell>
      <div className="space-y-10 max-w-4xl pb-16">
        {/* ── Back + Header ──────────────────────────────────────── */}
        <div>
          <Link
            href="/patterns"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-5"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Patterns
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-4xl">{pattern.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">{pattern.name}</h1>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium mt-1',
                  colors.badge
                )}
              >
                {pattern.category}
              </span>
            </div>
            <div className="ml-auto">
              <BookmarkButton
                item={{
                  id: `pattern-${slug}`,
                  type: 'pattern',
                  title: pattern.name,
                  slug,
                }}
              />
            </div>
          </div>

          {/* Description fallback for legacy data */}
          {pattern.description && (
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{pattern.description}</p>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800" />

        {/* ── Section 1: Intuition ───────────────────────────────── */}
        <section>
          <SectionHeader number={1} emoji="🧠" title="Intuition" icon={Brain} />

          {(pattern.analogy || pattern.whatIsThis) && (
            <div className="space-y-4">
              <div className="rounded-xl border-l-2 border-l-purple-500/50 bg-zinc-900/60 border border-zinc-800 p-5">
                {(pattern.analogy || pattern.whatIsThis || '')
                  .split('\n\n')
                  .filter(Boolean)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="text-[15px] text-zinc-300 leading-relaxed italic mb-3 last:mb-0"
                    >
                      {para}
                    </p>
                  ))}
              </div>

              {/* Legacy real-world analogy */}
              {!pattern.analogy && pattern.realWorldAnalogy && (
                <div className="flex gap-3 rounded-lg border-l-2 border-emerald-500 bg-emerald-500/5 p-4">
                  <Lightbulb className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                      Real World Analogy
                    </span>
                    <p className="mt-1 text-sm text-zinc-300 leading-relaxed">
                      {pattern.realWorldAnalogy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Insight callout */}
          {pattern.keyInsight && (
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  💡 Key Insight
                </span>
                <p className="mt-1 text-sm text-zinc-300 leading-relaxed">{pattern.keyInsight}</p>
              </div>
            </div>
          )}
        </section>

        {/* ── Section 2: Problem It Solves ───────────────────────── */}
        <section>
          <SectionHeader number={2} emoji="🎯" title="Problem It Solves" icon={Target} />

          {pattern.problemItSolves && (
            <div className="space-y-3 mb-5">
              {pattern.problemItSolves
                .split('\n\n')
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-sm text-zinc-400 leading-relaxed">
                    {para}
                  </p>
                ))}
            </div>
          )}

          {/* Signal cards */}
          {pattern.signals && pattern.signals.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Recognition Signals
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pattern.signals.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg bg-zinc-800/30 border border-zinc-800 p-3"
                  >
                    <span className="text-amber-400 mt-0.5 shrink-0">📌</span>
                    <div>
                      <code className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {s.signal}
                      </code>
                      <p className="text-xs text-zinc-500 mt-1">{s.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy when-to-use fallback */}
          {!pattern.signals && pattern.whenToUse && pattern.whenToUse.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pattern.whenToUse.map((use, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-zinc-800/30 border border-zinc-800 p-3"
                >
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-zinc-400">{use}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Section 3: Core Idea ───────────────────────────────── */}
        {pattern.coreIdea && (
          <section>
            <SectionHeader number={3} emoji="⚙️" title="Core Idea" icon={Cog} />

            <div className="rounded-xl border-l-2 border-l-blue-500/50 bg-zinc-900/40 border border-zinc-800 p-5 space-y-3">
              {pattern.coreIdea
                .split('\n\n')
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-sm text-zinc-300 leading-[1.75]">
                    {para}
                  </p>
                ))}
            </div>
          </section>
        )}

        {/* ── Sections 4–7: Per-Example (Simulation + Visual + Code + Dry Run) */}
        {pattern.examples?.map((example, exIdx) => (
          <div key={exIdx} className="space-y-8">
            {/* Example header card */}
            <Card className="border-zinc-700/50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-zinc-200">{example.title}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{example.problem}</p>
                </div>
                <Badge variant={example.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>
                  {example.difficulty}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-xs mb-3">
                <span className="text-zinc-500">
                  <strong className="text-zinc-400">Input:</strong> {example.input}
                </span>
                <span className="text-zinc-500">
                  <strong className="text-zinc-400">Output:</strong> {example.output}
                </span>
              </div>

              <div className="flex gap-4">
                <div className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                  <Clock className="h-3 w-3" /> {example.timeComplexity}
                </div>
                <div className="inline-flex items-center gap-1 text-[10px] text-zinc-400">
                  <HardDrive className="h-3 w-3" /> {example.spaceComplexity}
                </div>
              </div>
            </Card>

            {/* Section 4: Step-by-Step Simulation */}
            <section>
              <SectionHeader number={4} emoji="🎬" title="Step-by-Step Simulation" icon={Film} />
              <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/50 p-4">
                <SimulationPlayer steps={example.steps} />
              </div>
            </section>

            {/* Section 5: Visual Representation */}
            <section>
              <SectionHeader number={5} emoji="🧩" title="Visual Representation" icon={Puzzle} />
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <p className="text-xs text-zinc-500 flex items-center gap-2">
                  <Puzzle className="h-3.5 w-3.5" />
                  Use the simulation controls above to step through the visualization. Each step
                  updates the visual representation of the data structure in real time.
                </p>
              </div>
            </section>

            {/* Section 6: Code */}
            <section>
              <SectionHeader number={6} emoji="💻" title="Code" icon={Code2} />
              <CodeTabs codes={example.codes} />
            </section>

            {/* Section 7: Dry Run */}
            {example.dryRun && example.dryRun.length > 0 && (
              <section>
                <SectionHeader number={7} emoji="🔁" title="Dry Run" icon={RotateCcw} />
                <Card className="border-zinc-700/50 bg-zinc-900/40">
                  <ol className="space-y-2">
                    {example.dryRun.map((line, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700/50 text-[10px] font-bold text-zinc-500 shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-zinc-400 font-mono leading-relaxed">
                          {line}
                        </span>
                      </li>
                    ))}
                  </ol>
                </Card>
              </section>
            )}

            {/* Separator between examples */}
            {exIdx < (pattern.examples?.length ?? 0) - 1 && (
              <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            )}
          </div>
        ))}

        {/* ── Section 8: Common Mistakes ─────────────────────────── */}
        {pattern.commonMistakes && pattern.commonMistakes.length > 0 && (
          <section>
            <SectionHeader number={8} emoji="⚠️" title="Common Mistakes" icon={AlertTriangle} />

            <div className="space-y-3">
              {pattern.commonMistakes.map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl border-l-2 border-l-red-500/50 bg-zinc-900/40 border border-zinc-800 p-4"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-sm font-semibold text-red-400">{m.mistake}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed ml-6">{m.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 9: Pattern Recognition Tips ────────────────── */}
        {pattern.recognitionTips && pattern.recognitionTips.length > 0 && (
          <section>
            <SectionHeader number={9} emoji="🔗" title="Pattern Recognition Tips" icon={Search} />

            <div className="space-y-2">
              {pattern.recognitionTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg bg-zinc-900/40 border border-zinc-800 p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-zinc-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 10: Practice Problems ──────────────────────── */}
        {pattern.practiceProblems && pattern.practiceProblems.length > 0 && (
          <section>
            <SectionHeader number={10} emoji="📝" title="Practice Problems" icon={BookOpen} />

            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 px-4 py-2.5 bg-zinc-800/50 border-b border-zinc-800">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Problem
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Difficulty
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Why It Fits
                </span>
              </div>

              {/* Table rows */}
              {pattern.practiceProblems.map((prob, i) => {
                const problemSlug = prob.name
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-');
                return (
                  <Link
                    key={i}
                    href={`/problems/${problemSlug}`}
                    className={cn(
                      'grid grid-cols-[1fr_auto_1fr] gap-4 px-4 py-3 items-center hover:bg-zinc-800/50 transition-colors group',
                      i % 2 === 0 ? 'bg-zinc-900/30' : 'bg-zinc-900/10'
                    )}
                  >
                    <span className="text-sm font-medium text-zinc-300 group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      {prob.name}
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
                    </span>
                    <Badge
                      variant={prob.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}
                    >
                      {prob.difficulty}
                    </Badge>
                    <span className="text-xs text-zinc-500">{prob.why}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Legacy commonProblems fallback */}
        {!pattern.practiceProblems &&
          pattern.commonProblems &&
          pattern.commonProblems.length > 0 && (
            <section>
              <SectionHeader number={10} emoji="📝" title="Practice Problems" icon={BookOpen} />
              <div className="flex flex-wrap gap-1.5">
                {pattern.commonProblems.map((problem, i) => {
                  const problemSlug = problem
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-');
                  return (
                    <Link
                      key={i}
                      href={`/problems/${problemSlug}`}
                      className="inline-flex items-center rounded-full bg-zinc-800 border border-zinc-700/50 px-2.5 py-1 text-[11px] text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                    >
                      {problem}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

        {/* ── Related Patterns ───────────────────────────────────── */}
        {pattern.relatedPatterns && pattern.relatedPatterns.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <LinkIcon className="h-4 w-4 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-300">Related Patterns</h2>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="flex flex-wrap gap-2">
              {pattern.relatedPatterns.map((relSlug) => {
                const related = patterns.find((p) => p.slug === relSlug);
                if (!related) return null;
                return (
                  <Link
                    key={relSlug}
                    href={`/patterns/${relSlug}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                  >
                    <span>{related.icon}</span>
                    {related.name}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
