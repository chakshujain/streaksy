'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { notesApi } from '@/lib/api';
import type { Note } from '@/lib/types';

interface NoteEditorProps {
  problemId: string;
  groupId?: string;
  visibility: 'personal' | 'group';
  existingNote?: Note;
  onSaved: () => void;
}

export function NoteEditor({
  problemId,
  groupId,
  visibility,
  existingNote,
  onSaved,
}: NoteEditorProps) {
  const [content, setContent] = useState(existingNote?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    setError('');
    try {
      if (existingNote) {
        await notesApi.update(existingNote.id, content);
      } else {
        await notesApi.create({ problemId, content, visibility, groupId });
      }
      onSaved();
      if (!existingNote) setContent('');
    } catch {
      setError('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">{error}</div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          visibility === 'personal'
            ? 'Add your personal notes...'
            : 'Share a note with the group...'
        }
        rows={4}
        className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-800/30 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} loading={saving}>
          {existingNote ? 'Update' : 'Save Note'}
        </Button>
      </div>
    </Card>
  );
}
