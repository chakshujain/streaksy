import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insights — DSA Progress Analytics',
  description: 'Visualize your strengths across topics, difficulty levels, solve times, and weekly trends.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
