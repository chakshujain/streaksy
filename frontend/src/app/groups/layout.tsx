import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Groups — Compete & Learn Together',
  description: 'Create or join study groups, assign problem sheets, compete on leaderboards, and track group progress.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
