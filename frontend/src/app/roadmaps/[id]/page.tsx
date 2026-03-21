'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  ArrowLeft,
  Share2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Flame,
  Trophy,
  Users,
  ExternalLink,
  Loader2,
  Clock,
  CalendarDays,
  Swords,
  BookOpen,
  Play,
  Bell,
  ChevronRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { roadmapsApi, pokesApi, roomsApi, streaksApi } from '@/lib/api';
import { templatesBySlug } from '@/lib/roadmap-templates';
import { templateContentMap } from '@/lib/roadmap-content-map';
import type { UserRoadmap } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface Participant {
  userId?: string;
  name: string;
  displayName?: string;
  streak: number;
  progress: number;
  groupId?: string;
  groupName?: string;
  lastActivity?: string;
  lastDay?: number;
}

interface Discussion {
  id?: string;
  user: string;
  userId?: string;
  text: string;
  content?: string;
  time: string;
  created_at?: string;
}

interface DayTask {
  day: number;
  title: string;
  link?: string;
  topic?: string;
  type?: 'problem' | 'lesson' | 'generic';
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */
const TOPIC_COLORS: Record<string, string> = {
  'Arrays & Hashing': 'bg-emerald-500',
  'Two Pointers': 'bg-cyan-500',
  'Sliding Window': 'bg-purple-500',
  'Stack': 'bg-amber-500',
  'Binary Search': 'bg-rose-500',
  'Linked List': 'bg-blue-500',
  'Trees': 'bg-orange-500',
  'Tries': 'bg-pink-500',
  'Heap / Priority Queue': 'bg-teal-500',
  'Backtracking': 'bg-indigo-500',
  'Graphs': 'bg-lime-500',
  'Dynamic Programming': 'bg-red-500',
  'Greedy': 'bg-violet-500',
  'Intervals': 'bg-fuchsia-500',
  'Math & Geometry': 'bg-sky-500',
  'Bit Manipulation': 'bg-yellow-500',
  'Advanced Graphs': 'bg-emerald-600',
  'Matrix Problems': 'bg-cyan-600',
  'String Manipulation': 'bg-purple-600',
  'Recursion': 'bg-amber-600',
};

const FALLBACK_COLORS = [
  'bg-emerald-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500',
  'bg-rose-500', 'bg-blue-500', 'bg-orange-500', 'bg-pink-500',
  'bg-teal-500', 'bg-indigo-500', 'bg-lime-500', 'bg-red-500',
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function generateDayTasks(templateSlug?: string, totalDays?: number): DayTask[] {
  const days = totalDays || 30;
  const template = templateSlug ? templatesBySlug[templateSlug] : null;

  // Use content map if available — provides real links to lessons/patterns
  if (templateSlug && templateContentMap[templateSlug]) {
    const contentItems = templateContentMap[templateSlug];
    return Array.from({ length: days }, (_, i) => {
      const item = i < contentItems.length ? contentItems[i] : null;
      if (item) {
        return {
          day: i + 1,
          title: item.title,
          link: item.link,
          topic: item.topicSlug || item.title,
          type: item.type === 'pattern' ? ('problem' as const) : (item.type as 'lesson' | 'problem'),
        };
      }
      // Days beyond the content map (e.g. template has more days than content)
      return {
        day: i + 1,
        title: `Day ${i + 1}: Review & Practice`,
        type: 'generic' as const,
      };
    });
  }

  if (template) {
    const category = template.category;

    if (category === 'Coding & Tech') {
      const topics = [
        'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack',
        'Binary Search', 'Linked List', 'Trees', 'Tries',
        'Heap / Priority Queue', 'Backtracking', 'Graphs', 'Dynamic Programming',
        'Greedy', 'Intervals', 'Math & Geometry', 'Bit Manipulation',
        'Advanced Graphs', 'Matrix Problems', 'String Manipulation', 'Recursion',
      ];
      return Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: topics[i % topics.length],
        topic: topics[i % topics.length],
        type: 'problem' as const,
      }));
    }

    if (category === 'Fitness & Health') {
      return Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${template.name}`,
        type: 'generic' as const,
      }));
    }
  }

  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1} Task`,
    type: 'generic' as const,
  }));
}

function formatTime(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  } catch {
    return '';
  }
}

function getTopicColor(topic?: string, index?: number): string {
  if (topic && TOPIC_COLORS[topic]) return TOPIC_COLORS[topic];
  return FALLBACK_COLORS[(index || 0) % FALLBACK_COLORS.length];
}

function getNextScheduledRoom(day?: string, time?: string): { label: string; date: Date } | null {
  if (!day || !time) return null;
  const dayMap: Record<string, number> = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };
  const targetDay = dayMap[day.toLowerCase()];
  if (targetDay === undefined) return null;

  const now = new Date();
  const currentDay = now.getDay();
  let daysUntil = targetDay - currentDay;
  if (daysUntil <= 0) daysUntil += 7;

  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntil);
  const [h, m] = time.split(':').map(Number);
  nextDate.setHours(h, m, 0, 0);

  const label = `${day.charAt(0).toUpperCase() + day.slice(1)} at ${parseInt(time) > 12 ? parseInt(time) - 12 : parseInt(time)}:${time.split(':')[1]} ${parseInt(time) >= 12 ? 'PM' : 'AM'}`;
  return { label, date: nextDate };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [showTimeline, setShowTimeline] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Discussion[]>([]);
  const [shareToast, setShareToast] = useState(false);
  const [pokeToast, setPokeToast] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingDay, setUpdatingDay] = useState<number | null>(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [multiplierPreview, setMultiplierPreview] = useState<{
    streakTier: string; streakMultiplier: number;
    groupLabel: string; groupMultiplier: number;
    potentialPoints: number;
  } | null>(null);

  const [allActiveRoadmaps, setAllActiveRoadmaps] = useState<UserRoadmap[]>([]);

  // Load roadmap from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]') as UserRoadmap[];
      setAllActiveRoadmaps(stored);
      const found = stored.find((r) => r.id === id);
      if (found) {
        setRoadmap(found);
        const completed = new Set<number>();
        for (let i = 1; i <= found.completedDays; i++) completed.add(i);
        setCompletedDays(completed);
      }
    } catch { /* empty */ }
  }, [id]);

  const groupsUsingTemplate = useMemo(() => {
    if (!roadmap?.templateSlug) return [];
    const groupMap = new Map<string, string>();
    for (const rm of allActiveRoadmaps) {
      if (rm.templateSlug === roadmap.templateSlug && rm.groupId) {
        if (!groupMap.has(rm.groupId)) {
          groupMap.set(rm.groupId, rm.groupId);
        }
      }
    }
    return Array.from(groupMap.entries()).map(([gId, gName]) => ({ id: gId, name: gName }));
  }, [roadmap?.templateSlug, allActiveRoadmaps]);

  // Fetch participants
  const fetchParticipants = useCallback(async (templateSlug: string) => {
    setLoadingParticipants(true);
    try {
      const { data } = await roadmapsApi.getParticipants(templateSlug);
      const apiParticipants = (data.participants || data || []).map((p: Record<string, unknown>) => ({
        userId: (p.userId || p.user_id || p.id || '') as string,
        name: (p.displayName || p.display_name || p.name || 'Anonymous') as string,
        streak: (p.streak || p.currentStreak || p.current_streak || 0) as number,
        progress: (p.progress || 0) as number,
        groupId: (p.groupId || p.group_id || '') as string,
        groupName: (p.groupName || p.group_name || '') as string,
        lastActivity: (p.lastActivity || p.last_activity || p.updated_at || '') as string,
        lastDay: (p.lastDay || p.last_day || p.completedDays || 0) as number,
      }));
      setParticipants(apiParticipants);
    } catch {
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  }, []);

  // Fetch discussions
  const fetchDiscussions = useCallback(async (templateSlug: string) => {
    setLoadingDiscussions(true);
    try {
      const { data } = await roadmapsApi.getDiscussions(templateSlug);
      const apiMessages = (data.discussions || data || []).map((d: Record<string, unknown>) => ({
        id: (d.id || '') as string,
        user: (d.displayName || d.display_name || d.user || 'Anonymous') as string,
        userId: (d.userId || d.user_id || '') as string,
        text: (d.content || d.text || '') as string,
        time: formatTime(d.created_at as string | undefined) || (d.time as string || ''),
      }));
      setMessages(apiMessages);
    } catch {
      setMessages([]);
    } finally {
      setLoadingDiscussions(false);
    }
  }, []);

  useEffect(() => {
    if (roadmap?.templateSlug) {
      fetchParticipants(roadmap.templateSlug);
      fetchDiscussions(roadmap.templateSlug);
    }
  }, [roadmap?.templateSlug, fetchParticipants, fetchDiscussions]);

  // Fetch multiplier preview
  useEffect(() => {
    if (!roadmap) return;
    streaksApi.getMultipliers(roadmap.groupId || undefined)
      .then(({ data }) => setMultiplierPreview(data.preview))
      .catch(() => {});
  }, [roadmap?.groupId, roadmap]);

  const toggleDay = async (day: number) => {
    const isCompleting = !completedDays.has(day);
    setUpdatingDay(day);

    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);

      if (roadmap) {
        try {
          const stored = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]') as UserRoadmap[];
          const idx = stored.findIndex((r) => r.id === roadmap.id);
          if (idx >= 0) {
            stored[idx].completedDays = next.size;
            localStorage.setItem('streaksy_active_roadmaps', JSON.stringify(stored));
          }
        } catch { /* empty */ }
      }
      return next;
    });

    if (roadmap) {
      try {
        await roadmapsApi.updateProgress(roadmap.id, day, isCompleting);
      } catch { /* Backend sync failed silently */ }
    }
    setUpdatingDay(null);
  };

  const handleLeaveRoadmap = async () => {
    if (!roadmap) return;
    setLeaving(true);

    // Do localStorage cleanup FIRST (always works, no auth needed)
    try {
      const stored = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]') as UserRoadmap[];
      const updated = stored.filter((r) => r.id !== roadmap.id);
      localStorage.setItem('streaksy_active_roadmaps', JSON.stringify(updated));

      // Save to history in localStorage
      const history = JSON.parse(localStorage.getItem('streaksy_roadmap_history') || '[]');
      history.unshift({
        ...roadmap,
        status: 'abandoned' as const,
        completedDays: completedDays.size,
        leftAt: new Date().toISOString(),
      });
      localStorage.setItem('streaksy_roadmap_history', JSON.stringify(history));
    } catch { /* localStorage unavailable */ }

    // Fire-and-forget backend sync (may fail if not logged in or roadmap not synced)
    roadmapsApi.update(roadmap.id, { status: 'abandoned' }).catch(() => {});

    setLeaving(false);
    router.push('/roadmaps');
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const optimisticMsg: Discussion = { user: 'You', text: message, time: 'just now' };
    setMessages((prev) => [optimisticMsg, ...prev]);
    const content = message;
    setMessage('');

    if (roadmap?.templateSlug) {
      setSendingMessage(true);
      try {
        await roadmapsApi.postDiscussion(roadmap.templateSlug, content);
      } catch { /* keep optimistic */ }
      finally { setSendingMessage(false); }
    }
  };

  const handlePoke = async (participant: Participant) => {
    if (!participant.userId) {
      setPokeToast(`Poke sent to ${participant.name}!`);
      setTimeout(() => setPokeToast(''), 2000);
      return;
    }
    try {
      await pokesApi.poke(participant.userId, roadmap?.groupId, `Stay on track with ${roadmap?.name}!`);
      setPokeToast(`Poke sent to ${participant.name}!`);
    } catch {
      setPokeToast(`Poke sent to ${participant.name}!`);
    }
    setTimeout(() => setPokeToast(''), 2000);
  };

  const handleChallenge = async (participant: Participant) => {
    if (!roadmap) return;
    setCreatingRoom(true);
    try {
      const { data } = await roomsApi.create({
        name: `${roadmap.name} Challenge`,
        mode: 'practice',
      });
      const roomId = data.room?.id || data.id;
      if (roomId) router.push(`/rooms/${roomId}`);
    } catch {
      setPokeToast(`Challenge room created! Invite ${participant.name}`);
      setTimeout(() => setPokeToast(''), 2000);
    }
    setCreatingRoom(false);
  };

  const handleCreateSolveRoom = async () => {
    if (!roadmap) return;
    setCreatingRoom(true);
    try {
      const { data } = await roomsApi.create({
        name: `${roadmap.name} - Solve Together`,
        mode: 'practice',
      });
      const roomId = data.room?.id || data.id;
      if (roomId) router.push(`/rooms/${roomId}`);
    } catch {
      setPokeToast('Room created!');
      setTimeout(() => setPokeToast(''), 2000);
    }
    setCreatingRoom(false);
  };

  const handleShare = () => {
    if (roadmap?.shareCode) {
      navigator.clipboard.writeText(`${window.location.origin}/roadmaps/join/${roadmap.shareCode}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  // Group participants
  const participantsByGroup = useMemo(() => {
    const grouped: { groupId: string; groupName: string; participants: Participant[] }[] = [];
    const noGroup: Participant[] = [];
    const groupMap = new Map<string, { groupName: string; participants: Participant[] }>();

    for (const p of participants) {
      if (p.groupId) {
        const existing = groupMap.get(p.groupId);
        if (existing) existing.participants.push(p);
        else groupMap.set(p.groupId, { groupName: p.groupName || p.groupId, participants: [p] });
      } else {
        noGroup.push(p);
      }
    }

    Array.from(groupMap.entries()).forEach(([groupId, val]) => {
      grouped.push({ groupId, groupName: val.groupName, participants: val.participants });
    });

    return { grouped, noGroup };
  }, [participants]);

  const hasMultipleGroups = participantsByGroup.grouped.length > 1 || (participantsByGroup.grouped.length >= 1 && participantsByGroup.noGroup.length > 0);

  const totalDays = roadmap?.durationDays || 0;
  const completed = completedDays.size;
  const pct = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
  const currentDay = completed + 1;
  const dayTasks = generateDayTasks(roadmap?.templateSlug, totalDays);
  const todayTask = currentDay <= dayTasks.length ? dayTasks[currentDay - 1] : null;
  const isCoding = roadmap?.category === 'Coding & Tech';
  const template = roadmap?.templateSlug ? templatesBySlug[roadmap.templateSlug] : null;

  // Schedule info
  const startDate = roadmap ? new Date(roadmap.startDate) : new Date();
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / 86400000);
  const expectedDay = Math.min(daysSinceStart + 1, totalDays);
  const daysAheadBehind = completed - expectedDay;

  // Time estimate
  const hoursPerDay = roadmap?.hoursPerDay || 2;
  const timeEstimate = todayTask ? `~${hoursPerDay}h estimated` : '';

  // Weekly room schedule
  const nextRoom = getNextScheduledRoom(roadmap?.weeklyRoomDay, roadmap?.weeklyRoomTime);

  // Leaderboard
  const leaderboard = [...participants].sort((a, b) => b.progress - a.progress).slice(0, 5);

  // Group days by week
  const weekGroups = useMemo(() => {
    const weeks: { weekNum: number; days: DayTask[] }[] = [];
    for (let i = 0; i < dayTasks.length && i < totalDays; i++) {
      const weekIdx = Math.floor(i / 7);
      if (!weeks[weekIdx]) weeks[weekIdx] = { weekNum: weekIdx + 1, days: [] };
      weeks[weekIdx].days.push(dayTasks[i]);
    }
    return weeks;
  }, [dayTasks, totalDays]);

  // Topic progress breakdown
  const topicProgress = useMemo(() => {
    if (!roadmap?.selectedTopics || roadmap.selectedTopics.length === 0) return [];
    const topicDays: Record<string, { total: number; completed: number }> = {};
    dayTasks.slice(0, totalDays).forEach((dt) => {
      const topic = dt.topic || 'Other';
      if (!topicDays[topic]) topicDays[topic] = { total: 0, completed: 0 };
      topicDays[topic].total++;
      if (completedDays.has(dt.day)) topicDays[topic].completed++;
    });
    return Object.entries(topicDays).map(([t, data]) => ({
      topic: t,
      total: data.total,
      completed: data.completed,
      pct: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }));
  }, [dayTasks, totalDays, completedDays, roadmap?.selectedTopics]);

  if (!roadmap) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg mb-4">Roadmap not found.</p>
          <Link href="/roadmaps" className="text-emerald-400 hover:underline">
            Browse Roadmaps
          </Link>
        </div>
      </AppShell>
    );
  }

  const renderParticipant = (p: Participant, i: number) => (
    <div key={p.userId || i} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-800/30 transition-colors">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-bold text-emerald-400">
        {p.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-orange-400">&#x1F525; {p.streak}d</span>
          <span className="text-[10px] text-zinc-500">{p.progress}%</span>
          {p.lastDay ? (
            <span className="text-[10px] text-zinc-600">Day {p.lastDay} {p.lastActivity ? `- ${formatTime(p.lastActivity)}` : ''}</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => handlePoke(p)}
          className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-2 py-1 text-[10px] font-medium text-orange-400 hover:bg-orange-500/20 transition-colors"
        >
          Poke
        </button>
        <button
          onClick={() => handleChallenge(p)}
          disabled={creatingRoom}
          className="rounded-lg bg-purple-500/10 border border-purple-500/20 px-2 py-1 text-[10px] font-medium text-purple-400 hover:bg-purple-500/20 transition-colors"
        >
          <Swords className="h-3 w-3 inline -mt-0.5 mr-0.5" />
          Challenge
        </button>
      </div>
    </div>
  );

  return (
    <AppShell>
      <PageTransition>
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Back + Header */}
          <div className="flex items-center justify-between">
            <Link href="/roadmaps" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Roadmaps
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Share
                </Button>
                {shareToast && (
                  <div className="absolute right-0 top-full mt-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400 whitespace-nowrap z-10">
                    Link copied!
                  </div>
                )}
              </div>
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setShowLeaveConfirm(true)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Leave
                </Button>
              </div>
            </div>
          </div>

          {/* Leave confirmation modal — rendered via portal to avoid z-index/overflow issues */}
          {showLeaveConfirm && typeof document !== 'undefined' && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70" onClick={() => setShowLeaveConfirm(false)}>
              <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Leave Roadmap?</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-2">
                  You&apos;ve completed <span className="text-white font-medium">{completedDays.size}/{totalDays}</span> days so far.
                </p>
                <p className="text-sm text-zinc-500 mb-6">
                  This will mark the roadmap as abandoned. It will appear in your history so you can track your journey. You can always start a new one later.
                </p>
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowLeaveConfirm(false)}>
                    Keep Going
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                    onClick={handleLeaveRoadmap}
                    disabled={leaving}
                  >
                    {leaving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <LogOut className="h-4 w-4 mr-1.5" />}
                    Leave
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Toasts */}
          {pokeToast && (
            <div className="rounded-lg bg-orange-500/20 border border-orange-500/30 px-4 py-2 text-sm text-orange-400 text-center">
              {pokeToast}
            </div>
          )}

          {/* ============================================================ */}
          {/*  Roadmap Header                                               */}
          {/* ============================================================ */}
          <Card className="border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{roadmap.icon}</span>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{roadmap.name}</h1>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="text-sm text-zinc-400">Day {completed}/{totalDays}</span>
                  {roadmap.currentStreak > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-400">
                      <Flame className="h-4 w-4" /> {roadmap.currentStreak} day streak
                    </span>
                  )}
                  {groupsUsingTemplate.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-cyan-400 bg-cyan-500/10 rounded-full px-2.5 py-0.5">
                      <Users className="h-3 w-3" /> Used by {groupsUsingTemplate.length} group{groupsUsingTemplate.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {roadmap.hoursPerDay && (
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-400 bg-zinc-800 rounded-full px-2.5 py-0.5">
                      <Clock className="h-3 w-3" /> {roadmap.hoursPerDay}h/day
                    </span>
                  )}
                </div>

                {/* Progress bar with phase markers */}
                <div className="mt-3 relative">
                  <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  {/* Phase markers at 25%, 50%, 75% */}
                  {[25, 50, 75].map((marker) => (
                    <div key={marker} className="absolute top-0 h-2.5 w-px bg-zinc-600/50" style={{ left: `${marker}%` }} />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-zinc-500">{pct}% complete</p>
                  <p className={`text-xs font-medium ${
                    daysAheadBehind >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {daysAheadBehind === 0 ? 'On track' : daysAheadBehind > 0 ? `${daysAheadBehind} day${daysAheadBehind > 1 ? 's' : ''} ahead` : `${Math.abs(daysAheadBehind)} day${Math.abs(daysAheadBehind) > 1 ? 's' : ''} behind`}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* ============================================================ */}
          {/*  Streak Multiplier Preview                                    */}
          {/* ============================================================ */}
          {multiplierPreview && (multiplierPreview.streakMultiplier > 1 || multiplierPreview.groupMultiplier > 1) && (
            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-zinc-900/50 to-orange-500/5 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="h-5 w-5 text-amber-400" />
                <span className="text-sm font-semibold text-white">Active Multipliers</span>
                <span className="ml-auto text-lg font-bold text-amber-400">
                  {multiplierPreview.potentialPoints} pts/task
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {multiplierPreview.streakMultiplier > 1 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-400">
                    <Flame className="h-3 w-3" />
                    {multiplierPreview.streakTier} ({multiplierPreview.streakMultiplier}x)
                  </span>
                )}
                {multiplierPreview.groupMultiplier > 1 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-medium text-cyan-400">
                    <Users className="h-3 w-3" />
                    {multiplierPreview.groupLabel} ({multiplierPreview.groupMultiplier}x)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/*  Today's Task — Prominent & Actionable                        */}
          {/* ============================================================ */}
          {todayTask && (
            <Card variant="glow" className="border-emerald-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">Today&apos;s Task</h2>
                  <p className="text-xs text-zinc-500">Day {currentDay} of {totalDays}</p>
                </div>
                {timeEstimate && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                    <Clock className="h-3 w-3" />
                    {timeEstimate}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{todayTask.title}</h3>
              {todayTask.topic && (
                <div className="flex items-center gap-2 mb-4">
                  <div className={`h-2 w-2 rounded-full ${getTopicColor(todayTask.topic)}`} />
                  <span className="text-xs text-zinc-400">{todayTask.topic}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mb-4">
                {todayTask.type === 'problem' && (
                  <>
                    {todayTask.link && todayTask.link.startsWith('/') ? (
                      <Link
                        href={todayTask.link}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        Go to Pattern
                      </Link>
                    ) : todayTask.link ? (
                      <a
                        href={todayTask.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in LeetCode
                      </a>
                    ) : (
                      <Link
                        href={`/patterns/${todayTask.topic?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'arrays'}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        Go to Lesson
                      </Link>
                    )}
                    <button
                      onClick={handleCreateSolveRoom}
                      disabled={creatingRoom}
                      className="inline-flex items-center gap-2 rounded-lg bg-purple-500/10 border border-purple-500/30 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                    >
                      <Swords className="h-4 w-4" />
                      Solve Together
                    </button>
                  </>
                )}
                {todayTask.type === 'lesson' && (
                  <Link
                    href={todayTask.link || `/learn/${template?.slug || ''}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Start Learning
                  </Link>
                )}
              </div>

              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={() => toggleDay(currentDay)}
                disabled={completedDays.has(currentDay) || updatingDay === currentDay}
                loading={updatingDay === currentDay}
              >
                {completedDays.has(currentDay) ? (
                  <><CheckCircle className="h-5 w-5 mr-2" /> Completed!</>
                ) : (
                  <><CheckCircle className="h-5 w-5 mr-2" /> Mark Complete</>
                )}
              </Button>
            </Card>
          )}

          {/* ============================================================ */}
          {/*  Weekly Schedule + Progress — Two columns                      */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Schedule Card */}
            {nextRoom && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-base font-semibold text-white">Next Scheduled Room</h2>
                </div>
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-4">
                  <p className="text-sm font-medium text-cyan-300">{nextRoom.label}</p>
                  <p className="text-xs text-zinc-500 mt-1">DSA Practice Room</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1" onClick={handleCreateSolveRoom} loading={creatingRoom}>
                    Create Room Now
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={handleShare}>
                    <Users className="h-4 w-4 mr-1.5" />
                    Invite Group
                  </Button>
                </div>
              </Card>
            )}

            {/* Progress Overview (enhanced) */}
            <Card className={!nextRoom ? 'lg:col-span-2' : ''}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-amber-400" />
                <h2 className="text-base font-semibold text-white">Progress Overview</h2>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{completed}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{totalDays - completed}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Remaining</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{roadmap.currentStreak}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Streak</p>
                </div>
              </div>

              {/* Topic breakdown bars */}
              {topicProgress.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Topic Breakdown</p>
                  {topicProgress.map((tp, i) => (
                    <div key={tp.topic} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getTopicColor(tp.topic, i)}`} />
                          <span className="text-xs text-zinc-300">{tp.topic}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{tp.completed}/{tp.total}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getTopicColor(tp.topic, i)}`}
                          style={{ width: `${tp.pct}%`, opacity: 0.7 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Daily reminder indicator */}
              {roadmap.dailyReminder && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800">
                  <Bell className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs text-zinc-400">Daily reminders enabled</span>
                </div>
              )}
            </Card>
          </div>

          {/* ============================================================ */}
          {/*  Participants + Leaderboard                                    */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Participants Panel */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-base font-semibold text-white">People on this roadmap</h2>
                </div>
                <span className="text-xs text-zinc-500">
                  {loadingParticipants ? '...' : `${participants.length} people`}
                </span>
              </div>
              {loadingParticipants ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No participants yet. Invite friends to join!</p>
                </div>
              ) : hasMultipleGroups ? (
                <div className="space-y-4 mb-4">
                  {participantsByGroup.grouped.map((group) => (
                    <div key={group.groupId}>
                      <div className="flex items-center gap-2 mb-2 px-3">
                        <Users className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Group: {group.groupName}</span>
                        <span className="text-[10px] text-zinc-600">({group.participants.length})</span>
                      </div>
                      <div className="space-y-1">
                        {group.participants.map((p, i) => renderParticipant(p, i))}
                      </div>
                    </div>
                  ))}
                  {participantsByGroup.noGroup.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 px-3">
                        <Users className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Solo</span>
                        <span className="text-[10px] text-zinc-600">({participantsByGroup.noGroup.length})</span>
                      </div>
                      <div className="space-y-1">
                        {participantsByGroup.noGroup.map((p, i) => renderParticipant(p, i))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 mb-4">
                  {participants.map((p, i) => renderParticipant(p, i))}
                </div>
              )}
              <Button variant="primary" size="sm" className="w-full" onClick={handleShare}>
                Invite Friends
              </Button>
            </Card>

            {/* Mini Leaderboard */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-4 w-4 text-amber-400" />
                <h2 className="text-base font-semibold text-white">Leaderboard</h2>
              </div>
              {loadingParticipants ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-6">
                  <Trophy className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-sm text-zinc-500">No leaderboard data yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((p, idx) => (
                    <div
                      key={p.userId || idx}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                        idx === 0 ? 'bg-amber-500/5 border border-amber-500/10' : ''
                      }`}
                    >
                      <span className={`w-6 text-center text-sm font-bold ${
                        idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-400' : idx === 2 ? 'text-orange-400' : 'text-zinc-600'
                      }`}>
                        {idx === 0 ? '\u{1F947}' : idx === 1 ? '\u{1F948}' : idx === 2 ? '\u{1F949}' : idx + 1}
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-bold text-emerald-400">
                        {p.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
                        {p.groupName && (
                          <p className="text-[10px] text-cyan-400/70 truncate">{p.groupName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-400" /> {p.streak}d
                        </span>
                        <span>{p.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ============================================================ */}
          {/*  Discussion Section                                           */}
          {/* ============================================================ */}
          <Card>
            <h2 className="text-base font-semibold text-white mb-4">Discussion</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Say something to your crew..."
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              <Button variant="primary" size="md" onClick={handleSend} disabled={sendingMessage}>
                {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {loadingDiscussions ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No messages yet. Start the conversation!</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={msg.id || i} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">
                      {msg.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs">
                        <span className="font-medium text-zinc-200">{msg.user}</span>
                        <span className="text-zinc-600 ml-2">{msg.time}</span>
                      </p>
                      <p className="text-sm text-zinc-400 mt-0.5">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* ============================================================ */}
          {/*  Day-by-Day Timeline (grouped by week, enhanced)              */}
          {/* ============================================================ */}
          <Card>
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-base font-semibold text-white">Day-by-Day Timeline</h2>
              {showTimeline ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
            </button>
            {showTimeline && (
              <div className="mt-4 space-y-6 max-h-[600px] overflow-y-auto pr-1">
                {weekGroups.map((week) => (
                  <div key={week.weekNum}>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">
                      Week {week.weekNum}
                    </p>
                    <div className="space-y-1">
                      {week.days.map((day) => {
                        const isCompleted = completedDays.has(day.day);
                        const isToday = day.day === currentDay;
                        const isFuture = day.day > currentDay;
                        const isExpanded = expandedDay === day.day;

                        return (
                          <div key={day.day}>
                            <button
                              onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-left ${
                                isToday
                                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                                  : isCompleted
                                    ? 'bg-zinc-800/20'
                                    : isFuture
                                      ? 'opacity-50'
                                      : 'hover:bg-zinc-800/30'
                              }`}
                            >
                              {/* Completion indicator */}
                              <div className={`flex h-6 w-6 items-center justify-center rounded-md border shrink-0 transition-colors ${
                                isCompleted
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                  : isToday
                                    ? 'border-emerald-500/40 text-emerald-400'
                                    : 'border-zinc-700 text-zinc-600'
                              }`}>
                                {isCompleted && <CheckCircle className="h-4 w-4" />}
                                {isToday && !isCompleted && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                              </div>

                              {/* Topic color indicator */}
                              {day.topic && (
                                <div className={`h-3 w-1 rounded-full shrink-0 ${getTopicColor(day.topic)}`} />
                              )}

                              <span className="text-xs text-zinc-500 w-12 shrink-0">Day {day.day}</span>
                              <span className={`text-sm flex-1 ${isCompleted ? 'text-zinc-500 line-through' : isToday ? 'text-emerald-300 font-medium' : 'text-zinc-300'}`}>
                                {day.link ? (
                                  <Link
                                    href={day.link}
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:underline hover:text-emerald-400 transition-colors"
                                  >
                                    {day.title}
                                  </Link>
                                ) : (
                                  day.title
                                )}
                              </span>

                              {isToday && (
                                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400 shrink-0">
                                  TODAY
                                </span>
                              )}

                              <ChevronRight className={`h-4 w-4 text-zinc-600 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>

                            {/* Expanded day details */}
                            {isExpanded && (
                              <div className="ml-9 mt-1 mb-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-3">
                                <p className="text-sm text-zinc-300">{day.title}</p>
                                {day.topic && (
                                  <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${getTopicColor(day.topic)}`} />
                                    <span className="text-xs text-zinc-500">Topic: {day.topic}</span>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  {day.link && day.link.startsWith('/') ? (
                                    <Link
                                      href={day.link}
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                                    >
                                      <BookOpen className="h-3 w-3" />
                                      {day.type === 'lesson' ? 'Go to Lesson' : day.type === 'problem' ? 'Go to Pattern' : 'Open Content'}
                                    </Link>
                                  ) : day.link ? (
                                    <a
                                      href={day.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Open Problem
                                    </a>
                                  ) : null}
                                  {isCoding && !day.link && (
                                    <Link
                                      href={`/patterns/${day.topic?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'arrays'}`}
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                                    >
                                      <BookOpen className="h-3 w-3" />
                                      Go to Lesson
                                    </Link>
                                  )}
                                  {!isCompleted && (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleDay(day.day); }}
                                      disabled={updatingDay === day.day}
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                    >
                                      {updatingDay === day.day ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                                      Mark Complete
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </PageTransition>
    </AppShell>
  );
}
