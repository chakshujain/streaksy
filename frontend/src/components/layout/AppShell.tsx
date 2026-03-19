'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/lib/store';
import { authApi } from '@/lib/api';
import { StreakRiskBanner } from '@/components/poke/StreakRiskBanner';
import { TopLoader } from '@/components/ui/TopLoader';
import { SearchBar } from '@/components/search/SearchBar';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
      <div className="min-h-screen bg-zinc-950 flex">
        {/* Sidebar skeleton */}
        <div className="w-64 border-r border-zinc-800/40 bg-zinc-950/70 p-6 space-y-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl skeleton-shimmer" />
            <div className="h-5 w-20 rounded skeleton-shimmer" />
          </div>
          <div className="space-y-2 mt-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
        {/* Content skeleton */}
        <div className="flex-1 p-8 space-y-6">
          <div className="h-8 w-48 rounded-lg skeleton-shimmer" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
          <div className="h-64 rounded-2xl skeleton-shimmer" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <TopLoader />
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
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-zinc-800/40 bg-zinc-950/80 backdrop-blur-xl px-8 py-3">
          <SearchBar />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
          </div>
        </div>
        {/* Streak risk banner — shows when streak is about to break */}
        <StreakRiskBanner />
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
