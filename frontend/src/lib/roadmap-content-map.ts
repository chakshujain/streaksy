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

// ── Crack the Job Together (90 days) ─────────────────────────────────────────
// Combines DSA Patterns + System Design + Databases + OOP + Multithreading + Design Patterns
// Interleaves topics across 90 days for variety

function buildCrackTheJob(): ContentItem[] {
  const topicContent: { topic: string; items: ContentItem[] }[] = [
    { topic: 'DSA Patterns', items: buildDsaPatterns30().filter(i => i.slug !== 'review') },
    { topic: 'System Design', items: lessonsFromTopic('system-design') },
    { topic: 'Databases', items: lessonsFromTopic('databases') },
    { topic: 'OOP', items: lessonsFromTopic('oops') },
    { topic: 'Multithreading', items: lessonsFromTopic('multithreading') },
    { topic: 'Design Patterns', items: lessonsFromTopic('design-patterns') },
  ];

  // Round-robin interleave: cycle through topics, picking one item from each
  const result: ContentItem[] = [];
  const indices = topicContent.map(() => 0);
  let round = 0;

  while (result.length < 90) {
    let added = false;
    for (let t = 0; t < topicContent.length; t++) {
      if (result.length >= 90) break;
      if (indices[t] < topicContent[t].items.length) {
        result.push(topicContent[t].items[indices[t]]);
        indices[t]++;
        added = true;
      }
    }
    // Every 6 items (1 round), add a review day if we haven't filled 90 yet
    round++;
    if (round % 3 === 0 && result.length < 90 && added) {
      result.push({
        type: 'lesson',
        slug: `review-${round}`,
        title: `Review & Mock Interview (Week ${Math.ceil(result.length / 7)})`,
        link: '/revision',
      });
    }
    // Safety: if no items were added, fill remaining with review days
    if (!added) {
      while (result.length < 90) {
        result.push({
          type: 'lesson',
          slug: `review-fill-${result.length}`,
          title: `Day ${result.length + 1}: Review & Practice`,
          link: '/revision',
        });
      }
    }
  }

  return result.slice(0, 90);
}

// ── 100 Days of Code ─────────────────────────────────────────────────────────
// Combines all available content across all topics

function build100DaysOfCode(): ContentItem[] {
  const allContent = [
    ...buildDsaPatterns30().filter(i => i.slug !== 'review'),
    ...lessonsFromTopic('system-design'),
    ...lessonsFromTopic('databases'),
    ...lessonsFromTopic('oops'),
    ...lessonsFromTopic('multithreading'),
    ...lessonsFromTopic('frontend-dev'),
    ...lessonsFromTopic('backend-dev'),
    ...lessonsFromTopic('git-github'),
    ...lessonsFromTopic('design-patterns'),
  ];

  const result: ContentItem[] = [];
  for (let i = 0; i < 100; i++) {
    if (i < allContent.length) {
      result.push(allContent[i]);
    } else {
      result.push({
        type: 'lesson',
        slug: `practice-${i + 1}`,
        title: `Day ${i + 1}: Free Practice & Review`,
        link: '/problems',
      });
    }
  }
  return result;
}

// ── Template Content Map ─────────────────────────────────────────────────────

export const templateContentMap: Record<string, ContentItem[]> = {
  'crack-the-job-together': buildCrackTheJob(),
  'learn-databases': lessonsFromTopic('databases'),
  'learn-system-design': lessonsFromTopic('system-design'),
  'learn-oops': lessonsFromTopic('oops'),
  'learn-multithreading': lessonsFromTopic('multithreading'),
  'learn-frontend': lessonsFromTopic('frontend-dev'),
  'learn-backend': lessonsFromTopic('backend-dev'),
  'master-git': lessonsFromTopic('git-github'),
  'learn-design-patterns': lessonsFromTopic('design-patterns'),
  'dsa-patterns-30': buildDsaPatterns30(),
  '100-days-of-code': build100DaysOfCode(),
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
