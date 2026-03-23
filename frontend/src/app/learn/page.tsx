'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { topics } from '@/lib/learn-data';
import { patterns } from '@/lib/patterns-data';
import { cn } from '@/lib/cn';
import { ArrowRight, GraduationCap, BookOpen, CheckCircle } from 'lucide-react';
import { useLearnProgress } from '@/hooks/useLearnProgress';

const colorMap: Record<string, { bg: string; text: string; hoverText: string; border: string; badge: string }> = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    hoverText: 'group-hover:text-emerald-400',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/15 text-emerald-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    hoverText: 'group-hover:text-blue-400',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/15 text-blue-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    hoverText: 'group-hover:text-purple-400',
    border: 'border-purple-500/20',
    badge: 'bg-purple-500/15 text-purple-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    hoverText: 'group-hover:text-amber-400',
    border: 'border-amber-500/20',
    badge: 'bg-amber-500/15 text-amber-400',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    hoverText: 'group-hover:text-red-400',
    border: 'border-red-500/20',
    badge: 'bg-red-500/15 text-red-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    hoverText: 'group-hover:text-cyan-400',
    border: 'border-cyan-500/20',
    badge: 'bg-cyan-500/15 text-cyan-400',
  },
  zinc: {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    hoverText: 'group-hover:text-zinc-400',
    border: 'border-zinc-500/20',
    badge: 'bg-zinc-500/15 text-zinc-400',
  },
};

export default function LearnPage() {
  const { getTopicProgress, getAllProgress } = useLearnProgress();
  const { totalCompleted, totalLessons, topicsInProgress } = getAllProgress();

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-7 w-7 text-emerald-400" />
            <h1 className="text-2xl font-bold text-zinc-100">Learning Hub</h1>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            Structured lessons on databases, system design, OOP, and multithreading — from fundamentals to advanced topics.
          </p>
        </div>

        {/* Overall progress stat */}
        {totalCompleted > 0 && (
          <Card className="border-emerald-500/15 bg-emerald-500/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  {totalCompleted} lesson{totalCompleted !== 1 ? 's' : ''} completed across all topics
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-32 rounded-full bg-zinc-800">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-emerald-400">{totalCompleted}/{totalLessons}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Continue Learning */}
        {topicsInProgress.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topicsInProgress.map((tip) => {
                if (!tip.nextLesson) return null;
                return (
                  <Link key={tip.topicSlug} href={`/learn/${tip.topicSlug}/${tip.nextLesson.slug}`}>
                    <Card className="group cursor-pointer hover:border-zinc-700 transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-500">{tip.topicName}</p>
                          <p className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors truncate mt-0.5">
                            {tip.nextLesson.title}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors flex-shrink-0 ml-2" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Topic grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map((topic) => {
            const colors = colorMap[topic.color] || colorMap.blue;
            const isDsaPatterns = topic.slug === 'dsa-patterns';
            const lessonCount = isDsaPatterns ? patterns.length : topic.lessons.length;
            const availableCount = isDsaPatterns ? patterns.length : topic.lessons.filter((l) => l.steps.length > 0).length;
            const cardHref = isDsaPatterns ? '/patterns' : `/learn/${topic.slug}`;
            const topicProgress = !isDsaPatterns ? getTopicProgress(topic.slug) : null;
            const topicPct = topicProgress && topicProgress.total > 0 ? Math.round((topicProgress.completed / topicProgress.total) * 100) : 0;

            return (
              <Link key={topic.slug} href={cardHref}>
                <Card className="h-full hover:border-zinc-700 transition-all duration-200 group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl',
                          colors.bg
                        )}
                      >
                        <span className="text-2xl">{topic.icon}</span>
                      </div>
                      <div>
                        <h2
                          className={cn(
                            'text-lg font-semibold text-zinc-200 group-hover:transition-colors',
                            colors.hoverText
                          )}
                        >
                          {topic.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                              colors.badge
                            )}
                          >
                            {lessonCount} {isDsaPatterns ? 'patterns' : 'lessons'}
                          </span>
                          {availableCount > 0 && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                              {availableCount} available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors mt-1" />
                  </div>
                  <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Difficulty breakdown */}
                  {!isDsaPatterns && (
                    <div className="mt-4 flex gap-3">
                      {(['beginner', 'intermediate', 'advanced'] as const).map((d) => {
                        const count = topic.lessons.filter((l) => l.difficulty === d).length;
                        if (count === 0) return null;
                        return (
                          <span
                            key={d}
                            className={cn(
                              'inline-flex items-center gap-1 text-[11px]',
                              d === 'beginner' && 'text-green-500',
                              d === 'intermediate' && 'text-yellow-500',
                              d === 'advanced' && 'text-red-500'
                            )}
                          >
                            <span
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                d === 'beginner' && 'bg-green-500',
                                d === 'intermediate' && 'bg-yellow-500',
                                d === 'advanced' && 'bg-red-500'
                              )}
                            />
                            {count} {d}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Progress bar */}
                  {topicProgress && topicProgress.total > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-zinc-500">
                          {topicProgress.completed}/{topicProgress.total} completed
                        </span>
                        {topicPct > 0 && (
                          <span className="text-[11px] font-medium text-emerald-400">{topicPct}%</span>
                        )}
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                          style={{ width: `${topicPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
