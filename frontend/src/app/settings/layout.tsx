import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Customize your Streaksy preferences.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
