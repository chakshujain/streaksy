import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Profile | Streaksy',
  description: 'View user profile, stats, badges, and activity on Streaksy.',
};

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
