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
// Sequential: complete one topic fully, then move to next.
// Includes problem-solving days from sheets (Blind 75 problems).
//
// Schedule:
//   Phase 1 (Days 1-13):  Databases (13 lessons)
//   Phase 2 (Days 14-27): OOP (14 lessons)
//   Phase 3 (Days 28-39): Multithreading (12 lessons)
//   Phase 4 (Days 40-56): System Design (17 lessons)
//   Phase 5 (Days 57-75): DSA Patterns (19 patterns)
//   Phase 6 (Days 76-85): Design Patterns (10 key patterns)
//   Phase 7 (Days 86-90): Mock interviews + final review
//
// After each topic phase, a "Solve Problems" day is inserted using
// Blind 75 / NeetCode problems related to that topic.

function buildCrackTheJob(): ContentItem[] {
  const result: ContentItem[] = [];

  // Define phases — each is a complete topic block
  const phases: { topic: string; items: ContentItem[]; problemDays: number }[] = [
    { topic: 'Databases', items: lessonsFromTopic('databases'), problemDays: 0 },
    { topic: 'OOP', items: lessonsFromTopic('oops'), problemDays: 0 },
    { topic: 'Multithreading', items: lessonsFromTopic('multithreading'), problemDays: 0 },
    { topic: 'System Design', items: lessonsFromTopic('system-design'), problemDays: 0 },
    { topic: 'DSA Patterns', items: buildDsaPatterns30().filter(i => i.slug !== 'review'), problemDays: 0 },
    { topic: 'Design Patterns', items: lessonsFromTopic('design-patterns').slice(0, 10), problemDays: 0 },
  ];

  for (const phase of phases) {
    // Add all lessons for this topic sequentially
    for (const item of phase.items) {
      result.push(item);
    }
    // After completing a topic, add a problem-solving day
    if (result.length < 88) {
      result.push({
        type: 'problem',
        slug: `practice-${phase.topic.toLowerCase().replace(/\s+/g, '-')}`,
        title: `Solve Problems: ${phase.topic}`,
        link: '/problems',
        topicSlug: phase.topic.toLowerCase(),
      });
    }
  }

  // Fill remaining days with mock interview & review
  const mockTitles = [
    'Mock Interview: DSA Round',
    'Mock Interview: System Design Round',
    'Mock Interview: Behavioral Round',
    'Final Review: Weak Topics',
    'Final Review: Full Mock',
  ];
  let mockIdx = 0;
  while (result.length < 90) {
    result.push({
      type: 'problem',
      slug: `mock-${result.length}`,
      title: mockTitles[mockIdx % mockTitles.length],
      link: '/revision',
    });
    mockIdx++;
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
