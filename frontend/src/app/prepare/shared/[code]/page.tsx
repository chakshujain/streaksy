'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  Rocket,
  Calendar,
  Clock,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import {
  type PrepAnswers,
  type FocusTopic,
  topicMeta,
  roleOptions,
  levelOptions,
  savePrepAnswers,
  saveRoadmap,
  generateRoadmap,
} from '@/lib/interview-planner';
import { useAuthStore } from '@/lib/store';

const topicColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

interface SharedConfig {
  role: string;
  totalDays: number;
  hoursPerDay: number;
  level: string;
  focusTopics: FocusTopic[];
}

export default function SharedRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [config, setConfig] = useState<SharedConfig | null>(null);
  const [error, setError] = useState(false);
  const [generating, setGenerating] = useState(false);

  const code = params.code as string;

  useEffect(() => {
    if (!code) return;
    try {
      // Pad the base64 string if needed
      let padded = code;
      while (padded.length % 4 !== 0) {
        padded += '=';
      }
      const decoded = JSON.parse(atob(padded));
      if (decoded.role && decoded.totalDays && decoded.focusTopics) {
        setConfig(decoded);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, [code]);

  const handleUsePlan = async () => {
    if (!config) return;
    setGenerating(true);

    await new Promise(r => setTimeout(r, 600));

    const answers: PrepAnswers = {
      role: config.role as PrepAnswers['role'],
      totalDays: config.totalDays,
      hoursPerDay: config.hoursPerDay,
      level: config.level as PrepAnswers['level'],
      studyMode: 'solo',
      focusTopics: config.focusTopics,
    };

    savePrepAnswers(answers);
    const roadmap = generateRoadmap(answers);
    saveRoadmap(roadmap);
    router.push('/prepare/roadmap');
  };

  const roleLabel =
    config &&
    (roleOptions.find(r => r.value === config.role)?.label ||
      config.role.replace('-', ' '));

  const levelLabel =
    config &&
    (levelOptions.find(l => l.value === config.level)?.label || config.level);

  if (error) {
    return (
      <AppShell>
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="text-4xl mb-4">🔗</div>
          <h1 className="text-xl font-bold text-zinc-100 mb-2">
            Invalid Share Link
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            This link is broken or has expired. Ask your friend for a new one.
          </p>
          <Button variant="primary" onClick={() => router.push('/prepare')}>
            Create Your Own Plan
          </Button>
        </div>
      </AppShell>
    );
  }

  if (!config) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/15 mb-4">
            <Rocket className="h-7 w-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">Shared Study Plan</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Someone shared their interview prep plan with you
          </p>
        </div>

        <Card>
          <div className="space-y-4">
            {/* Role */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                <BookOpen className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Role</p>
                <p className="text-sm font-medium text-zinc-200">{roleLabel}</p>
              </div>
            </div>

            {/* Days */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                <Calendar className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Duration</p>
                <p className="text-sm font-medium text-zinc-200">
                  {config.totalDays} days
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                <Clock className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Daily Commitment</p>
                <p className="text-sm font-medium text-zinc-200">
                  {config.hoursPerDay} hours/day ({config.totalDays * config.hoursPerDay}h total)
                </p>
              </div>
            </div>

            {/* Level */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                <BarChart3 className="h-4 w-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Level</p>
                <p className="text-sm font-medium text-zinc-200">{levelLabel}</p>
              </div>
            </div>

            {/* Topics */}
            <div>
              <p className="text-xs text-zinc-500 mb-2">Focus Topics</p>
              <div className="flex flex-wrap gap-2">
                {config.focusTopics.map(t => {
                  const meta = topicMeta[t];
                  if (!meta) return null;
                  return (
                    <span
                      key={t}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium',
                        topicColorMap[meta.color],
                      )}
                    >
                      {meta.icon} {meta.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {user ? (
          <Button
            variant="gradient"
            size="lg"
            className="w-full gap-2"
            onClick={handleUsePlan}
            loading={generating}
          >
            <Rocket className="h-4 w-4" />
            Use This Plan
          </Button>
        ) : (
          <Card className="text-center">
            <p className="text-sm text-zinc-400 mb-3">
              Log in to generate this plan for yourself
            </p>
            <Button
              variant="gradient"
              onClick={() => router.push('/auth/login')}
              className="gap-2"
            >
              Log In to Continue
            </Button>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
