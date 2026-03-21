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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await discussionsApi.createComment(problemSlug, { content, parentId });
      setContent('');
      onPosted?.();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error || e.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <div className="flex gap-2">
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
      </div>
    </form>
  );
}
