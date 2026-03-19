import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In — Streaksy',
  description: 'Sign in to Streaksy to track your LeetCode progress, compete with friends, and maintain your coding streak.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
