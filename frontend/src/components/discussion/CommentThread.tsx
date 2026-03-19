'use client';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { useAsync } from '@/hooks/useAsync';
import { discussionsApi } from '@/lib/api';
import { MessageSquare } from 'lucide-react';
import type { Comment } from '@/lib/types';

interface CommentThreadProps {
  problemSlug: string;
}

export function CommentThread({ problemSlug }: CommentThreadProps) {
  const { data: comments, loading, refetch } = useAsync<Comment[]>(
    () => discussionsApi.getComments(problemSlug).then((r) => r.data.comments),
    [problemSlug]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-zinc-400" />
        <h2 className="text-lg font-semibold text-zinc-200">Discussion</h2>
        {comments && <span className="text-xs text-zinc-500">({comments.length})</span>}
      </div>

      <CommentForm problemSlug={problemSlug} onPosted={refetch} />

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="divide-y divide-zinc-800/50">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} problemSlug={problemSlug} onUpdated={refetch} />
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-zinc-500 text-center py-4">No comments yet. Start the discussion!</p>
        </Card>
      )}
    </div>
  );
}
