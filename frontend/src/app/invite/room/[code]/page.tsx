'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { inviteApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Swords, LogIn, UserPlus, ArrowRight, Loader2, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import Link from 'next/link';

interface RoomPreview {
  type: 'room';
  id: string;
  name: string;
  problemTitle: string | null;
  problemDifficulty: string | null;
  status: string;
  participantCount: number;
  timeLimitMinutes: number;
  mode: string;
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  waiting: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'Waiting' },
  scheduled: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', label: 'Scheduled' },
  active: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', label: 'Live' },
  finished: { bg: 'bg-zinc-500/10 border-zinc-500/20', text: 'text-zinc-400', label: 'Finished' },
};

export default function RoomInvitePage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();
  const { user, loading: authLoading, hydrate } = useAuthStore();

  const [preview, setPreview] = useState<RoomPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    inviteApi.resolveRoom(code)
      .then(({ data }) => setPreview(data))
      .catch(() => setError('This invite link is invalid or has expired.'))
      .finally(() => setLoading(false));
  }, [code]);

  const handleJoin = async () => {
    if (preview?.status === 'finished') {
      setError('This room has already ended.');
      return;
    }
    setJoining(true);
    setError('');
    try {
      const { data } = await inviteApi.joinRoom(code);
      setJoined(true);
      setTimeout(() => router.push(`/rooms/${data.room.id}`), 1000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Failed to join room');
    } finally {
      setJoining(false);
    }
  };

  const handleAuthRedirect = (path: string) => {
    localStorage.setItem('streaksy_pending_invite', JSON.stringify({ type: 'room', code }));
    router.push(path);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error && !preview) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100 mb-2">Invalid Invite Link</h1>
          <p className="text-sm text-zinc-500 mb-6">{error}</p>
          <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300">Go to Streaksy</Link>
        </div>
      </div>
    );
  }

  const status = statusColors[preview?.status || 'waiting'] || statusColors.waiting;
  const isFinished = preview?.status === 'finished';

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-2xl">🔥</span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Streaksy</span>
          </Link>
        </div>

        {/* Invite Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/10">
              <Swords className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-sm text-zinc-500 mb-1">You&apos;ve been invited to a solve room</p>
            <h1 className="text-2xl font-bold text-zinc-100">{preview?.name}</h1>
            {preview?.problemTitle && (
              <p className="text-sm text-emerald-400 mt-2">{preview.problemTitle}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-6 py-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-lg font-bold text-zinc-100">{preview?.participantCount}</span>
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Joined</p>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-lg font-bold text-zinc-100">{preview?.timeLimitMinutes}m</span>
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Limit</p>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="text-center">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                {status.label}
              </span>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Status</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {joined ? (
            <div className="text-center py-4">
              <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-emerald-400">Joined! Redirecting...</p>
            </div>
          ) : isFinished ? (
            <div className="text-center py-4">
              <p className="text-sm text-zinc-500">This room has already ended.</p>
              <Link href="/rooms" className="text-sm text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
                Browse Active Rooms
              </Link>
            </div>
          ) : user ? (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200 disabled:opacity-50"
            >
              {joining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  Join Room
                </>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => handleAuthRedirect('/auth/login')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                Log in to Join
              </button>
              <button
                onClick={() => handleAuthRedirect('/auth/signup')}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-all duration-200"
              >
                <UserPlus className="h-4 w-4" />
                Sign up to Join
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Streaksy — DSA Prep, Together
        </p>
      </div>
    </div>
  );
}
