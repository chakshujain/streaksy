'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Flame,
  LogOut,
  Settings,
  User,
  Swords,
  GraduationCap,
  Map,
  Trophy,
  Rss,
  BarChart3,
} from 'lucide-react';
import { useAuthStore, useDashboardStore } from '@/lib/store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/feed', label: 'Feed', icon: Rss },
  { href: '/roadmaps', label: 'Roadmaps', icon: Map },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/problems', label: 'Problems', icon: BookOpen },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/rooms', label: 'Solve Rooms', icon: Swords },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { streak } = useDashboardStore();

  const initials = user?.displayName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden bg-zinc-950/70 backdrop-blur-xl border-r border-zinc-800/40">
      {/* Gradient border accent on the right edge */}
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent" />

      {/* Logo */}
      <div className="flex items-center border-b border-zinc-800/40 px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text tracking-tight">Streaksy</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href) || (href === '/learn' && pathname.startsWith('/patterns'));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out',
                active
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_-6px_rgba(16,185,129,0.25)]'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-400 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300',
                  active
                    ? 'bg-emerald-500/15'
                    : 'bg-transparent group-hover:bg-zinc-700/50'
                )}
              >
                <Icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

      {/* Streak display */}
      {streak && streak.currentStreak > 0 && (
        <div className="mx-3 my-3 overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15">
              <span className="text-lg">{'\u{1F525}'}</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-orange-400">{streak.currentStreak}</span>
                <span className="text-xs text-zinc-500">day streak</span>
                {streak.points != null && streak.points > 0 && (
                  <>
                    <span className="text-xs text-zinc-600 mx-0.5">&bull;</span>
                    <span className="text-xs font-medium text-amber-400">{streak.points} pts</span>
                  </>
                )}
              </div>
              {streak.longestStreak > streak.currentStreak && (
                <p className="text-[11px] text-zinc-600">
                  Best: {streak.longestStreak} days
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User */}
      <div className="border-t border-zinc-800/40 p-4">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="h-9 w-9 flex-shrink-0 rounded-full object-cover border border-emerald-500/20"
            />
          ) : (
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-200">
              {user?.displayName}
            </p>
            <p className="truncate text-[11px] text-zinc-600">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
