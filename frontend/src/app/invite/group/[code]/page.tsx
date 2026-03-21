'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { inviteApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Users, LogIn, UserPlus, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface GroupPreview {
  type: 'group';
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
}

export default function GroupInvitePage() {
  const params = useParams();
  const code = params.code as string;
  const router = useRouter();
  const { user, loading: authLoading, hydrate } = useAuthStore();

  const [preview, setPreview] = useState<GroupPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  // Fetch preview data and auto-join if logged in
  useEffect(() => {
    inviteApi.resolveGroup(code)
      .then(({ data }) => {
        setPreview(data);
        // Auto-join if user is logged in
        if (user && !authLoading) {
          setJoining(true);
          inviteApi.joinGroup(code)
            .then(({ data: joinData }) => {
              setJoined(true);
              router.push(`/groups/${joinData.group?.id || data.id}`);
            })
            .catch((err: { response?: { status?: number } }) => {
              if (err.response?.status === 409) {
                // Already a member — redirect directly
                router.push(`/groups/${data.id}`);
              } else {
                setJoining(false);
              }
            });
        }
      })
      .catch(() => setError('This invite link is invalid or has expired.'))
      .finally(() => setLoading(false));
  }, [code, user, authLoading, router]);

  const handleJoin = async () => {
    setJoining(true);
    setError('');
    try {
      const { data } = await inviteApi.joinGroup(code);
      setJoined(true);
      setTimeout(() => router.push(`/groups/${data.group.id}`), 1000);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { error?: string } } };
      if (e.response?.status === 409) {
        // Already a member — redirect directly
        if (preview?.id) router.push(`/groups/${preview.id}`);
      } else {
        setError(e.response?.data?.error || 'Failed to join group');
      }
    } finally {
      setJoining(false);
    }
  };

  const handleAuthRedirect = (path: string) => {
    localStorage.setItem('streaksy_pending_invite', JSON.stringify({ type: 'group', code }));
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/10">
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-sm text-zinc-500 mb-1">You&apos;ve been invited to join</p>
            <h1 className="text-2xl font-bold text-zinc-100">{preview?.name}</h1>
            {preview?.description && (
              <p className="text-sm text-zinc-400 mt-2">{preview.description}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-6 py-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-100">{preview?.memberCount}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Members</p>
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
          ) : user ? (
            /* Logged in — show join button */
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
                  Join Group
                </>
              )}
            </button>
          ) : (
            /* Not logged in — show auth options */
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
