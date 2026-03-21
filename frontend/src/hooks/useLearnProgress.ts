'use client';

import { useState, useEffect, useCallback } from 'react';
import { topics } from '@/lib/learn-data';

const STORAGE_KEY = 'streaksy_learn_progress';

interface LessonProgress {
  completedAt: string;
  timeSpent?: number;
}

type ProgressData = Record<string, Record<string, LessonProgress>>;

function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useLearnProgress() {
  const [progress, setProgress] = useState<ProgressData>({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const markComplete = useCallback((topicSlug: string, lessonSlug: string, timeSpent?: number) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (!next[topicSlug]) next[topicSlug] = {};
      next[topicSlug] = {
        ...next[topicSlug],
        [lessonSlug]: {
          completedAt: new Date().toISOString(),
          ...(timeSpent !== undefined ? { timeSpent } : {}),
        },
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const unmarkComplete = useCallback((topicSlug: string, lessonSlug: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      if (next[topicSlug]) {
        const { [lessonSlug]: _removed, ...rest } = next[topicSlug];
        next[topicSlug] = rest;
        if (Object.keys(next[topicSlug]).length === 0) {
          delete next[topicSlug];
        }
      }
      saveProgress(next);
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (topicSlug: string, lessonSlug: string): boolean => {
      return !!progress[topicSlug]?.[lessonSlug];
    },
    [progress]
  );

  const getCompletionDate = useCallback(
    (topicSlug: string, lessonSlug: string): string | null => {
      return progress[topicSlug]?.[lessonSlug]?.completedAt ?? null;
    },
    [progress]
  );

  const getTopicProgress = useCallback(
    (topicSlug: string): { completed: number; total: number } => {
      const topic = topics.find((t) => t.slug === topicSlug);
      if (!topic) return { completed: 0, total: 0 };
      const availableLessons = topic.lessons.filter((l) => l.steps.length > 0);
      const completed = availableLessons.filter(
        (l) => !!progress[topicSlug]?.[l.slug]
      ).length;
      return { completed, total: availableLessons.length };
    },
    [progress]
  );

  const getAllProgress = useCallback((): {
    totalCompleted: number;
    totalLessons: number;
    topicsInProgress: { topicSlug: string; topicName: string; nextLesson: { slug: string; title: string } | null }[];
  } => {
    let totalCompleted = 0;
    let totalLessons = 0;
    const topicsInProgress: {
      topicSlug: string;
      topicName: string;
      nextLesson: { slug: string; title: string } | null;
    }[] = [];

    for (const topic of topics) {
      if (topic.slug === 'dsa-patterns') continue;
      const available = topic.lessons.filter((l) => l.steps.length > 0);
      totalLessons += available.length;
      const completedCount = available.filter(
        (l) => !!progress[topic.slug]?.[l.slug]
      ).length;
      totalCompleted += completedCount;

      if (completedCount > 0 && completedCount < available.length) {
        const nextLesson = available.find(
          (l) => !progress[topic.slug]?.[l.slug]
        );
        topicsInProgress.push({
          topicSlug: topic.slug,
          topicName: topic.name,
          nextLesson: nextLesson
            ? { slug: nextLesson.slug, title: nextLesson.title }
            : null,
        });
      }
    }

    return { totalCompleted, totalLessons, topicsInProgress };
  }, [progress]);

  return {
    progress,
    markComplete,
    unmarkComplete,
    isComplete,
    getCompletionDate,
    getTopicProgress,
    getAllProgress,
  };
}
