export interface RoadmapTemplateData {
  slug: string;
  name: string;
  icon: string;
  category: string;
  color: string;
  duration: number;
  difficulty: string;
  description: string;
  featured?: boolean;
  flagship?: boolean;
  participants?: number;
  tracked?: 'auto' | 'manual';
}

export const roadmapTemplates: RoadmapTemplateData[] = [
  // Flagship
  { slug: 'crack-the-job-together', name: 'Crack the Job Together', icon: '🚀', category: 'Coding & Tech', color: 'emerald', duration: 90, difficulty: 'advanced', description: 'THE 90-day interview prep. DSA + System Design + OOP + Behavioral. Do it with your crew.', featured: true, flagship: true, participants: 234 },
  // Sheets
  { slug: 'solve-striver-sheet', name: 'Solve Striver Sheet', icon: '📋', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Complete Striver SDE Sheet. Auto-tracked via extension.', featured: true, participants: 156, tracked: 'auto' },
  { slug: 'solve-love-babbar-sheet', name: 'Solve Love Babbar Sheet', icon: '📋', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Love Babbar 450 DSA Sheet. Auto-tracked.', featured: true, participants: 89, tracked: 'auto' },
  { slug: 'leetcode-top-150', name: 'LeetCode Top 150', icon: '🏆', category: 'Coding & Tech', color: 'amber', duration: 30, difficulty: 'intermediate', description: 'Top 150 interview questions. Auto-tracked.', featured: true, participants: 312, tracked: 'auto' },
  // Coding & Tech
  { slug: 'dsa-patterns-30', name: 'DSA Patterns', icon: '🧩', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Master 19 problem-solving patterns with simulations', participants: 178 },
  { slug: 'learn-system-design', name: 'Learn System Design', icon: '🏗️', category: 'Coding & Tech', color: 'purple', duration: 17, difficulty: 'intermediate', description: 'From load balancers to designing Netflix', participants: 145 },
  { slug: 'learn-databases', name: 'Learn Databases', icon: '🗄️', category: 'Coding & Tech', color: 'blue', duration: 14, difficulty: 'beginner', description: 'SQL basics to sharding and replication', participants: 98 },
  { slug: 'learn-oops', name: 'Learn OOP', icon: '🧱', category: 'Coding & Tech', color: 'amber', duration: 14, difficulty: 'beginner', description: 'SOLID principles to design patterns', participants: 67 },
  { slug: 'learn-multithreading', name: 'Learn Multithreading', icon: '⚡', category: 'Coding & Tech', color: 'red', duration: 12, difficulty: 'intermediate', description: 'Threads, locks, deadlocks, async', participants: 45 },
  { slug: 'learn-design-patterns', name: 'Learn Design Patterns', icon: '🧬', category: 'Coding & Tech', color: 'teal', duration: 30, difficulty: 'intermediate', description: 'Gang of Four patterns — Singleton, Factory, Observer, Strategy, and more', participants: 0 },
  { slug: '100-days-of-code', name: '100 Days of Code', icon: '💻', category: 'Coding & Tech', color: 'emerald', duration: 100, difficulty: 'beginner', description: 'Code every day for 100 days', participants: 423, featured: true },
  // Fitness & Health
  { slug: 'gym-daily-30', name: 'Go to Gym Daily', icon: '💪', category: 'Fitness & Health', color: 'blue', duration: 30, difficulty: 'beginner', description: 'Build a daily gym habit', participants: 567 },
  { slug: '10k-steps-30', name: '10,000 Steps', icon: '🏃', category: 'Fitness & Health', color: 'blue', duration: 30, difficulty: 'beginner', description: 'Walk 10K steps every day', participants: 234 },
  { slug: 'quit-smoking', name: 'Quit Smoking', icon: '🚭', category: 'Fitness & Health', color: 'red', duration: 90, difficulty: 'advanced', description: '90-day journey to freedom', participants: 145 },
  { slug: 'meditation-30', name: '30-Day Meditation', icon: '🧘', category: 'Fitness & Health', color: 'purple', duration: 30, difficulty: 'beginner', description: 'Build a mindfulness habit', participants: 189 },
  // Learning & Reading
  { slug: 'read-book-month', name: 'Read 1 Book/Month', icon: '📖', category: 'Learning & Reading', color: 'amber', duration: 30, difficulty: 'beginner', description: 'Daily reading goals', participants: 312 },
  { slug: 'daily-journal-30', name: 'Daily Journal', icon: '✍️', category: 'Learning & Reading', color: 'amber', duration: 30, difficulty: 'beginner', description: 'Daily journaling for self-reflection', participants: 78 },
  // ── NEW: Coding & Tech ──────────────────────────────────────────────
  { slug: 'learn-frontend', name: 'Learn Frontend Dev', icon: '🎨', category: 'Coding & Tech', color: 'cyan', duration: 30, difficulty: 'beginner', description: 'HTML, CSS, JS, and React — build real UIs every day', participants: 0 },
  { slug: 'learn-backend', name: 'Learn Backend Dev', icon: '⚙️', category: 'Coding & Tech', color: 'emerald', duration: 30, difficulty: 'intermediate', description: 'Node.js, APIs, databases, auth, and deployment', participants: 0 },
  { slug: 'learn-devops', name: 'Learn DevOps & Cloud', icon: '☁️', category: 'Coding & Tech', color: 'violet', duration: 21, difficulty: 'intermediate', description: 'Docker, Kubernetes, CI/CD, and AWS essentials', participants: 0 },
  { slug: 'learn-ai-ml', name: 'Learn AI/ML', icon: '🤖', category: 'Coding & Tech', color: 'pink', duration: 30, difficulty: 'intermediate', description: 'Python, NumPy, scikit-learn — build your first ML models', participants: 0 },
  { slug: 'learn-cybersecurity', name: 'Cybersecurity Basics', icon: '🔐', category: 'Coding & Tech', color: 'red', duration: 21, difficulty: 'intermediate', description: 'Networking, encryption, attacks, and defense', participants: 0 },
  { slug: 'learn-mobile-dev', name: 'Mobile Development', icon: '📱', category: 'Coding & Tech', color: 'blue', duration: 21, difficulty: 'intermediate', description: 'Build cross-platform apps with React Native', participants: 0 },
  { slug: 'master-git', name: 'Git & GitHub Mastery', icon: '🌿', category: 'Coding & Tech', color: 'gray', duration: 7, difficulty: 'beginner', description: 'Branching, PRs, rebasing, and collaboration workflows', participants: 0 },
  { slug: 'learn-linux', name: 'Linux & Command Line', icon: '🐧', category: 'Coding & Tech', color: 'slate', duration: 14, difficulty: 'beginner', description: 'Terminal, scripting, permissions, and essential tools', participants: 0 },
  // ── NEW: Languages ──────────────────────────────────────────────────
  { slug: 'learn-french', name: 'Learn French', icon: '🇫🇷', category: 'Languages', color: 'blue', duration: 90, difficulty: 'beginner', description: 'Bonjour! Daily vocab, grammar, and conversation — 15 min/day', participants: 0 },
  { slug: 'learn-german', name: 'Learn German', icon: '🇩🇪', category: 'Languages', color: 'amber', duration: 90, difficulty: 'beginner', description: 'Hallo! Daily vocab, grammar cases, and conversation — 15 min/day', participants: 0 },
  { slug: 'learn-spanish', name: 'Learn Spanish', icon: '🇪🇸', category: 'Languages', color: 'red', duration: 90, difficulty: 'beginner', description: 'Hola! Daily vocab, grammar, and conversation — 15 min/day', participants: 0 },
  { slug: 'learn-japanese', name: 'Learn Japanese', icon: '🇯🇵', category: 'Languages', color: 'rose', duration: 90, difficulty: 'intermediate', description: 'Hiragana to basic kanji — reading, writing, and speaking', participants: 0 },
  // ── NEW: Personal Growth ────────────────────────────────────────────
  { slug: 'public-speaking-30', name: 'Public Speaking', icon: '🎤', category: 'Personal Growth', color: 'orange', duration: 30, difficulty: 'beginner', description: 'From nervous to confident — daily speaking exercises', participants: 0 },
  { slug: 'financial-literacy', name: 'Financial Literacy', icon: '💰', category: 'Personal Growth', color: 'green', duration: 21, difficulty: 'beginner', description: 'Budgeting, saving, investing — money skills for life', participants: 0 },
  { slug: 'productivity-14', name: 'Productivity Masterclass', icon: '⚡', category: 'Personal Growth', color: 'yellow', duration: 14, difficulty: 'beginner', description: 'Focus systems, time management, and habit stacking', participants: 0 },
];

export const templatesBySlug: Record<string, RoadmapTemplateData> = Object.fromEntries(
  roadmapTemplates.map(t => [t.slug, t])
);
