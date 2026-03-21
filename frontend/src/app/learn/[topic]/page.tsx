'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { topics } from '@/lib/learn-data';
import { cn } from '@/lib/cn';
import { ArrowLeft, ArrowRight, Clock, Lock } from 'lucide-react';

const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    accent: 'bg-emerald-500',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    accent: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    accent: 'bg-purple-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    accent: 'bg-amber-500',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    accent: 'bg-red-500',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
    accent: 'bg-cyan-500',
  },
  zinc: {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/20',
    accent: 'bg-zinc-500',
  },
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-green-500/15', text: 'text-green-400' },
  intermediate: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  advanced: { bg: 'bg-red-500/15', text: 'text-red-400' },
};

export default function TopicPage() {
  const params = useParams();
  const topicSlug = params.topic as string;
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

  const colors = colorMap[topic.color] || colorMap.blue;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Back link */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Learning Hub
        </Link>

        {/* Topic header */}
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0',
              colors.bg
            )}
          >
            <span className="text-3xl">{topic.icon}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{topic.name}</h1>
            <p className="mt-1 text-sm text-zinc-400 max-w-2xl">{topic.description}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-zinc-500">
                {topic.lessons.length} lessons
              </span>
              <span className="text-zinc-700">|</span>
              {(['beginner', 'intermediate', 'advanced'] as const).map((d) => {
                const count = topic.lessons.filter((l) => l.difficulty === d).length;
                if (count === 0) return null;
                const dc = difficultyColors[d];
                return (
                  <span
                    key={d}
                    className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                      dc.bg,
                      dc.text
                    )}
                  >
                    {count} {d}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lessons list */}
        <div className="space-y-3">
          {topic.lessons.map((lesson, index) => {
            const hasContent = lesson.steps.length > 0;
            const dc = difficultyColors[lesson.difficulty];

            return hasContent ? (
              <Link
                key={lesson.slug}
                href={`/learn/${topic.slug}/${lesson.slug}`}
              >
                <Card className="group cursor-pointer hover:border-zinc-700 transition-all duration-200 mb-3">
                  <div className="flex items-center gap-4">
                    {/* Number badge */}
                    <div
                      className={cn(
                        'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                        colors.bg,
                        colors.text
                      )}
                    >
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors truncate">
                          {lesson.title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                          dc.bg,
                          dc.text
                        )}
                      >
                        {lesson.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </span>
                      <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ) : (
              <Card
                key={lesson.slug}
                className="opacity-60 mb-3"
              >
                <div className="flex items-center gap-4">
                  {/* Number badge */}
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold bg-zinc-800/50 text-zinc-600'
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-zinc-400 truncate">
                        {lesson.title}
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-600 line-clamp-1">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                        dc.bg,
                        dc.text
                      )}
                    >
                      {lesson.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                      <Clock className="h-3 w-3" />
                      {lesson.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600">
                      <Lock className="h-3 w-3" />
                      Coming Soon
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
