// ─────────────────────────────────────────────────────────────────────────────
// interview-planner.ts — Roadmap generation logic for "Prepare for Interview"
// ─────────────────────────────────────────────────────────────────────────────

export type Role =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'mobile'
  | 'data-engineer'
  | 'devops'
  | 'new-grad'
  | 'senior';

export type Level = 'beginner' | 'basics' | 'intermediate' | 'advanced';
export type StudyMode = 'solo' | 'group';
export type FocusTopic =
  | 'dsa'
  | 'databases'
  | 'system-design'
  | 'oop'
  | 'multithreading'
  | 'behavioral';

export interface PrepAnswers {
  role: Role;
  totalDays: number;
  hoursPerDay: number;
  level: Level;
  studyMode: StudyMode;
  focusTopics: FocusTopic[];
}

export interface DayPlan {
  day: number;
  week: number;
  phase: number;
  phaseName: string;
  topic: FocusTopic;
  topicLabel: string;
  topicIcon: string;
  topicColor: string;
  title: string;
  link: string;
  estimatedMinutes: number;
  done: boolean;
}

export interface Roadmap {
  answers: PrepAnswers;
  days: DayPlan[];
  totalDays: number;
  generatedAt: string;
}

// ── Topic metadata ──────────────────────────────────────────────────────────

export const topicMeta: Record<FocusTopic, { label: string; icon: string; color: string }> = {
  dsa: { label: 'DSA Patterns', icon: '🧩', color: 'emerald' },
  databases: { label: 'Databases', icon: '🗄️', color: 'blue' },
  'system-design': { label: 'System Design', icon: '🏗️', color: 'purple' },
  oop: { label: 'OOP', icon: '🧱', color: 'amber' },
  multithreading: { label: 'Multithreading', icon: '⚡', color: 'red' },
  behavioral: { label: 'Behavioral', icon: '🎤', color: 'cyan' },
};

// ── Role-based allocation percentages ───────────────────────────────────────

const roleAllocations: Record<Role, Partial<Record<FocusTopic, number>>> = {
  frontend:       { dsa: 60, 'system-design': 15, oop: 15, databases: 10 },
  backend:        { dsa: 50, 'system-design': 20, databases: 15, multithreading: 15 },
  fullstack:      { dsa: 45, 'system-design': 20, databases: 15, oop: 10, multithreading: 10 },
  mobile:         { dsa: 55, 'system-design': 15, oop: 20, databases: 10 },
  'data-engineer': { dsa: 40, databases: 30, 'system-design': 20, multithreading: 10 },
  devops:         { dsa: 35, 'system-design': 30, databases: 15, multithreading: 20 },
  'new-grad':     { dsa: 65, 'system-design': 15, oop: 10, databases: 10 },
  senior:         { dsa: 30, 'system-design': 35, databases: 15, oop: 10, multithreading: 10 },
};

// ── Content pools (ordered by difficulty) ───────────────────────────────────

const dsaContent: { title: string; slug: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }[] = [
  { title: 'Two Pointers', slug: 'two-pointers', difficulty: 'beginner' },
  { title: 'Sliding Window', slug: 'sliding-window', difficulty: 'beginner' },
  { title: 'Prefix Sum', slug: 'prefix-sum', difficulty: 'beginner' },
  { title: 'Fast & Slow Pointers', slug: 'fast-slow-pointers', difficulty: 'beginner' },
  { title: 'Binary Search', slug: 'binary-search', difficulty: 'intermediate' },
  { title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'intermediate' },
  { title: 'Cyclic Sort', slug: 'cyclic-sort', difficulty: 'intermediate' },
  { title: 'BFS', slug: 'bfs', difficulty: 'intermediate' },
  { title: 'DFS', slug: 'dfs', difficulty: 'intermediate' },
  { title: 'Backtracking', slug: 'backtracking', difficulty: 'intermediate' },
  { title: 'Topological Sort', slug: 'topological-sort', difficulty: 'advanced' },
  { title: 'DP: Knapsack', slug: 'dp-knapsack', difficulty: 'advanced' },
  { title: 'DP: Longest Increasing Subsequence', slug: 'dp-lis', difficulty: 'advanced' },
  { title: 'DP: Longest Common Subsequence', slug: 'dp-lcs', difficulty: 'advanced' },
  { title: 'Monotonic Stack', slug: 'monotonic-stack', difficulty: 'advanced' },
  { title: 'Two Heaps', slug: 'two-heaps', difficulty: 'advanced' },
  { title: 'Trie', slug: 'trie', difficulty: 'advanced' },
  { title: 'Union Find', slug: 'union-find', difficulty: 'advanced' },
  { title: 'Bit Manipulation', slug: 'bit-manipulation', difficulty: 'advanced' },
];

const databasesContent: { title: string; slug: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }[] = [
  { title: 'What is a Database?', slug: 'what-is-a-database', difficulty: 'beginner' },
  { title: 'SQL Basics: SELECT, WHERE, ORDER BY', slug: 'sql-basics-select-where-order-by', difficulty: 'beginner' },
  { title: 'JOINs — Connecting Tables', slug: 'joins-connecting-tables', difficulty: 'beginner' },
  { title: 'Indexing — Making Queries Fast', slug: 'indexing-making-queries-fast', difficulty: 'intermediate' },
  { title: 'Normalization', slug: 'normalization-organizing-data', difficulty: 'intermediate' },
  { title: 'Transactions & ACID', slug: 'transactions-acid-properties', difficulty: 'intermediate' },
  { title: 'Isolation Levels', slug: 'isolation-levels', difficulty: 'intermediate' },
  { title: 'SQL vs NoSQL', slug: 'sql-vs-nosql', difficulty: 'intermediate' },
  { title: 'Query Optimization', slug: 'query-optimization', difficulty: 'advanced' },
  { title: 'Sharding', slug: 'sharding-splitting-data-across-servers', difficulty: 'advanced' },
  { title: 'Replication', slug: 'replication-copies-for-safety', difficulty: 'advanced' },
  { title: 'CAP Theorem', slug: 'cap-theorem', difficulty: 'advanced' },
  { title: 'Database Design Patterns', slug: 'database-design-patterns', difficulty: 'advanced' },
];

const systemDesignContent: { title: string; slug: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }[] = [
  { title: 'What is System Design?', slug: 'what-is-system-design', difficulty: 'beginner' },
  { title: 'Client-Server Architecture', slug: 'client-server-architecture', difficulty: 'beginner' },
  { title: 'Load Balancing', slug: 'load-balancing', difficulty: 'beginner' },
  { title: 'Caching', slug: 'caching-speed-up-everything', difficulty: 'intermediate' },
  { title: 'CDN', slug: 'cdn-content-closer-to-users', difficulty: 'intermediate' },
  { title: 'Message Queues', slug: 'message-queues', difficulty: 'intermediate' },
  { title: 'Database Scaling', slug: 'database-scaling', difficulty: 'intermediate' },
  { title: 'API Design', slug: 'api-design', difficulty: 'intermediate' },
  { title: 'Rate Limiting', slug: 'rate-limiting', difficulty: 'intermediate' },
  { title: 'Consistent Hashing', slug: 'consistent-hashing', difficulty: 'advanced' },
  { title: 'Microservices vs Monolith', slug: 'microservices-vs-monolith', difficulty: 'advanced' },
  { title: 'Design: URL Shortener', slug: 'design-url-shortener', difficulty: 'advanced' },
  { title: 'Design: Chat Application', slug: 'design-chat-application', difficulty: 'advanced' },
  { title: 'Design: Instagram', slug: 'design-instagram', difficulty: 'advanced' },
  { title: 'Design: Twitter Feed', slug: 'design-twitter-feed', difficulty: 'advanced' },
  { title: 'Design: Uber', slug: 'design-uber', difficulty: 'advanced' },
  { title: 'Design: Netflix Streaming', slug: 'design-netflix-streaming', difficulty: 'advanced' },
];

const oopContent: { title: string; slug: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }[] = [
  { title: 'What is OOP?', slug: 'what-is-oop', difficulty: 'beginner' },
  { title: 'Classes & Objects', slug: 'classes-and-objects', difficulty: 'beginner' },
  { title: 'Encapsulation', slug: 'encapsulation', difficulty: 'beginner' },
  { title: 'Inheritance', slug: 'inheritance', difficulty: 'beginner' },
  { title: 'Polymorphism', slug: 'polymorphism', difficulty: 'intermediate' },
  { title: 'Abstraction', slug: 'abstraction', difficulty: 'intermediate' },
  { title: 'Interfaces & Abstract Classes', slug: 'interfaces-and-abstract-classes', difficulty: 'intermediate' },
  { title: 'SOLID Principles', slug: 'solid-principles', difficulty: 'intermediate' },
  { title: 'Singleton & Factory', slug: 'design-pattern-singleton-factory', difficulty: 'advanced' },
  { title: 'Observer & Strategy', slug: 'design-pattern-observer-strategy', difficulty: 'advanced' },
  { title: 'Builder & Adapter', slug: 'design-pattern-builder-adapter', difficulty: 'advanced' },
  { title: 'Composition over Inheritance', slug: 'composition-over-inheritance', difficulty: 'advanced' },
  { title: 'Design: Parking Lot', slug: 'design-parking-lot-system', difficulty: 'advanced' },
  { title: 'Design: ATM Machine', slug: 'design-atm-machine', difficulty: 'advanced' },
];

const multithreadingContent: { title: string; slug: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }[] = [
  { title: 'What is a Thread?', slug: 'what-is-a-thread', difficulty: 'beginner' },
  { title: 'Process vs Thread', slug: 'process-vs-thread', difficulty: 'beginner' },
  { title: 'Creating Threads', slug: 'creating-threads', difficulty: 'beginner' },
  { title: 'Race Conditions', slug: 'race-conditions', difficulty: 'intermediate' },
  { title: 'Mutex & Locks', slug: 'mutex-and-locks', difficulty: 'intermediate' },
  { title: 'Deadlock', slug: 'deadlock', difficulty: 'intermediate' },
  { title: 'Semaphores', slug: 'semaphores', difficulty: 'intermediate' },
  { title: 'Producer-Consumer Pattern', slug: 'producer-consumer-pattern', difficulty: 'advanced' },
  { title: 'Thread Pools', slug: 'thread-pools', difficulty: 'advanced' },
  { title: 'Concurrent Data Structures', slug: 'concurrent-data-structures', difficulty: 'advanced' },
  { title: 'Async/Await & Futures', slug: 'async-await-and-futures', difficulty: 'advanced' },
  { title: 'Dining Philosophers', slug: 'classic-dining-philosophers', difficulty: 'advanced' },
];

const behavioralContent: { title: string; slug: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }[] = [
  { title: 'STAR Method Framework', slug: '', difficulty: 'beginner' },
  { title: 'Tell Me About Yourself', slug: '', difficulty: 'beginner' },
  { title: 'Why This Company?', slug: '', difficulty: 'beginner' },
  { title: 'Describe a Challenging Project', slug: '', difficulty: 'intermediate' },
  { title: 'Conflict Resolution', slug: '', difficulty: 'intermediate' },
  { title: 'Leadership & Ownership', slug: '', difficulty: 'intermediate' },
  { title: 'Failure & Learning', slug: '', difficulty: 'intermediate' },
  { title: 'System Design Decisions You Made', slug: '', difficulty: 'advanced' },
  { title: 'Cross-Team Collaboration', slug: '', difficulty: 'advanced' },
  { title: 'Mentoring & Growing Others', slug: '', difficulty: 'advanced' },
];

function getContentPool(topic: FocusTopic) {
  switch (topic) {
    case 'dsa': return dsaContent;
    case 'databases': return databasesContent;
    case 'system-design': return systemDesignContent;
    case 'oop': return oopContent;
    case 'multithreading': return multithreadingContent;
    case 'behavioral': return behavioralContent;
  }
}

function getLinkForTopic(topic: FocusTopic, slug: string): string {
  switch (topic) {
    case 'dsa': return `/patterns/${slug}`;
    case 'databases': return `/learn/databases/${slug}`;
    case 'system-design': return `/learn/system-design/${slug}`;
    case 'oop': return `/learn/oops/${slug}`;
    case 'multithreading': return `/learn/multithreading/${slug}`;
    case 'behavioral': return '/prepare/roadmap'; // no dedicated page yet
  }
}

function filterByLevel(
  pool: { title: string; slug: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }[],
  level: Level
) {
  switch (level) {
    case 'beginner': return pool; // everything, starting from basics
    case 'basics': return pool; // same — they know basics but need practice
    case 'intermediate': return pool.filter(c => c.difficulty !== 'beginner').length > 0
      ? pool.filter(c => c.difficulty !== 'beginner')
      : pool;
    case 'advanced': return pool.filter(c => c.difficulty === 'advanced').length > 0
      ? pool.filter(c => c.difficulty === 'advanced')
      : pool;
  }
}

// ── Phase definitions ───────────────────────────────────────────────────────

const phases = [
  { name: 'Fundamentals', fraction: 0.2 },
  { name: 'Core Practice', fraction: 0.5 },
  { name: 'Advanced', fraction: 0.2 },
  { name: 'Review', fraction: 0.1 },
];

function getPhaseForDay(day: number, totalDays: number): { phase: number; phaseName: string } {
  let accum = 0;
  for (let i = 0; i < phases.length; i++) {
    accum += Math.ceil(phases[i].fraction * totalDays);
    if (day <= accum) {
      return { phase: i + 1, phaseName: phases[i].name };
    }
  }
  return { phase: 4, phaseName: 'Review' };
}

// ── Main generation function ────────────────────────────────────────────────

export function generateRoadmap(answers: PrepAnswers): Roadmap {
  const { role, totalDays, hoursPerDay, level, focusTopics } = answers;

  // Get the allocation for this role
  const baseAllocation = roleAllocations[role];

  // Filter to only selected topics and re-normalize percentages
  const selectedAllocations: { topic: FocusTopic; pct: number }[] = [];
  let totalPct = 0;

  for (const t of focusTopics) {
    const pct = baseAllocation[t] || 10; // default 10% if not in role allocation
    selectedAllocations.push({ topic: t, pct });
    totalPct += pct;
  }

  // Normalize to 100%
  for (const a of selectedAllocations) {
    a.pct = Math.round((a.pct / totalPct) * 100);
  }

  // Calculate days per topic
  const topicDays: { topic: FocusTopic; days: number }[] = [];
  let assignedDays = 0;

  for (let i = 0; i < selectedAllocations.length; i++) {
    const d = i === selectedAllocations.length - 1
      ? totalDays - assignedDays
      : Math.round((selectedAllocations[i].pct / 100) * totalDays);
    topicDays.push({ topic: selectedAllocations[i].topic, days: Math.max(1, d) });
    assignedDays += topicDays[topicDays.length - 1].days;
  }

  // Build the day-by-day plan
  const dayPlans: DayPlan[] = [];
  let currentDay = 1;

  for (const { topic, days } of topicDays) {
    const pool = filterByLevel(getContentPool(topic), level);
    const meta = topicMeta[topic];

    for (let i = 0; i < days; i++) {
      const contentIdx = i % pool.length;
      const content = pool[contentIdx];
      const { phase, phaseName } = getPhaseForDay(currentDay, totalDays);

      // For review phase, prepend "Review: " to title
      const isReview = phaseName === 'Review';
      const title = isReview ? `Review: ${content.title}` : content.title;

      dayPlans.push({
        day: currentDay,
        week: Math.ceil(currentDay / 7),
        phase,
        phaseName,
        topic,
        topicLabel: meta.label,
        topicIcon: meta.icon,
        topicColor: meta.color,
        title,
        link: getLinkForTopic(topic, content.slug),
        estimatedMinutes: hoursPerDay * 60,
        done: false,
      });

      currentDay++;
    }
  }

  // Interleave topics for variety instead of doing all of one topic first
  // Sort by distributing topics across the timeline
  const interleaved = interleaveDays(dayPlans);

  // Re-assign day numbers and weeks after interleaving
  for (let i = 0; i < interleaved.length; i++) {
    interleaved[i].day = i + 1;
    interleaved[i].week = Math.ceil((i + 1) / 7);
    const { phase, phaseName } = getPhaseForDay(i + 1, totalDays);
    interleaved[i].phase = phase;
    interleaved[i].phaseName = phaseName;
  }

  return {
    answers,
    days: interleaved,
    totalDays,
    generatedAt: new Date().toISOString(),
  };
}

function interleaveDays(dayPlans: DayPlan[]): DayPlan[] {
  // Group by topic
  const buckets: Record<string, DayPlan[]> = {};
  for (const d of dayPlans) {
    if (!buckets[d.topic]) buckets[d.topic] = [];
    buckets[d.topic].push(d);
  }

  const topicKeys = Object.keys(buckets);
  const result: DayPlan[] = [];
  const indices: Record<string, number> = {};
  for (const k of topicKeys) indices[k] = 0;

  let remaining = dayPlans.length;
  let topicIdx = 0;

  while (remaining > 0) {
    const topic = topicKeys[topicIdx % topicKeys.length];
    if (indices[topic] < buckets[topic].length) {
      result.push(buckets[topic][indices[topic]]);
      indices[topic]++;
      remaining--;
    }
    topicIdx++;
    // Safety: if we've gone around all topics without adding, break
    if (topicIdx > remaining + topicKeys.length * 2) break;
  }

  return result;
}

// ── localStorage helpers ────────────────────────────────────────────────────

const PREP_ANSWERS_KEY = 'streaksy_prep_answers';
const PREP_ROADMAP_KEY = 'streaksy_prep_roadmap';
const PREP_PROGRESS_KEY = 'streaksy_prep_progress';

export function savePrepAnswers(answers: PrepAnswers) {
  localStorage.setItem(PREP_ANSWERS_KEY, JSON.stringify(answers));
}

export function loadPrepAnswers(): PrepAnswers | null {
  const raw = localStorage.getItem(PREP_ANSWERS_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveRoadmap(roadmap: Roadmap) {
  localStorage.setItem(PREP_ROADMAP_KEY, JSON.stringify(roadmap));
}

export function loadRoadmap(): Roadmap | null {
  const raw = localStorage.getItem(PREP_ROADMAP_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveProgress(progress: Record<number, boolean>) {
  localStorage.setItem(PREP_PROGRESS_KEY, JSON.stringify(progress));
}

export function loadProgress(): Record<number, boolean> {
  const raw = localStorage.getItem(PREP_PROGRESS_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

// ── Role display info ───────────────────────────────────────────────────────

export const roleOptions: { value: Role; label: string; icon: string; desc: string }[] = [
  { value: 'frontend', label: 'Frontend Engineer', icon: '🎨', desc: 'React, DOM, CSS, Web APIs' },
  { value: 'backend', label: 'Backend Engineer', icon: '🔧', desc: 'APIs, databases, servers' },
  { value: 'fullstack', label: 'Full-Stack Engineer', icon: '🌐', desc: 'End-to-end development' },
  { value: 'mobile', label: 'Mobile Developer', icon: '📱', desc: 'iOS, Android, React Native' },
  { value: 'data-engineer', label: 'Data Engineer', icon: '📊', desc: 'Pipelines, SQL, warehouses' },
  { value: 'devops', label: 'DevOps / SRE', icon: '🚀', desc: 'CI/CD, infra, monitoring' },
  { value: 'new-grad', label: 'New Grad / Entry Level', icon: '🎓', desc: 'First job, strong fundamentals' },
  { value: 'senior', label: 'Senior / Staff', icon: '👑', desc: 'System design heavy' },
];

export const levelOptions: { value: Level; label: string; icon: string; desc: string }[] = [
  { value: 'beginner', label: 'Complete Beginner', icon: '🌱', desc: 'Never done DSA before' },
  { value: 'basics', label: 'Know Basics', icon: '📗', desc: 'Arrays, loops, basic DS' },
  { value: 'intermediate', label: 'Intermediate', icon: '📘', desc: 'Solved 50-100 problems' },
  { value: 'advanced', label: 'Advanced', icon: '📕', desc: '200+ problems, need review' },
];

export const focusTopicOptions: { value: FocusTopic; label: string; icon: string }[] = [
  { value: 'dsa', label: 'DSA Patterns', icon: '🧩' },
  { value: 'databases', label: 'Databases', icon: '🗄️' },
  { value: 'system-design', label: 'System Design', icon: '🏗️' },
  { value: 'oop', label: 'OOP / Object-Oriented Design', icon: '🧱' },
  { value: 'multithreading', label: 'Multithreading / Concurrency', icon: '⚡' },
  { value: 'behavioral', label: 'Behavioral Questions', icon: '🎤' },
];
