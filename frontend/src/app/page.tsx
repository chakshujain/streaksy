'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Zap,
  BarChart3,
  ArrowRight,
  Code2,
  Target,
  Sparkles,
  Chrome,
  Download,
  Clock,
  Shield,
  ChevronRight,
  CheckCircle,
  Map,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('streaksy_token'));
  }, []);
  return isLoggedIn;
}

function SmartLink({ href, children, loggedInText, className }: { href: string; children: React.ReactNode; loggedInText?: React.ReactNode; className?: string }) {
  const isLoggedIn = useIsLoggedIn();
  const isAuthLink = href === '/auth/signup' || href === '/auth/login';
  const target = isLoggedIn && isAuthLink ? '/dashboard' : href;
  return <Link href={target} className={className}>{isLoggedIn && isAuthLink && loggedInText ? loggedInText : children}</Link>;
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
function Navbar() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Streaksy</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-white">Features</a>
          <a href="#roadmaps" className="text-sm text-zinc-400 transition-colors hover:text-white">Roadmaps</a>
          <a href="#extension" className="text-sm text-zinc-400 transition-colors hover:text-white">Extension</a>
          <a href="#cta" className="text-sm text-zinc-400 transition-colors hover:text-white">Get Started</a>
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 bg-[length:200%_100%] px-4 py-2 text-sm font-medium text-white transition-[background-position] duration-500 hover:bg-right"
            >
              Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 bg-[length:200%_100%] px-4 py-2 text-sm font-medium text-white transition-[background-position] duration-500 hover:bg-right"
              >
                Sign Up
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section aria-label="Hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-cyan-500/8 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="animate-slide-up mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          Your goals, your streak, your crew
        </div>

        {/* Headline */}
        <h1
          className="animate-slide-up text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          Learn Anything.{' '}
          <span className="gradient-text">Together.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl md:mt-8 md:text-2xl"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          Pick a goal. Follow a roadmap. Track your streak. Do it solo or with friends. Coding, fitness, reading, habits — all in one place.
        </p>

        {/* CTA buttons */}
        <div
          className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-12"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <Link
            href="/roadmaps"
            className="glow-md inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 bg-[length:200%_100%] px-8 py-4 text-base font-semibold text-white transition-all duration-500 hover:bg-right hover:shadow-emerald-500/25"
          >
            <Map className="h-4 w-4" />
            Explore Roadmaps
          </Link>
          <SmartLink
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:text-white"
            loggedInText={<>Go to Dashboard <ArrowRight className="h-4 w-4" /></>}
          >
            Sign Up Free
            <ArrowRight className="h-4 w-4" />
          </SmartLink>
        </div>

        {/* Floating cards */}
        <div className="pointer-events-none mt-16 hidden md:block">
          <div className="relative mx-auto h-64 max-w-3xl">
            <div className="animate-float glass absolute left-0 top-4 rounded-xl p-4 text-left" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span className="font-mono">DSA Patterns — Day 12</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">Sliding Window completed</p>
            </div>
            <div className="animate-float glass absolute left-1/2 top-0 -translate-x-1/2 rounded-xl p-4 text-left" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Study Crew</p>
                  <p className="text-xs text-zinc-500">3 members on track</p>
                </div>
              </div>
            </div>
            <div className="animate-float glass absolute right-0 top-8 rounded-xl p-4 text-left" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2 text-sm text-orange-400">
                <Flame className="h-4 w-4" />
                <span className="font-semibold">42-day streak!</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">1,260 pts earned</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Features Section                                                   */
/* ------------------------------------------------------------------ */
const features = [
  {
    emoji: '\u{1F5FA}\uFE0F',
    title: 'Curated Roadmaps',
    description: 'Pre-built plans for coding interviews, fitness, reading, and more. Follow step-by-step or customize your own.',
    color: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  {
    emoji: '\u{1F525}',
    title: 'Streak Tracking',
    description: 'Stay consistent with daily streaks and earn points. Freeze streaks, unlock powerups, and celebrate milestones.',
    color: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/10',
  },
  {
    emoji: '\u{1F465}',
    title: 'Learn Together',
    description: 'Join groups, compete on leaderboards, hold each other accountable. Solo is fine — but together is better.',
    color: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/10',
  },
  {
    emoji: '\u{1F4CA}',
    title: 'Track Progress',
    description: 'Visual dashboards, insights, and milestone celebrations. See exactly how far you have come.',
    color: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/10',
  },
];

function Features() {
  return (
    <section id="features" aria-label="Features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Everything you need
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your complete{' '}
            <span className="gradient-text">goal-crushing toolkit</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Whether it is coding, fitness, reading, or any habit — Streaksy keeps you on track.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 ${feature.glow} hover:shadow-lg`}
            >
              <div className="mb-4 text-3xl">{feature.emoji}</div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Popular Roadmaps Section                                           */
/* ------------------------------------------------------------------ */
const popularRoadmaps = [
  { name: 'DSA Patterns', duration: '30 days', icon: '\u{1F9E9}', color: 'emerald', slug: 'dsa-patterns-30' },
  { name: 'Interview Prep 60-Day', duration: '60 days', icon: '\u{1F3AF}', color: 'emerald', slug: 'interview-prep-60' },
  { name: 'Learn System Design', duration: '17 days', icon: '\u{1F3D7}\uFE0F', color: 'purple', slug: 'learn-system-design' },
  { name: 'Go to Gym Daily', duration: '30 days', icon: '\u{1F4AA}', color: 'blue', slug: 'gym-daily-30' },
  { name: '100 Days of Code', duration: '100 days', icon: '\u{1F4BB}', color: 'emerald', slug: '100-days-of-code' },
  { name: 'Read 1 Book/Month', duration: '30 days', icon: '\u{1F4D6}', color: 'amber', slug: 'read-book-month' },
];

const colorMap: Record<string, string> = {
  emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
  blue: 'border-blue-500/20 hover:border-blue-500/40',
  purple: 'border-purple-500/20 hover:border-purple-500/40',
  amber: 'border-amber-500/20 hover:border-amber-500/40',
};

const badgeColorMap: Record<string, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
  amber: 'bg-amber-500/10 text-amber-400',
};

function PopularRoadmaps() {
  return (
    <section id="roadmaps" aria-label="Popular Roadmaps" className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Popular{' '}
            <span className="gradient-text">Roadmaps</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Pick a roadmap and start today. Solo or with friends.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoadmaps.map((rm) => (
            <Link
              key={rm.slug}
              href={`/roadmaps/start/${rm.slug}`}
              className={`group rounded-2xl border bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/80 hover:shadow-lg ${colorMap[rm.color] || colorMap.emerald}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{rm.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">{rm.name}</h3>
                  <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${badgeColorMap[rm.color] || badgeColorMap.emerald}`}>
                    {rm.duration}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                Start now <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/roadmaps"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:text-white"
          >
            Browse All Roadmaps
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Chrome Extension Section                                           */
/* ------------------------------------------------------------------ */
function ExtensionSection() {
  const captures = [
    { icon: Code2, label: 'Submitted Code', desc: 'Full solution source code in any language' },
    { icon: Clock, label: 'Time Spent', desc: 'How long you took from opening to solving' },
    { icon: Zap, label: 'Runtime & Memory', desc: 'Execution time, memory, and percentile rank' },
    { icon: Target, label: 'Language Stats', desc: 'Track which languages you use most' },
    { icon: BarChart3, label: 'Submission History', desc: 'Every attempt logged — not just accepts' },
    { icon: Shield, label: 'Private & Secure', desc: 'Your code stays yours — encrypted and private' },
  ];

  return (
    <section id="extension" aria-label="Chrome Extension" className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[600px] -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-sm text-cyan-400 mb-6">
              <Chrome className="h-3.5 w-3.5" />
              Chrome Extension
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Capture <span className="gradient-text">everything</span> from LeetCode
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Our Chrome extension silently watches your LeetCode sessions and captures rich data
              from every submission — code, performance, time spent, and more.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {captures.map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                    <c.icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{c.label}</p>
                    <p className="text-xs text-zinc-500">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/streaksy-extension.tar.gz"
                download
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Download Extension
              </a>
              <a
                href="#install-guide"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:text-white"
              >
                Installation Guide
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: Visual mockup */}
          <div className="relative">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                </div>
                <div className="flex-1 mx-4 h-7 rounded-lg bg-zinc-800 flex items-center px-3">
                  <span className="text-[10px] text-zinc-500">leetcode.com/problems/two-sum</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span className="text-lg font-semibold text-emerald-400">Accepted</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-zinc-800/80 p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Runtime</p>
                    <p className="text-lg font-bold text-white">4 ms</p>
                    <p className="text-xs text-emerald-400">Beats 95.2%</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/80 p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Memory</p>
                    <p className="text-lg font-bold text-white">16.2 MB</p>
                    <p className="text-xs text-cyan-400">Beats 87.1%</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/80 p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Time Spent</p>
                    <p className="text-lg font-bold text-white">4m 32s</p>
                    <p className="text-xs text-zinc-400">Since page open</p>
                  </div>
                  <div className="rounded-lg bg-zinc-800/80 p-3">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Language</p>
                    <p className="text-lg font-bold text-white">Python3</p>
                    <p className="text-xs text-zinc-400">12 lines</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <Zap className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400">Synced to Streaksy automatically</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Guide */}
        <div id="install-guide" className="mt-24">
          <div className="mx-auto max-w-3xl">
            <h3 className="text-2xl font-bold text-white text-center mb-2">How to Install</h3>
            <p className="text-center text-zinc-400 mb-10">Get set up in under 2 minutes</p>

            <div className="space-y-6">
              {[
                { step: 1, title: 'Download the extension', desc: 'Click the "Download Extension" button above to get the extension archive.' },
                { step: 2, title: 'Extract the archive', desc: 'Extract the downloaded file to a folder on your computer. Remember where you saved it.' },
                { step: 3, title: 'Open Chrome Extensions', desc: 'Go to chrome://extensions in your browser. Enable "Developer mode" using the toggle in the top-right corner.' },
                { step: 4, title: 'Load the extension', desc: 'Click "Load unpacked" and select the folder where you extracted the archive. The Streaksy icon will appear in your toolbar.' },
                { step: 5, title: 'Sign in & start solving', desc: 'Click the Streaksy icon, sign in with your account, then head to LeetCode. Every accepted submission will be auto-synced with full details!' },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                    <p className="mt-1 text-sm text-zinc-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Section                                                        */
/* ------------------------------------------------------------------ */
function CTA() {
  return (
    <section id="cta" className="relative px-6 py-32">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl">
        <div className="animated-border rounded-3xl">
          <div className="relative rounded-3xl bg-zinc-950 px-8 py-20 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[80px]" />
            </div>

            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <Flame className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Ready to{' '}
                <span className="gradient-text">start your streak?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                Join people who are crushing their goals with Streaksy. Coding, fitness, reading — whatever your thing is. Free to start.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <SmartLink
                  href="/auth/signup"
                  className="glow-lg inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 bg-[length:200%_100%] px-8 py-4 text-base font-semibold text-white transition-all duration-500 hover:bg-right"
                  loggedInText={<>Go to Dashboard <ArrowRight className="h-4 w-4" /></>}
                >
                  Get Started — It&apos;s Free
                  <ArrowRight className="h-4 w-4" />
                </SmartLink>
              </div>

              <p className="mt-6 text-xs text-zinc-600">
                No spam. No BS. Just pure grind fuel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-400">Streaksy</span>
        </div>
        <p className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Streaksy. Built for grinders, by grinders.
        </p>
        <div className="flex gap-6">
          <Link href="/roadmaps" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Roadmaps
          </Link>
          <a href="/streaksy-extension.tar.gz" download className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Extension
          </a>
          <SmartLink href="/auth/login" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors" loggedInText="Dashboard">
            Log in
          </SmartLink>
          <SmartLink href="/auth/signup" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors" loggedInText="Dashboard">
            Sign up
          </SmartLink>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Streaksy',
            url: 'https://streaksy.in',
            description: 'Learn anything together. Track streaks. Crush goals. Coding, fitness, reading, habits — all in one place.',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Curated Roadmaps',
              'Streak Tracking',
              'Study Groups & Leaderboards',
              'Progress Dashboards',
              'Chrome Extension',
              'Live Solve Rooms',
            ],
          }),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PopularRoadmaps />
        <ExtensionSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
