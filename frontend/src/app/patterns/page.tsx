'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { patterns, patternCategories } from '@/lib/patterns-data';
import { cn } from '@/lib/cn';
import { ArrowLeft, ArrowRight, Cpu } from 'lucide-react';

export default function PatternsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? patterns.filter((p) => p.category === activeCategory)
    : patterns;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Back link */}
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Learning Hub
        </Link>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <Cpu className="h-7 w-7 text-emerald-400" />
            <h1 className="text-2xl font-bold text-zinc-100">DSA Patterns</h1>
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            Master the {patterns.length} essential problem-solving patterns with interactive step-by-step simulations.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              !activeCategory
                ? 'bg-zinc-700 text-zinc-100'
                : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
            )}
          >
            All ({patterns.length})
          </button>
          {patternCategories.map((cat) => {
            const count = patterns.filter((p) => p.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  activeCategory === cat.name
                    ? cat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      cat.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      cat.color === 'purple' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      cat.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300'
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Pattern grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pattern) => (
            <Link key={pattern.slug} href={`/patterns/${pattern.slug}`}>
              <Card className="h-full hover:border-zinc-700 transition-all duration-200 group cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{pattern.icon}</span>
                    <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-emerald-400 transition-colors">
                      {pattern.name}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                </div>
                <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{pattern.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                    pattern.color === 'emerald' && 'bg-emerald-500/10 text-emerald-400',
                    pattern.color === 'blue' && 'bg-blue-500/10 text-blue-400',
                    pattern.color === 'purple' && 'bg-purple-500/10 text-purple-400',
                    pattern.color === 'amber' && 'bg-amber-500/10 text-amber-400',
                    pattern.color === 'red' && 'bg-red-500/10 text-red-400',
                  )}>
                    {pattern.category}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                    {pattern.examples[0]?.steps.length || 0} steps
                  </span>
                  <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                    {pattern.practiceProblems?.length || pattern.commonProblems?.length || 0} problems
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
