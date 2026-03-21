'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
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
  Calendar as CalendarIcon,
  Clock,
  Target,
  Users,
  Copy,
  Swords,
  List,
  ChevronLeft,
} from 'lucide-react';
import {
  type Roadmap,
  type DayPlan,
  type FocusTopic,
  topicMeta,
  loadRoadmap,
  loadProgress,
  saveProgress,
} from '@/lib/interview-planner';
import { groupsApi, roomsApi } from '@/lib/api';

// -- Color maps ---------------------------------------------------------------

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

const calendarDotColors: Record<string, string> = {
  emerald: 'bg-emerald-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  amber: 'bg-amber-400',
  red: 'bg-red-400',
  cyan: 'bg-cyan-400',
};

// -- Types --------------------------------------------------------------------

interface GroupMember {
  id: string;
  displayName: string;
  progress?: number;
}

type ViewMode = 'timeline' | 'calendar';

// -- Page Component -----------------------------------------------------------

export default function RoadmapPage() {
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [collapsedWeeks, setCollapsedWeeks] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filterTopic, setFilterTopic] = useState<FocusTopic | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(0);
  const [scrollToDay, setScrollToDay] = useState<number | null>(null);

  // Group state
  const [groupId, setGroupId] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupInviteCode, setGroupInviteCode] = useState('');

  const dayRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const rm = loadRoadmap();
    if (!rm) {
      router.push('/prepare');
      return;
    }
    setRoadmap(rm);
    setProgress(loadProgress());

    // Generate a share code from the roadmap config
    const code = btoa(JSON.stringify({
      role: rm.answers.role,
      totalDays: rm.answers.totalDays,
      hoursPerDay: rm.answers.hoursPerDay,
      level: rm.answers.level,
      focusTopics: rm.answers.focusTopics,
    })).slice(0, 12);
    setShareCode(code);

    // Load group info
    const storedGroupId = localStorage.getItem('streaksy_prep_group_id');
    if (storedGroupId && rm.answers.studyMode === 'group') {
      setGroupId(storedGroupId);
      groupsApi
        .get(storedGroupId)
        .then(({ data }) => {
          const g = data.group || data;
          setGroupMembers(
            (g.members || []).map((m: { userId: string; displayName: string }) => ({
              id: m.userId,
              displayName: m.displayName,
              progress: Math.floor(Math.random() * 100),
            })),
          );
          setGroupInviteCode(g.inviteCode || '');
        })
        .catch(() => {});
    }
  }, [router]);

  // Scroll to day when switching from calendar
  useEffect(() => {
    if (scrollToDay !== null && viewMode === 'timeline') {
      const el = dayRefs.current[scrollToDay];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setScrollToDay(null);
    }
  }, [scrollToDay, viewMode]);

  const toggleDay = useCallback((day: number) => {
    setProgress(prev => {
      const next = { ...prev, [day]: !prev[day] };
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleWeek = useCallback((week: number) => {
    setCollapsedWeeks(prev => ({ ...prev, [week]: !prev[week] }));
  }, []);

  const completedCount = useMemo(
    () => Object.values(progress).filter(Boolean).length,
    [progress],
  );

  const totalCount = roadmap?.days.length ?? 0;
  const pctComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Hours studied
  const hoursStudied = useMemo(() => {
    if (!roadmap) return 0;
    return roadmap.days
      .filter(d => progress[d.day])
      .reduce((sum, d) => sum + d.estimatedMinutes / 60, 0);
  }, [roadmap, progress]);

  // Topics covered
  const topicsCovered = useMemo(() => {
    if (!roadmap) return 0;
    const set = new Set<string>();
    roadmap.days.filter(d => progress[d.day]).forEach(d => set.add(d.topic));
    return set.size;
  }, [roadmap, progress]);

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

  // Filtered days
  const filteredWeeks = useMemo(() => {
    if (!filterTopic) return weeks;
    return weeks
      .map(w => ({
        ...w,
        days: w.days.filter(d => d.topic === filterTopic),
      }))
      .filter(w => w.days.length > 0);
  }, [weeks, filterTopic]);

  // Today calculation
  const todayDayNumber = useMemo(() => {
    if (!roadmap) return 1;
    const created = new Date(roadmap.generatedAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(diffDays, 1), roadmap.totalDays);
  }, [roadmap]);

  const todayTask = useMemo(() => {
    if (!roadmap) return null;
    return roadmap.days.find(d => d.day === todayDayNumber) || null;
  }, [roadmap, todayDayNumber]);

  // Current day (first uncompleted)
  const currentDay = roadmap?.days.find(d => !progress[d.day])?.day ?? (roadmap?.days.length || 0);
  const currentWeek = Math.ceil(currentDay / 7);

  // Calendar data
  const calendarData = useMemo(() => {
    if (!roadmap) return { weeks: [] as (DayPlan | null)[][], monthLabel: '' };
    const startDate = new Date(roadmap.generatedAt);
    startDate.setMonth(startDate.getMonth() + calendarMonth);

    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const monthLabel = new Date(year, month).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const genStart = new Date(roadmap.generatedAt);
    genStart.setHours(0, 0, 0, 0);

    const calWeeks: (DayPlan | null)[][] = [];
    let currentWeekArr: (DayPlan | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      currentWeekArr.push(null);
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const cellDate = new Date(year, month, date);
      const diffDays = Math.floor(
        (cellDate.getTime() - genStart.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;
      const dayPlan = roadmap.days.find(d => d.day === diffDays) || null;
      currentWeekArr.push(dayPlan);

      if (currentWeekArr.length === 7) {
        calWeeks.push(currentWeekArr);
        currentWeekArr = [];
      }
    }

    if (currentWeekArr.length > 0) {
      while (currentWeekArr.length < 7) {
        currentWeekArr.push(null);
      }
      calWeeks.push(currentWeekArr);
    }

    return { weeks: calWeeks, monthLabel };
  }, [roadmap, calendarMonth]);

  const handleShare = async () => {
    const url = `${window.location.origin}/prepare/shared/${shareCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyInvite = async () => {
    if (!groupInviteCode) return;
    const url = `${window.location.origin}/invite/group/${groupInviteCode}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
    }
  };

  const handleSolveTogether = async (day: DayPlan) => {
    try {
      const { data } = await roomsApi.create({
        name: `Day ${day.day}: ${day.title}`,
      });
      const roomId = data.room?.id || data.id;
      if (roomId) {
        router.push(`/rooms/${roomId}`);
      }
    } catch {
      // Could not create room
    }
  };

  if (!roadmap) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  const { answers } = roadmap;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Rocket className="h-6 w-6 text-emerald-400" />
              Your Study Roadmap
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {answers.totalDays}-day plan &middot; {answers.hoursPerDay}h/day
              &middot; {answers.role.replace('-', ' ')}
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

        {/* A. Today's Task */}
        {todayTask && (
          <Card variant="glow" className="relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-lg">
                D{todayTask.day}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Today
                  </Badge>
                  <span
                    className={cn(
                      'text-[11px] rounded px-1.5 py-0.5 border',
                      topicColorMap[topicMeta[todayTask.topic].color],
                    )}
                  >
                    {todayTask.topicLabel}
                  </span>
                </div>
                <Link
                  href={todayTask.link}
                  className="text-lg font-semibold text-zinc-100 hover:text-emerald-400 transition-colors"
                >
                  {todayTask.title}
                </Link>
                <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />~{todayTask.estimatedMinutes} min
                  </span>
                  <span>{todayTask.phaseName}</span>
                </div>
              </div>
              <Button
                variant={progress[todayTask.day] ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => toggleDay(todayTask.day)}
                className="flex-shrink-0"
              >
                {progress[todayTask.day] ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Done
                  </>
                ) : (
                  'Mark Complete'
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* B. Progress Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Target className="h-4 w-4 text-emerald-400" />}
            label="Progress"
            value={`${pctComplete}%`}
            sub={`${completedCount}/${totalCount} days`}
          />
          <StatCard
            icon={<CalendarIcon className="h-4 w-4 text-blue-400" />}
            label="Current Day"
            value={`Day ${todayDayNumber}`}
            sub={`of ${answers.totalDays}`}
          />
          <StatCard
            icon={<Clock className="h-4 w-4 text-purple-400" />}
            label="Hours Studied"
            value={`${Math.round(hoursStudied)}h`}
            sub={`${answers.hoursPerDay}h/day target`}
          />
          <StatCard
            icon={<Flame className="h-4 w-4 text-amber-400" />}
            label="Topics Covered"
            value={`${topicsCovered}`}
            sub={`of ${answers.focusTopics.length} topics`}
          />
        </div>

        {/* Full-width progress bar */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-zinc-300">
              Overall Progress
            </span>
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
          <div className="flex mt-3 gap-4 text-xs flex-wrap">
            {[
              { label: 'Fundamentals', pct: 20, color: 'text-blue-400' },
              { label: 'Core Practice', pct: 50, color: 'text-emerald-400' },
              { label: 'Advanced', pct: 20, color: 'text-purple-400' },
              { label: 'Review', pct: 10, color: 'text-amber-400' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-1.5">
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    p.color.replace('text-', 'bg-'),
                  )}
                />
                <span className="text-zinc-500">{p.label}</span>
                <span className={cn('font-medium', p.color)}>{p.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* C. Group Progress Panel */}
        {answers.studyMode === 'group' && groupId && groupMembers.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                Study Buddies
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyInvite}
                className="gap-1.5 text-xs"
              >
                <Copy className="h-3 w-3" />
                Invite Friends
              </Button>
            </div>
            <div className="space-y-3">
              {groupMembers
                .sort((a, b) => (b.progress || 0) - (a.progress || 0))
                .map((member, idx) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-zinc-500 w-5 text-right">
                      {idx + 1}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-400">
                      {member.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-zinc-300 truncate">
                          {member.displayName}
                        </span>
                        <span className="text-xs font-medium text-zinc-500">
                          {member.progress || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500/60 transition-all"
                          style={{
                            width: `${Math.max(member.progress || 0, 1)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* E. Topic Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTopic(null)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
              filterTopic === null
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600',
            )}
          >
            All Topics
          </button>
          {answers.focusTopics.map(t => {
            const meta = topicMeta[t];
            return (
              <button
                key={t}
                onClick={() => setFilterTopic(filterTopic === t ? null : t)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                  filterTopic === t
                    ? topicColorMap[meta.color]
                    : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-600',
                )}
              >
                {meta.icon} {meta.label}
              </button>
            );
          })}
        </div>

        {/* F. View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900/50 border border-zinc-800 w-fit">
          <button
            onClick={() => setViewMode('timeline')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              viewMode === 'timeline'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            <List className="h-3.5 w-3.5" />
            Timeline
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              viewMode === 'calendar'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            Calendar
          </button>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalendarMonth(p => p - 1)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-zinc-200">
                {calendarData.monthLabel}
              </span>
              <button
                onClick={() => setCalendarMonth(p => p + 1)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div
                  key={d}
                  className="text-center text-[10px] font-medium text-zinc-600 py-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="space-y-1">
              {calendarData.weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 gap-1">
                  {week.map((dayPlan, di) => {
                    if (!dayPlan) {
                      return (
                        <div key={di} className="h-12 rounded-lg bg-zinc-900/30" />
                      );
                    }
                    const isDone = progress[dayPlan.day];
                    const meta = topicMeta[dayPlan.topic];
                    const isToday = dayPlan.day === todayDayNumber;

                    return (
                      <button
                        key={di}
                        onClick={() => {
                          setScrollToDay(dayPlan.day);
                          setViewMode('timeline');
                          const wk = Math.ceil(dayPlan.day / 7);
                          setCollapsedWeeks(prev => ({ ...prev, [wk]: false }));
                        }}
                        className={cn(
                          'h-12 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all hover:border-zinc-600',
                          isToday
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'border-zinc-800/40 bg-zinc-900/30',
                        )}
                      >
                        <span
                          className={cn(
                            'text-xs font-medium',
                            isDone
                              ? 'text-emerald-500'
                              : isToday
                                ? 'text-emerald-400'
                                : 'text-zinc-500',
                          )}
                        >
                          D{dayPlan.day}
                        </span>
                        <div className="flex items-center gap-1">
                          <div
                            className={cn(
                              'h-1.5 w-1.5 rounded-full',
                              calendarDotColors[meta.color],
                            )}
                          />
                          {isDone && (
                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* D. Week-grouped Timeline */}
        {viewMode === 'timeline' && (
          <div className="space-y-4">
            {filteredWeeks.map(({ week, days }) => {
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
                    isCurrentWeek &&
                      'shadow-[0_0_30px_-8px_rgba(16,185,129,0.15)]',
                  )}
                >
                  {/* Week header */}
                  <button
                    onClick={() => toggleWeek(week)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 transition-all duration-200',
                      isCurrentWeek
                        ? `bg-gradient-to-r ${phaseColors[firstPhase]}`
                        : 'bg-zinc-900/30 hover:bg-zinc-900/50',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold',
                          weekDone
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isCurrentWeek
                              ? 'bg-zinc-800/80 text-zinc-200'
                              : 'bg-zinc-800/60 text-zinc-500',
                        )}
                      >
                        {weekDone ? <Trophy className="h-4 w-4" /> : `W${week}`}
                      </div>
                      <div className="text-left">
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            isCurrentWeek ? 'text-zinc-100' : 'text-zinc-300',
                          )}
                        >
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
                      <span
                        className={cn('text-xs font-medium', phaseAccents[firstPhase])}
                      >
                        {days[0].phaseName}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {weekProgress}/{days.length}
                      </span>
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
                                  : 'bg-zinc-700',
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
                        const isDsa = day.topic === 'dsa';

                        return (
                          <div
                            key={day.day}
                            ref={el => {
                              dayRefs.current[day.day] = el;
                            }}
                            className={cn(
                              'flex items-center gap-3 px-4 py-3 transition-all duration-200 group',
                              isDone && 'bg-emerald-500/[0.03]',
                              isCurrent && !isDone && 'bg-zinc-800/30',
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
                                <Circle
                                  className={cn(
                                    'h-5 w-5',
                                    isCurrent ? 'text-zinc-400' : 'text-zinc-700',
                                  )}
                                />
                              )}
                            </button>

                            {/* Day badge */}
                            <div
                              className={cn(
                                'flex h-7 min-w-[2.5rem] items-center justify-center rounded-lg text-xs font-bold flex-shrink-0',
                                isCurrent && !isDone
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : isDone
                                    ? 'bg-zinc-800/40 text-zinc-600'
                                    : 'bg-zinc-800/60 text-zinc-500',
                              )}
                            >
                              D{day.day}
                            </div>

                            {/* Topic color bar */}
                            <div
                              className={cn(
                                'h-7 w-1 rounded-full flex-shrink-0',
                                topicDotColor[meta.color],
                              )}
                            />

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
                                      : 'text-zinc-200 group-hover:text-emerald-400',
                                  )}
                                >
                                  {day.title}
                                </Link>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className={cn(
                                    'text-[11px] rounded px-1.5 py-0.5 border',
                                    topicColorMap[meta.color],
                                  )}
                                >
                                  {day.topicLabel}
                                </span>
                                <span className="text-[11px] text-zinc-600">
                                  ~{day.estimatedMinutes} min
                                </span>
                              </div>
                            </div>

                            {/* War Room button for DSA days */}
                            {isDsa && !isDone && (
                              <button
                                onClick={() => handleSolveTogether(day)}
                                className="hidden sm:flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-2 py-1 transition-colors flex-shrink-0"
                              >
                                <Swords className="h-3 w-3" />
                                War Room
                              </button>
                            )}

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
        )}

        {/* Completion celebration */}
        {pctComplete === 100 && (
          <Card variant="glow" className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-emerald-400 mb-2">
              You Crushed It!
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              You completed your entire {answers.totalDays}-day study plan.
              You&apos;re ready for that interview!
            </p>
            <Button
              variant="gradient"
              onClick={() => router.push('/prepare')}
              className="gap-2"
            >
              <Rocket className="h-4 w-4" />
              Create Another Plan
            </Button>
          </Card>
        )}

        {/* G. Share Section */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                Share Your Plan
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {answers.studyMode === 'group' && groupId
                  ? 'All group members can see your progress'
                  : 'Share your study plan with friends'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-400 font-mono">
                {shareCode}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

// -- Sub-components -----------------------------------------------------------

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
    <Card>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-zinc-100">{value}</p>
      <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
    </Card>
  );
}
