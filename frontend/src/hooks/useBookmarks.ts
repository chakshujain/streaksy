'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'streaksy_bookmarks';

export interface Bookmark {
  id: string;
  type: 'problem' | 'lesson' | 'pattern' | 'roadmap';
  title: string;
  slug: string;
  topicSlug?: string;
  difficulty?: string;
  savedAt: string;
}

function loadBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: Bookmark[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(loadBookmarks());
  }, []);

  const addBookmark = useCallback((item: Omit<Bookmark, 'savedAt'>) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev;
      const next = [...prev, { ...item, savedAt: new Date().toISOString() }];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string): boolean => {
      return bookmarks.some((b) => b.id === id);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (item: Omit<Bookmark, 'savedAt'>): boolean => {
      if (isBookmarked(item.id)) {
        removeBookmark(item.id);
        return false;
      } else {
        addBookmark(item);
        return true;
      }
    },
    [isBookmarked, removeBookmark, addBookmark]
  );

  const getByType = useCallback(
    (type: Bookmark['type']): Bookmark[] => {
      return bookmarks.filter((b) => b.type === type);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    getByType,
  };
}
