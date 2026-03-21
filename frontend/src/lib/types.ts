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
  youtube_url?: string | null;
  video_title?: string | null;
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
  plan?: string;
  objective?: string;
  target_date?: string;
}

export interface GroupSheet {
  sheet_id: string;
  name: string;
  slug: string;
  description: string | null;
  assigned_at: string;
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
  points?: number;
  freezeCount?: number;
  lastFreezeUsed?: string | null;
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
  easySolved: number;
  easyPercentage: number;
  mediumSolved: number;
  mediumPercentage: number;
  hardSolved: number;
  hardPercentage: number;
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
  digest_enabled?: boolean;
  digest_time?: string;
  digest_frequency?: string;
  evening_reminder?: boolean;
  weekly_report?: boolean;
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

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  status: string;
  language: string;
  code: string | null;
  runtime_ms: number | null;
  runtime_percentile: number | null;
  memory_kb: number | null;
  memory_percentile: number | null;
  time_spent_seconds: number | null;
  leetcode_submission_id: string | null;
  submitted_at: string;
  problem_title?: string;
  problem_slug?: string;
  problem_difficulty?: string;
}

export interface SubmissionStats {
  totalSubmissions: number;
  acceptedSubmissions: number;
  avgRuntime: number | null;
  avgMemory: number | null;
  avgTimeSpent: number | null;
  languages: { language: string; count: number }[];
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

export interface Room {
  id: string;
  name: string;
  code: string;
  problem_id: string;
  host_id: string;
  status: 'waiting' | 'active' | 'finished' | 'scheduled';
  time_limit_minutes: number;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  scheduled_at: string | null;
  mode: 'single' | 'multi';
  sheet_id: string | null;
  recurrence: string | null;
  meet_link: string | null;
  calendar_event_id: string | null;
  problem_title?: string;
  problem_slug?: string;
  problem_difficulty?: string;
  participants?: RoomParticipant[];
  messages?: RoomMessage[];
}

export interface RoomLeaderboardEntry {
  user_id: string;
  display_name: string;
  rooms_participated: number;
  rooms_won: number;
  total_solves: number;
}

export interface SuggestedProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  url: string;
}

export interface RoomProblem {
  problem_id: string;
  title: string;
  slug: string;
  difficulty: string;
  position: number;
}

export interface RoomParticipant {
  room_id: string;
  user_id: string;
  status: string;
  solved_at: string | null;
  code: string | null;
  language: string | null;
  runtime_ms: number | null;
  memory_kb: number | null;
  joined_at: string;
  display_name?: string;
}

export interface PeerSolution {
  id: string;
  language: string;
  code: string;
  runtime_ms: number | null;
  runtime_percentile: number | null;
  memory_kb: number | null;
  memory_percentile: number | null;
  submitted_at: string;
  display_name: string;
  user_id: string;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  display_name?: string;
}

export interface FeedEvent {
  id: string;
  user_id: string;
  event_type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  display_name?: string;
  avatar_url?: string;
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
}

export interface PublicProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  currentStreak: number;
  longestStreak: number;
  totalSolved: number;
  badges: UserBadge[];
  joinedAt: string;
}

export interface FeedComment {
  id: string;
  feed_event_id: string;
  user_id: string;
  content: string;
  created_at: string;
  display_name?: string;
}

// ── Ratings ──
export interface ProblemRating {
  avg_rating: number;
  rating_count: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface CompanyTag {
  id: string;
  name: string;
}

export interface ProblemCompanyTag {
  problem_id: string;
  company_tag_id: string;
  company_name: string;
  report_count: number;
}

// ── Powerups ──
export interface Powerup {
  id: string;
  user_id: string;
  powerup_type: 'streak_freeze' | 'double_xp' | 'streak_shield';
  quantity: number;
}

export interface PowerupInventory {
  powerups: Powerup[];
  points: number;
  freezeCount: number;
  lastFreezeUsed: string | null;
}

export interface PowerupLogEntry {
  id: string;
  user_id: string;
  powerup_type: string;
  action: string;
  reason: string | null;
  created_at: string;
}

// ── Digest ──
export interface DigestPreferences {
  digest_enabled: boolean;
  digest_time: string;
  digest_frequency: string;
  evening_reminder: boolean;
  weekly_report: boolean;
}
