import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your Streaksy profile, avatar, and social links.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
