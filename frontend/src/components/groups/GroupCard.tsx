'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Users, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Group } from '@/lib/types';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/groups/${group.id}`}>
      <Card className="transition-colors hover:border-zinc-700 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">{group.name}</h3>
              {group.description && (
                <p className="mt-0.5 text-xs text-zinc-500 line-clamp-1">
                  {group.description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Copy invite code"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {group.invite_code}
          </button>
        </div>
      </Card>
    </Link>
  );
}
