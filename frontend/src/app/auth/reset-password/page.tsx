'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { Flame, Lock, CheckCircle } from 'lucide-react';

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
  if (score <= 2) return { label: 'Fair', color: 'bg-amber-500', width: '40%' };
  if (score <= 3) return { label: 'Good', color: 'bg-emerald-500', width: '60%' };
  if (score <= 4) return { label: 'Strong', color: 'bg-cyan-500', width: '80%' };
  return { label: 'Very Strong', color: 'bg-emerald-400', width: '100%' };
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset link. Please request a new one.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Flame className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold text-zinc-100 tracking-tight">Streaksy</span>
        </div>

        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
          {success ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold text-zinc-100">Password reset!</h1>
              <p className="text-sm text-zinc-400">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-100">Set new password</h1>
                <p className="mt-2 text-sm text-zinc-500">Enter your new password below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
                  <Input
                    id="password"
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="pl-10"
                    required
                    minLength={8}
                  />
                  {password && (() => {
                    const strength = getPasswordStrength(password);
                    return (
                      <div className="mt-1.5 space-y-1">
                        <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
                        </div>
                        <p className={`text-[10px] ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</p>
                      </div>
                    );
                  })()}
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
                  <Input
                    id="confirm"
                    label="Confirm Password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className="pl-10"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" loading={loading}>
                  Reset Password
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link href="/auth/login" className="text-sm text-zinc-500 hover:text-zinc-300">
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950"><div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
