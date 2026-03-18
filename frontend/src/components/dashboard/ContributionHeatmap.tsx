'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import type { ProblemProgress } from '@/lib/types';

interface ContributionHeatmapProps {
  progress: ProblemProgress[];
}

const WEEKS = 26; // ~6 months
const DAYS_PER_WEEK = 7;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getIntensity(count: number): string {
  if (count === 0) return 'bg-zinc-800/60';
  if (count === 1) return 'bg-emerald-900/60';
  if (count <= 3) return 'bg-emerald-700/70';
  if (count <= 5) return 'bg-emerald-500/80';
  return 'bg-emerald-400';
}

export function ContributionHeatmap({ progress }: ContributionHeatmapProps) {
  const { grid, months } = useMemo(() => {
    // Build a map of date → solve count
    const dateCounts = new Map<string, number>();
    for (const p of progress) {
      if (p.solved_at) {
        const date = p.solved_at.split('T')[0];
        dateCounts.set(date, (dateCounts.get(date) || 0) + 1);
      }
    }

    // Build grid: WEEKS columns × 7 rows
    const today = new Date();
    const grid: { date: string; count: number }[][] = [];
    const monthSet: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let w = WEEKS - 1; w >= 0; w--) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < DAYS_PER_WEEK; d++) {
        const dayOffset = w * 7 + (6 - d) - today.getDay();
        const date = new Date(today);
        date.setDate(today.getDate() - dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        week.push({ date: dateStr, count: dateCounts.get(dateStr) || 0 });

        if (d === 0 && date.getMonth() !== lastMonth) {
          lastMonth = date.getMonth();
          monthSet.push({ label: MONTH_LABELS[lastMonth], col: WEEKS - 1 - w });
        }
      }
      grid.push(week);
    }

    return { grid, months: monthSet };
  }, [progress]);

  return (
    <Card variant="glass">
      <h3 className="mb-4 text-sm font-medium text-zinc-400">Activity</h3>

      {/* Month labels */}
      <div className="mb-1 flex pl-8">
        {months.map((m, i) => (
          <span
            key={i}
            className="text-xs text-zinc-500"
            style={{ marginLeft: i === 0 ? m.col * 16 : 0, width: 48 }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-0">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] pr-2">
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="h-[13px] text-[10px] leading-[13px] text-zinc-500">
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={cn('h-[13px] w-[13px] rounded-sm', getIntensity(day.count))}
                  title={`${day.date}: ${day.count} problem${day.count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-zinc-500">
        <span>Less</span>
        {[0, 1, 3, 5, 7].map((n) => (
          <div key={n} className={cn('h-[11px] w-[11px] rounded-sm', getIntensity(n))} />
        ))}
        <span>More</span>
      </div>
    </Card>
  );
}
