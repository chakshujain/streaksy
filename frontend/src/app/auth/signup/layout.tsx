import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — Start Your DSA Journey | Streaksy',
  description: 'Create your free Streaksy account. Auto-sync LeetCode, join study groups, track streaks, and ace your coding interviews.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
