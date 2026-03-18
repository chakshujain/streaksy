'use client';

import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GroupLeaderboard } from '@/components/groups/GroupLeaderboard';
import { MemberList } from '@/components/groups/MemberList';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { groupsApi, leaderboardApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Group, LeaderboardEntry } from '@/lib/types';

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const { data: group, loading: groupLoading } = useAsync<Group>(
    () => groupsApi.get(groupId).then((r) => r.data.group),
    [groupId]
  );

  const { data: leaderboard, loading: lbLoading } = useAsync<LeaderboardEntry[]>(
    () => leaderboardApi.getGroup(groupId).then((r) => r.data.leaderboard),
    [groupId]
  );

  const copyCode = () => {
    if (group) {
      navigator.clipboard.writeText(group.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (groupLoading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64" />
        </div>
      </AppShell>
    );
  }

  if (!group) {
    return (
      <AppShell>
        <p className="text-zinc-500">Group not found.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{group.name}</h1>
            {group.description && (
              <p className="mt-1 text-sm text-zinc-500">{group.description}</p>
            )}
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Invite: {group.invite_code}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Leaderboard (2 cols) */}
          <div className="lg:col-span-2">
            {lbLoading ? (
              <Skeleton className="h-80" />
            ) : (
              <GroupLeaderboard
                entries={leaderboard || []}
                currentUserId={user?.id}
              />
            )}
          </div>

          {/* Members (1 col) */}
          <div>
            {group.members ? (
              <MemberList members={group.members} />
            ) : (
              <Skeleton className="h-40" />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
