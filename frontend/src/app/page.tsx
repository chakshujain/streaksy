'use client';

import { cn } from '@/lib/cn';
import Link from 'next/link';
import {
  Flame,
  Users,
  Zap,
  BarChart3,
  Trophy,
  CheckCircle,
  ArrowRight,
  Code2,
  Target,
  TrendingUp,
  Sparkles,
  GitBranch,
  BookOpen,
  Star,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 transition-transform group-hover:scale-105">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Streaksy
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Features
          </a>
          <a href="#stats" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Community
          </a>
          <a href="#cta" className="text-sm text-zinc-400 transition-colors hover:text-white">
            Get Started
          </a>
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-16">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial gradient orbs */}
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-cyan-500/8 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-500/8 blur-[100px]" />
        {/* Grid pattern */}
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
          DSA Prep, Reimagined
        </div>

        {/* Headline */}
        <h1
          className="animate-slide-up text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          Crack the code.{' '}
          <span className="gradient-text">Together.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl md:mt-8 md:text-2xl"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        >
          Track your LeetCode progress, compete in study groups, maintain
          streaks, and level up your interview prep — all in one place.
        </p>

        {/* CTA buttons */}
        <div
          className="animate-slide-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-12"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <Link
            href="/auth/signup"
            className="glow-md inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 bg-[length:200%_100%] px-8 py-4 text-base font-semibold text-white transition-all duration-500 hover:bg-right hover:shadow-emerald-500/25"
          >
            Start for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:text-white"
          >
            See Features
          </Link>
        </div>

        {/* Floating code snippets for visual interest */}
        <div className="pointer-events-none mt-16 hidden md:block">
          <div className="relative mx-auto h-64 max-w-3xl">
            {/* Floating card left */}
            <div
              className="animate-float glass absolute left-0 top-4 rounded-xl p-4 text-left"
              style={{ animationDelay: '0s' }}
            >
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span className="font-mono">Two Sum</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">Solved in 4 min</p>
            </div>
            {/* Floating card center */}
            <div
              className="animate-float glass absolute left-1/2 top-0 -translate-x-1/2 rounded-xl p-4 text-left"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Neetcode Gang</p>
                  <p className="text-xs text-zinc-500">3 members online</p>
                </div>
              </div>
            </div>
            {/* Floating card right */}
            <div
              className="animate-float glass absolute right-0 top-8 rounded-xl p-4 text-left"
              style={{ animationDelay: '1s' }}
            >
              <div className="flex items-center gap-2 text-sm text-orange-400">
                <Flame className="h-4 w-4" />
                <span className="font-semibold">42-day streak!</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">Keep it going</p>
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
    icon: Zap,
    title: 'LeetCode Sync',
    description:
      'Automatically sync your LeetCode submissions. See your solved problems, topics, and difficulty breakdown in real time.',
    color: 'text-yellow-400',
    glow: 'group-hover:shadow-yellow-500/10',
  },
  {
    icon: Users,
    title: 'Study Groups',
    description:
      'Create or join study groups. Assign problem sheets, track member progress, and compete on leaderboards.',
    color: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/10',
  },
  {
    icon: Flame,
    title: 'Streaks & Habits',
    description:
      'Build consistency with daily streak tracking and a beautiful contribution heatmap that shows your grind.',
    color: 'text-orange-400',
    glow: 'group-hover:shadow-orange-500/10',
  },
  {
    icon: BarChart3,
    title: 'Deep Insights',
    description:
      'Visualize your strengths and weaknesses across topics, difficulty levels, and time. Know exactly where to focus.',
    color: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  {
    icon: BookOpen,
    title: 'Problem Sheets',
    description:
      'Follow curated problem lists like Neetcode 150, Blind 75, or create your own custom sheets for targeted practice.',
    color: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/10',
  },
  {
    icon: Trophy,
    title: 'Leaderboards',
    description:
      'Compete with friends and group members. Rankings update live as you solve problems and climb the ladder.',
    color: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/10',
  },
];

function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Everything you need
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your complete{' '}
            <span className="gradient-text">DSA toolkit</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Everything a serious DSA grinder needs, beautifully designed and
            thoughtfully integrated.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                'group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all duration-300',
                'hover:border-zinc-700 hover:bg-zinc-900/80',
                feature.glow,
                'hover:shadow-lg'
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Icon */}
              <div
                className={cn(
                  'mb-4 inline-flex rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition-colors group-hover:border-zinc-700',
                )}
              >
                <feature.icon className={cn('h-6 w-6', feature.color)} />
              </div>

              <h3 className="text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats / Social Proof Section                                       */
/* ------------------------------------------------------------------ */
const stats = [
  { value: '10K+', label: 'Problems Tracked', icon: Target },
  { value: '2.5K+', label: 'Active Users', icon: Users },
  { value: '500+', label: 'Study Groups', icon: GitBranch },
  { value: '1M+', label: 'Submissions Synced', icon: TrendingUp },
];

function Stats() {
  return (
    <section id="stats" className="relative px-6 py-32">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Trusted by grinders
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Join a growing{' '}
            <span className="gradient-text">community</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Thousands of developers are already leveling up their DSA game with
            Streaksy.
          </p>
        </div>

        {/* Stats grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass group rounded-2xl p-8 text-center transition-all duration-300 hover:glow-sm"
            >
              <stat.icon className="mx-auto mb-4 h-8 w-8 text-emerald-400 transition-transform group-hover:scale-110" />
              <p className="gradient-text text-4xl font-extrabold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial-style blurbs */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                'Streaksy turned my solo grind into a team sport. The group leaderboard keeps me motivated every day.',
              name: 'Alex K.',
              role: 'SWE @ Google',
              stars: 5,
            },
            {
              quote:
                'The LeetCode sync is seamless. I just solve problems and Streaksy tracks everything automatically.',
              name: 'Priya M.',
              role: 'CS Student, Stanford',
              stars: 5,
            },
            {
              quote:
                'My 90-day streak was the push I needed to finally crack my FAANG interviews. Streaksy made it fun.',
              name: 'James L.',
              role: 'SDE II @ Amazon',
              stars: 5,
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Create your account',
      description: 'Sign up in seconds. No credit card required.',
      icon: Sparkles,
    },
    {
      step: '02',
      title: 'Connect LeetCode',
      description: 'Link your LeetCode profile and we auto-sync your progress.',
      icon: Zap,
    },
    {
      step: '03',
      title: 'Join a study group',
      description: 'Find or create a group. Assign sheets and start grinding.',
      icon: Users,
    },
    {
      step: '04',
      title: 'Level up',
      description: 'Track streaks, climb leaderboards, and ace your interviews.',
      icon: TrendingUp,
    },
  ];

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Simple setup
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Up and running in{' '}
            <span className="gradient-text">minutes</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-zinc-700 to-transparent lg:block" />
              )}
              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                <s.icon className="h-7 w-7 text-emerald-400" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                  {s.step.replace('0', '')}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{s.description}</p>
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
        {/* Animated border */}
        <div className="animated-border rounded-3xl">
          <div className="relative rounded-3xl bg-zinc-950 px-8 py-20 text-center sm:px-16">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[80px]" />
            </div>

            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500">
                <Code2 className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Ready to{' '}
                <span className="gradient-text">level up?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                Join thousands of developers who are crushing their DSA prep with
                Streaksy. Free to start, no credit card required.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/auth/signup"
                  className="glow-lg inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 bg-[length:200%_100%] px-8 py-4 text-base font-semibold text-white transition-all duration-500 hover:bg-right"
                >
                  Get Started — It&apos;s Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
            <Code2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-400">Streaksy</span>
        </div>
        <p className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Streaksy. Built for grinders, by
          grinders.
        </p>
        <div className="flex gap-6">
          <Link href="/auth/login" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Log in
          </Link>
          <Link href="/auth/signup" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Sign up
          </Link>
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
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Stats />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
