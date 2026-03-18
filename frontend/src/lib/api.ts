import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('solvo_token');
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
      localStorage.removeItem('solvo_token');
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
};

// ── Groups ──
export const groupsApi = {
  list: () => api.get('/groups'),
  get: (id: string) => api.get(`/groups/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/groups', data),
  join: (inviteCode: string) =>
    api.post('/groups/join', { inviteCode }),
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

export default api;
