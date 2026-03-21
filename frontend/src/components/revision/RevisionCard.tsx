'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';
import type { RevisionNote } from '@/lib/types';
import { revisionApi } from '@/lib/api';
import { Clock, RotateCcw, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RevisionCardProps {
  note: RevisionNote;
  onClick?: () => void;
  onDelete?: () => void;
}

export function RevisionCard({ note, onClick, onDelete }: RevisionCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleting) return;
    if (!confirm('Delete this revision note?')) return;
    setDeleting(true);
    try {
      await revisionApi.delete(note.id);
      onDelete?.();
    } catch {
      // error handled by interceptor
    } finally {
      setDeleting(false);
    }
  };
  return (
    <Card
      className="cursor-pointer hover:border-emerald-500/30 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-zinc-100 truncate">{note.problem_title}</h3>
            {note.problem_difficulty && (
              <Badge variant={note.problem_difficulty as 'easy' | 'medium' | 'hard'}>
                {note.problem_difficulty}
              </Badge>
            )}
          </div>
          <p className="text-sm text-zinc-400 line-clamp-2">{note.key_takeaway}</p>
        </div>
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="shrink-0 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
            title="Delete note"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
        {note.time_complexity && (
          <span>Time: <span className="text-zinc-300">{note.time_complexity}</span></span>
        )}
        {note.space_complexity && (
          <span>Space: <span className="text-zinc-300">{note.space_complexity}</span></span>
        )}
      </div>

      {note.tags && note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <span key={tag} className="inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-600">
        <span className="flex items-center gap-1">
          <RotateCcw className="h-3 w-3" />
          {note.revision_count} revisions
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {note.last_revised_at
            ? `Revised ${formatDistanceToNow(new Date(note.last_revised_at), { addSuffix: true })}`
            : 'Never revised'}
        </span>
      </div>
    </Card>
  );
}
