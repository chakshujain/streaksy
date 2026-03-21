'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  Map,
  Plus,
  ArrowRight,
  Clock,
  Star,
  Sparkles,
} from 'lucide-react';
import type { UserRoadmap } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Template data                                                      */
/* ------------------------------------------------------------------ */
const templates = [
  { slug: 'dsa-patterns-30', name: 'DSA Patterns', icon: '\u{1F9E9}', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Master 19 essential problem-solving patterns', featured: true },
  { slug: 'interview-prep-30', name: 'Interview Prep 30-Day', icon: '\u{1F3AF}', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Structured plan for coding interviews', featured: true },
  { slug: 'interview-prep-60', name: 'Interview Prep 60-Day', icon: '\u{1F3AF}', category: 'Coding & Tech', color: 'emerald', duration: 60, difficulty: 'intermediate', description: 'Comprehensive 60-day interview preparation' },
  { slug: 'interview-prep-90', name: 'Interview Prep 90-Day', icon: '\u{1F3AF}', category: 'Coding & Tech', color: 'emerald', duration: 90, difficulty: 'advanced', description: 'Full coverage for senior-level interviews' },
  { slug: 'learn-databases', name: 'Learn Databases', icon: '\u{1F5C4}\uFE0F', category: 'Coding & Tech', color: 'blue', duration: 14, difficulty: 'beginner', description: 'From SQL basics to sharding and replication' },
  { slug: 'learn-system-design', name: 'Learn System Design', icon: '\u{1F3D7}\uFE0F', category: 'Coding & Tech', color: 'purple', duration: 17, difficulty: 'intermediate', description: 'Load balancers to designing Netflix' },
  { slug: 'learn-oops', name: 'Learn OOP', icon: '\u{1F9F1}', category: 'Coding & Tech', color: 'amber', duration: 14, difficulty: 'beginner', description: 'SOLID principles to design patterns' },
  { slug: 'learn-multithreading', name: 'Learn Multithreading', icon: '\u26A1', category: 'Coding & Tech', color: 'red', duration: 12, difficulty: 'intermediate', description: 'Threads, locks, deadlocks, async' },
  { slug: '100-days-of-code', name: '100 Days of Code', icon: '\u{1F4BB}', category: 'Coding & Tech', color: 'emerald', duration: 100, difficulty: 'beginner', description: 'Code every day for 100 days', featured: true },
  { slug: 'gym-daily-30', name: 'Go to Gym Daily', icon: '\u{1F4AA}', category: 'Fitness & Health', color: 'blue', duration: 30, difficulty: 'beginner', description: 'Build a daily gym habit' },
  { slug: '10k-steps-30', name: '10,000 Steps Challenge', icon: '\u{1F3C3}', category: 'Fitness & Health', color: 'blue', duration: 30, difficulty: 'beginner', description: 'Walk 10K steps every day for 30 days' },
  { slug: 'couch-to-5k', name: 'Couch to 5K', icon: '\u{1F3C3}\u200D\u2642\uFE0F', category: 'Fitness & Health', color: 'blue', duration: 60, difficulty: 'beginner', description: 'From zero to running 5 kilometers' },
  { slug: 'quit-smoking', name: 'Quit Smoking', icon: '\u{1F6AD}', category: 'Fitness & Health', color: 'red', duration: 90, difficulty: 'advanced', description: '90-day journey to freedom' },
  { slug: 'meditation-30', name: '30-Day Meditation', icon: '\u{1F9D8}', category: 'Fitness & Health', color: 'purple', duration: 30, difficulty: 'beginner', description: 'Build a mindfulness habit' },
  { slug: 'read-book-month', name: 'Read 1 Book/Month', icon: '\u{1F4D6}', category: 'Learning & Reading', color: 'amber', duration: 30, difficulty: 'beginner', description: 'Daily reading goals with milestones', featured: true },
  { slug: 'learn-language-90', name: 'Learn a New Language', icon: '\u{1F30D}', category: 'Learning & Reading', color: 'amber', duration: 90, difficulty: 'intermediate', description: 'Daily practice for 90 days' },
  { slug: 'daily-journal-30', name: 'Write Daily Journal', icon: '\u270D\uFE0F', category: 'Learning & Reading', color: 'amber', duration: 30, difficulty: 'beginner', description: 'Daily journaling for self-reflection' },
];

const categories = ['All', 'Coding & Tech', 'Fitness & Health', 'Learning & Reading'];

const colorClasses: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400' },
  blue: { border: 'border-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400' },
  purple: { border: 'border-purple-500/20', bg: 'bg-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400' },
  amber: { border: 'border-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400' },
  red: { border: 'border-red-500/20', bg: 'bg-red-500/10', text: 'text-red-400', badge: 'bg-red-500/10 text-red-400' },
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400',
  intermediate: 'bg-amber-500/10 text-amber-400',
  advanced: 'bg-red-500/10 text-red-400',
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function RoadmapsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRoadmaps, setActiveRoadmaps] = useState<UserRoadmap[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('streaksy_active_roadmaps');
      if (stored) setActiveRoadmaps(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  const featured = templates.filter((t) => t.featured);
  const filtered = activeCategory === 'All'
    ? templates
    : templates.filter((t) => t.category === activeCategory);

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Map className="h-6 w-6 text-emerald-400" />
                <h1 className="text-2xl font-bold text-white">Roadmaps</h1>
              </div>
              <p className="text-sm text-zinc-400">Pick a goal. Follow a plan. Track your streak.</p>
            </div>
            <Link href="/roadmaps/create">
              <Button variant="gradient" size="md">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Custom
              </Button>
            </Link>
          </div>

          {/* My Active Roadmaps */}
          {activeRoadmaps.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">My Active Roadmaps</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeRoadmaps.map((rm) => {
                  const c = colorClasses[rm.category === 'Coding & Tech' ? 'emerald' : rm.category === 'Fitness & Health' ? 'blue' : 'amber'] || colorClasses.emerald;
                  const pct = rm.durationDays > 0 ? Math.round((rm.completedDays / rm.durationDays) * 100) : 0;
                  return (
                    <Card key={rm.id} className={`${c.border} hover:bg-zinc-900/80 transition-all cursor-pointer`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{rm.icon}</span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-white truncate">{rm.name}</h3>
                          <p className="text-xs text-zinc-500">Day {rm.completedDays}/{rm.durationDays}</p>
                        </div>
                        {rm.currentStreak > 0 && (
                          <span className="text-xs font-medium text-orange-400">{'\u{1F525}'} {rm.currentStreak}d</span>
                        )}
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div className={`h-full rounded-full ${c.bg.replace('/10', '/60')} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured */}
          {activeCategory === 'All' && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">Featured</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((t) => {
                  const c = colorClasses[t.color] || colorClasses.emerald;
                  return (
                    <div
                      key={t.slug}
                      className={`group relative rounded-2xl border ${c.border} bg-zinc-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-lg`}
                    >
                      <div className="absolute top-3 right-3">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      </div>
                      <span className="text-3xl block mb-3">{t.icon}</span>
                      <h3 className="text-base font-semibold text-white mb-1">{t.name}</h3>
                      <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{t.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${c.badge}`}>
                          <Clock className="h-2.5 w-2.5" />
                          {t.duration} days
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[t.difficulty]}`}>
                          {t.difficulty}
                        </span>
                      </div>
                      <Link href={`/roadmaps/start/${t.slug}`}>
                        <Button size="sm" variant="primary" className="w-full">
                          Start <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Template grid */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-4">
              {activeCategory === 'All' ? 'All Roadmaps' : activeCategory}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t) => {
                const c = colorClasses[t.color] || colorClasses.emerald;
                return (
                  <div
                    key={t.slug}
                    className={`group rounded-2xl border ${c.border} bg-zinc-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">{t.icon}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">{t.category}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-3 line-clamp-2">{t.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${c.badge}`}>
                        <Clock className="h-2.5 w-2.5" />
                        {t.duration} days
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[t.difficulty]}`}>
                        {t.difficulty}
                      </span>
                    </div>
                    <Link href={`/roadmaps/start/${t.slug}`}>
                      <Button size="sm" variant="primary" className="w-full">
                        Start <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })}

              {/* Create Custom card */}
              <Link
                href="/roadmaps/create"
                className="group rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:bg-zinc-900/50 flex flex-col items-center justify-center text-center min-h-[200px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 group-hover:bg-emerald-500/10 transition-colors mb-3">
                  <Plus className="h-6 w-6 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors">Create Custom Roadmap</h3>
                <p className="text-xs text-zinc-600 mt-1">Design your own plan from scratch</p>
              </Link>
            </div>
          </section>
        </div>
      </PageTransition>
    </AppShell>
  );
}
