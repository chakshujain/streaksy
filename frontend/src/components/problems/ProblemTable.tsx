'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Circle, MinusCircle } from 'lucide-react';
import type { Problem, ProblemProgress } from '@/lib/types';

interface ProblemTableProps {
  problems: Problem[];
  progressMap: Map<string, ProblemProgress>;
}

function StatusIcon({ status }: { status?: string }) {
  switch (status) {
    case 'solved':
      return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    case 'attempted':
      return <MinusCircle className="h-4 w-4 text-amber-400" />;
    default:
      return <Circle className="h-4 w-4 text-zinc-700" />;
  }
}

export function ProblemTable({ problems, progressMap }: ProblemTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900/80">
            <th className="w-12 px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500">
              Difficulty
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-zinc-500 md:table-cell">
              Tags
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {problems.map((problem) => {
            const progress = progressMap.get(problem.id);
            return (
              <tr
                key={problem.id}
                className="transition-colors hover:bg-zinc-800/30"
              >
                <td className="px-4 py-3">
                  <StatusIcon status={progress?.status} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/problems/${problem.slug}`}
                    className="text-sm font-medium text-zinc-200 hover:text-emerald-400 transition-colors"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {problem.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag.id}>{tag.name}</Badge>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
