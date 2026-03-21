'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Share2,
  Trophy,
  Rocket,
  CheckCircle2,
  Circle,
  Flame,
  Calendar,
  Clock,
  Target,
} from 'lucide-react';
import {
  type Roadmap,
  type DayPlan,
  topicMeta,
  loadRoadmap,
  loadProgress,
  saveProgress,
} from '@/lib/interview-planner';

const phaseColors: Record<number, string> = {
  1: 'from-blue-500/20 to-blue-500/5',
  2: 'from-emerald-500/20 to-emerald-500/5',
  3: 'from-purple-500/20 to-purple-500/5',
  4: 'from-amber-500/20 to-amber-500/5',
};

const phaseAccents: Record<number, string> = {
  1: 'text-blue-400',
  2: 'text-emerald-400',
  3: 'text-purple-400',
  4: 'text-amber-400',
};

const phaseBorders: Record<number, string> = {
  1: 'border-blue-500/30',
  2: 'border-emerald-500/30',
  3: 'border-purple-500/30',
  4: 'border-amber-500/30',
};

const topicColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const topicDotColor: Record<string, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  cyan: 'bg-cyan-500',
};

export default function RoadmapPage() {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [collapsedWeeks, setCollapsedWeeks] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const rm = loadRoadmap();
    if (!rm) {
      router.push('/prepare');
      return;
    }
    setRoadmap(rm);
    setProgress(loadProgress());
  }, [router]);

  const toggleDay = (day: number) => {
    setProgress(prev => {
      const next = { ...prev, [day]: !prev[day] };
      saveProgress(next);
      return next;
    });
  };

  const toggleWeek = (week: number) => {
    setCollapsedWeeks(prev => ({ ...prev, [week]: !prev[week] }));
  };

  const completedCount = useMemo(
    () => Object.values(progress).filter(Boolean).length,
    [progress]
  );

  const totalCount = roadmap?.days.length ?? 0;
  const pctComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group days by week
  const weeks = useMemo(() => {
    if (!roadmap) return [];
    const map: Record<number, DayPlan[]> = {};
    for (const d of roadmap.days) {
      if (!map[d.week]) map[d.week] = [];
      map[d.week].push(d);
    }
    return Object.entries(map)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([week, days]) => ({ week: Number(week), days }));
  }, [roadmap]);

  const handleShare = async () => {
    const text = `I'm preparing for my coding interview with Streaksy! ${roadmap?.answers.totalDays}-day plan, ${pctComplete}% done. Join me at streaksy.in/prepare`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!roadmap) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  const { answers } = roadmap;

  // Current day (first uncompleted)
  const currentDay = roadmap.days.find(d => !progress[d.day])?.day ?? roadmap.days.length;
  const currentWeek = Math.ceil(currentDay / 7);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Rocket className="h-6 w-6 text-emerald-400" />
            Your Study Roadmap
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {answers.totalDays}-day plan &middot; {answers.hoursPerDay}h/day &middot;{' '}
            {answers.role.replace('-', ' ')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Share Plan'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/prepare')}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Redo
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Target className="h-4 w-4 text-emerald-400" />}
          label="Progress"
          value={`${pctComplete}%`}
          sub={`${completedCount}/${totalCount} days`}
        />
        <StatCard
          icon={<Calendar className="h-4 w-4 text-blue-400" />}
          label="Current Day"
          value={`Day ${currentDay}`}
          sub={`Week ${currentWeek}`}
        />
        <StatCard
          icon={<Clock className="h-4 w-4 text-purple-400" />}
          label="Total Hours"
          value={`${answers.totalDays * answers.hoursPerDay}h`}
          sub={`${answers.hoursPerDay}h/day`}
        />
        <StatCard
          icon={<Flame className="h-4 w-4 text-amber-400" />}
          label="Topics"
          value={`${answers.focusTopics.length}`}
          sub="focus areas"
        />
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-300">Overall Progress</span>
          <span className="text-sm font-bold gradient-text">{pctComplete}%</span>
        </div>
        <div className="h-3 rounded-full bg-zinc-800/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 transition-all duration-700 ease-out relative"
            style={{ width: `${Math.max(pctComplete, 1)}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
        {/* Phase markers */}
        <div className="flex mt-3 gap-4 text-xs">
          {[
            { label: 'Fundamentals', pct: 20, color: 'text-blue-400' },
            { label: 'Core Practice', pct: 50, color: 'text-emerald-400' },
            { label: 'Advanced', pct: 20, color: 'text-purple-400' },
            { label: 'Review', pct: 10, color: 'text-amber-400' },
          ].map(p => (
            <div key={p.label} className="flex items-center gap-1.5">
              <div className={cn('h-2 w-2 rounded-full', p.color.replace('text-', 'bg-'))} />
              <span className="text-zinc-500">{p.label}</span>
              <span className={cn('font-medium', p.color)}>{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topic legend */}
      <div className="flex flex-wrap gap-2">
        {answers.focusTopics.map(t => {
          const meta = topicMeta[t];
          return (
            <span
              key={t}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium',
                topicColorMap[meta.color]
              )}
            >
              {meta.icon} {meta.label}
            </span>
          );
        })}
      </div>

      {/* Weeks timeline */}
      <div className="space-y-4">
        {weeks.map(({ week, days }) => {
          const weekDone = days.every(d => progress[d.day]);
          const weekProgress = days.filter(d => progress[d.day]).length;
          const isCollapsed = collapsedWeeks[week];
          const isCurrentWeek = week === currentWeek;
          const firstPhase = days[0]?.phase ?? 1;

          return (
            <div
              key={week}
              className={cn(
                'rounded-2xl border overflow-hidden transition-all duration-300',
                isCurrentWeek ? phaseBorders[firstPhase] : 'border-zinc-800/60',
                isCurrentWeek && 'shadow-[0_0_30px_-8px_rgba(16,185,129,0.15)]'
              )}
            >
              {/* Week header */}
              <button
                onClick={() => toggleWeek(week)}
                className={cn(
                  'w-full flex items-center justify-between p-4 transition-all duration-200',
                  isCurrentWeek
                    ? `bg-gradient-to-r ${phaseColors[firstPhase]}`
                    : 'bg-zinc-900/30 hover:bg-zinc-900/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold',
                    weekDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCurrentWeek
                        ? 'bg-zinc-800/80 text-zinc-200'
                        : 'bg-zinc-800/60 text-zinc-500'
                  )}>
                    {weekDone ? (
                      <Trophy className="h-4 w-4" />
                    ) : (
                      `W${week}`
                    )}
                  </div>
                  <div className="text-left">
                    <span className={cn(
                      'text-sm font-semibold',
                      isCurrentWeek ? 'text-zinc-100' : 'text-zinc-300'
                    )}>
                      Week {week}
                    </span>
                    <span className="text-xs text-zinc-600 ml-2">
                      Days {days[0].day}-{days[days.length - 1].day}
                    </span>
                    {isCurrentWeek && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'text-xs font-medium',
                    phaseAccents[firstPhase]
                  )}>
                    {days[0].phaseName}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {weekProgress}/{days.length}
                  </span>
                  {/* Mini progress */}
                  <div className="hidden sm:flex gap-0.5">
                    {days.map(d => (
                      <div
                        key={d.day}
                        className={cn(
                          'h-1.5 w-1.5 rounded-full transition-colors',
                          progress[d.day]
                            ? 'bg-emerald-500'
                            : d.day === currentDay
                              ? 'bg-zinc-400 animate-pulse'
                              : 'bg-zinc-700'
                        )}
                      />
                    ))}
                  </div>
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Day rows */}
              {!isCollapsed && (
                <div className="divide-y divide-zinc-800/40">
                  {days.map(day => {
                    const isDone = progress[day.day];
                    const isCurrent = day.day === currentDay;
                    const meta = topicMeta[day.topic];

                    return (
                      <div
                        key={day.day}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 transition-all duration-200 group',
                          isDone && 'bg-emerald-500/[0.03]',
                          isCurrent && !isDone && 'bg-zinc-800/30'
                        )}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
                        >
                          {isDone ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Circle className={cn(
                              'h-5 w-5',
                              isCurrent ? 'text-zinc-400' : 'text-zinc-700'
                            )} />
                          )}
                        </button>

                        {/* Day badge */}
                        <div className={cn(
                          'flex h-7 min-w-[2.5rem] items-center justify-center rounded-lg text-xs font-bold flex-shrink-0',
                          isCurrent && !isDone
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : isDone
                              ? 'bg-zinc-800/40 text-zinc-600'
                              : 'bg-zinc-800/60 text-zinc-500'
                        )}>
                          D{day.day}
                        </div>

                        {/* Topic color bar */}
                        <div className={cn(
                          'h-7 w-1 rounded-full flex-shrink-0',
                          topicDotColor[meta.color]
                        )} />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{day.topicIcon}</span>
                            <Link
                              href={day.link}
                              className={cn(
                                'text-sm font-medium truncate transition-colors',
                                isDone
                                  ? 'text-zinc-600 line-through'
                                  : 'text-zinc-200 group-hover:text-emerald-400'
                              )}
                            >
                              {day.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={cn(
                              'text-[11px] rounded px-1.5 py-0.5 border',
                              topicColorMap[meta.color]
                            )}>
                              {day.topicLabel}
                            </span>
                            <span className="text-[11px] text-zinc-600">
                              ~{day.estimatedMinutes} min
                            </span>
                          </div>
                        </div>

                        {/* Link arrow */}
                        <Link
                          href={day.link}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-zinc-500 hover:text-emerald-400 transition-colors" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {pctComplete === 100 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-transparent p-8 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-emerald-400 mb-2">
            You Crushed It!
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            You completed your entire {answers.totalDays}-day study plan. You&apos;re ready for that interview!
          </p>
          <Button variant="gradient" onClick={() => router.push('/prepare')} className="gap-2">
            <Rocket className="h-4 w-4" />
            Create Another Plan
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-zinc-100">{value}</p>
      <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
    </div>
  );
}
