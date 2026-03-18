export interface User {
  id: string;
  email: string;
  displayName: string;
  leetcodeUsername?: string;
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
