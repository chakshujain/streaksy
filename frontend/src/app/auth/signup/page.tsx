'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/cn';
import { Flame, Mail, Lock, User, Zap, Shield, Code2, Trophy } from 'lucide-react';

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

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, displayName);
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-zinc-900 to-emerald-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.15),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.1),_transparent_50%)]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

        {/* Floating elements */}
        <div className="absolute top-20 right-16 animate-float">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm p-4">
            <Trophy className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
        <div className="absolute top-48 left-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm p-4">
            <Code2 className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        <div className="absolute bottom-40 right-24 animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm p-4">
            <Zap className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
        <div className="absolute bottom-24 left-16 animate-float" style={{ animationDelay: '2.5s' }}>
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm p-4">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-emerald-500/8 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-glow-pulse">
                <Flame className="h-6 w-6 text-emerald-400" />
              </div>
              <span className="text-2xl font-bold text-zinc-100 tracking-tight">Streaksy</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-zinc-100 leading-tight mb-6">
              Start your journey<br />
              <span className="text-emerald-400">to mastery today.</span>
            </h2>

            <p className="text-lg text-zinc-400 mb-10 max-w-md leading-relaxed">
              Practice with curated problems, track your growth, and build the skills top companies look for.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Code2, text: 'Hundreds of curated problems' },
                { icon: Zap, text: 'Real-time code execution' },
                { icon: Trophy, text: 'Track your progress' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <span className="text-sm text-zinc-300">{text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 border-zinc-900',
                      i === 0 && 'bg-emerald-500/40',
                      i === 1 && 'bg-emerald-600/40',
                      i === 2 && 'bg-emerald-700/40',
                      i === 3 && 'bg-emerald-800/40',
                    )}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Join 10,000+ developers</p>
                <p className="text-xs text-zinc-500">who leveled up their skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo - only shows on small screens */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Flame className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-zinc-100 tracking-tight">Streaksy</span>
          </div>

          {/* Glassmorphism card */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Create your account</h1>
              <p className="mt-2 text-sm text-zinc-500">Start your DSA journey with Streaksy</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-slide-up">
                  {error}
                </div>
              )}

              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
                <Input
                  id="name"
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="pl-10"
                  minLength={8}
                  required
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

              <Button type="submit" className="w-full mt-2" loading={loading}>
                Create Account
              </Button>
            </form>

            {/* OAuth divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <span className="text-xs text-zinc-500">or continue with</span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {/* OAuth buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/auth/google`}
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/auth/github`}
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-500">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-600">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
