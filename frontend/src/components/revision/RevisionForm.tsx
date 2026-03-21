'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { revisionApi } from '@/lib/api';
import { Save, X, Sparkles, Loader2 } from 'lucide-react';
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
  const [intuition, setIntuition] = useState('');
  const [pointsToRemember, setPointsToRemember] = useState<string[]>([]);
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [difficultyRating, setDifficultyRating] = useState('');
  const [aiGenerated, setAiGenerated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existing) {
      setKeyTakeaway(existing.key_takeaway || '');
      setApproach(existing.approach || '');
      setIntuition(existing.intuition || '');
      setPointsToRemember(existing.points_to_remember || []);
      setTimeComplexity(existing.time_complexity || '');
      setSpaceComplexity(existing.space_complexity || '');
      setTagsStr(existing.tags?.join(', ') || '');
      setDifficultyRating(existing.difficulty_rating || '');
      setAiGenerated(existing.ai_generated || false);
    }
  }, [existing]);

  const handleGenerateAI = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await revisionApi.generateAI(problemId);
      const notes = res.data.notes;
      setKeyTakeaway(notes.keyTakeaway);
      setApproach(notes.approach);
      setIntuition(notes.intuition);
      setPointsToRemember(notes.pointsToRemember);
      setTimeComplexity(notes.timeComplexity);
      setSpaceComplexity(notes.spaceComplexity);
      setAiGenerated(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate AI notes';
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await revisionApi.createOrUpdate({
        problemId,
        keyTakeaway,
        approach: approach || undefined,
        intuition: intuition || undefined,
        pointsToRemember: pointsToRemember.length > 0 ? pointsToRemember : undefined,
        timeComplexity: timeComplexity || undefined,
        spaceComplexity: spaceComplexity || undefined,
        tags: tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        difficultyRating: difficultyRating || undefined,
        aiGenerated: aiGenerated || undefined,
      });
      onSaved?.();
    } catch {
      setError('Failed to save revision note');
    } finally {
      setSaving(false);
    }
  };

  const handlePointChange = (index: number, value: string) => {
    const updated = [...pointsToRemember];
    updated[index] = value;
    setPointsToRemember(updated);
  };

  const addPoint = () => {
    if (pointsToRemember.length < 5) {
      setPointsToRemember([...pointsToRemember, '']);
    }
  };

  const removePoint = (index: number) => {
    setPointsToRemember(pointsToRemember.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      {/* AI Generate Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={generating}
          className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {generating ? 'Generating...' : 'Generate with AI'}
        </button>
        <span className="text-[11px] text-zinc-500">
          Auto-fill from your latest accepted submission
        </span>
      </div>

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

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">Intuition</label>
        <textarea
          value={intuition}
          onChange={(e) => setIntuition(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[60px] resize-none"
          placeholder="Why does this approach work for this problem?"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-300">Points to Remember</label>
        <div className="space-y-2">
          {pointsToRemember.map((point, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={point}
                onChange={(e) => handlePointChange(i, e.target.value)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={`Point ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removePoint(i)}
                className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {pointsToRemember.length < 5 && (
            <button
              type="button"
              onClick={addPoint}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              + Add point
            </button>
          )}
        </div>
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
