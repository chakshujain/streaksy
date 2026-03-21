'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useBookmarks, type Bookmark as BookmarkType } from '@/hooks/useBookmarks';
import { Toast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

interface BookmarkButtonProps {
  item: Omit<BookmarkType, 'savedAt'>;
  className?: string;
  size?: 'sm' | 'md';
}

export function BookmarkButton({ item, className, size = 'md' }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [toast, setToast] = useState<string | null>(null);
  const bookmarked = isBookmarked(item.id);

  const handleClick = () => {
    const added = toggleBookmark(item);
    setToast(added ? 'Bookmarked!' : 'Removed');
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <>
      <button
        onClick={handleClick}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        className={cn(
          'flex items-center justify-center rounded-lg transition-all duration-200',
          size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
          bookmarked
            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
            : 'bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300',
          className
        )}
      >
        <Bookmark
          className={cn(iconSize, bookmarked && 'fill-amber-400')}
        />
      </button>
      {toast && (
        <Toast message={toast} type="success" duration={2000} onClose={() => setToast(null)} />
      )}
    </>
  );
}
