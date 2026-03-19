import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('streaksy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('streaksy_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──
export const authApi = {
  signup: (data: { email: string; password: string; displayName: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  connectLeetcode: (leetcodeUsername: string) =>
    api.post('/auth/connect-leetcode', { leetcodeUsername }),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
  resendVerification: () =>
    api.post('/auth/resend-verification'),
  getProfile: () =>
    api.get('/auth/profile'),
  updateProfile: (data: { displayName?: string; bio?: string; location?: string; githubUrl?: string; linkedinUrl?: string }) =>
    api.put('/auth/profile', data),
  getPublicProfile: (userId: string) => api.get(`/auth/user/${userId}`),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Problems ──
export const problemsApi = {
  list: (params?: { difficulty?: string; limit?: number; offset?: number }) =>
    api.get('/problems', { params }),
  getBySlug: (slug: string) =>
    api.get(`/problems/${slug}`),
  getSheets: () =>
    api.get('/problems/sheets'),
  getSheetProblems: (slug: string) =>
    api.get(`/problems/sheets/${slug}`),
  search: (q: string, limit?: number) =>
    api.get('/problems/search', { params: { q, limit } }),
};

// ── Submissions ──
export const submissionsApi = {
  list: (params?: { limit?: number; offset?: number }) =>
    api.get('/sync/submissions', { params }),
  getForProblem: (problemId: string) =>
    api.get(`/sync/submissions/${problemId}`),
  getStats: () =>
    api.get('/sync/submissions/stats'),
  peerSolutions: (problemId: string) =>
    api.get(`/sync/peer-solutions/${problemId}`),
};

// ── Groups ──
export const groupsApi = {
  list: () => api.get('/groups'),
  get: (id: string) => api.get(`/groups/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/groups', data),
  join: (inviteCode: string) =>
    api.post('/groups/join', { inviteCode }),
  updatePlan: (id: string, data: { plan?: string; objective?: string; targetDate?: string }) =>
    api.put(`/groups/${id}/plan`, data),
  assignSheet: (id: string, sheetId: string) =>
    api.post(`/groups/${id}/sheets`, { sheetId }),
  removeSheet: (id: string, sheetId: string) =>
    api.delete(`/groups/${id}/sheets/${sheetId}`),
  getSheets: (id: string) =>
    api.get(`/groups/${id}/sheets`),
};

// ── Progress ──
export const progressApi = {
  get: () => api.get('/progress'),
  getForSheet: (sheetSlug: string) =>
    api.get(`/progress/sheet/${sheetSlug}`),
};

// ── Sync ──
export const syncApi = {
  leetcode: (data: { userId: string; problemSlug: string; status: string }) =>
    api.post('/sync/leetcode', data),
};

// ── Streaks ──
export const streaksApi = {
  get: () => api.get('/streaks'),
};

// ── Leaderboard ──
export const leaderboardApi = {
  getGroup: (groupId: string) =>
    api.get(`/leaderboard/group/${groupId}`),
};

// ── Notes ──
export const notesApi = {
  create: (data: { problemId: string; content: string; visibility: string; groupId?: string }) =>
    api.post('/notes', data),
  update: (id: string, content: string) =>
    api.put(`/notes/${id}`, { content }),
  delete: (id: string) =>
    api.delete(`/notes/${id}`),
  getPersonal: (problemId: string) =>
    api.get(`/notes/personal/${problemId}`),
  getGroup: (groupId: string, problemId: string) =>
    api.get(`/notes/group/${groupId}/${problemId}`),
};

// ── Insights ──
export const insightsApi = {
  overview: () => api.get('/insights/overview'),
  weekly: () => api.get('/insights/weekly'),
  tags: () => api.get('/insights/tags'),
  difficultyTrend: () => api.get('/insights/difficulty-trend'),
};

// ── Sheets upload ──
export const sheetsApi = {
  upload: (name: string, file: File) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    return api.post('/sheets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Preferences ──
export const preferencesApi = {
  get: () => api.get('/preferences'),
  update: (prefs: Record<string, unknown>) => api.put('/preferences', prefs),
};

// ── Notifications ──
export const notificationsApi = {
  list: (params?: { limit?: number; offset?: number }) =>
    api.get('/notifications', { params }),
  unreadCount: () =>
    api.get('/notifications/unread-count'),
  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),
  markAllRead: () =>
    api.patch('/notifications/read-all'),
};

// ── Discussions ──
export const discussionsApi = {
  getComments: (slug: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/problems/${slug}/comments`, { params }),
  createComment: (slug: string, data: { content: string; parentId?: string }) =>
    api.post(`/problems/${slug}/comments`, data),
  getReplies: (commentId: string) =>
    api.get(`/comments/${commentId}/replies`),
  updateComment: (id: string, content: string) =>
    api.put(`/comments/${id}`, { content }),
  deleteComment: (id: string) =>
    api.delete(`/comments/${id}`),
};

// ── Activity ──
export const activityApi = {
  getGroupActivity: (groupId: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/groups/${groupId}/activity`, { params }),
};

// ── Revisions ──
export const revisionApi = {
  list: (params?: { tag?: string; difficulty?: string; limit?: number; offset?: number }) =>
    api.get('/revisions', { params }),
  quiz: (count?: number) =>
    api.get('/revisions/quiz', { params: { count } }),
  get: (problemId: string) =>
    api.get(`/revisions/${problemId}`),
  createOrUpdate: (data: {
    problemId: string;
    keyTakeaway: string;
    approach?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    tags?: string[];
    difficultyRating?: string;
  }) => api.post('/revisions', data),
  markRevised: (id: string) =>
    api.patch(`/revisions/${id}/revised`),
  delete: (id: string) =>
    api.delete(`/revisions/${id}`),
};

// ── Contests ──
export const contestsApi = {
  getForGroup: (groupId: string) =>
    api.get(`/groups/${groupId}/contests`),
  getDetails: (contestId: string) =>
    api.get(`/contests/${contestId}`),
  create: (groupId: string, data: { title: string; description?: string; startsAt: string; endsAt: string; problemIds?: string[] }) =>
    api.post(`/groups/${groupId}/contests`, data),
  submit: (contestId: string, problemId: string) =>
    api.post(`/contests/${contestId}/submit`, { problemId }),
};

// ── Badges ──
export const badgesApi = {
  list: () => api.get('/badges'),
  mine: () => api.get('/badges/mine'),
};

// ── Pokes ──
export const pokesApi = {
  poke: (toUserId: string, groupId?: string, message?: string) =>
    api.post('/pokes', { toUserId, groupId, message }),
  received: (params?: { limit?: number; offset?: number }) =>
    api.get('/pokes/received', { params }),
  inactiveMembers: (groupId: string, days?: number) =>
    api.get(`/pokes/inactive/${groupId}`, { params: { days } }),
  streakRisk: () =>
    api.get('/pokes/streak-risk'),
  activeChallenge: () =>
    api.get('/pokes/challenge'),
};

// ── Feed ──
export const feedApi = {
  getFeed: (params?: { limit?: number; offset?: number }) =>
    api.get('/feed', { params }),
  getUserFeed: (userId: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/feed/user/${userId}`, { params }),
  toggleLike: (eventId: string) =>
    api.post(`/feed/${eventId}/like`),
  addComment: (eventId: string, content: string) =>
    api.post(`/feed/${eventId}/comments`, { content }),
  getComments: (eventId: string) =>
    api.get(`/feed/${eventId}/comments`),
  deleteComment: (commentId: string) =>
    api.delete(`/feed/comments/${commentId}`),
};

// ── Daily ──
export const dailyApi = {
  getProblems: (count?: number) => api.get('/daily', { params: { count } }),
};

// ── Rooms ──
export const roomsApi = {
  create: (data: { name: string; problemId?: string; problemIds?: string[]; sheetId?: string; scheduledAt?: string; mode?: string; timeLimitMinutes?: number; recurrence?: string; meetLink?: string }) =>
    api.post('/rooms', data),
  join: (code: string) =>
    api.post('/rooms/join', { code }),
  get: (id: string) =>
    api.get(`/rooms/${id}`),
  start: (id: string) =>
    api.post(`/rooms/${id}/start`),
  end: (id: string) =>
    api.post(`/rooms/${id}/end`),
  solve: (id: string, data?: { code?: string; language?: string; runtimeMs?: number; memoryKb?: number }) =>
    api.post(`/rooms/${id}/solve`, data || {}),
  mine: () =>
    api.get('/rooms/mine'),
  active: () =>
    api.get('/rooms/active'),
  upcoming: () =>
    api.get('/rooms/upcoming'),
  leaderboard: () =>
    api.get('/rooms/leaderboard'),
  getProblems: (id: string) =>
    api.get(`/rooms/${id}/problems`),
  suggestProblems: (mode: string, count?: number, sheetId?: string) =>
    api.get('/rooms/suggest', { params: { mode, count, sheetId } }),
};

export default api;
