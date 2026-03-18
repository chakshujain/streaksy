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
  BarChart3,
  Settings,
} from 'lucide-react';
import { useAuthStore, useDashboardStore } from '@/lib/store';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/problems', label: 'Problems', icon: BookOpen },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { streak } = useDashboardStore();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col glass-strong">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-zinc-800/50 px-6 py-5">
        <Flame className="h-6 w-6 text-emerald-500" />
        <span className="text-xl font-bold gradient-text">Solvo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
              )}
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Streak display */}
      {streak && streak.currentStreak > 0 && (
        <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl bg-orange-500/10 px-4 py-2.5 text-sm">
          <span className="text-lg">🔥</span>
          <span className="font-semibold text-orange-400">{streak.currentStreak}</span>
          <span className="text-zinc-400">day streak</span>
        </div>
      )}

      {/* User */}
      <div className="border-t border-zinc-800/50 p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-200">
              {user?.displayName}
            </p>
            <p className="truncate text-xs text-zinc-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
