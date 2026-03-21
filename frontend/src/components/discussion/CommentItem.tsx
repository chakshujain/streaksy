'use client';

import { useState } from 'react';
import { CommentForm } from './CommentForm';
import { discussionsApi } from '@/lib/api';
import { useAsync } from '@/hooks/useAsync';
import { MessageSquare, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

interface CommentItemProps {
  comment: Comment;
  problemSlug: string;
  onUpdated?: () => void;
  depth?: number;
}

export function CommentItem({ comment, problemSlug, onUpdated, depth = 0 }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuthStore();

  const { data: replies, refetch: refetchReplies } = useAsync<Comment[]>(
    () => showReplies ? discussionsApi.getReplies(comment.id).then((r) => r.data.replies) : Promise.resolve([]),
    [showReplies, comment.id]
  );

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await discussionsApi.deleteComment(comment.id);
      onUpdated?.();
    } catch {
      // Silently handle - comment may already be deleted
    }
  };

  const initials = comment.display_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <div className={depth > 0 ? 'ml-8 border-l border-zinc-800 pl-4' : ''}>
      <div className="flex gap-3 py-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-400">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/user/${comment.user_id}`} className="text-sm font-medium text-zinc-200 hover:text-emerald-400 transition-colors">{comment.display_name}</Link>
            <span className="text-[11px] text-zinc-600">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-zinc-300 whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-3 mt-2">
            {depth === 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300"
              >
                <MessageSquare className="h-3 w-3" />
                Replies
              </button>
            )}
            {depth === 0 && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-[11px] text-zinc-500 hover:text-zinc-300"
              >
                Reply
              </button>
            )}
            {user?.id === comment.user_id && (
              <button
                onClick={handleDelete}
                className="text-[11px] text-zinc-600 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-11 mb-2">
          <CommentForm
            problemSlug={problemSlug}
            parentId={comment.id}
            onPosted={() => { setShowReplyForm(false); setShowReplies(true); refetchReplies(); }}
            placeholder="Write a reply..."
          />
        </div>
      )}

      {showReplies && replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          problemSlug={problemSlug}
          onUpdated={refetchReplies}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
