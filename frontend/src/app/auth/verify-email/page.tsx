'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import { Flame, CheckCircle, XCircle } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('No verification token provided');
      return;
    }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setError(err.response?.data?.error || 'Verification failed');
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Flame className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold text-zinc-100 tracking-tight">Streaksy</span>
        </div>

        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20 text-center space-y-4">
          {status === 'loading' && (
            <>
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
              <p className="text-zinc-400">Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold text-zinc-100">Email verified!</h1>
              <p className="text-sm text-zinc-400">Your email has been successfully verified.</p>
              <Link href="/dashboard" className="inline-block mt-2 text-sm font-medium text-emerald-400 hover:text-emerald-300">
                Go to Dashboard
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="flex justify-center">
                <XCircle className="h-12 w-12 text-red-400" />
              </div>
              <h1 className="text-xl font-bold text-zinc-100">Verification failed</h1>
              <p className="text-sm text-red-400">{error}</p>
              <Link href="/dashboard" className="inline-block mt-2 text-sm font-medium text-emerald-400 hover:text-emerald-300">
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950"><div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
