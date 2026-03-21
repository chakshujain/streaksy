// ─────────────────────────────────────────────────────────────────────────────
// roadmap-content-map.ts — Maps roadmap template daily tasks to actual content
// ─────────────────────────────────────────────────────────────────────────────

import { topics } from '@/lib/learn-data';

export interface ContentItem {
  type: 'lesson' | 'pattern' | 'problem';
  slug: string;
  topicSlug?: string; // for lessons
  title: string;
  link: string; // full URL path like /learn/databases/what-is-a-database
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build a content map from a learn-data topic by mapping lessons 1:1 to days. */
function lessonsFromTopic(topicSlug: string): ContentItem[] {
  const topic = topics.find((t) => t.slug === topicSlug);
  if (!topic) return [];
  return topic.lessons.map((lesson) => ({
    type: 'lesson' as const,
    slug: lesson.slug,
    topicSlug,
    title: lesson.title,
    link: `/learn/${topicSlug}/${lesson.slug}`,
  }));
}

// ── DSA Patterns (19 patterns spread across 30 days) ─────────────────────────

const dsaPatternSlugs: { slug: string; name: string }[] = [
  { slug: 'two-pointers', name: 'Two Pointers' },
  { slug: 'sliding-window', name: 'Sliding Window' },
  { slug: 'fast-slow-pointers', name: 'Fast & Slow Pointers' },
  { slug: 'merge-intervals', name: 'Merge Intervals' },
  { slug: 'binary-search', name: 'Modified Binary Search' },
  { slug: 'prefix-sum', name: 'Prefix Sum' },
  { slug: 'cyclic-sort', name: 'Cyclic Sort' },
  { slug: 'bfs', name: 'BFS (Breadth-First Search)' },
  { slug: 'dfs', name: 'DFS (Depth-First Search)' },
  { slug: 'backtracking', name: 'Subsets / Backtracking' },
  { slug: 'topological-sort', name: 'Topological Sort' },
  { slug: 'dp-knapsack', name: 'DP: 0/1 Knapsack' },
  { slug: 'dp-lis', name: 'DP: Longest Increasing Subsequence' },
  { slug: 'dp-lcs', name: 'DP: Longest Common Subsequence' },
  { slug: 'monotonic-stack', name: 'Monotonic Stack' },
  { slug: 'two-heaps', name: 'Two Heaps' },
  { slug: 'trie', name: 'Trie (Prefix Tree)' },
  { slug: 'union-find', name: 'Union Find (Disjoint Set)' },
  { slug: 'bit-manipulation', name: 'Bit Manipulation' },
];

function buildDsaPatterns30(): ContentItem[] {
  const items: ContentItem[] = [];

  // 19 patterns + review/practice days to fill 30 days
  // Schedule: learn a pattern, then every ~3 patterns add a review day
  const schedule: ('pattern' | 'review')[] = [];
  let patternCount = 0;
  for (let day = 0; day < 30; day++) {
    // Review days at every 4th slot, and once all patterns are assigned
    if (patternCount >= dsaPatternSlugs.length) {
      schedule.push('review');
    } else if (day > 0 && day % 4 === 3) {
      schedule.push('review');
    } else {
      schedule.push('pattern');
      patternCount++;
    }
  }

  let pIdx = 0;
  let reviewCount = 0;
  for (const entry of schedule) {
    if (entry === 'pattern' && pIdx < dsaPatternSlugs.length) {
      const p = dsaPatternSlugs[pIdx];
      items.push({
        type: 'pattern',
        slug: p.slug,
        title: p.name,
        link: `/patterns/${p.slug}`,
      });
      pIdx++;
    } else {
      reviewCount++;
      // Review day — link to the patterns index page
      items.push({
        type: 'pattern',
        slug: 'review',
        title: `Review & Practice (Session ${reviewCount})`,
        link: '/patterns',
      });
    }
  }

  return items;
}

// ── Template Content Map ─────────────────────────────────────────────────────

export const templateContentMap: Record<string, ContentItem[]> = {
  'learn-databases': lessonsFromTopic('databases'),
  'learn-system-design': lessonsFromTopic('system-design'),
  'learn-oops': lessonsFromTopic('oops'),
  'learn-multithreading': lessonsFromTopic('multithreading'),
  'learn-frontend': lessonsFromTopic('frontend-dev'),
  'learn-backend': lessonsFromTopic('backend-dev'),
  'master-git': lessonsFromTopic('git-github'),
  'learn-design-patterns': lessonsFromTopic('design-patterns'),
  'dsa-patterns-30': buildDsaPatterns30(),
};

/** Look up the content item for a given template slug and day number (1-based). */
export function getContentForDay(
  templateSlug: string,
  day: number
): ContentItem | null {
  const items = templateContentMap[templateSlug];
  if (!items || day < 1 || day > items.length) return null;
  return items[day - 1];
}
