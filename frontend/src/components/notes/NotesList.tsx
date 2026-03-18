'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { notesApi } from '@/lib/api';
import type { Note } from '@/lib/types';

interface NotesListProps {
  notes: Note[];
  canDelete?: boolean;
  onDeleted: () => void;
}

export function NotesList({ notes, canDelete = false, onDeleted }: NotesListProps) {
  const handleDelete = async (id: string) => {
    await notesApi.delete(id);
    onDeleted();
  };

  if (notes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-zinc-600">No notes yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <Card key={note.id} className="group relative">
          {note.author_name && (
            <p className="mb-1 text-xs font-medium text-emerald-400">
              {note.author_name}
            </p>
          )}
          <p className="whitespace-pre-wrap text-sm text-zinc-300">{note.content}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-zinc-600">
              {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
            </span>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
