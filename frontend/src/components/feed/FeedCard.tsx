'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { feedApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/cn';
import {
  ThumbsUp, MessageCircle, ChevronDown, ChevronUp, Send, Trash2,
  Flame, Trophy, Code2, Zap, Target, BookOpen, Map, UserPlus,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { FeedEvent, FeedComment } from '@/lib/types';
import Link from 'next/link';

interface FeedCardProps {
  event: FeedEvent;
}

const eventIcons: Record<string, { icon: typeof Code2; color: string }> = {
  solve: { icon: Code2, color: 'text-emerald-400' },
  streak_milestone: { icon: Flame, color: 'text-orange-400' },
  badge_earned: { icon: Trophy, color: 'text-amber-400' },
  challenge_complete: { icon: Target, color: 'text-cyan-400' },
  lesson_complete: { icon: BookOpen, color: 'text-blue-400' },
  roadmap_complete: { icon: Map, color: 'text-purple-400' },
  daily_complete: { icon: Zap, color: 'text-orange-400' },
  friend_joined: { icon: UserPlus, color: 'text-cyan-400' },
};

export function FeedCard({ event }: FeedCardProps) {
  const { user } = useAuthStore();
  const [liked, setLiked] = useState(event.liked_by_me);
  const [likeCount, setLikeCount] = useState(event.like_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentCount, setCommentCount] = useState(event.comment_count);
  const [loadingComments, setLoadingComments] = useState(false);
  const [posting, setPosting] = useState(false);

  const iconInfo = eventIcons[event.event_type] || { icon: Zap, color: 'text-zinc-400' };
  const IconComponent = iconInfo.icon;
  const metadata = event.metadata || {};

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      await feedApi.toggleLike(event.id);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const { data } = await feedApi.getComments(event.id);
        setComments(data.comments);
      } catch { /* ignore */ }
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setPosting(true);
    try {
      const { data } = await feedApi.addComment(event.id, commentInput.trim());
      setComments([...comments, { ...data.comment, display_name: user?.displayName || 'You' }]);
      setCommentInput('');
      setCommentCount(commentCount + 1);
      if (!showComments) setShowComments(true);
    } catch { /* ignore */ }
    setPosting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await feedApi.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      setCommentCount(Math.max(0, commentCount - 1));
    } catch { /* ignore */ }
  };

  const initials = (event.display_name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Card className="hover:border-zinc-700/50 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3">
        {event.avatar_url ? (
          <img src={event.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link href={`/user/${event.user_id}`} className="text-sm font-semibold text-zinc-200 hover:text-emerald-400 transition-colors">{event.display_name}</Link>
            <span className="text-[11px] text-zinc-600">{formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <IconComponent className={cn('h-4 w-4', iconInfo.color)} />
            <span className="text-sm text-zinc-300">{event.title}</span>
          </div>
          {event.description && (
            <p className="text-xs text-zinc-500 mt-1">{event.description}</p>
          )}
          {/* Problem link */}
          {'problemSlug' in metadata && (
            <Link
              href={`/problems/${String(metadata.problemSlug)}`}
              className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Code2 className="h-3 w-3" />
              {String(metadata.problemTitle || metadata.problemSlug)}
              {'difficulty' in metadata && (
                <Badge variant={String(metadata.difficulty) as 'easy' | 'medium' | 'hard'} className="ml-1 text-[9px]">
                  {String(metadata.difficulty)}
                </Badge>
              )}
            </Link>
          )}
          {/* Streak badge */}
          {'streakDays' in metadata && (
            <div className="inline-flex items-center gap-1.5 mt-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1">
              <Flame className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-semibold text-orange-300">{String(metadata.streakDays)}-day streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-800/50">
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium transition-all duration-200',
            liked ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
          )}
        >
          <ThumbsUp className={cn('h-4 w-4 transition-transform', liked && 'scale-110 fill-emerald-400')} />
          {likeCount > 0 && <span>{likeCount}</span>}
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          {commentCount > 0 && <span>{commentCount}</span>}
          <span>Comment</span>
          {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 space-y-3 animate-fade-in">
          {loadingComments ? (
            <div className="space-y-2">
              <div className="h-8 skeleton-shimmer rounded-lg" />
              <div className="h-8 skeleton-shimmer rounded-lg" />
            </div>
          ) : (
            <>
              {comments.map(c => (
                <div key={c.id} className="flex items-start gap-2 pl-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-[8px] font-bold text-zinc-400 flex-shrink-0 mt-0.5">
                    {(c.display_name || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-zinc-300">{c.display_name}</span>
                      <span className="text-[10px] text-zinc-600">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                      {user?.id === c.user_id && (
                        <button onClick={() => handleDeleteComment(c.id)} className="text-zinc-700 hover:text-red-400 transition-colors">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">{c.content}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Comment input */}
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              maxLength={500}
            />
            <Button type="submit" size="sm" loading={posting} disabled={!commentInput.trim()}>
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}
