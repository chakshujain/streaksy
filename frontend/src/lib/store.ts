import { create } from 'zustand';
import type { User, Streak } from './types';
import { authApi, streaksApi } from './api';
import { disconnectSocket } from './socket';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  login: async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('streaksy_token', data.token);
    localStorage.setItem('streaksy_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  signup: async (email, password, displayName) => {
    const { data } = await authApi.signup({ email, password, displayName });
    localStorage.setItem('streaksy_token', data.token);
    localStorage.setItem('streaksy_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem('streaksy_token');
    localStorage.removeItem('streaksy_user');
    disconnectSocket();
    set({ user: null, token: null });
  },

  hydrate: () => {
    const token = localStorage.getItem('streaksy_token');
    const userStr = localStorage.getItem('streaksy_user');
    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        localStorage.removeItem('streaksy_user');
      }
    }
    set({ user, token, loading: false });
  },

  setUser: (user) => {
    localStorage.setItem('streaksy_user', JSON.stringify(user));
    set({ user });
  },
}));

// ── Dashboard Stats ──
interface DashboardState {
  streak: Streak | null;
  solvedCount: number;
  loading: boolean;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  streak: null,
  solvedCount: 0,
  loading: true,

  fetchStats: async () => {
    set({ loading: true });
    try {
      const [streakRes, progressRes] = await Promise.all([
        streaksApi.get(),
        (await import('./api')).progressApi.get(),
      ]);
      const solved = progressRes.data.progress.filter(
        (p: { status: string }) => p.status === 'solved'
      ).length;
      set({
        streak: streakRes.data.streak,
        solvedCount: solved,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
