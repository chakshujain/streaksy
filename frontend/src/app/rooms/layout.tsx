import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live War Rooms — Real-time Collaborative Problem Solving',
  description: 'Create rooms, invite friends, solve LeetCode problems together with a countdown timer, and see who solves first.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
