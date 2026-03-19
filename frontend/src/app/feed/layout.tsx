import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity Feed — See What Your Peers Are Solving',
  description: 'Social activity feed showing problem solves, streak milestones, and achievements from your study groups.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
