'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Users,
  User,
} from 'lucide-react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Template data (duplicated for now — will come from API)            */
/* ------------------------------------------------------------------ */
const templates: Record<string, { slug: string; name: string; icon: string; category: string; color: string; duration: number; difficulty: string; description: string }> = {
  'dsa-patterns-30': { slug: 'dsa-patterns-30', name: 'DSA Patterns', icon: '\u{1F9E9}', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Master 19 essential problem-solving patterns' },
  'interview-prep-30': { slug: 'interview-prep-30', name: 'Interview Prep 30-Day', icon: '\u{1F3AF}', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Structured plan for coding interviews' },
  'interview-prep-60': { slug: 'interview-prep-60', name: 'Interview Prep 60-Day', icon: '\u{1F3AF}', category: 'Coding & Tech', color: 'emerald', duration: 60, difficulty: 'intermediate', description: 'Comprehensive 60-day interview preparation' },
  'interview-prep-90': { slug: 'interview-prep-90', name: 'Interview Prep 90-Day', icon: '\u{1F3AF}', category: 'Coding & Tech', color: 'emerald', duration: 90, difficulty: 'advanced', description: 'Full coverage for senior-level interviews' },
  'learn-databases': { slug: 'learn-databases', name: 'Learn Databases', icon: '\u{1F5C4}\uFE0F', category: 'Coding & Tech', color: 'blue', duration: 14, difficulty: 'beginner', description: 'From SQL basics to sharding and replication' },
  'learn-system-design': { slug: 'learn-system-design', name: 'Learn System Design', icon: '\u{1F3D7}\uFE0F', category: 'Coding & Tech', color: 'purple', duration: 17, difficulty: 'intermediate', description: 'Load balancers to designing Netflix' },
  'learn-oops': { slug: 'learn-oops', name: 'Learn OOP', icon: '\u{1F9F1}', category: 'Coding & Tech', color: 'amber', duration: 14, difficulty: 'beginner', description: 'SOLID principles to design patterns' },
  'learn-multithreading': { slug: 'learn-multithreading', name: 'Learn Multithreading', icon: '\u26A1', category: 'Coding & Tech', color: 'red', duration: 12, difficulty: 'intermediate', description: 'Threads, locks, deadlocks, async' },
  '100-days-of-code': { slug: '100-days-of-code', name: '100 Days of Code', icon: '\u{1F4BB}', category: 'Coding & Tech', color: 'emerald', duration: 100, difficulty: 'beginner', description: 'Code every day for 100 days' },
  'gym-daily-30': { slug: 'gym-daily-30', name: 'Go to Gym Daily', icon: '\u{1F4AA}', category: 'Fitness & Health', color: 'blue', duration: 30, difficulty: 'beginner', description: 'Build a daily gym habit' },
  '10k-steps-30': { slug: '10k-steps-30', name: '10,000 Steps Challenge', icon: '\u{1F3C3}', category: 'Fitness & Health', color: 'blue', duration: 30, difficulty: 'beginner', description: 'Walk 10K steps every day for 30 days' },
  'couch-to-5k': { slug: 'couch-to-5k', name: 'Couch to 5K', icon: '\u{1F3C3}\u200D\u2642\uFE0F', category: 'Fitness & Health', color: 'blue', duration: 60, difficulty: 'beginner', description: 'From zero to running 5 kilometers' },
  'quit-smoking': { slug: 'quit-smoking', name: 'Quit Smoking', icon: '\u{1F6AD}', category: 'Fitness & Health', color: 'red', duration: 90, difficulty: 'advanced', description: '90-day journey to freedom' },
  'meditation-30': { slug: 'meditation-30', name: '30-Day Meditation', icon: '\u{1F9D8}', category: 'Fitness & Health', color: 'purple', duration: 30, difficulty: 'beginner', description: 'Build a mindfulness habit' },
  'read-book-month': { slug: 'read-book-month', name: 'Read 1 Book/Month', icon: '\u{1F4D6}', category: 'Learning & Reading', color: 'amber', duration: 30, difficulty: 'beginner', description: 'Daily reading goals with milestones' },
  'learn-language-90': { slug: 'learn-language-90', name: 'Learn a New Language', icon: '\u{1F30D}', category: 'Learning & Reading', color: 'amber', duration: 90, difficulty: 'intermediate', description: 'Daily practice for 90 days' },
  'daily-journal-30': { slug: 'daily-journal-30', name: 'Write Daily Journal', icon: '\u270D\uFE0F', category: 'Learning & Reading', color: 'amber', duration: 30, difficulty: 'beginner', description: 'Daily journaling for self-reflection' },
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400',
  intermediate: 'bg-amber-500/10 text-amber-400',
  advanced: 'bg-red-500/10 text-red-400',
};

export default function RoadmapStartPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const template = templates[slug];

  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<'solo' | 'friends'>('solo');
  const [groupOption, setGroupOption] = useState<'create' | 'existing' | 'join'>('create');
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!template) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg">Roadmap not found.</p>
          <Link href="/roadmaps" className="text-emerald-400 hover:underline mt-2 inline-block">
            Back to Roadmaps
          </Link>
        </div>
      </AppShell>
    );
  }

  const handleStart = () => {
    setLoading(true);

    const id = `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const shareCode = Math.random().toString(36).slice(2, 8).toUpperCase();

    const roadmap = {
      id,
      name: template.name,
      templateSlug: template.slug,
      category: template.category,
      icon: template.icon,
      durationDays: template.duration,
      startDate,
      status: 'active' as const,
      completedDays: 0,
      currentStreak: 0,
      shareCode,
      groupId: mode === 'friends' && groupOption === 'create' ? `grp_${Date.now()}` : undefined,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]');
      existing.push(roadmap);
      localStorage.setItem('streaksy_active_roadmaps', JSON.stringify(existing));
    } catch { /* empty */ }

    router.push('/roadmaps');
  };

  return (
    <AppShell>
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Back */}
          <Link href="/roadmaps" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </Link>

          {/* Template header */}
          <Card className="border-zinc-800">
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">{template.icon}</span>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{template.name}</h1>
                <p className="text-sm text-zinc-400 mt-1">{template.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                    <Clock className="h-3 w-3" />
                    {template.duration} days
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${difficultyColors[template.difficulty]}`}>
                    {template.difficulty}
                  </span>
                  <span className="text-xs text-zinc-500">{template.category}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Configuration form */}
          <Card>
            <h2 className="text-lg font-semibold text-white mb-6">Configure Your Roadmap</h2>

            {/* Start date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1.5" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Study mode */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-3">Study Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('solo')}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                    mode === 'solo'
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                      : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Solo</p>
                    <p className="text-[11px] text-zinc-500">Just me</p>
                  </div>
                </button>
                <button
                  onClick={() => setMode('friends')}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                    mode === 'friends'
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                      : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-sm font-medium">With Friends</p>
                    <p className="text-[11px] text-zinc-500">Study together</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Group options */}
            {mode === 'friends' && (
              <div className="mb-6 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                <div className="flex gap-2">
                  {(['create', 'existing', 'join'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setGroupOption(opt)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        groupOption === opt
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {opt === 'create' ? 'Create Group' : opt === 'existing' ? 'Use Existing' : 'Join with Code'}
                    </button>
                  ))}
                </div>

                {groupOption === 'create' && (
                  <input
                    type="text"
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                )}

                {groupOption === 'join' && (
                  <input
                    type="text"
                    placeholder="Enter invite code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                  />
                )}

                {groupOption === 'existing' && (
                  <p className="text-xs text-zinc-500">Your existing groups will be loaded from the server.</p>
                )}
              </div>
            )}

            {/* Start button */}
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={handleStart}
              loading={loading}
            >
              Start Roadmap
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Card>
        </div>
      </PageTransition>
    </AppShell>
  );
}
