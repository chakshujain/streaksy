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
  Users,
  Zap,
} from 'lucide-react';
import type { UserRoadmap } from '@/lib/types';
import { roadmapTemplates } from '@/lib/roadmap-templates';

const templates = roadmapTemplates;

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

  const sheetTemplates = templates.filter((t) => t.tracked === 'auto');
  const flagship = templates.find((t) => t.flagship);
  const filtered = activeCategory === 'All'
    ? templates.filter((t) => !t.flagship)
    : templates.filter((t) => t.category === activeCategory && !t.flagship);

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
              <p className="text-sm text-zinc-400">Pick one. Customize it. Start with friends.</p>
            </div>
            <Link href="/roadmaps/create">
              <Button variant="gradient" size="md">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Custom
              </Button>
            </Link>
          </div>

          {/* Flagship Hero */}
          {flagship && (
            <Link
              href={`/roadmaps/start/${flagship.slug}`}
              className="group block relative rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-emerald-950/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 overflow-hidden"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-[80px]" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                <span className="text-6xl">{flagship.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{flagship.name}</h2>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400">THE flagship</span>
                  </div>
                  <p className="text-zinc-400 mb-3">{flagship.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                      <Clock className="h-3 w-3" /> {flagship.duration} days
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                      <Users className="h-3 w-3" /> {flagship.participants}+ people
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="primary" size="lg">
                    Customize & Start <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Link>
          )}

          {/* Sheet-Based Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Solve a Problem Sheet</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {sheetTemplates.map((t) => {
                const c = colorClasses[t.color] || colorClasses.emerald;
                return (
                  <div
                    key={t.slug}
                    className={`group relative rounded-2xl border ${c.border} bg-zinc-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl flex-shrink-0">{t.icon}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">{t.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${c.badge}`}>
                        <Clock className="h-2.5 w-2.5" />
                        {t.duration} days
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        Auto-tracked via extension
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                        <Users className="h-3 w-3" /> {t.participants} people on this
                      </span>
                    </div>
                    <Link href={`/roadmaps/start/${t.slug}`}>
                      <Button size="sm" variant="primary" className="w-full">
                        Customize & Start <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          {/* My Active Roadmaps */}
          {activeRoadmaps.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">My Active Roadmaps</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeRoadmaps.map((rm) => {
                  const c = colorClasses[rm.category === 'Coding & Tech' ? 'emerald' : rm.category === 'Fitness & Health' ? 'blue' : 'amber'] || colorClasses.emerald;
                  const pct = rm.durationDays > 0 ? Math.round((rm.completedDays / rm.durationDays) * 100) : 0;
                  return (
                    <Link key={rm.id} href={`/roadmaps/${rm.id}`}>
                      <Card className={`${c.border} hover:bg-zinc-900/80 transition-all cursor-pointer`}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{rm.icon}</span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-white truncate">{rm.name}</h3>
                            <p className="text-xs text-zinc-500">Day {rm.completedDays}/{rm.durationDays}</p>
                          </div>
                          {rm.currentStreak > 0 && (
                            <span className="text-xs font-medium text-orange-400">🔥 {rm.currentStreak}d</span>
                          )}
                        </div>
                        <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div className={`h-full rounded-full bg-emerald-500/60 transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </Card>
                    </Link>
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

          {/* Template grid */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">
                {activeCategory === 'All' ? 'All Roadmaps' : activeCategory}
              </h2>
            </div>
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
                        <p className="text-xs text-zinc-500 mt-0.5">{t.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${c.badge}`}>
                        <Clock className="h-2.5 w-2.5" />
                        {t.duration} days
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[t.difficulty]}`}>
                        {t.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                        <Users className="h-3 w-3" /> {t.participants} people on this
                      </span>
                    </div>
                    <Link href={`/roadmaps/start/${t.slug}`}>
                      <Button size="sm" variant="primary" className="w-full">
                        Customize & Start <ArrowRight className="h-3 w-3 ml-1" />
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
                <h3 className="text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors">Want something unique?</h3>
                <p className="text-xs text-zinc-600 mt-1">Build your own roadmap from scratch</p>
              </Link>
            </div>
          </section>
        </div>
      </PageTransition>
    </AppShell>
  );
}
