'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  AlertCircle,
  Check,
  Timer,
  Target,
  BarChart3,
  Bell,
  CalendarDays,
  Sparkles,
  Wand2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

import { templatesBySlug } from '@/lib/roadmap-templates';
import { roadmapsApi, groupsApi, roomsApi } from '@/lib/api';
import { topics as learnTopics } from '@/lib/learn-data';
import { patterns as dsaPatterns } from '@/lib/patterns-data';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400',
  intermediate: 'bg-amber-500/10 text-amber-400',
  advanced: 'bg-red-500/10 text-red-400',
};

const HOURS_OPTIONS = [1, 2, 3, 4];

/* ── Content-aware topic map ── */
/* Maps template slugs to rich topic objects with actual content from the library */
interface TopicContent {
  name: string;
  icon: string;
  lessonCount: number;
  lessons: { slug: string; title: string; duration: string; difficulty: string }[];
  topicSlug?: string; // links to /learn/[topicSlug]
}

function buildTopicContent(topicSlug: string): TopicContent | null {
  const topic = learnTopics.find((t) => t.slug === topicSlug);
  if (!topic) return null;
  return {
    name: topic.name,
    icon: topic.icon,
    lessonCount: topic.lessons.length,
    lessons: topic.lessons.map((l) => ({ slug: l.slug, title: l.title, duration: l.duration, difficulty: l.difficulty })),
    topicSlug: topic.slug,
  };
}

const DSA_PATTERNS_CONTENT: TopicContent = {
  name: 'DSA Patterns',
  icon: '🧩',
  lessonCount: dsaPatterns?.length || 19,
  lessons: (dsaPatterns || []).map((p) => ({ slug: p.slug, title: p.name, duration: '30 min', difficulty: 'intermediate' })),
  topicSlug: 'dsa-patterns',
};

/* Rich content map — each template maps to content library items */
const CONTENT_TOPIC_MAP: Record<string, TopicContent[]> = {
  'crack-the-job-together': [
    buildTopicContent('databases'),
    buildTopicContent('oops'),
    buildTopicContent('multithreading'),
    buildTopicContent('system-design'),
    DSA_PATTERNS_CONTENT,
    buildTopicContent('design-patterns'),
    { name: 'Problem Sheets', icon: '📋', lessonCount: 6, topicSlug: 'sheets', lessons: [
      { slug: 'blind-75', title: 'Blind 75 — The Gold Standard', duration: '75 problems', difficulty: 'intermediate' },
      { slug: 'grind-75', title: 'Grind 75 — Optimized Blind 75', duration: '75 problems', difficulty: 'intermediate' },
      { slug: 'neetcode-150', title: 'NeetCode 150 — Comprehensive', duration: '150 problems', difficulty: 'intermediate' },
      { slug: 'striver-sde', title: 'Striver SDE Sheet', duration: '191 problems', difficulty: 'advanced' },
      { slug: 'love-babbar-450', title: 'Love Babbar 450', duration: '450 problems', difficulty: 'advanced' },
      { slug: 'leetcode-top-150', title: 'LeetCode Top 150', duration: '150 problems', difficulty: 'beginner' },
    ]},
    { name: 'Mock Interviews', icon: '🎯', lessonCount: 3, topicSlug: 'mocks', lessons: [
      { slug: 'mock-dsa', title: 'Mock Interview: DSA Round', duration: '60 min', difficulty: 'advanced' },
      { slug: 'mock-system-design', title: 'Mock Interview: System Design', duration: '45 min', difficulty: 'advanced' },
      { slug: 'mock-behavioral', title: 'Mock Interview: Behavioral', duration: '30 min', difficulty: 'intermediate' },
    ]},
  ].filter(Boolean) as TopicContent[],
  'dsa-patterns-30': [DSA_PATTERNS_CONTENT],
  'learn-system-design': [buildTopicContent('system-design')].filter(Boolean) as TopicContent[],
  'learn-databases': [buildTopicContent('databases')].filter(Boolean) as TopicContent[],
  'learn-oops': [buildTopicContent('oops')].filter(Boolean) as TopicContent[],
  'learn-multithreading': [buildTopicContent('multithreading')].filter(Boolean) as TopicContent[],
  'learn-frontend': [buildTopicContent('frontend-dev')].filter(Boolean) as TopicContent[],
  'learn-backend': [buildTopicContent('backend-dev')].filter(Boolean) as TopicContent[],
  'learn-design-patterns': [buildTopicContent('design-patterns')].filter(Boolean) as TopicContent[],
};

/* Sheet-based roadmaps — show problem sheets */
const SHEET_TEMPLATES = new Set(['solve-striver-sheet', 'solve-love-babbar-sheet', 'leetcode-top-150']);

/* Fallback simple topic list for templates without content mapping */
const TOPIC_MAP: Record<string, string[]> = {
  'crack-the-job-together': ['Databases', 'OOP', 'Multithreading', 'System Design', 'DSA Patterns', 'Design Patterns', 'Problem Sheets', 'Mock Interviews'],
  'solve-striver-sheet': ['Easy', 'Medium', 'Hard'],
  'solve-love-babbar-sheet': ['Easy', 'Medium', 'Hard'],
  'leetcode-top-150': ['Easy', 'Medium', 'Hard'],
  'dsa-patterns-30': ['Two Pointers', 'Sliding Window', 'Binary Search', 'DFS', 'BFS', 'Backtracking', 'Dynamic Programming', 'Graphs', 'Trees', 'Stack & Queue', 'Greedy', 'Trie'],
};

const DEFAULT_CODING_TOPICS = ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Strings', 'Sorting', 'Recursion', 'Bit Manipulation'];

const TOPIC_COLORS = [
  'bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500',
  'bg-rose-500', 'bg-blue-500', 'bg-orange-500', 'bg-pink-500',
  'bg-teal-500', 'bg-indigo-500', 'bg-lime-500', 'bg-red-500',
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface GroupInfo {
  id: string;
  name: string;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function RoadmapStartPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const template = templatesBySlug[slug];

  const isCodingRoadmap = template?.category === 'Coding & Tech';
  const isSheetRoadmap = SHEET_TEMPLATES.has(slug);
  const hasContentMap = !!(slug && CONTENT_TOPIC_MAP[slug]);
  const totalSteps = isCodingRoadmap ? 4 : 1;

  // Wizard step
  const [step, setStep] = useState(1);

  // Customization mode: 'ai' (auto-create) or 'manual' (select yourself)
  const [customizeMode, setCustomizeMode] = useState<'ai' | 'manual'>('ai');

  // For content-aware templates: which specific lessons/patterns are selected
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set());
  const [expandedContentTopic, setExpandedContentTopic] = useState<string | null>(null);

  // Step 1: Overview
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Step 2: Customize (coding only)
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const availableTopics = useMemo(() => {
    if (!template) return DEFAULT_CODING_TOPICS;
    return TOPIC_MAP[template.slug] || DEFAULT_CODING_TOPICS;
  }, [template]);

  // Rich content topics from the learning library
  const contentTopics = useMemo(() => {
    if (!slug) return [];
    return CONTENT_TOPIC_MAP[slug] || [];
  }, [slug]);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [topicAllocation, setTopicAllocation] = useState<Record<string, number>>({});

  // Auto-select all content when AI mode or on initial load
  useEffect(() => {
    if (contentTopics.length > 0 && customizeMode === 'ai') {
      const allLessons = new Set<string>();
      contentTopics.forEach((ct) => ct.lessons.forEach((l) => allLessons.add(`${ct.topicSlug || ct.name}:${l.slug}`)));
      setSelectedLessons(allLessons);
      // Also auto-select all topics
      const topicNames = contentTopics.map((ct) => ct.name);
      setSelectedTopics(topicNames);
      const pct = Math.floor(100 / topicNames.length);
      const alloc: Record<string, number> = {};
      topicNames.forEach((t, i) => { alloc[t] = i === topicNames.length - 1 ? 100 - pct * (topicNames.length - 1) : pct; });
      setTopicAllocation(alloc);
    }
  }, [contentTopics, customizeMode]);

  // Step 3: Study mode
  const [mode, setMode] = useState<'solo' | 'friends'>('solo');
  const [groupOption, setGroupOption] = useState<'create' | 'existing' | 'join'>('create');
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [existingGroups, setExistingGroups] = useState<GroupInfo[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Friends extras
  const [scheduleWeeklyRoom, setScheduleWeeklyRoom] = useState(false);
  const [weeklyRoomDay, setWeeklyRoomDay] = useState('Saturday');
  const [weeklyRoomTime, setWeeklyRoomTime] = useState('10:00');
  const [dailyReminder, setDailyReminder] = useState(false);

  // General
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize topics with even split
  useEffect(() => {
    if (selectedTopics.length === 0 && availableTopics.length > 0 && isCodingRoadmap) {
      // Default: select first 4 topics
      const defaults = availableTopics.slice(0, Math.min(4, availableTopics.length));
      setSelectedTopics(defaults);
      const pct = Math.floor(100 / defaults.length);
      const alloc: Record<string, number> = {};
      defaults.forEach((t, i) => {
        alloc[t] = i === defaults.length - 1 ? 100 - pct * (defaults.length - 1) : pct;
      });
      setTopicAllocation(alloc);
    }
  }, [availableTopics, isCodingRoadmap, selectedTopics.length]);

  // Fetch groups
  useEffect(() => {
    if (groupOption === 'existing' && mode === 'friends') {
      setLoadingGroups(true);
      groupsApi
        .list()
        .then(({ data }) => {
          const groups = (data.groups || data || []) as GroupInfo[];
          setExistingGroups(groups);
        })
        .catch(() => setExistingGroups([]))
        .finally(() => setLoadingGroups(false));
    }
  }, [groupOption, mode]);

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

  /* ---- Topic helpers ---- */
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      const next = prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic];
      // Recalculate allocation
      if (next.length > 0) {
        const pct = Math.floor(100 / next.length);
        const alloc: Record<string, number> = {};
        next.forEach((t, i) => {
          alloc[t] = i === next.length - 1 ? 100 - pct * (next.length - 1) : pct;
        });
        setTopicAllocation(alloc);
      } else {
        setTopicAllocation({});
      }
      return next;
    });
  };

  const updateAllocation = (topic: string, value: number) => {
    setTopicAllocation((prev) => {
      const others = selectedTopics.filter((t) => t !== topic);
      const clamped = Math.max(0, Math.min(100, value));
      const remaining = 100 - clamped;
      const otherTotal = others.reduce((sum, t) => sum + (prev[t] || 0), 0);
      const next: Record<string, number> = { ...prev, [topic]: clamped };
      // Distribute remaining proportionally among others
      if (others.length > 0) {
        others.forEach((t, i) => {
          if (otherTotal > 0) {
            const ratio = (prev[t] || 0) / otherTotal;
            next[t] = i === others.length - 1
              ? remaining - others.slice(0, -1).reduce((s, ot) => s + (next[ot] || 0), 0)
              : Math.round(remaining * ratio);
          } else {
            const even = Math.floor(remaining / others.length);
            next[t] = i === others.length - 1 ? remaining - even * (others.length - 1) : even;
          }
        });
      }
      return next;
    });
  };

  /* ---- Navigation ---- */
  const canGoNext = () => {
    if (step === 1) return true;
    if (step === 2) return selectedTopics.length > 0;
    if (step === 3) {
      if (mode === 'friends') {
        if (groupOption === 'create' && !groupName.trim()) return false;
        if (groupOption === 'join' && !joinCode.trim()) return false;
        if (groupOption === 'existing' && !selectedGroupId) return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (step < totalSteps && canGoNext()) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  /* ---- Start roadmap ---- */
  const handleStart = async () => {
    setLoading(true);
    setError('');

    try {
      let groupId: string | undefined;

      if (mode === 'friends') {
        if (groupOption === 'create') {
          if (!groupName.trim()) { setError('Please enter a group name.'); setLoading(false); return; }
          const { data } = await groupsApi.create({ name: groupName.trim() });
          groupId = data.group?.id || data.id;
        } else if (groupOption === 'join') {
          if (!joinCode.trim()) { setError('Please enter an invite code.'); setLoading(false); return; }
          const { data } = await groupsApi.join(joinCode.trim());
          groupId = data.group?.id || data.id;
        } else if (groupOption === 'existing') {
          if (!selectedGroupId) { setError('Please select a group.'); setLoading(false); return; }
          groupId = selectedGroupId;
        }
      }

      const createPayload = {
        templateSlug: template.slug,
        name: template.name,
        category: template.category,
        icon: template.icon,
        durationDays: template.duration,
        startDate,
        groupId,
      };

      let roadmapId: string;
      let shareCode: string;

      try {
        const { data } = await roadmapsApi.create(createPayload);
        roadmapId = data.roadmap?.id || data.id || `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        shareCode = data.roadmap?.shareCode || data.shareCode || Math.random().toString(36).slice(2, 8).toUpperCase();
      } catch {
        roadmapId = `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        shareCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      }

      const roadmap = {
        id: roadmapId,
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
        groupId,
        ...(isCodingRoadmap && {
          hoursPerDay,
          selectedTopics,
          selectedLessons: Array.from(selectedLessons),
          topicAllocation,
          customizeMode,
          weeklyRoomDay: scheduleWeeklyRoom ? weeklyRoomDay.toLowerCase() : undefined,
          weeklyRoomTime: scheduleWeeklyRoom ? weeklyRoomTime : undefined,
          dailyReminder,
        }),
      };

      try {
        const existing = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]');
        existing.push(roadmap);
        localStorage.setItem('streaksy_active_roadmaps', JSON.stringify(existing));
      } catch { /* localStorage not available */ }

      // Auto-create weekly war room if scheduled
      if (scheduleWeeklyRoom && weeklyRoomDay && weeklyRoomTime) {
        try {
          const dayMap: Record<string, number> = {
            monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
            friday: 5, saturday: 6, sunday: 0,
          };
          const targetDay = dayMap[weeklyRoomDay.toLowerCase()] ?? 6;
          const now = new Date();
          const curDay = now.getDay();
          let daysUntil = targetDay - curDay;
          if (daysUntil <= 0) daysUntil += 7;

          const scheduledDate = new Date(now);
          scheduledDate.setDate(now.getDate() + daysUntil);
          const [h, m] = weeklyRoomTime.split(':').map(Number);
          scheduledDate.setHours(h, m, 0, 0);

          await roomsApi.create({
            name: `${template.name} — Weekly Solve Room`,
            scheduledAt: scheduledDate.toISOString(),
            recurrence: 'weekly',
            timeLimitMinutes: 60,
            mode: 'multi',
          });
        } catch { /* Room creation failed — non-critical */ }
      }

      router.push(`/roadmaps/${roadmapId}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error || e.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  /* ---- Wizard step labels ---- */
  const stepLabels = isCodingRoadmap
    ? ['Overview', 'Customize', 'Study Mode', 'Review']
    : ['Configure'];

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */
  if (!template) {
    return (
      <AppShell>
        <PageTransition>
          <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
            <p className="text-zinc-400">Roadmap template not found.</p>
            <Link href="/roadmaps" className="text-emerald-400 hover:text-emerald-300 text-sm">
              Browse roadmaps
            </Link>
          </div>
        </PageTransition>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-6">
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

          {/* Progress bar (wizard) */}
          {isCodingRoadmap && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {stepLabels.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => { if (i + 1 < step) setStep(i + 1); }}
                    className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                      i + 1 === step ? 'text-emerald-400' : i + 1 < step ? 'text-zinc-300 cursor-pointer' : 'text-zinc-600'
                    }`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                      i + 1 < step
                        ? 'bg-emerald-500 text-white'
                        : i + 1 === step
                          ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-600'
                    }`}>
                      {i + 1 < step ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400 flex-1">{error}</p>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 text-xs shrink-0">Dismiss</button>
            </div>
          )}

          {/* ============================================================ */}
          {/*  STEP 1: Overview                                             */}
          {/* ============================================================ */}
          {(step === 1 || !isCodingRoadmap) && (
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">
                  {isCodingRoadmap ? 'Step 1: Choose Start Date' : 'Configure Your Roadmap'}
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <p className="text-xs text-zinc-500 mt-1.5">
                  Ends on {new Date(new Date(startDate).getTime() + (template.duration - 1) * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* For non-coding: show study mode + start inline */}
              {!isCodingRoadmap && (
                <>
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

                  {mode === 'friends' && <GroupOptions groupOption={groupOption} setGroupOption={(o) => { setGroupOption(o); setSelectedGroupId(null); }} groupName={groupName} setGroupName={setGroupName} joinCode={joinCode} setJoinCode={setJoinCode} loadingGroups={loadingGroups} existingGroups={existingGroups} selectedGroupId={selectedGroupId} setSelectedGroupId={setSelectedGroupId} />}

                  <Button variant="gradient" size="lg" className="w-full" onClick={handleStart} loading={loading}>
                    Start Roadmap <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </>
              )}

              {/* Coding: just next button */}
              {isCodingRoadmap && (
                <Button variant="primary" size="lg" className="w-full" onClick={nextStep}>
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </Card>
          )}

          {/* ============================================================ */}
          {/*  STEP 2: Customize Plan (coding only)                         */}
          {/* ============================================================ */}
          {step === 2 && isCodingRoadmap && (
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Target className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Step 2: Customize Your Plan</h2>
              </div>

              {/* Hours per day */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                  <Timer className="h-4 w-4 text-zinc-400" />
                  How many hours per day can you dedicate?
                </label>
                <div className="flex gap-3">
                  {HOURS_OPTIONS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHoursPerDay(h)}
                      className={`flex-1 rounded-xl border py-3 text-center font-medium transition-all ${
                        hoursPerDay === h
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-lg">{h}{h === 4 ? '+' : ''}</span>
                      <span className="block text-[10px] text-zinc-500 mt-0.5">hr{h > 1 ? 's' : ''}/day</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Customization Mode Toggle ── */}
              {(hasContentMap || isSheetRoadmap) && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                    <Wand2 className="h-4 w-4 text-zinc-400" />
                    How do you want to build your plan?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCustomizeMode('ai')}
                      className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                        customizeMode === 'ai'
                          ? 'border-purple-500/40 bg-purple-500/5 text-purple-400'
                          : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <Sparkles className="h-5 w-5" />
                      <div className="text-left">
                        <p className="text-sm font-medium">AI Auto-Create</p>
                        <p className="text-[11px] text-zinc-500">Optimized schedule</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setCustomizeMode('manual')}
                      className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                        customizeMode === 'manual'
                          ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                          : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <Target className="h-5 w-5" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Select Yourself</p>
                        <p className="text-[11px] text-zinc-500">Pick topics &amp; lessons</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* ── AI Mode Summary ── */}
              {customizeMode === 'ai' && contentTopics.length > 0 && (
                <div className="mb-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">AI-optimized plan includes:</span>
                  </div>
                  <div className="space-y-2">
                    {contentTopics.map((ct) => (
                      <div key={ct.name} className="flex items-center gap-2">
                        <span className="text-lg">{ct.icon}</span>
                        <span className="text-sm text-zinc-300">{ct.name}</span>
                        <span className="text-[10px] text-zinc-500 ml-auto">{ct.lessonCount} {ct.lessonCount === 1 ? 'item' : 'items'}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-3">All {contentTopics.reduce((s, ct) => s + ct.lessonCount, 0)} items will be scheduled across {template?.duration || 30} days with balanced pacing.</p>
                </div>
              )}

              {/* ── Manual Mode: Content-aware topic + lesson selection ── */}
              {customizeMode === 'manual' && contentTopics.length > 0 && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                    <BookOpen className="h-4 w-4 text-zinc-400" />
                    Select topics and lessons from the content library
                  </label>
                  <div className="space-y-2">
                    {contentTopics.map((ct) => {
                      const topicKey = ct.topicSlug || ct.name;
                      const topicLessons = ct.lessons.map((l) => `${topicKey}:${l.slug}`);
                      const selectedCount = topicLessons.filter((k) => selectedLessons.has(k)).length;
                      const allSelected = selectedCount === ct.lessons.length && ct.lessons.length > 0;
                      const isExpanded = expandedContentTopic === ct.name;
                      const isTopicSelected = selectedTopics.includes(ct.name);

                      return (
                        <div key={ct.name} className="rounded-xl border border-zinc-800 overflow-hidden">
                          {/* Topic header */}
                          <button
                            className="w-full flex items-center gap-3 p-3 hover:bg-zinc-800/30 transition-colors"
                            onClick={() => setExpandedContentTopic(isExpanded ? null : ct.name)}
                          >
                            <input
                              type="checkbox"
                              checked={isTopicSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleTopic(ct.name);
                                // Select/deselect all lessons in topic
                                setSelectedLessons((prev) => {
                                  const next = new Set(prev);
                                  if (isTopicSelected) {
                                    topicLessons.forEach((k) => next.delete(k));
                                  } else {
                                    topicLessons.forEach((k) => next.add(k));
                                  }
                                  return next;
                                });
                              }}
                              className="rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                            />
                            <span className="text-lg">{ct.icon}</span>
                            <span className="text-sm font-medium text-zinc-200">{ct.name}</span>
                            <span className="text-[10px] text-zinc-500 ml-1">
                              {selectedCount}/{ct.lessons.length} selected
                            </span>
                            <div className="ml-auto flex items-center gap-2">
                              {allSelected && <span className="text-[10px] text-emerald-400">All</span>}
                              {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-500" /> : <ChevronDown className="h-4 w-4 text-zinc-500" />}
                            </div>
                          </button>

                          {/* Expanded lesson list */}
                          {isExpanded && ct.lessons.length > 0 && (
                            <div className="border-t border-zinc-800/50 bg-zinc-900/30 max-h-60 overflow-y-auto">
                              {ct.lessons.map((lesson, li) => {
                                const lessonKey = `${topicKey}:${lesson.slug}`;
                                const isSelected = selectedLessons.has(lessonKey);
                                return (
                                  <label
                                    key={lesson.slug}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-800/20 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {
                                        setSelectedLessons((prev) => {
                                          const next = new Set(prev);
                                          if (isSelected) next.delete(lessonKey);
                                          else next.add(lessonKey);
                                          return next;
                                        });
                                        // Auto-select the parent topic if not already
                                        if (!isTopicSelected && !isSelected) toggleTopic(ct.name);
                                      }}
                                      className="rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500 h-3.5 w-3.5"
                                    />
                                    <span className="text-xs text-zinc-400 w-5 text-right">{li + 1}.</span>
                                    <span className="text-sm text-zinc-300 flex-1 truncate">{lesson.title}</span>
                                    <span className="text-[10px] text-zinc-600">{lesson.duration}</span>
                                    <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                                      lesson.difficulty === 'beginner' ? 'text-emerald-400 bg-emerald-500/10'
                                        : lesson.difficulty === 'advanced' ? 'text-red-400 bg-red-500/10'
                                        : 'text-amber-400 bg-amber-500/10'
                                    }`}>{lesson.difficulty}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                          {isExpanded && ct.lessons.length === 0 && (
                            <div className="border-t border-zinc-800/50 bg-zinc-900/30 px-4 py-3">
                              <p className="text-xs text-zinc-500">No structured lessons — this topic uses custom daily tasks</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2">
                    {selectedLessons.size} items selected across {selectedTopics.length} topics
                  </p>
                </div>
              )}

              {/* ── Fallback: Simple topic selection for templates without content map ── */}
              {customizeMode === 'manual' && contentTopics.length === 0 && (
                <div className="mb-8">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                    <BarChart3 className="h-4 w-4 text-zinc-400" />
                    Which topics do you want to focus on?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                          selectedTopics.includes(topic)
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                            : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        {selectedTopics.includes(topic) && <Check className="h-3 w-3 inline mr-1.5 -mt-0.5" />}
                        {topic}
                      </button>
                    ))}
                  </div>
                  {selectedTopics.length === 0 && (
                    <p className="text-xs text-amber-400/80 mt-2">Select at least one topic to continue</p>
                  )}
                </div>
              )}

              {/* ── Sheet auto-selection notice ── */}
              {isSheetRoadmap && (
                <div className="mb-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-300">
                      {template?.name} auto-selected
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Problems from this sheet will be automatically scheduled into your daily tasks.
                    {template?.tracked === 'auto' && ' Your progress will sync automatically via the Chrome extension.'}
                  </p>
                </div>
              )}

              {/* Time allocation (shown for both modes when topics selected) */}
              {selectedTopics.length > 0 && (
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-4">
                    Allocate your time
                  </label>

                  {/* Visual bar */}
                  <div className="h-4 rounded-full overflow-hidden flex mb-4 bg-zinc-800">
                    {selectedTopics.map((topic, i) => (
                      <div
                        key={topic}
                        className={`h-full transition-all duration-300 ${TOPIC_COLORS[i % TOPIC_COLORS.length]}`}
                        style={{ width: `${topicAllocation[topic] || 0}%` }}
                        title={`${topic}: ${topicAllocation[topic] || 0}%`}
                      />
                    ))}
                  </div>

                  {/* Legend + sliders */}
                  <div className="space-y-3">
                    {selectedTopics.map((topic, i) => (
                      <div key={topic} className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full shrink-0 ${TOPIC_COLORS[i % TOPIC_COLORS.length]}`} />
                        <span className="text-sm text-zinc-300 w-32 truncate">{topic}</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={topicAllocation[topic] || 0}
                          onChange={(e) => updateAllocation(topic, parseInt(e.target.value))}
                          className="flex-1 h-1.5 rounded-full appearance-none bg-zinc-700 accent-emerald-500 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
                        />
                        <span className="text-xs text-zinc-400 w-10 text-right tabular-nums">{topicAllocation[topic] || 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" size="lg" className="flex-1" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={nextStep} disabled={!canGoNext()}>
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* ============================================================ */}
          {/*  STEP 3: Study Mode (coding only)                             */}
          {/* ============================================================ */}
          {step === 3 && isCodingRoadmap && (
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Step 3: Study Mode</h2>
              </div>

              {/* Solo / Friends toggle */}
              <div className="mb-6">
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

              {/* Group options (friends mode) */}
              {mode === 'friends' && (
                <>
                  <GroupOptions groupOption={groupOption} setGroupOption={(o) => { setGroupOption(o); setSelectedGroupId(null); }} groupName={groupName} setGroupName={setGroupName} joinCode={joinCode} setJoinCode={setJoinCode} loadingGroups={loadingGroups} existingGroups={existingGroups} selectedGroupId={selectedGroupId} setSelectedGroupId={setSelectedGroupId} />

                  {/* Weekly room scheduling */}
                  <div className="mb-4 mt-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <CalendarDays className="h-4 w-4 text-zinc-400" />
                        Schedule weekly solve rooms?
                      </label>
                      <button
                        onClick={() => setScheduleWeeklyRoom(!scheduleWeeklyRoom)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${scheduleWeeklyRoom ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${scheduleWeeklyRoom ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>

                    {scheduleWeeklyRoom && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-zinc-500 mb-1">Day</label>
                          <select
                            value={weeklyRoomDay}
                            onChange={(e) => setWeeklyRoomDay(e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                          >
                            {DAYS_OF_WEEK.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-zinc-500 mb-1">Time</label>
                          <select
                            value={weeklyRoomTime}
                            onChange={(e) => setWeeklyRoomTime(e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                          >
                            {TIME_SLOTS.map((t) => (
                              <option key={t} value={t}>{t.replace(/^(\d+):/, (_, h) => `${parseInt(h) > 12 ? parseInt(h) - 12 : h}:`)} {parseInt(t) >= 12 ? 'PM' : 'AM'}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                        <Bell className="h-4 w-4 text-zinc-400" />
                        Daily reminders?
                      </label>
                      <button
                        onClick={() => setDailyReminder(!dailyReminder)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${dailyReminder ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${dailyReminder ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" size="lg" className="flex-1" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button variant="primary" size="lg" className="flex-1" onClick={nextStep} disabled={!canGoNext()}>
                  Continue <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}

          {/* ============================================================ */}
          {/*  STEP 4: Review & Start (coding only)                         */}
          {/* ============================================================ */}
          {step === 4 && isCodingRoadmap && (
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Check className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Step 4: Review &amp; Start</h2>
              </div>

              <div className="space-y-4">
                {/* Summary rows */}
                <SummaryRow label="Roadmap" value={template.name} />
                <SummaryRow label="Start date" value={new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
                <SummaryRow label="Duration" value={`${template.duration} days`} />
                <SummaryRow label="Daily commitment" value={`${hoursPerDay}${hoursPerDay === 4 ? '+' : ''} hours/day`} />
                <SummaryRow label="Study mode" value={mode === 'solo' ? 'Solo' : 'With Friends'} />

                {mode === 'friends' && groupOption === 'create' && groupName && (
                  <SummaryRow label="Group" value={`New: ${groupName}`} />
                )}
                {mode === 'friends' && scheduleWeeklyRoom && (
                  <SummaryRow label="Weekly room" value={`${weeklyRoomDay}s at ${weeklyRoomTime}`} />
                )}
                {dailyReminder && <SummaryRow label="Daily reminders" value="Enabled" />}

                {/* Topics */}
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-3">Focus Topics</p>
                  <div className="space-y-2">
                    {selectedTopics.map((topic, i) => (
                      <div key={topic} className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${TOPIC_COLORS[i % TOPIC_COLORS.length]}`} />
                        <span className="text-sm text-zinc-300 flex-1">{topic}</span>
                        <span className="text-xs text-zinc-500 tabular-nums">{topicAllocation[topic] || 0}%</span>
                      </div>
                    ))}
                  </div>
                  {/* Mini allocation bar */}
                  <div className="h-2 rounded-full overflow-hidden flex mt-3 bg-zinc-800">
                    {selectedTopics.map((topic, i) => (
                      <div
                        key={topic}
                        className={`h-full ${TOPIC_COLORS[i % TOPIC_COLORS.length]}`}
                        style={{ width: `${topicAllocation[topic] || 0}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                <Button variant="ghost" size="lg" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button variant="gradient" size="lg" className="flex-1" onClick={handleStart} loading={loading}>
                  Start Roadmap <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}

/* ================================================================== */
/*  Shared sub-components                                              */
/* ================================================================== */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-zinc-200">{value}</span>
    </div>
  );
}

function GroupOptions({
  groupOption, setGroupOption,
  groupName, setGroupName,
  joinCode, setJoinCode,
  loadingGroups, existingGroups,
  selectedGroupId, setSelectedGroupId,
}: {
  groupOption: 'create' | 'existing' | 'join';
  setGroupOption: (o: 'create' | 'existing' | 'join') => void;
  groupName: string;
  setGroupName: (v: string) => void;
  joinCode: string;
  setJoinCode: (v: string) => void;
  loadingGroups: boolean;
  existingGroups: GroupInfo[];
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string) => void;
}) {
  return (
    <div className="mb-4 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
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
        <div>
          {loadingGroups ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            </div>
          ) : existingGroups.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">No groups found. Create one instead!</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {existingGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                    selectedGroupId === g.id
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'border-zinc-800 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium truncate">{g.name}</span>
                  {selectedGroupId === g.id && (
                    <div className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
