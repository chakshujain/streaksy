'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTransition } from '@/components/ui/PageTransition';
import { ProblemPicker } from '@/components/search/ProblemPicker';
import { useAsync } from '@/hooks/useAsync';
import { roomsApi, problemsApi } from '@/lib/api';
import { Swords, Plus, LogIn, Calendar, Trophy, Clock, Video, CalendarPlus, Shuffle, ListOrdered, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Room, Problem, Sheet, RoomLeaderboardEntry, SuggestedProblem } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

type Tab = 'rooms' | 'upcoming' | 'leaderboard';

function generateGoogleCalendarUrl(title: string, scheduledAt: string, timeLimitMinutes: number, meetLink?: string): string {
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

export default function RoomsPage() {
  const router = useRouter();
  useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('rooms');
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  // Create form state
  const [roomName, setRoomName] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [selectedSheet, setSelectedSheet] = useState('');
  const [roomMode, setRoomMode] = useState<'single' | 'multi'>('single');
  const [recurrence, setRecurrence] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [meetLinkOverride, setMeetLinkOverride] = useState(false);
  type ProblemSelectionMode = 'pick' | 'next_unsolved' | 'random_sheet' | 'random_all';
  const [problemSelectionMode, setProblemSelectionMode] = useState<ProblemSelectionMode>('pick');
  const [suggestCount, setSuggestCount] = useState(4);
  const [suggestedProblems, setSuggestedProblems] = useState<SuggestedProblem[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const { data: rooms, loading } = useAsync<Room[]>(
    () => roomsApi.mine().then(r => r.data.rooms),
    []
  );

  const { data: upcomingRooms, loading: upcomingLoading } = useAsync<Room[]>(
    () => roomsApi.upcoming().then(r => r.data.rooms),
    []
  );

  const { data: leaderboard, loading: leaderboardLoading } = useAsync<RoomLeaderboardEntry[]>(
    () => roomsApi.leaderboard().then(r => r.data.leaderboard),
    []
  );

  const { data: sheets } = useAsync<Sheet[]>(
    () => problemsApi.getSheets().then(r => r.data.sheets),
    []
  );

  const handleCreate = async () => {
    const hasProblemSelection = selectedProblem || selectedSheet || suggestedProblems.length > 0;
    if (!roomName.trim() || !hasProblemSelection) return;
    setCreateLoading(true);
    setCreateError('');
    try {
      const problemIds = suggestedProblems.length > 0 ? suggestedProblems.map(p => p.id) : undefined;
      const { data } = await roomsApi.create({
        name: roomName,
        problemId: selectedProblem?.id || undefined,
        problemIds,
        sheetId: selectedSheet || undefined,
        timeLimitMinutes: timeLimit,
        scheduledAt: scheduledAt || undefined,
        mode: suggestedProblems.length > 1 ? 'multi' : roomMode,
        recurrence: recurrence || undefined,
        meetLink: meetLink || undefined,
      });
      router.push(`/rooms/${data.room.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setCreateError(e.response?.data?.error || 'Failed to create room');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setJoinLoading(true);
    setJoinError('');
    try {
      const { data } = await roomsApi.join(joinCode.toUpperCase());
      router.push(`/rooms/${data.room.id}`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setJoinError(e.response?.data?.error || 'Room not found');
    } finally {
      setJoinLoading(false);
    }
  };

  const activeRooms = rooms?.filter(r => r.status !== 'finished') || [];
  const pastRooms = rooms?.filter(r => r.status === 'finished') || [];

  return (
    <AppShell>
      <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/10 glow-sm">
              <Swords className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Live Solve Rooms</h1>
              <p className="text-sm text-zinc-500 mt-0.5">Solve problems together in real-time</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setShowJoin(true); setShowCreate(false); }} className="flex items-center gap-1.5">
              <LogIn className="h-4 w-4" /> Join Room
            </Button>
            <Button onClick={() => { setShowCreate(true); setShowJoin(false); }} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Create Room
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-zinc-800/50 p-1 border border-zinc-700/50 w-fit animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
          {([
            { key: 'rooms' as Tab, label: 'My Rooms', icon: Swords },
            { key: 'upcoming' as Tab, label: 'Upcoming', icon: Calendar },
            { key: 'leaderboard' as Tab, label: 'Leaderboard', icon: Trophy },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-zinc-700 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Join Room */}
        {showJoin && (
          <div className="animate-scale-in">
            <Card>
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">Join a Room</h2>
              <div className="flex gap-3">
                <Input
                  id="join-code"
                  placeholder="Enter room code (e.g. A1B2C3D4)"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="flex-1 font-mono tracking-widest uppercase"
                />
                <Button onClick={handleJoin} loading={joinLoading}>Join</Button>
              </div>
              {joinError && <p className="text-sm text-red-400 mt-2">{joinError}</p>}
            </Card>
          </div>
        )}

        {/* Create Room */}
        {showCreate && (
          <div className="animate-scale-in">
            <Card className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-200">Create a Room</h2>
              {createError && <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{createError}</div>}
              <Input id="room-name" label="Room Name" value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Friday Night Grind" />

              {/* Mode selector */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Mode</label>
                <div className="flex gap-2">
                  {(['single', 'multi'] as const).map(m => (
                    <button key={m} onClick={() => setRoomMode(m)}
                      className={cn('rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 capitalize',
                        roomMode === m ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      )}>
                      {m === 'single' ? 'Single Problem' : 'Multi Problem'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Selection Mode */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Problem Selection</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {([
                    { key: 'pick' as ProblemSelectionMode, label: 'Search & Pick', icon: Sparkles },
                    { key: 'next_unsolved' as ProblemSelectionMode, label: 'Next Unsolved', icon: ListOrdered },
                    { key: 'random_sheet' as ProblemSelectionMode, label: 'Random from Sheet', icon: Shuffle },
                    { key: 'random_all' as ProblemSelectionMode, label: 'Random from All', icon: RefreshCw },
                  ]).map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setProblemSelectionMode(opt.key); setSuggestedProblems([]); }}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition-all duration-200',
                        problemSelectionMode === opt.key
                          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                          : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Pick mode */}
              {problemSelectionMode === 'pick' && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-zinc-300">Problem</label>
                    <ProblemPicker
                      onSelect={(p) => setSelectedProblem(p)}
                      placeholder="Search for a problem..."
                    />
                    {selectedProblem && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm text-zinc-300">{selectedProblem.title}</span>
                        <Badge variant={selectedProblem.difficulty}>{selectedProblem.difficulty}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Sheet selector for pick mode */}
                  {sheets && sheets.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-zinc-300">Or select from a Sheet</label>
                      <select
                        value={selectedSheet}
                        onChange={e => setSelectedSheet(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      >
                        <option value="">None</option>
                        {sheets.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Smart selection modes: sheet selector + count + suggest button */}
              {problemSelectionMode !== 'pick' && (
                <div className="space-y-3">
                  {problemSelectionMode !== 'random_all' && sheets && sheets.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-zinc-300">Sheet</label>
                      <select
                        value={selectedSheet}
                        onChange={e => setSelectedSheet(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      >
                        <option value="">Select a sheet</option>
                        {sheets.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-zinc-300">Number of problems</label>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5, 6].map(n => (
                        <button key={n} onClick={() => setSuggestCount(n)}
                          className={cn('rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200',
                            suggestCount === n ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          )}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    loading={suggestLoading}
                    disabled={problemSelectionMode !== 'random_all' && !selectedSheet}
                    onClick={async () => {
                      setSuggestLoading(true);
                      try {
                        const { data } = await roomsApi.suggestProblems(
                          problemSelectionMode,
                          suggestCount,
                          selectedSheet || undefined
                        );
                        setSuggestedProblems(data.problems);
                      } catch {
                        setSuggestedProblems([]);
                      } finally {
                        setSuggestLoading(false);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    {suggestedProblems.length > 0 ? 'Re-roll' : 'Suggest Problems'}
                  </Button>

                  {suggestedProblems.length > 0 && (
                    <div className="space-y-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 p-3">
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Suggested Problems</p>
                      {suggestedProblems.map((p, i) => (
                        <div key={p.id} className="flex items-center justify-between rounded-md bg-zinc-800/50 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500 font-mono w-5">{i + 1}.</span>
                            <span className="text-sm text-zinc-200">{p.title}</span>
                          </div>
                          <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Schedule */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Schedule (optional)</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                />
              </div>

              {/* Recurrence */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Recurrence</label>
                <select
                  value={recurrence}
                  onChange={e => setRecurrence(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                >
                  <option value="">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="weekends">Weekends only</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Meet Link */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Meet Link</label>
                <p className="text-xs text-zinc-500">A Jitsi Meet link will be auto-generated. Toggle to enter a custom link.</p>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                  {meetLinkOverride ? (
                    <input
                      type="url"
                      value={meetLink}
                      onChange={e => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    />
                  ) : (
                    <div className="flex-1 rounded-lg border border-zinc-700/50 bg-zinc-800/30 px-3 py-2 text-sm text-zinc-400 font-mono">
                      {'https://meet.jit.si/streaksy-... (auto-generated)'}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { setMeetLinkOverride(!meetLinkOverride); if (meetLinkOverride) setMeetLink(''); }}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200',
                      meetLinkOverride
                        ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                        : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {meetLinkOverride ? 'Auto' : 'Custom'}
                  </button>
                </div>
              </div>

              {/* Add to Google Calendar */}
              {scheduledAt && (
                <a
                  href={generateGoogleCalendarUrl(roomName || 'Solve Room', scheduledAt, timeLimit, meetLink || undefined)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
                >
                  <CalendarPlus className="h-4 w-4" />
                  Add to Google Calendar
                </a>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Time Limit</label>
                <div className="flex gap-2">
                  {[15, 30, 45, 60].map(t => (
                    <button key={t} onClick={() => setTimeLimit(t)}
                      className={cn('rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200',
                        timeLimit === t ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                      )}>
                      {t}min
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleCreate} loading={createLoading} disabled={!roomName.trim() || (!selectedProblem && !selectedSheet && suggestedProblems.length === 0)}>Create Room</Button>
            </Card>
          </div>
        )}

        {/* Tab content */}
        {activeTab === 'rooms' && (
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
            ) : (
              <>
                {activeRooms.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Active Rooms</h2>
                    {activeRooms.map((room, i) => (
                      <div key={room.id} className="animate-slide-up" style={{ animationDelay: `${100 + i * 50}ms`, animationFillMode: 'both' }}>
                        <Card className="cursor-pointer hover:border-emerald-500/30 hover:scale-[1.01] transition-all duration-200" onClick={() => router.push(`/rooms/${room.id}`)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn('h-3 w-3 rounded-full', room.status === 'active' ? 'bg-emerald-500 animate-pulse' : room.status === 'scheduled' ? 'bg-blue-500' : 'bg-amber-500')} />
                              <div>
                                <h3 className="text-sm font-semibold text-zinc-100">{room.name}</h3>
                                <p className="text-xs text-zinc-500">
                                  {room.problem_title ? `${room.problem_title} · ` : ''}{room.time_limit_minutes}min
                                  {room.scheduled_at && ` · Scheduled ${formatDistanceToNow(new Date(room.scheduled_at), { addSuffix: true })}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {room.problem_difficulty && <Badge variant={room.problem_difficulty as 'easy' | 'medium' | 'hard'}>{room.problem_difficulty}</Badge>}
                              <span className="text-xs font-mono text-zinc-500">{room.code}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}

                {pastRooms.length > 0 && (
                  <div className="space-y-3 mt-6">
                    <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Past Rooms</h2>
                    {pastRooms.slice(0, 10).map((room, i) => (
                      <div key={room.id} className="animate-slide-up" style={{ animationDelay: `${200 + i * 50}ms`, animationFillMode: 'both' }}>
                        <Card className="cursor-pointer hover:border-zinc-700 hover:scale-[1.01] transition-all duration-200 opacity-60 hover:opacity-100" onClick={() => router.push(`/rooms/${room.id}`)}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-zinc-300">{room.name}</h3>
                              <p className="text-xs text-zinc-600">{room.problem_title || 'Multi-problem'}</p>
                            </div>
                            {room.problem_difficulty && <Badge variant={room.problem_difficulty as 'easy' | 'medium' | 'hard'}>{room.problem_difficulty}</Badge>}
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}

                {rooms && rooms.length === 0 && (
                  <EmptyState
                    icon={<Swords className="h-10 w-10" />}
                    title="No rooms yet"
                    description="Create a room to solve problems together with friends in real-time."
                    action={<Button onClick={() => setShowCreate(true)}>Create Your First Room</Button>}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            {upcomingLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
            ) : upcomingRooms && upcomingRooms.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Upcoming Scheduled Rooms</h2>
                {upcomingRooms.map((room, i) => (
                  <div key={room.id} className="animate-slide-up" style={{ animationDelay: `${100 + i * 50}ms`, animationFillMode: 'both' }}>
                    <Card className="cursor-pointer hover:border-blue-500/30 hover:scale-[1.01] transition-all duration-200" onClick={() => router.push(`/rooms/${room.id}`)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <Calendar className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-zinc-100">{room.name}</h3>
                            <p className="text-xs text-zinc-500">
                              {room.problem_title ? `${room.problem_title} · ` : ''}{room.time_limit_minutes}min
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-blue-400">
                            <Clock className="h-3.5 w-3.5" />
                            {room.scheduled_at && formatDistanceToNow(new Date(room.scheduled_at), { addSuffix: true })}
                          </div>
                          {room.problem_difficulty && <Badge variant={room.problem_difficulty as 'easy' | 'medium' | 'hard'}>{room.problem_difficulty}</Badge>}
                          <span className="text-xs font-mono text-zinc-500">{room.code}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Calendar className="h-10 w-10" />}
                title="No upcoming rooms"
                description="No rooms are scheduled yet. Create a room with a scheduled start time."
                action={<Button onClick={() => { setShowCreate(true); setActiveTab('rooms'); }}>Schedule a Room</Button>}
              />
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            {leaderboardLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <Card>
                <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Room Champions</h2>
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => (
                    <div key={entry.user_id} className={cn(
                      'flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200',
                      i === 0 ? 'bg-amber-500/5 border border-amber-500/10' : i === 1 ? 'bg-zinc-400/5 border border-zinc-400/10' : i === 2 ? 'bg-orange-500/5 border border-orange-500/10' : 'bg-zinc-800/30'
                    )} style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                      <div className="w-8 text-center">
                        <span className={cn('text-sm font-bold',
                          i === 0 ? 'text-amber-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-orange-400' : 'text-zinc-500'
                        )}>
                          {i === 0 ? '\u{1F947}' : i === 1 ? '\u{1F948}' : i === 2 ? '\u{1F949}' : `#${i + 1}`}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-100">{entry.display_name}</p>
                        <p className="text-xs text-zinc-500">{entry.rooms_participated} rooms participated</p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-sm font-bold text-emerald-400">{entry.rooms_won}</p>
                          <p className="text-[10px] text-zinc-500 uppercase">Wins</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-200">{entry.total_solves}</p>
                          <p className="text-[10px] text-zinc-500 uppercase">Solves</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={<Trophy className="h-10 w-10" />}
                title="No leaderboard data"
                description="Complete some rooms to start building the leaderboard!"
              />
            )}
          </div>
        )}
      </div>
      </PageTransition>
    </AppShell>
  );
}
