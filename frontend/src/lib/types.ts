export interface User {
  id: string;
  email: string;
  displayName: string;
  leetcodeUsername?: string;
  emailVerified?: boolean;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  url?: string;
  tags?: { id: string; name: string }[];
}

export interface Sheet {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  invite_code: string;
  created_by: string;
  members?: GroupMember[];
}

export interface GroupMember {
  user_id: string;
  display_name: string;
  email: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface ProblemProgress {
  slug?: string;
  title?: string;
  difficulty?: string;
  user_id?: string;
  problem_id: string;
  status: 'not_started' | 'attempted' | 'solved';
  solved_at?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  solvedCount: number;
  currentStreak: number;
  score: number;
}

export interface Note {
  id: string;
  user_id: string;
  problem_id: string;
  group_id?: string;
  content: string;
  visibility: 'personal' | 'group';
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface InsightsOverview {
  totalSolved: number;
  totalProblems: number;
  easyCount: number;
  easySolved: number;
  mediumCount: number;
  mediumSolved: number;
  hardCount: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
}

export interface WeeklyData {
  weekStart: string;
  count: number;
}

export interface TagProgress {
  name: string;
  solved: number;
  total: number;
}

export interface DifficultyTrend {
  month: string;
  easy: number;
  medium: number;
  hard: number;
}

export interface UserPreferences {
  theme: string;
  accent_color: string;
  dashboard_layout: string;
  show_streak_animation: boolean;
  show_heatmap: boolean;
  weekly_goal: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  problem_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityItem {
  id: string;
  group_id: string;
  user_id: string;
  action: string;
  metadata: Record<string, unknown>;
  display_name: string;
  created_at: string;
}

export interface RevisionNote {
  id: string;
  user_id: string;
  problem_id: string;
  key_takeaway: string;
  approach: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  tags: string[];
  difficulty_rating: string | null;
  last_revised_at: string | null;
  revision_count: number;
  created_at: string;
  updated_at: string;
  problem_title?: string;
  problem_slug?: string;
  problem_difficulty?: string;
}

export interface Contest {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  created_by: string;
  problems?: ContestProblem[];
  standings?: ContestStanding[];
}

export interface ContestProblem {
  problem_id: string;
  title: string;
  slug: string;
  difficulty: string;
  position: number;
}

export interface ContestStanding {
  user_id: string;
  display_name: string;
  solved_count: number;
  last_submission: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface UserBadge extends Badge {
  badge_id: string;
  earned_at: string;
}
