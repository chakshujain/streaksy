'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Suspense } from 'react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hydrate } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        localStorage.setItem('streaksy_token', token);
        localStorage.setItem('streaksy_user', JSON.stringify(user));
        hydrate();
        const pending = localStorage.getItem('streaksy_pending_invite');
        if (pending) {
          try {
            const invite = JSON.parse(pending);
            localStorage.removeItem('streaksy_pending_invite');
            router.replace(`/invite/${invite.type}/${invite.code}`);
          } catch {
            router.replace('/dashboard');
          }
        } else {
          router.replace('/dashboard');
        }
      } catch {
        router.replace('/auth/login?error=invalid_callback');
      }
    } else {
      router.replace('/auth/login?error=missing_params');
    }
  }, [searchParams, hydrate, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
        <p className="text-sm text-zinc-400">Signing you in...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
