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
import { useAsync } from '@/hooks/useAsync';
import { roomsApi, problemsApi } from '@/lib/api';
import { Swords, Plus, LogIn } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Room, Problem } from '@/lib/types';
import { useAuthStore } from '@/lib/store';

export default function RoomsPage() {
  const router = useRouter();
  useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  // Create form state
  const [roomName, setRoomName] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Problem[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const { data: rooms, loading } = useAsync<Room[]>(
    () => roomsApi.mine().then(r => r.data.rooms),
    []
  );

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    try {
      const { data } = await problemsApi.search(q, 8);
      setSearchResults(data.problems);
    } catch { setSearchResults([]); }
  };

  const handleCreate = async () => {
    if (!roomName.trim() || !selectedProblem) return;
    setCreateLoading(true);
    setCreateError('');
    try {
      const { data } = await roomsApi.create({ name: roomName, problemId: selectedProblem, timeLimitMinutes: timeLimit });
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Live Solve Rooms</h1>
            <p className="text-sm text-zinc-500 mt-1">Solve problems together in real-time</p>
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

        {/* Join Room */}
        {showJoin && (
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
        )}

        {/* Create Room */}
        {showCreate && (
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-200">Create a Room</h2>
            {createError && <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{createError}</div>}
            <Input id="room-name" label="Room Name" value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Friday Night Grind" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Problem</label>
              <input
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search for a problem..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchResults.length > 0 && (
                <div className="rounded-lg border border-zinc-700 bg-zinc-800/80 overflow-hidden max-h-40 overflow-y-auto">
                  {searchResults.map(p => (
                    <button key={p.id} onClick={() => { setSelectedProblem(p.id); setSearchQuery(p.title); setSearchResults([]); }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-zinc-700/50 text-sm">
                      <span className="text-zinc-200">{p.title}</span>
                      <Badge variant={p.difficulty}>{p.difficulty}</Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Time Limit</label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map(t => (
                  <button key={t} onClick={() => setTimeLimit(t)}
                    className={cn('rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      timeLimit === t ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    )}>
                    {t}min
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleCreate} loading={createLoading} disabled={!roomName.trim() || !selectedProblem}>Create Room</Button>
          </Card>
        )}

        {/* Active Rooms */}
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : (
          <>
            {activeRooms.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Active Rooms</h2>
                {activeRooms.map(room => (
                  <Card key={room.id} className="cursor-pointer hover:border-emerald-500/30 transition-all" onClick={() => router.push(`/rooms/${room.id}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('h-3 w-3 rounded-full', room.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-100">{room.name}</h3>
                          <p className="text-xs text-zinc-500">{room.problem_title} · {room.time_limit_minutes}min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={room.problem_difficulty as 'easy' | 'medium' | 'hard'}>{room.problem_difficulty}</Badge>
                        <span className="text-xs font-mono text-zinc-500">{room.code}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {pastRooms.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Past Rooms</h2>
                {pastRooms.slice(0, 10).map(room => (
                  <Card key={room.id} className="cursor-pointer hover:border-zinc-700 transition-all opacity-60 hover:opacity-100" onClick={() => router.push(`/rooms/${room.id}`)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-zinc-300">{room.name}</h3>
                        <p className="text-xs text-zinc-600">{room.problem_title}</p>
                      </div>
                      <Badge variant={room.problem_difficulty as 'easy' | 'medium' | 'hard'}>{room.problem_difficulty}</Badge>
                    </div>
                  </Card>
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
    </AppShell>
  );
}
