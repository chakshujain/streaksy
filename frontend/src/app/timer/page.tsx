'use client';

import { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageTransition } from '@/components/ui/PageTransition';
import { Card } from '@/components/ui/Card';
import { StudyTimer, loadStats, getTodayKey, type StudyStats } from '@/components/timer/StudyTimer';
import { cn } from '@/lib/cn';
import {
  Timer,
  Clock,
  Flame,
  BarChart3,
  Zap,
} from 'lucide-react';

const PRESETS = [
  { label: '25 min', focus: 25, breakMin: 5 },
  { label: '45 min', focus: 45, breakMin: 10 },
  { label: '60 min', focus: 60, breakMin: 15 },
];

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function getWeekDays(): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en', { weekday: 'short' });
}

/** Compute a simple study streak from daily stats */
function computeStreak(dailySessions: Record<string, number>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dailySessions[key] && dailySessions[key] > 0) {
      streak++;
    } else {
      // Allow today to be missing (day not yet completed)
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

export default function TimerPage() {
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [customFocus, setCustomFocus] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Load stats on mount and poll every 5s to pick up timer completions
  useEffect(() => {
    setStats(loadStats());
    const interval = setInterval(() => setStats(loadStats()), 5000);
    return () => clearInterval(interval);
  }, []);

  const todayKey = getTodayKey();
  const todaySeconds = stats?.dailySeconds[todayKey] || 0;
  const todaySessions = stats?.dailySessions[todayKey] || 0;
  const streak = useMemo(() => (stats ? computeStreak(stats.dailySessions) : 0), [stats]);

  const weekDays = useMemo(() => getWeekDays(), []);
  const weekData = useMemo(() => {
    if (!stats) return weekDays.map(() => 0);
    return weekDays.map((d) => (stats.dailySeconds[d] || 0) / 60); // in minutes
  }, [stats, weekDays]);
  const maxWeek = Math.max(...weekData, 1);

  const handleCustom = () => {
    const val = parseInt(customFocus, 10);
    if (val > 0 && val <= 180) {
      setFocusMinutes(val);
      setBreakMinutes(Math.max(5, Math.round(val / 5)));
      setShowCustom(false);
      setCustomFocus('');
    }
  };

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20">
                <Timer className="h-5 w-5 text-emerald-400" />
              </div>
              Study Timer
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Stay focused with Pomodoro sessions. Track your study time.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Left: Timer */}
            <div className="space-y-6">
              {/* Timer card */}
              <Card className="flex flex-col items-center py-10">
                <StudyTimer
                  initialFocus={focusMinutes}
                  initialBreak={breakMinutes}
                />
              </Card>

              {/* Presets */}
              <Card>
                <h2 className="text-sm font-semibold text-zinc-300 mb-3">Quick Start</h2>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => { setFocusMinutes(p.focus); setBreakMinutes(p.breakMin); }}
                      className={cn(
                        'rounded-xl px-4 py-2 text-sm font-medium transition-all',
                        focusMinutes === p.focus
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 border border-zinc-700'
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                  {!showCustom ? (
                    <button
                      onClick={() => setShowCustom(true)}
                      className="rounded-xl px-4 py-2 text-sm font-medium bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 border border-zinc-700 transition-all"
                    >
                      Custom
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={180}
                        placeholder="min"
                        value={customFocus}
                        onChange={(e) => setCustomFocus(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
                        className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={handleCustom}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 transition-colors"
                      >
                        Set
                      </button>
                      <button
                        onClick={() => setShowCustom(false)}
                        className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Stats */}
            <div className="space-y-4">
              {/* Today stats */}
              <Card>
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-500" />
                  Today
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-4">
                    <p className="text-2xl font-bold text-emerald-400">{formatTime(todaySeconds)}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Study time</p>
                  </div>
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-4">
                    <p className="text-2xl font-bold text-cyan-400">{todaySessions}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Sessions</p>
                  </div>
                </div>
              </Card>

              {/* Overall stats */}
              <Card>
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-zinc-500" />
                  All Time
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-4">
                    <p className="text-2xl font-bold text-zinc-200">{formatTime(stats?.totalSeconds || 0)}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Total study</p>
                  </div>
                  <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 p-4">
                    <p className="text-2xl font-bold text-zinc-200">{stats?.totalSessions || 0}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Sessions</p>
                  </div>
                </div>
              </Card>

              {/* Streak */}
              <Card>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
                    <Flame className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-orange-400">{streak}</p>
                    <p className="text-xs text-zinc-500">Day study streak</p>
                  </div>
                </div>
              </Card>

              {/* Weekly chart */}
              <Card>
                <h2 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-zinc-500" />
                  This Week
                </h2>
                <div className="flex items-end gap-2 h-32">
                  {weekDays.map((day, i) => {
                    const val = weekData[i];
                    const heightPct = Math.max(4, (val / maxWeek) * 100);
                    const isToday = day === todayKey;
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {val > 0 ? `${Math.round(val)}m` : ''}
                        </span>
                        <div className="w-full flex items-end" style={{ height: '80px' }}>
                          <div
                            className={cn(
                              'w-full rounded-t-md transition-all',
                              isToday
                                ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                                : val > 0
                                  ? 'bg-gradient-to-t from-zinc-700 to-zinc-500'
                                  : 'bg-zinc-800'
                            )}
                            style={{ height: `${heightPct}%`, minHeight: '3px' }}
                          />
                        </div>
                        <span className={cn('text-[10px]', isToday ? 'text-emerald-400 font-semibold' : 'text-zinc-600')}>
                          {getDayLabel(day)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
