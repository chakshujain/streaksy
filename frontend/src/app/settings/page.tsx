'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { preferencesApi, authApi, notificationsApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { PageTransition } from '@/components/ui/PageTransition';
import { Settings, Palette, LayoutGrid, Eye, Target, Check, Save, Lock, Download, CalendarDays, Link2, Unlink, BellRing, Puzzle } from 'lucide-react';
import { DigestSection } from '@/components/settings/DigestSection';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import type { UserPreferences } from '@/lib/types';

const accentSwatches = [
  { name: 'Emerald', value: 'emerald', color: 'bg-emerald-500', ring: 'ring-emerald-500/40', glow: 'shadow-emerald-500/30' },
  { name: 'Cyan', value: 'cyan', color: 'bg-cyan-500', ring: 'ring-cyan-500/40', glow: 'shadow-cyan-500/30' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-500', ring: 'ring-purple-500/40', glow: 'shadow-purple-500/30' },
  { name: 'Pink', value: 'pink', color: 'bg-pink-500', ring: 'ring-pink-500/40', glow: 'shadow-pink-500/30' },
  { name: 'Amber', value: 'amber', color: 'bg-amber-500', ring: 'ring-amber-500/40', glow: 'shadow-amber-500/30' },
  { name: 'Blue', value: 'blue', color: 'bg-blue-500', ring: 'ring-blue-500/40', glow: 'shadow-blue-500/30' },
];

function Toggle({ enabled, onChange, label, description }: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-zinc-800/30 last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative h-7 w-12 rounded-full transition-all duration-300',
          enabled
            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
            : 'bg-zinc-700'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300',
            enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

function SectionCard({ icon: Icon, iconGradient, title, children }: {
  icon: React.ElementType;
  iconGradient: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br',
          iconGradient
        )}>
          <Icon className="h-4 w-4 text-white/80" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { data: prefs, loading } = useAsync<UserPreferences>(
    () => preferencesApi.get().then((r) => r.data),
    []
  );

  const [accentColor, setAccentColor] = useState('emerald');
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [showStreakAnimation, setShowStreakAnimation] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Google Calendar state
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarDisconnecting, setCalendarDisconnecting] = useState(false);

  // Push notifications
  const push = usePushNotifications();

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    in_app_enabled: true,
    email_enabled: true,
    push_enabled: true,
    social_enabled: true,
    roadmap_enabled: true,
    room_enabled: true,
    achievement_enabled: true,
    smart_enabled: true,
  });
  const [notifPrefsLoading, setNotifPrefsLoading] = useState(true);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (prefs) {
      setAccentColor(prefs.accent_color || 'emerald');
      setDashboardLayout(prefs.dashboard_layout || 'default');
      setShowStreakAnimation(prefs.show_streak_animation ?? true);
      setShowHeatmap(prefs.show_heatmap ?? true);
      setWeeklyGoal(prefs.weekly_goal || 5);
    }
  }, [prefs]);

  // Fetch Google Calendar connection status
  useEffect(() => {
    authApi.getCalendarStatus()
      .then(r => setCalendarConnected(r.data.connected))
      .catch(() => {})
      .finally(() => setCalendarLoading(false));

    // Check for callback params
    const params = new URLSearchParams(window.location.search);
    if (params.get('calendar') === 'connected') {
      setCalendarConnected(true);
      setCalendarLoading(false);
      window.history.replaceState({}, '', '/settings');
    }

    // Load notification preferences
    notificationsApi.getNotifPreferences()
      .then(r => {
        if (r.data.preferences) setNotifPrefs(prev => ({ ...prev, ...r.data.preferences }));
      })
      .catch(() => {})
      .finally(() => setNotifPrefsLoading(false));
  }, []);

  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess(false);
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters');
      return;
    }
    setPwSaving(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setPwError(e.response?.data?.error || e.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      await preferencesApi.update({
        accent_color: accentColor,
        dashboard_layout: dashboardLayout,
        show_streak_animation: showStreakAnimation,
        show_heatmap: showHeatmap,
        weekly_goal: weeklyGoal,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setSaveError(e.response?.data?.error || e.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <PageTransition>
          <div className="max-w-2xl space-y-6">
            <Skeleton className="h-10 w-48 rounded-xl" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </PageTransition>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageTransition>
      <div className="max-w-2xl space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-500/20 to-zinc-400/10 border border-zinc-700/30 glow-sm">
            <Settings className="h-6 w-6 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Settings</h1>
            <p className="mt-0.5 text-sm text-zinc-500">
              Customize your experience
            </p>
          </div>
        </div>

        {/* Accent Color */}
        <div className="animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
          <SectionCard icon={Palette} iconGradient="from-pink-500/30 to-purple-500/30" title="Accent Color">
            <div className="flex flex-wrap gap-3">
              {accentSwatches.map((swatch) => (
                <button
                  key={swatch.value}
                  onClick={() => setAccentColor(swatch.value)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl px-4 py-2.5 border transition-all duration-200',
                    accentColor === swatch.value
                      ? `border-zinc-600 bg-zinc-800/80 ring-2 ${swatch.ring} shadow-lg ${swatch.glow}`
                      : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-800/40'
                  )}
                >
                  <div className={cn(
                    'h-4 w-4 rounded-full transition-transform duration-200',
                    swatch.color,
                    accentColor === swatch.value && 'scale-110'
                  )} />
                  <span className={cn(
                    'text-sm transition-colors duration-200',
                    accentColor === swatch.value ? 'text-zinc-200 font-medium' : 'text-zinc-400'
                  )}>
                    {swatch.name}
                  </span>
                  {accentColor === swatch.value && (
                    <Check className="h-3.5 w-3.5 text-zinc-400 ml-0.5" />
                  )}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Dashboard Layout */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <SectionCard icon={LayoutGrid} iconGradient="from-blue-500/30 to-cyan-500/30" title="Dashboard Layout">
            <div className="flex gap-3">
              {['default', 'compact'].map((layout) => (
                <button
                  key={layout}
                  onClick={() => setDashboardLayout(layout)}
                  className={cn(
                    'flex-1 rounded-xl py-3.5 text-sm font-medium border transition-all duration-200 capitalize',
                    dashboardLayout === layout
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5'
                      : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/30'
                  )}
                >
                  {layout}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Toggles */}
        <div className="animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <SectionCard icon={Eye} iconGradient="from-amber-500/30 to-orange-500/30" title="Display Options">
            <Toggle
              label="Streak Animation"
              description="Show glow animation on active streaks"
              enabled={showStreakAnimation}
              onChange={setShowStreakAnimation}
            />
            <Toggle
              label="Contribution Heatmap"
              description="Show heatmap on dashboard"
              enabled={showHeatmap}
              onChange={setShowHeatmap}
            />
          </SectionCard>
        </div>

        {/* Weekly Goal */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <SectionCard icon={Target} iconGradient="from-emerald-500/30 to-cyan-500/30" title="Weekly Goal">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Problems per week</span>
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">{weeklyGoal}</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={weeklyGoal}
                onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-zinc-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-emerald-500/30 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-emerald-500/50"
              />
              <div className="flex justify-between text-xs text-zinc-600">
                <span>1</span>
                <span>15</span>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Google Calendar Integration */}
        <div className="animate-slide-up" style={{ animationDelay: '225ms', animationFillMode: 'both' }}>
          <SectionCard icon={CalendarDays} iconGradient="from-blue-500/30 to-indigo-500/30" title="Google Calendar">
            <p className="text-sm text-zinc-400 mb-4">
              Auto-add study sessions and war rooms to your Google Calendar when you start a roadmap or schedule a room.
            </p>
            {calendarLoading ? (
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
                Checking connection...
              </div>
            ) : calendarConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                  <span className="text-sm text-emerald-400 font-medium">Connected</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  loading={calendarDisconnecting}
                  onClick={async () => {
                    setCalendarDisconnecting(true);
                    try {
                      await authApi.disconnectCalendar();
                      setCalendarConnected(false);
                    } catch {}
                    setCalendarDisconnecting(false);
                  }}
                  className="gap-2 text-zinc-400 hover:text-red-400"
                >
                  <Unlink className="h-3.5 w-3.5" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                variant="gradient"
                onClick={async () => {
                  try {
                    const { data } = await authApi.getCalendarConnectUrl();
                    window.location.href = data.url;
                  } catch {
                    // fallback
                  }
                }}
                className="gap-2"
              >
                <Link2 className="h-4 w-4" />
                Connect Google Calendar
              </Button>
            )}
          </SectionCard>
        </div>

        {/* Notification Channels */}
        <div className="animate-slide-up" style={{ animationDelay: '235ms', animationFillMode: 'both' }}>
          <SectionCard icon={BellRing} iconGradient="from-amber-500/30 to-red-500/30" title="Notifications">
            {notifPrefsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-zinc-800/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {/* Channels */}
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Channels</p>
                <Toggle
                  label="In-App Notifications"
                  description="Show notifications in the bell menu"
                  enabled={notifPrefs.in_app_enabled}
                  onChange={(v) => {
                    setNotifPrefs(p => ({ ...p, in_app_enabled: v }));
                    notificationsApi.updateNotifPreferences({ in_app_enabled: v }).catch(() => {});
                  }}
                />
                <Toggle
                  label="Email Notifications"
                  description="Receive important notifications via email"
                  enabled={notifPrefs.email_enabled}
                  onChange={(v) => {
                    setNotifPrefs(p => ({ ...p, email_enabled: v }));
                    notificationsApi.updateNotifPreferences({ email_enabled: v }).catch(() => {});
                  }}
                />
                <div className="flex items-center justify-between py-3.5 border-b border-zinc-800/30">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Browser Push Notifications</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Get notified even when Streaksy isn&apos;t open</p>
                  </div>
                  {push.isSupported ? (
                    push.isSubscribed ? (
                      <button
                        onClick={async () => {
                          await push.unsubscribe();
                          notificationsApi.updateNotifPreferences({ push_enabled: false }).catch(() => {});
                          setNotifPrefs(p => ({ ...p, push_enabled: false }));
                        }}
                        className="relative h-7 w-12 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-300"
                      >
                        <span className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm translate-x-[22px] transition-all duration-300" />
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const ok = await push.subscribe();
                          if (ok) {
                            notificationsApi.updateNotifPreferences({ push_enabled: true }).catch(() => {});
                            setNotifPrefs(p => ({ ...p, push_enabled: true }));
                          }
                        }}
                        className="relative h-7 w-12 rounded-full bg-zinc-700 transition-all duration-300"
                      >
                        <span className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm translate-x-0.5 transition-all duration-300" />
                      </button>
                    )
                  ) : (
                    <span className="text-xs text-zinc-600">Not supported</span>
                  )}
                </div>

                {/* Categories */}
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-4 mb-2">Categories</p>
                <Toggle
                  label="Social"
                  description="Friend requests, pokes, group activity"
                  enabled={notifPrefs.social_enabled}
                  onChange={(v) => {
                    setNotifPrefs(p => ({ ...p, social_enabled: v }));
                    notificationsApi.updateNotifPreferences({ social_enabled: v }).catch(() => {});
                  }}
                />
                <Toggle
                  label="Roadmaps"
                  description="Progress updates, reminders, completions"
                  enabled={notifPrefs.roadmap_enabled}
                  onChange={(v) => {
                    setNotifPrefs(p => ({ ...p, roadmap_enabled: v }));
                    notificationsApi.updateNotifPreferences({ roadmap_enabled: v }).catch(() => {});
                  }}
                />
                <Toggle
                  label="War Rooms"
                  description="Room starts, solves, and endings"
                  enabled={notifPrefs.room_enabled}
                  onChange={(v) => {
                    setNotifPrefs(p => ({ ...p, room_enabled: v }));
                    notificationsApi.updateNotifPreferences({ room_enabled: v }).catch(() => {});
                  }}
                />
                <Toggle
                  label="Achievements"
                  description="Badges earned, streak milestones"
                  enabled={notifPrefs.achievement_enabled}
                  onChange={(v) => {
                    setNotifPrefs(p => ({ ...p, achievement_enabled: v }));
                    notificationsApi.updateNotifPreferences({ achievement_enabled: v }).catch(() => {});
                  }}
                />
                <Toggle
                  label="Smart Alerts"
                  description="Lagging behind, friend activity, streak at risk"
                  enabled={notifPrefs.smart_enabled}
                  onChange={(v) => {
                    setNotifPrefs(p => ({ ...p, smart_enabled: v }));
                    notificationsApi.updateNotifPreferences({ smart_enabled: v }).catch(() => {});
                  }}
                />
              </div>
            )}
          </SectionCard>
        </div>

        {/* LeetCode Extension */}
        <div className="animate-slide-up" style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
          <SectionCard icon={Puzzle} iconGradient="from-violet-500/30 to-purple-500/30" title="LeetCode Extension">
            <p className="text-sm text-zinc-400 mb-4">
              Our Chrome extension auto-captures your LeetCode submissions — code, runtime, memory, and time spent. No manual tracking needed.
            </p>
            <div className="flex items-center gap-3">
              <a href="/extension">
                <Button variant="gradient" className="gap-2">
                  <Puzzle className="h-4 w-4" />
                  Get Extension
                </Button>
              </a>
              <a
                href="/streaksy-extension.tar.gz"
                download
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Direct download (.tar.gz)
              </a>
            </div>
          </SectionCard>
        </div>

        {/* Change Password */}
        <div className="animate-slide-up" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
          <SectionCard icon={Lock} iconGradient="from-red-500/30 to-pink-500/30" title="Change Password">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              {pwError && (
                <p className="text-sm text-red-400">{pwError}</p>
              )}
              {pwSuccess && (
                <p className="text-sm text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  Password changed successfully
                </p>
              )}
              <div className="flex justify-end">
                <Button
                  variant="gradient"
                  loading={pwSaving}
                  onClick={handleChangePassword}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                  className="gap-2 rounded-xl"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Email Digest */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <DigestSection />
        </div>

        {/* Export Data */}
        <div className="animate-slide-up" style={{ animationDelay: '350ms', animationFillMode: 'both' }}>
          <SectionCard icon={Download} iconGradient="from-cyan-500/30 to-blue-500/30" title="Data Export">
            <p className="text-sm text-zinc-400 mb-4">
              Download all your Streaksy data including profile, progress, submissions, revisions, and streak history.
            </p>
            <Button variant="secondary" onClick={async () => {
              try {
                const { data } = await authApi.exportData();
                const blob = data instanceof Blob ? data : new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'streaksy-export.json';
                a.click();
                URL.revokeObjectURL(url);
              } catch {
                // error handled by interceptor
              }
            }}>
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
          </SectionCard>
        </div>

        {/* Save Button */}
        <div className="animate-slide-up sticky bottom-6 pt-2" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <div className="glass-strong rounded-2xl border border-zinc-800/50 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">
                {saved ? 'Preferences saved successfully.' : 'Save your changes to apply them.'}
              </p>
              {saveError && (
                <p className="text-sm text-red-400 mt-1">{saveError}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-400 animate-slide-up">
                  <Check className="h-4 w-4" />
                  Saved
                </span>
              )}
              <Button
                variant="gradient"
                size="lg"
                loading={saving}
                onClick={handleSave}
                className="gap-2 rounded-xl"
              >
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
      </PageTransition>
    </AppShell>
  );
}
