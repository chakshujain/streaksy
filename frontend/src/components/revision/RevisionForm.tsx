'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { revisionApi } from '@/lib/api';
import { Save, X } from 'lucide-react';
import type { RevisionNote } from '@/lib/types';

interface RevisionFormProps {
  problemId: string;
  existing?: RevisionNote | null;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function RevisionForm({ problemId, existing, onSaved, onCancel }: RevisionFormProps) {
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [approach, setApproach] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [difficultyRating, setDifficultyRating] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existing) {
      setKeyTakeaway(existing.key_takeaway || '');
      setApproach(existing.approach || '');
      setTimeComplexity(existing.time_complexity || '');
      setSpaceComplexity(existing.space_complexity || '');
      setTagsStr(existing.tags?.join(', ') || '');
      setDifficultyRating(existing.difficulty_rating || '');
    }
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await revisionApi.createOrUpdate({
        problemId,
        keyTakeaway,
        approach: approach || undefined,
        timeComplexity: timeComplexity || undefined,
        spaceComplexity: spaceComplexity || undefined,
        tags: tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        difficultyRating: difficultyRating || undefined,
      });
      onSaved?.();
    } catch {
      setError('Failed to save revision note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">Key Takeaway *</label>
        <textarea
          value={keyTakeaway}
          onChange={(e) => setKeyTakeaway(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px] resize-none"
          placeholder="What's the key insight for this problem?"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">Approach</label>
        <textarea
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px] resize-none"
          placeholder="Describe the approach/algorithm..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="timeComplexity"
          label="Time Complexity"
          value={timeComplexity}
          onChange={(e) => setTimeComplexity(e.target.value)}
          placeholder="O(n log n)"
        />
        <Input
          id="spaceComplexity"
          label="Space Complexity"
          value={spaceComplexity}
          onChange={(e) => setSpaceComplexity(e.target.value)}
          placeholder="O(n)"
        />
      </div>

      <Input
        id="tags"
        label="Tags (comma-separated)"
        value={tagsStr}
        onChange={(e) => setTagsStr(e.target.value)}
        placeholder="sliding-window, two-pointer, dp"
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">Difficulty Rating</label>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setDifficultyRating(difficultyRating === d ? '' : d)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                difficultyRating === d
                  ? d === 'easy' ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                    : d === 'medium' ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                    : 'border-red-500/30 bg-red-500/15 text-red-400'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} className="flex items-center gap-1.5">
            <X className="h-4 w-4" /> Cancel
          </Button>
        )}
        <Button type="submit" loading={saving} className="flex items-center gap-1.5">
          <Save className="h-4 w-4" /> Save Note
        </Button>
      </div>
    </form>
  );
}
