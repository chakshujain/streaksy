'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  ArrowRight,
  Sparkles,
  Map,
  CheckCircle,
  Plug,
  Smartphone,
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
          <a href="#roadmaps" className="text-sm text-zinc-400 transition-colors hover:text-white">Roadmaps</a>
          <a href="#how-we-track" className="text-sm text-zinc-400 transition-colors hover:text-white">Tracking</a>
          <a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-white">Features</a>
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
          Why solve alone when you have friends?
        </div>

        {/* Headline */}
        <h1
          className="animate-slide-up text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          Why Alone?{' '}
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Crush Your Goals With Friends.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl md:mt-8 md:text-2xl"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          Pick a roadmap. Get your friends in. Track streaks together. Coding interviews, fitness, reading — do it together or don&apos;t bother.
        </p>

        {/* CTA buttons */}
        <div
          className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-12"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <Link
            href="/roadmaps"
            className="glow-md inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-emerald-500/25 hover:shadow-lg"
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

        {/* Social Proof Floating Cards */}
        <div className="pointer-events-none mt-16 hidden md:block">
          <div className="relative mx-auto h-64 max-w-3xl">
            <div className="animate-float glass absolute left-0 top-4 rounded-xl p-4 text-left opacity-90" style={{ animationDelay: '0s' }}>
              <p className="text-sm text-zinc-300">
                <span className="mr-1">🔥</span> Arjun and 47 others are on <span className="font-medium text-emerald-400">Crack the Job Together</span>
              </p>
            </div>
            <div className="animate-float glass absolute left-1/2 top-0 -translate-x-1/2 rounded-xl p-4 text-left opacity-90" style={{ animationDelay: '0.5s' }}>
              <p className="text-sm text-zinc-300">
                <span className="mr-1">👆</span> Priya poked you — <span className="font-medium text-orange-400">get back on track!</span>
              </p>
            </div>
            <div className="animate-float glass absolute right-0 top-8 rounded-xl p-4 text-left opacity-90" style={{ animationDelay: '1s' }}>
              <p className="text-sm text-zinc-300">
                <span className="mr-1">✅</span> Your crew solved <span className="font-semibold text-emerald-400">12 problems</span> today
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Curated Roadmaps Section                                           */
/* ------------------------------------------------------------------ */
const curatedRoadmaps = [
  { name: 'Solve Striver Sheet', icon: '📋', duration: '30 days', slug: 'solve-striver-sheet', participants: 156 },
  { name: 'LeetCode Top 150', icon: '🏆', duration: '30 days', slug: 'leetcode-top-150', participants: 312 },
  { name: 'Learn System Design', icon: '🏗️', duration: '17 days', slug: 'learn-system-design', participants: 145 },
  { name: 'Go to Gym Daily', icon: '💪', duration: '30 days', slug: 'gym-daily-30', participants: 567 },
  { name: '100 Days of Code', icon: '💻', duration: '100 days', slug: '100-days-of-code', participants: 423 },
];

function CuratedRoadmaps() {
  return (
    <section id="roadmaps" aria-label="Curated Roadmaps" className="relative px-6 py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Get started
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Curated Roadmaps — <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Start With Your Crew</span>
          </h2>
        </div>

        {/* Flagship Card */}
        <div className="mt-16 mb-8">
          <Link
            href="/roadmaps/start/crack-the-job-together"
            className="group block relative rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-emerald-950/30 p-8 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 overflow-hidden"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-emerald-500/10 blur-[80px]" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <span className="text-6xl">🚀</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">Crack the Job Together</h3>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-xs font-semibold text-emerald-400">THE flagship</span>
                </div>
                <p className="text-zinc-400 mb-3">90-day interview prep. DSA + System Design + OOP + Behavioral. Do it with your crew.</p>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">90 days</span>
                  <span className="text-xs text-zinc-500">200+ people on this</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all group-hover:bg-emerald-500">
                  Customize & Start <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Grid of other roadmaps */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {curatedRoadmaps.map((rm) => (
            <Link
              key={rm.slug}
              href={`/roadmaps/start/${rm.slug}`}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg"
            >
              <span className="text-3xl block mb-3">{rm.icon}</span>
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">{rm.name}</h3>
              <span className="inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 mb-2">{rm.duration}</span>
              <p className="text-[11px] text-zinc-500">{rm.participants} people</p>
              <p className="text-[11px] text-emerald-500/70 mt-1">Start with friends</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How We Track Section                                               */
/* ------------------------------------------------------------------ */
function HowWeTrack() {
  return (
    <section id="how-we-track" aria-label="How We Track" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Tracking
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            We Track. <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">You Focus.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/15">
              <Plug className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Auto-Tracked</h3>
            <p className="text-sm text-zinc-400">LeetCode problems sync via our Chrome extension. Solve on LeetCode, we record it.</p>
          </div>

          <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/15">
              <CheckCircle className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Daily Check-in</h3>
            <p className="text-sm text-zinc-400">Gym, reading, journaling — just tap done each day. Simple.</p>
          </div>

          <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/15">
              <Smartphone className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
            <p className="text-sm text-zinc-400">Mobile app and smartwatch integration on the way.</p>
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
    emoji: '\u{1F465}',
    title: 'Do It Together',
    description: 'See who\u2019s on your roadmap. Poke slackers. Discuss strategies. Solve problems together in live rooms.',
    color: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/10',
  },
  {
    emoji: '\u{1F5FA}\uFE0F',
    title: 'Curated Roadmaps',
    description: 'Pre-built plans for coding interviews, fitness, reading. Or create your own.',
    color: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  {
    emoji: '\u{1F525}',
    title: 'Streak Points',
    description: 'Complete tasks, maintain streaks, earn points. Compete on leaderboards.',
    color: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/10',
  },
  {
    emoji: '\u{1F4CA}',
    title: 'Track Everything',
    description: 'Visual progress, insights, and milestone celebrations.',
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
                Your friends are already grinding.{' '}
                <span className="gradient-text">Join them.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                Pick a roadmap, invite your crew, hold each other accountable.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <SmartLink
                  href="/auth/signup"
                  className="glow-lg inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-emerald-500/25 hover:shadow-lg"
                  loggedInText={<>Go to Dashboard <ArrowRight className="h-4 w-4" /></>}
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </SmartLink>
              </div>
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
            description: 'Why alone? Crush your goals with friends. Pick a roadmap, track streaks together.',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Curated Roadmaps',
              'Social Streak Tracking',
              'Study Groups & Leaderboards',
              'Chrome Extension',
              'Live War Rooms',
            ],
          }),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <CuratedRoadmaps />
        <HowWeTrack />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
