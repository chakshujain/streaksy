'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  ArrowLeft,
  Trophy,
  XCircle,
  Flame,
  Clock,
  CheckCircle,
  Target,
  TrendingUp,
  CalendarDays,
  History,
  Loader2,
} from 'lucide-react';
import { roadmapsApi } from '@/lib/api';
import { templatesBySlug } from '@/lib/roadmap-templates';
import type { UserRoadmap } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

type HistoryRoadmap = UserRoadmap & { leftAt?: string };

const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    icon: Trophy,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  abandoned: {
    label: 'Left',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    badge: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  paused: {
    label: 'Paused',
    icon: Clock,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  active: {
    label: 'Active',
    icon: Flame,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
};

export default function RoadmapHistoryPage() {
  const [roadmaps, setRoadmaps] = useState<HistoryRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'abandoned'>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Try backend first
        const { data } = await roadmapsApi.getAll();
        const all = (data.roadmaps || data || []).map((r: Record<string, unknown>) => ({
          id: r.id as string,
          name: r.name as string,
          templateSlug: (r.template_slug || r.templateSlug || '') as string,
          category: (r.category_slug || r.category || '') as string,
          icon: (r.category_icon || r.icon || '') as string,
          durationDays: (r.duration_days || r.durationDays || 0) as number,
          startDate: (r.start_date || r.startDate || '') as string,
          status: (r.status || 'active') as UserRoadmap['status'],
          completedDays: (r.completed_days || r.completedDays || 0) as number,
          currentStreak: 0,
          shareCode: (r.share_code || r.shareCode || '') as string,
          groupId: (r.group_id || r.groupId || '') as string,
        }));
        setRoadmaps(all);
      } catch {
        // Fallback to localStorage
        try {
          const active = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]');
          const history = JSON.parse(localStorage.getItem('streaksy_roadmap_history') || '[]');
          setRoadmaps([...active, ...history]);
        } catch { /* empty */ }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return roadmaps.filter(r => r.status !== 'active');
    return roadmaps.filter(r => r.status === filter);
  }, [roadmaps, filter]);

  const stats = useMemo(() => {
    const completed = roadmaps.filter(r => r.status === 'completed').length;
    const abandoned = roadmaps.filter(r => r.status === 'abandoned').length;
    const active = roadmaps.filter(r => r.status === 'active').length;
    const total = completed + abandoned;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalDaysCompleted = roadmaps.reduce((s, r) => s + (r.completedDays || 0), 0);
    return { completed, abandoned, active, completionRate, totalDaysCompleted };
  }, [roadmaps]);

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Back */}
          <Link href="/roadmaps" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </Link>

          {/* Header */}
          <div className="animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/10">
                <History className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Goal History</h1>
                <p className="text-sm text-zinc-500">Track your journey — completed goals and ones you left behind</p>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Completed', value: stats.completed, icon: Trophy, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-green-500/20' },
                { label: 'Left', value: stats.abandoned, icon: XCircle, color: 'text-red-400', bg: 'from-red-500/20 to-rose-500/20' },
                { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: Target, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/20' },
                { label: 'Total Days Done', value: stats.totalDaysCompleted, icon: TrendingUp, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/20' },
              ].map((s) => (
                <Card key={s.label} className="border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.bg}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">{s.value}</p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.label}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Active goals count */}
          {stats.active > 0 && (
            <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/10 px-4 py-3 flex items-center gap-3">
              <Flame className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-zinc-300">
                You have <span className="font-semibold text-cyan-400">{stats.active}</span> active roadmap{stats.active !== 1 ? 's' : ''} right now.
              </span>
              <Link href="/roadmaps" className="ml-auto text-xs text-cyan-400 hover:text-cyan-300">
                View
              </Link>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2">
            {(['all', 'completed', 'abandoned'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                {f === 'all' ? 'All History' : f === 'completed' ? 'Completed' : 'Left'}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <History className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg mb-2">No history yet</p>
              <p className="text-sm text-zinc-600 mb-4">
                {filter === 'completed'
                  ? 'Complete a roadmap to see it here!'
                  : filter === 'abandoned'
                  ? "You haven't left any roadmaps. Keep it up!"
                  : 'Start a roadmap and your journey will be tracked here.'}
              </p>
              <Link href="/roadmaps" className="text-emerald-400 hover:text-emerald-300 text-sm">
                Browse Roadmaps
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((rm) => {
                const config = STATUS_CONFIG[rm.status] || STATUS_CONFIG.abandoned;
                const StatusIcon = config.icon;
                const pct = rm.durationDays > 0 ? Math.round((rm.completedDays / rm.durationDays) * 100) : 0;
                const tmpl = rm.templateSlug ? templatesBySlug[rm.templateSlug] : null;
                const icon = tmpl?.icon || rm.icon || '';

                return (
                  <Card key={rm.id} className="border-zinc-800/50 hover:bg-zinc-900/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl flex-shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-white truncate">{rm.name}</h3>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${config.badge}`}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {rm.completedDays}/{rm.durationDays} days ({pct}%)
                          </span>
                          {rm.startDate && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              Started {formatDistanceToNow(new Date(rm.startDate), { addSuffix: true })}
                            </span>
                          )}
                          {rm.category && (
                            <span className="text-zinc-600">{rm.category}</span>
                          )}
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              rm.status === 'completed' ? 'bg-emerald-500' : 'bg-red-500/60'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
