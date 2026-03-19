'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />
      {/* Email verification banner */}
      {user.emailVerified === false && (
        <div className="fixed top-0 left-64 right-0 z-30 bg-amber-500/10 border-b border-amber-500/20 px-8 py-2 flex items-center justify-between">
          <p className="text-xs text-amber-400">
            Please verify your email address. Check your inbox for a verification link.
          </p>
          <button
            onClick={() => authApi.resendVerification().catch(() => {})}
            className="text-xs font-medium text-amber-300 hover:text-amber-200 underline"
          >
            Resend
          </button>
        </div>
      )}
      <main className={`pl-64 ${user.emailVerified === false ? 'pt-10' : ''}`}>
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
