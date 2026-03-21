'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import type { UserRoadmap } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */
const seedParticipants = [
  { name: 'Arjun Mehta', streak: 12, progress: 78 },
  { name: 'Priya Sharma', streak: 9, progress: 65 },
  { name: 'Rahul Kumar', streak: 15, progress: 82 },
  { name: 'Sneha Reddy', streak: 6, progress: 45 },
  { name: 'Vikram Singh', streak: 3, progress: 30 },
  { name: 'Ananya Gupta', streak: 8, progress: 55 },
  { name: 'Dev Patel', streak: 11, progress: 70 },
  { name: 'Kavya Nair', streak: 4, progress: 35 },
  { name: 'Rohan Das', streak: 7, progress: 50 },
  { name: 'Meera Joshi', streak: 2, progress: 20 },
];

const seedMessages = [
  { user: 'Arjun Mehta', text: 'Just finished the sliding window section. The two-pointer approach clicked!', time: '2h ago' },
  { user: 'Priya Sharma', text: 'Anyone stuck on the graph BFS problem? I can help.', time: '4h ago' },
  { user: 'Rahul Kumar', text: 'Day 15 done. This roadmap is amazing for staying consistent.', time: '6h ago' },
  { user: 'Sneha Reddy', text: 'Poked Vikram -- he has been slacking for 2 days!', time: '8h ago' },
];

const sampleDays = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  title: i < 5
    ? ['Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search'][i]
    : i < 10
    ? ['Linked List', 'Trees', 'Tries', 'Heap / Priority Queue', 'Backtracking'][i - 5]
    : `Day ${i + 1} Task`,
  link: i < 10 ? `https://leetcode.com/problems/sample-${i + 1}` : undefined,
}));

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
  const [messages, setMessages] = useState(seedMessages);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]') as UserRoadmap[];
      const found = stored.find((r) => r.id === id);
      if (found) {
        setRoadmap(found);
        // Populate completed days from stored data
        const completed = new Set<number>();
        for (let i = 1; i <= found.completedDays; i++) completed.add(i);
        setCompletedDays(completed);
      }
    } catch { /* empty */ }
  }, [id]);

  const toggleDay = (day: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      // Persist
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
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [{ user: 'You', text: message, time: 'just now' }, ...prev]);
    setMessage('');
  };

  const handleShare = () => {
    if (roadmap?.shareCode) {
      navigator.clipboard.writeText(`${window.location.origin}/roadmaps/join/${roadmap.shareCode}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

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
  const todayTask = currentDay <= sampleDays.length ? sampleDays[currentDay - 1] : null;

  // Leaderboard: sort participants by progress desc
  const leaderboard = [...seedParticipants].sort((a, b) => b.progress - a.progress).slice(0, 5);

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

          {/* Roadmap Header */}
          <Card className="border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{roadmap.icon}</span>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{roadmap.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-zinc-400">Day {completed}/{totalDays}</span>
                  {roadmap.currentStreak > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-400">
                      <Flame className="h-4 w-4" /> {roadmap.currentStreak} day streak
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
              <div className="flex items-center gap-3 mt-3">
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  {currentDay <= 10 ? 'Auto-tracked' : 'Check-in'}
                </span>
              </div>
              <Button
                variant="gradient"
                size="lg"
                className="w-full mt-4"
                onClick={() => toggleDay(currentDay)}
                disabled={completedDays.has(currentDay)}
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
                <span className="text-xs text-zinc-500">{seedParticipants.length} people</span>
              </div>
              <div className="space-y-2 mb-4">
                {seedParticipants.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-zinc-800/30 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-bold text-emerald-400">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-orange-400">🔥 {p.streak}d</span>
                        <span className="text-[10px] text-zinc-500">{p.progress}%</span>
                      </div>
                    </div>
                    <button className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[10px] font-medium text-orange-400 hover:bg-orange-500/20 transition-colors">
                      Poke
                    </button>
                  </div>
                ))}
              </div>
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
              <div className="space-y-2">
                {leaderboard.map((p, idx) => (
                  <div
                    key={p.name}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                      idx === 0 ? 'bg-amber-500/5 border border-amber-500/10' : ''
                    }`}
                  >
                    <span className={`w-6 text-center text-sm font-bold ${
                      idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-zinc-400' : idx === 2 ? 'text-orange-400' : 'text-zinc-600'
                    }`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-bold text-emerald-400">
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
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
              <Button variant="primary" size="md" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className="flex items-start gap-3">
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
                {sampleDays.slice(0, totalDays).map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-800/30 transition-colors"
                  >
                    <button
                      onClick={() => toggleDay(day.day)}
                      className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                        completedDays.has(day.day)
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'border-zinc-700 text-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      {completedDays.has(day.day) && <CheckCircle className="h-4 w-4" />}
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
