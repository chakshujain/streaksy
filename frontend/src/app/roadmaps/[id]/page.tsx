'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
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
} from 'lucide-react';
import { roadmapsApi, pokesApi } from '@/lib/api';
import { templatesBySlug } from '@/lib/roadmap-templates';
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
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function generateDayTasks(templateSlug?: string, totalDays?: number): DayTask[] {
  const days = totalDays || 30;

  // If we have template data, generate topic-appropriate tasks
  const template = templateSlug ? templatesBySlug[templateSlug] : null;

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
      }));
    }

    if (category === 'Fitness & Health') {
      return Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${template.name}`,
      }));
    }
  }

  // Generic day tasks
  return Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1} Task`,
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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function RoadmapDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [roadmap, setRoadmap] = useState<UserRoadmap | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [showTimeline, setShowTimeline] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Discussion[]>([]);
  const [shareToast, setShareToast] = useState(false);
  const [pokeToast, setPokeToast] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [loadingDiscussions, setLoadingDiscussions] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingDay, setUpdatingDay] = useState<number | null>(null);

  // All active roadmaps (to find groups using the same template)
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

  // Compute groups using this same template
  const groupsUsingTemplate = useMemo(() => {
    if (!roadmap?.templateSlug) return [];
    const groupMap = new Map<string, string>();
    for (const rm of allActiveRoadmaps) {
      if (rm.templateSlug === roadmap.templateSlug && rm.groupId) {
        // Use group name from the roadmap name or groupId as fallback
        if (!groupMap.has(rm.groupId)) {
          groupMap.set(rm.groupId, rm.groupId);
        }
      }
    }
    return Array.from(groupMap.entries()).map(([gId, gName]) => ({ id: gId, name: gName }));
  }, [roadmap?.templateSlug, allActiveRoadmaps]);

  // Fetch participants from API
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
      }));
      setParticipants(apiParticipants);
    } catch {
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  }, []);

  // Fetch discussions from API
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

  // Fetch data when roadmap is loaded
  useEffect(() => {
    if (roadmap?.templateSlug) {
      fetchParticipants(roadmap.templateSlug);
      fetchDiscussions(roadmap.templateSlug);
    }
  }, [roadmap?.templateSlug, fetchParticipants, fetchDiscussions]);

  const toggleDay = async (day: number) => {
    const isCompleting = !completedDays.has(day);
    setUpdatingDay(day);

    // Update local state immediately
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);

      // Update localStorage
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

    // Sync with backend
    if (roadmap) {
      try {
        await roadmapsApi.updateProgress(roadmap.id, day, isCompleting);
      } catch {
        // Backend sync failed silently - local state is still updated
      }
    }
    setUpdatingDay(null);
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
      } catch {
        // Message was added optimistically, keep it
      } finally {
        setSendingMessage(false);
      }
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

  const handleShare = () => {
    if (roadmap?.shareCode) {
      navigator.clipboard.writeText(`${window.location.origin}/roadmaps/join/${roadmap.shareCode}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  // Group participants by their group
  const participantsByGroup = useMemo(() => {
    const grouped: { groupId: string; groupName: string; participants: Participant[] }[] = [];
    const noGroup: Participant[] = [];

    const groupMap = new Map<string, { groupName: string; participants: Participant[] }>();

    for (const p of participants) {
      if (p.groupId) {
        const existing = groupMap.get(p.groupId);
        if (existing) {
          existing.participants.push(p);
        } else {
          groupMap.set(p.groupId, { groupName: p.groupName || p.groupId, participants: [p] });
        }
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

  const totalDays = roadmap.durationDays;
  const completed = completedDays.size;
  const pct = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
  const currentDay = completed + 1;
  const dayTasks = generateDayTasks(roadmap.templateSlug, totalDays);
  const todayTask = currentDay <= dayTasks.length ? dayTasks[currentDay - 1] : null;

  // Leaderboard: sort participants by progress desc
  const leaderboard = [...participants].sort((a, b) => b.progress - a.progress).slice(0, 5);

  const renderParticipant = (p: Participant, i: number) => (
    <div key={p.userId || i} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-zinc-800/30 transition-colors">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-bold text-emerald-400">
        {p.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-orange-400">&#x1F525; {p.streak}d</span>
          <span className="text-[10px] text-zinc-500">{p.progress}%</span>
        </div>
      </div>
      <button
        onClick={() => handlePoke(p)}
        className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[10px] font-medium text-orange-400 hover:bg-orange-500/20 transition-colors"
      >
        Poke
      </button>
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
            <div className="relative">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
              </Button>
              {shareToast && (
                <div className="absolute right-0 top-full mt-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400 whitespace-nowrap">
                  Link copied!
                </div>
              )}
            </div>
          </div>

          {/* Poke toast */}
          {pokeToast && (
            <div className="rounded-lg bg-orange-500/20 border border-orange-500/30 px-4 py-2 text-sm text-orange-400 text-center">
              {pokeToast}
            </div>
          )}

          {/* Roadmap Header */}
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
                </div>
                <div className="mt-3 h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{pct}% complete</p>
              </div>
            </div>
          </Card>

          {/* Today's Task */}
          {todayTask && (
            <Card variant="glow" className="border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                </div>
                <h2 className="text-base font-semibold text-white">Today&apos;s Task</h2>
                <span className="ml-auto rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-400">Day {currentDay}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{todayTask.title}</h3>
              {todayTask.link && (
                <a href={todayTask.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline mb-4">
                  Open problem <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <Button
                variant="gradient"
                size="lg"
                className="w-full mt-4"
                onClick={() => toggleDay(currentDay)}
                disabled={completedDays.has(currentDay) || updatingDay === currentDay}
                loading={updatingDay === currentDay}
              >
                {completedDays.has(currentDay) ? 'Completed!' : 'Mark Complete'}
              </Button>
            </Card>
          )}

          {/* Two-column layout: Participants + Leaderboard */}
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
                <div className="space-y-2 mb-4">
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

          {/* Discussion Section */}
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

          {/* Day-by-Day Timeline */}
          <Card>
            <button
              onClick={() => setShowTimeline(!showTimeline)}
              className="flex items-center justify-between w-full text-left"
            >
              <h2 className="text-base font-semibold text-white">Day-by-Day Timeline</h2>
              {showTimeline ? <ChevronUp className="h-5 w-5 text-zinc-400" /> : <ChevronDown className="h-5 w-5 text-zinc-400" />}
            </button>
            {showTimeline && (
              <div className="mt-4 space-y-1.5 max-h-[500px] overflow-y-auto">
                {dayTasks.slice(0, totalDays).map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800/30 transition-colors"
                  >
                    <button
                      onClick={() => toggleDay(day.day)}
                      disabled={updatingDay === day.day}
                      className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                        completedDays.has(day.day)
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'border-zinc-700 text-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      {updatingDay === day.day ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : completedDays.has(day.day) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : null}
                    </button>
                    <span className="text-xs text-zinc-500 w-12">Day {day.day}</span>
                    <span className="text-sm text-zinc-300 flex-1">{day.title}</span>
                    {day.link && (
                      <a href={day.link} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                        Link <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
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
