'use client';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { activityApi } from '@/lib/api';
import { Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityItem } from '@/lib/types';

interface ActivityFeedProps {
  groupId: string;
}

const actionLabels: Record<string, string> = {
  'join': 'joined the group',
  'solve': 'solved a problem',
  'note_share': 'shared a note',
  'contest_create': 'created a contest',
};

export function ActivityFeed({ groupId }: ActivityFeedProps) {
  const { data: activity, loading } = useAsync<ActivityItem[]>(
    () => activityApi.getGroupActivity(groupId).then((r) => r.data.activity),
    [groupId]
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
      </div>
    );
  }

  if (!activity || activity.length === 0) {
    return (
      <Card>
        <p className="text-sm text-zinc-500 text-center py-4">No activity yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-200">Recent Activity</h3>
      </div>
      <div className="space-y-1">
        {activity.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-zinc-800/30 transition-colors">
            <div className="h-2 w-2 rounded-full bg-emerald-500/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300">
                <span className="font-medium text-zinc-200">{item.display_name}</span>
                {' '}
                {actionLabels[item.action] || item.action}
                {'problemTitle' in (item.metadata || {}) && (
                  <span className="text-emerald-400"> {String(item.metadata.problemTitle)}</span>
                )}
              </p>
            </div>
            <span className="text-[10px] text-zinc-600 flex-shrink-0">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
