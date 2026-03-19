import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Problem Sheets — Blind 75, NeetCode 150, Striver SDE | Streaksy',
  description: 'Browse and track progress on curated DSA problem sheets including Blind 75, NeetCode 150, Striver SDE Sheet, Love Babbar 450, and Grind 75.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
