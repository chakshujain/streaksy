'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { discussionsApi } from '@/lib/api';
import { Send } from 'lucide-react';

interface CommentFormProps {
  problemSlug: string;
  parentId?: string;
  onPosted?: () => void;
  placeholder?: string;
}

export function CommentForm({ problemSlug, parentId, onPosted, placeholder }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await discussionsApi.createComment(problemSlug, { content, parentId });
      setContent('');
      onPosted?.();
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder || 'Write a comment...'}
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[40px] max-h-[120px] resize-none"
        rows={1}
      />
      <Button type="submit" loading={loading} size="sm" className="self-end">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
