'use client';

import { useState, useEffect } from 'react';
import { Flame, BookOpen, Chrome, Users, Trophy, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const steps = [
  {
    icon: Flame,
    color: 'from-orange-500/20 to-amber-500/20',
    iconColor: 'text-orange-400',
    title: 'Welcome to Streaksy!',
    description: "You've joined a community of developers serious about DSA. Let's show you around in 30 seconds.",
  },
  {
    icon: BookOpen,
    color: 'from-emerald-500/20 to-cyan-500/20',
    iconColor: 'text-emerald-400',
    title: 'Solve Problems',
    description: 'Browse curated sheets like Blind 75, NeetCode 150, and Striver SDE. Filter by difficulty, track your progress, and watch video solutions.',
  },
  {
    icon: Chrome,
    color: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400',
    title: 'Install the Extension',
    description: 'Our Chrome extension auto-captures your LeetCode submissions — code, runtime, memory, and time spent. No manual tracking needed.',
    action: { label: 'Download Extension', href: '/streaksy-extension.tar.gz' },
  },
  {
    icon: Users,
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    title: 'Join Study Groups',
    description: 'Compete on leaderboards, poke inactive friends, assign problem sheets, and solve together in live rooms with video chat.',
  },
  {
    icon: Trophy,
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: 'text-amber-400',
    title: "You're All Set!",
    description: 'Build streaks, earn badges, review with flashcards, and crush your interviews. Your DSA journey starts now!',
  },
];

export function WelcomeModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem('streaksy_onboarding_done');
      if (!done) setShow(true);
    }
  }, []);

  const complete = () => {
    localStorage.setItem('streaksy_onboarding_done', 'true');
    setShow(false);
  };

  if (!show) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden animate-scale-in">
        {/* Close */}
        <button onClick={complete} className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-400 transition-colors z-10">
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${current.color}`}>
            <Icon className={`h-10 w-10 ${current.iconColor}`} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-zinc-100 mb-3">{current.title}</h2>

          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">{current.description}</p>

          {/* Action link (e.g., download extension) */}
          {current.action && (
            <a
              href={current.action.href}
              download
              className="inline-flex items-center gap-1.5 mt-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              {current.action.label}
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-zinc-800 bg-zinc-950/50">
          {/* Step dots */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-emerald-500' : i < step ? 'w-1.5 bg-emerald-500/50' : 'w-1.5 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                Back
              </button>
            )}
            {!isLast && (
              <button onClick={complete} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                Skip
              </button>
            )}
            <Button
              size="sm"
              onClick={() => isLast ? complete() : setStep(step + 1)}
              className="flex items-center gap-1.5"
            >
              {isLast ? "Let's Go!" : 'Next'}
              {!isLast && <ArrowRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
