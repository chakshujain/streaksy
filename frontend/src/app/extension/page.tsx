'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/ui/PageTransition';
import { cn } from '@/lib/cn';
import { Puzzle, Download, Zap, Shield, Clock, Code2, CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Auto-Sync Submissions',
    description: 'Automatically captures your LeetCode submissions the moment you solve a problem. No copy-pasting needed.',
    gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/10',
    iconColor: 'text-amber-400',
  },
  {
    icon: Code2,
    title: 'Full Code Capture',
    description: 'Records your submitted code, language, runtime, and memory usage for every accepted solution.',
    gradient: 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Tracks how long you spend on each problem so you can monitor improvement over time.',
    gradient: 'from-blue-500/20 to-indigo-500/10 border-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Only syncs with your Streaksy account. No data is shared with third parties. Open source and auditable.',
    gradient: 'from-violet-500/20 to-purple-500/10 border-violet-500/10',
    iconColor: 'text-violet-400',
  },
];

const steps = [
  { step: 1, title: 'Download', description: 'Download the extension file below' },
  { step: 2, title: 'Unpack', description: 'Extract the .tar.gz file to a folder' },
  { step: 3, title: 'Load in Chrome', description: 'Go to chrome://extensions, enable Developer Mode, click "Load unpacked" and select the folder' },
  { step: 4, title: 'Sign In', description: 'Click the extension icon and sign in with your Streaksy account' },
];

export default function ExtensionPage() {
  return (
    <AppShell>
      <PageTransition>
        <div className="max-w-3xl space-y-8">
          {/* Header */}
          <div className="flex items-start gap-4 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/10 glow-sm">
              <Puzzle className="h-7 w-7 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Chrome Extension</h1>
              <p className="mt-1 text-sm text-zinc-500 max-w-lg">
                Auto-capture your LeetCode submissions — code, runtime, memory, and time spent. Solve on LeetCode, we record it.
              </p>
            </div>
          </div>

          {/* Download Card */}
          <div className="animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
            <Card className="border-violet-500/15 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent">
              <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 border border-violet-500/10 shrink-0">
                  <svg className="h-8 w-8 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                  </svg>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-zinc-100">Streaksy for Chrome</h2>
                  <p className="text-sm text-zinc-500 mt-0.5">Manifest V3 &middot; Works with Chrome, Edge, Brave, and Arc</p>
                </div>
                <a href="/streaksy-extension.tar.gz" download>
                  <Button variant="gradient" size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Extension
                  </Button>
                </a>
              </div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature) => (
                <Card key={feature.title} variant="glass" className="group hover:scale-[1.01] transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br border shrink-0 transition-transform duration-300 group-hover:scale-110',
                      feature.gradient
                    )}>
                      <feature.icon className={cn('h-4 w-4', feature.iconColor)} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-200">{feature.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Installation Steps */}
          <div className="animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Installation</h2>
            <Card variant="glass">
              <div className="space-y-4">
                {steps.map((s, idx) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 border border-violet-500/20 text-sm font-bold text-violet-400 shrink-0">
                      {s.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-sm font-semibold text-zinc-200">{s.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">{s.description}</p>
                    </div>
                    {idx < steps.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-700 mt-2 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* What gets synced */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
            <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">What Gets Synced</h2>
            <Card variant="glass">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Submitted code', 'Language used', 'Runtime (ms)', 'Memory usage', 'Time spent', 'Problem metadata'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-xs text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
