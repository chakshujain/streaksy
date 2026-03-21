'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Rocket, ArrowRight, GraduationCap, Users } from 'lucide-react';
import type { Roadmap } from '@/lib/interview-planner';
import { loadRoadmap, loadProgress, roleOptions } from '@/lib/interview-planner';

const phaseColors: Record<string, string> = {
  Fundamentals: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Core Practice': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Advanced: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Review: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

export function PrepProgressWidget() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const rm = loadRoadmap();
    const pr = loadProgress();
    setRoadmap(rm);
    setProgress(pr);
  }, []);

  if (!mounted) return null;

  // No active roadmap — show CTA
  if (!roadmap) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/20 transition-all duration-300">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 border border-emerald-500/10">
              <GraduationCap className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Start Interview Prep</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Get a personalized study plan based on your role, level, and timeline
              </p>
            </div>
          </div>
          <Link href="/prepare">
            <Button size="sm" variant="primary" className="gap-1.5">
              Get Started <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Has active roadmap — show progress
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalDays = roadmap.totalDays;
  const pct = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;

  // Find current day (first incomplete day)
  const currentDayIdx = roadmap.days.findIndex((d) => !progress[d.day]);
  const currentDay = currentDayIdx >= 0 ? roadmap.days[currentDayIdx] : roadmap.days[roadmap.days.length - 1];
  const dayNumber = currentDay?.day ?? completedCount;

  const phaseName = currentDay?.phaseName ?? 'Review';
  const phaseStyle = phaseColors[phaseName] ?? phaseColors['Review'];

  const roleMeta = roleOptions.find((r) => r.value === roadmap.answers.role);
  const isGroupStudy = roadmap.answers.studyMode === 'group';

  return (
    <Card
      variant="glow"
      className="relative overflow-hidden border-emerald-500/20"
    >
      {/* Subtle gradient glow */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/10">
              <Rocket className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Interview Prep</h3>
              {roleMeta && (
                <p className="text-xs text-zinc-500">{roleMeta.label} track</p>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${phaseStyle}`}>
            {phaseName}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-400">
              Day {dayNumber} of {totalDays}
            </span>
            <span className="font-semibold text-emerald-400">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Today's task */}
        {currentDay && (
          <div className="rounded-xl border border-zinc-800/50 bg-zinc-800/30 px-4 py-3 mb-4">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">Today&apos;s Task</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-200">{currentDay.title}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium bg-${currentDay.topicColor}-500/15 text-${currentDay.topicColor}-400 border-${currentDay.topicColor}-500/30`}
              >
                {currentDay.topicIcon} {currentDay.topicLabel}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          {isGroupStudy && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Users className="h-3.5 w-3.5" />
              Group study mode
            </div>
          )}
          <div className="ml-auto">
            <Link href="/prepare/roadmap">
              <Button size="sm" variant="primary" className="gap-1.5">
                Continue <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
