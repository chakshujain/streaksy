'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageTransition } from '@/components/ui/PageTransition';
import { useAsync } from '@/hooks/useAsync';
import { roomsApi } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/cn';
import {
  Play, Square, Copy, CheckCircle, Clock, MessageSquare, Send, ExternalLink,
  Crown, Users, Swords, Timer, List, Trophy, Video, CalendarPlus, Repeat,
} from 'lucide-react';
import type { Room, RoomParticipant, RoomMessage, RoomProblem } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

function generateGoogleCalendarUrl(title: string, scheduledAt: string, timeLimitMinutes: number, meetLink?: string | null): string {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + timeLimitMinutes * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Streaksy Solve Room${meetLink ? `\nJoin: ${meetLink}` : ''}`,
  });
  if (meetLink) params.set('location', meetLink);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = params.id as string;
  const { user } = useAuthStore();

  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [problems, setProblems] = useState<RoomProblem[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [scheduledTimeLeft, setScheduledTimeLeft] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [celebrateUser, setCelebrateUser] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Initial fetch
  const { loading } = useAsync<Room>(
    () => roomsApi.get(roomId).then(r => {
      const data = r.data.room;
      setRoom(data);
      setParticipants(data.participants || []);
      setMessages(data.messages || []);
      return data;
    }),
    [roomId]
  );

  // Fetch problems for multi-problem rooms
  useEffect(() => {
    if (room?.mode === 'multi' || room) {
      roomsApi.getProblems(roomId).then(r => {
        setProblems(r.data.problems || []);
      }).catch(() => {});
    }
  }, [room?.id, room?.mode, roomId]);

  // Socket connection
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('room:join', roomId);
    });

    socket.on('room:participants', (data: RoomParticipant[]) => {
      setParticipants(data);
    });

    socket.on('room:started', (data: Room) => {
      setRoom(data);
    });

    socket.on('room:ended', (data: { room: Room; participants: RoomParticipant[] }) => {
      setRoom(data.room);
      setParticipants(data.participants);
    });

    socket.on('room:solve_event', (data: { userId: string }) => {
      // Celebration animation for solve events
      setCelebrateUser(data.userId);
      setTimeout(() => setCelebrateUser(null), 2000);
    });

    socket.on('room:new_message', (msg: RoomMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.emit('room:leave', roomId);
      socket.off('connect');
      socket.off('room:participants');
      socket.off('room:started');
      socket.off('room:ended');
      socket.off('room:solve_event');
      socket.off('room:new_message');
      socket.off('disconnect');
    };
  }, [roomId]);

  // Timer countdown
  useEffect(() => {
    if (!room?.started_at || room.status !== 'active') { setTimeLeft(null); return; }

    const endTime = new Date(room.started_at).getTime() + room.time_limit_minutes * 60 * 1000;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [room?.started_at, room?.time_limit_minutes, room?.status]);

  // Scheduled countdown
  useEffect(() => {
    if (!room?.scheduled_at || room.status !== 'scheduled') { setScheduledTimeLeft(null); return; }

    const startTime = new Date(room.scheduled_at).getTime();

    const tick = () => {
      const remaining = Math.max(0, Math.floor((startTime - Date.now()) / 1000));
      setScheduledTimeLeft(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [room?.scheduled_at, room?.status]);

  // Auto-scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const isHost = user?.id === room?.host_id;
  const mySolve = participants.find(p => p.user_id === user?.id);

  const handleStart = () => {
    const socket = getSocket();
    socket.emit('room:start', roomId);
  };

  const handleEnd = () => {
    const socket = getSocket();
    socket.emit('room:end', roomId);
  };

  const handleSolve = () => {
    const socket = getSocket();
    socket.emit('room:solved', { roomId });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const socket = getSocket();
    socket.emit('room:message', { roomId, content: chatInput.trim() });
    setChatInput('');
  };

  const copyCode = () => {
    if (!room?.code) return;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `${baseUrl}/invite/room/${room.code}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <AppShell>
        <PageTransition>
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
            </div>
          </div>
        </PageTransition>
      </AppShell>
    );
  }

  if (!room) {
    return <AppShell><p className="text-zinc-500">Room not found.</p></AppShell>;
  }

  // Rank participants by solve time
  const ranked = [...participants].sort((a, b) => {
    if (a.solved_at && !b.solved_at) return -1;
    if (!a.solved_at && b.solved_at) return 1;
    if (a.solved_at && b.solved_at) return new Date(a.solved_at).getTime() - new Date(b.solved_at).getTime();
    return 0;
  });

  const solvedCount = participants.filter(p => p.solved_at).length;
  const winner = ranked.length > 0 && ranked[0].solved_at ? ranked[0] : null;

  return (
    <AppShell>
      <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-zinc-100">{room.name}</h1>
              <Badge variant={room.status === 'active' ? 'easy' : room.status === 'waiting' ? 'medium' : room.status === 'scheduled' ? 'default' : 'default'}>
                {room.status}
              </Badge>
              {room.mode === 'multi' && (
                <Badge variant="default">Multi-Problem</Badge>
              )}
              {room.recurrence && (
                <Badge variant="default">
                  <Repeat className="h-3 w-3 mr-1 inline" />
                  {room.recurrence}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2">
              {room.problem_slug && (
                <a href={`https://leetcode.com/problems/${room.problem_slug}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors duration-200">
                  {room.problem_title} <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {room.problem_difficulty && <Badge variant={room.problem_difficulty as 'easy' | 'medium' | 'hard'}>{room.problem_difficulty}</Badge>}
              {!room.problem_slug && problems.length > 0 && (
                <span className="text-sm text-zinc-400">{problems.length} problems</span>
              )}
              {room.meet_link && (
                <a
                  href={room.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
                >
                  <Video className="h-4 w-4" />
                  Join Meet
                </a>
              )}
              {room.scheduled_at && (
                <a
                  href={generateGoogleCalendarUrl(room.name, room.scheduled_at, room.time_limit_minutes, room.meet_link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-all duration-200"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Add to Calendar
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Room code */}
            <button onClick={copyCode} className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 transition-all duration-200 hover:scale-[1.02]">
              {copied ? 'Link Copied!' : <><span className="font-mono tracking-widest">{room.code}</span><span className="text-zinc-500 text-xs ml-1">Share</span></>}
              {copied ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400 animate-bounce-in" /> : <Copy className="h-3.5 w-3.5 text-zinc-500" />}
            </button>

            {/* Host controls */}
            {isHost && (room.status === 'waiting' || room.status === 'scheduled') && (
              <Button onClick={handleStart} className="flex items-center gap-1.5">
                <Play className="h-4 w-4" /> Start
              </Button>
            )}
            {isHost && room.status === 'active' && (
              <Button variant="danger" onClick={handleEnd} className="flex items-center gap-1.5">
                <Square className="h-4 w-4" /> End
              </Button>
            )}
          </div>
        </div>

        {/* Scheduled countdown */}
        {room.status === 'scheduled' && scheduledTimeLeft !== null && (
          <div className="flex items-center justify-center gap-3 rounded-xl p-6 border border-blue-500/30 bg-blue-500/5 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <Clock className="h-6 w-6 text-blue-400" />
            <div className="text-center">
              <p className="text-sm text-blue-400 mb-1">Starting in</p>
              <span className="text-3xl font-mono font-bold tabular-nums text-blue-400">
                {formatTime(scheduledTimeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Timer */}
        {room.status === 'active' && timeLeft !== null && (
          <div className={cn(
            'flex items-center justify-center gap-3 rounded-xl p-4 border animate-slide-up transition-all duration-300',
            timeLeft < 60 ? 'border-red-500/30 bg-red-500/10 animate-pulse-glow' : timeLeft < 300 ? 'border-amber-500/30 bg-amber-500/10' : 'border-emerald-500/30 bg-emerald-500/10'
          )} style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <Timer className={cn('h-6 w-6 transition-colors duration-300', timeLeft < 60 ? 'text-red-400 animate-pulse' : timeLeft < 300 ? 'text-amber-400' : 'text-emerald-400')} />
            <span className={cn('text-3xl font-mono font-bold tabular-nums transition-colors duration-300', timeLeft < 60 ? 'text-red-400' : timeLeft < 300 ? 'text-amber-400' : 'text-emerald-400')}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}

        {/* Celebration overlay */}
        {celebrateUser && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="animate-bounce-in text-center">
              <div className="text-6xl mb-2">{'\u{1F389}'}</div>
              <p className="text-lg font-bold text-emerald-400 animate-pulse-glow rounded-xl bg-zinc-900/90 px-6 py-3 border border-emerald-500/30">
                Someone solved it!
              </p>
            </div>
          </div>
        )}

        {/* Results summary for finished rooms */}
        {room.status === 'finished' && (
          <div className="animate-slide-up" style={{ animationDelay: '75ms', animationFillMode: 'both' }}>
            <Card className="border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-zinc-200">Results</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-zinc-100">{participants.length}</p>
                  <p className="text-xs text-zinc-500 uppercase mt-1">Participants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">{solvedCount}</p>
                  <p className="text-xs text-zinc-500 uppercase mt-1">Solved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{winner?.display_name || '--'}</p>
                  <p className="text-xs text-zinc-500 uppercase mt-1">Winner</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Waiting state */}
        {room.status === 'waiting' && (
          <div className="animate-slide-up" style={{ animationDelay: '75ms', animationFillMode: 'both' }}>
            <Card className="text-center py-10">
              <Swords className="h-10 w-10 text-zinc-500 mx-auto mb-4 animate-float" />
              <h2 className="text-lg font-semibold text-zinc-200">Waiting for host to start...</h2>
              <p className="text-sm text-zinc-500 mt-1">Share the room code <span className="font-mono text-emerald-400">{room.code}</span> with friends</p>
              <p className="text-xs text-zinc-600 mt-3">{participants.length} participant{participants.length !== 1 ? 's' : ''} joined</p>
            </Card>
          </div>
        )}

        {/* Solve button (active room, not yet solved) */}
        {room.status === 'active' && !mySolve?.solved_at && (
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <Button onClick={handleSolve} size="lg" className="w-full flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform duration-200">
              <CheckCircle className="h-5 w-5" /> I Solved It!
            </Button>
          </div>
        )}

        <div className={cn('grid grid-cols-1 gap-6 animate-slide-up', problems.length > 1 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')} style={{ animationDelay: '125ms', animationFillMode: 'both' }}>
          {/* Problem list sidebar for multi-problem rooms */}
          {problems.length > 1 && (
            <Card className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <List className="h-5 w-5 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-200">Problems ({problems.length})</h2>
              </div>
              <div className="space-y-2">
                {problems.map((p, i) => (
                  <a
                    key={p.problem_id}
                    href={`https://leetcode.com/problems/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 bg-zinc-800/30 hover:bg-zinc-700/30 transition-all duration-200"
                  >
                    <span className="text-xs font-mono text-zinc-500 w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate">{p.title}</p>
                    </div>
                    <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty}</Badge>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Participants / Leaderboard */}
          <Card className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-zinc-400" />
              <h2 className="text-sm font-semibold text-zinc-200">
                {room.status === 'finished' ? 'Results' : 'Participants'} ({participants.length})
              </h2>
            </div>
            <div className="space-y-2">
              {ranked.map((p, i) => (
                <div key={p.user_id} className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-300',
                  p.solved_at ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-zinc-800/30',
                  p.user_id === celebrateUser && 'animate-celebrate border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                )} style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                  {/* Rank / status */}
                  <div className="w-6 text-center">
                    {p.solved_at ? (
                      <span className={cn('text-sm font-bold', i === 0 ? 'text-amber-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-orange-400' : 'text-zinc-500')}>
                        {i === 0 ? '\u{1F947}' : i === 1 ? '\u{1F948}' : i === 2 ? '\u{1F949}' : `#${i + 1}`}
                      </span>
                    ) : (
                      <Clock className="h-4 w-4 text-zinc-600 mx-auto" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/user/${p.user_id}`} className="text-sm font-medium text-zinc-200 truncate hover:text-emerald-400 transition-colors">{p.display_name}</Link>
                      {p.user_id === room.host_id && <Crown className="h-3 w-3 text-amber-400" />}
                    </div>
                    {p.solved_at && (
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.language && <span className="text-[10px] text-zinc-500">{p.language}</span>}
                        {p.runtime_ms && <span className="text-[10px] text-zinc-500">{p.runtime_ms}ms</span>}
                        <span className="text-[10px] text-emerald-400/70">
                          {room.started_at && formatDistanceToNow(new Date(p.solved_at), { addSuffix: false })}
                        </span>
                      </div>
                    )}
                  </div>

                  {p.solved_at && <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Chat */}
          <Card className={cn('flex flex-col', problems.length > 1 ? 'lg:col-span-2' : 'lg:col-span-2')} padding={false}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <MessageSquare className="h-4 w-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-zinc-200">Discussion</h2>
              {!connected && <span className="text-[10px] text-amber-400 animate-pulse">reconnecting...</span>}
            </div>

            <div ref={chatRef} className="flex-1 min-h-[300px] max-h-[500px] overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-zinc-600 text-center py-8">
                  {room.status === 'waiting' || room.status === 'scheduled' ? 'Chat will be available during and after the solve session.' : 'No messages yet. Start the discussion!'}
                </p>
              ) : (
                messages.map((msg, i) => (
                  <div key={msg.id} className={cn(
                    'flex gap-2',
                    msg.user_id === user?.id ? 'flex-row-reverse' : '',
                    i === messages.length - 1 ? 'animate-slide-in-right' : ''
                  )}>
                    <div className={cn(
                      'max-w-[70%] rounded-lg px-3 py-2 transition-all duration-200',
                      msg.user_id === user?.id ? 'bg-emerald-500/10 border border-emerald-500/10' : 'bg-zinc-800/50'
                    )}>
                      <p className="text-[11px] font-medium text-zinc-400 mb-0.5">{msg.display_name}</p>
                      <p className="text-sm text-zinc-200 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 px-4 py-3 border-t border-zinc-800">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
              />
              <Button type="submit" size="sm"><Send className="h-4 w-4" /></Button>
            </form>
          </Card>
        </div>
      </div>
      </PageTransition>
    </AppShell>
  );
}
