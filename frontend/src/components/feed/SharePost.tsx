'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { feedApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/lib/store';

interface Props {
  onPost?: () => void;
}

export function SharePost({ onPost }: Props) {
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const user = useAuthStore(s => s.user);

  const handlePost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await feedApi.createPost(content.trim());
      setContent('');
      setPosted(true);
      setTimeout(() => setPosted(false), 2000);
      onPost?.();
    } catch {
      // handled by interceptor
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  const initials = user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 text-xs font-bold text-emerald-300">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what you're working on..."
            maxLength={500}
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-800/50 bg-transparent px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className={cn(
              'text-[10px] transition-colors',
              content.length > 450 ? 'text-amber-400' : 'text-zinc-600'
            )}>
              {content.length}/500
            </span>
            <div className="flex items-center gap-2">
              {posted && (
                <span className="text-xs text-emerald-400 animate-fade-in">Posted!</span>
              )}
              <button
                disabled={!content.trim() || posting}
                onClick={handlePost}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  content.trim()
                    ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                    : 'text-zinc-600 cursor-not-allowed'
                )}
              >
                {posting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
