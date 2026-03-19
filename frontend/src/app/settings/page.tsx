'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { preferencesApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { Settings, Palette, LayoutGrid, Eye, Target, Check, Save } from 'lucide-react';
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

  useEffect(() => {
    if (prefs) {
      setAccentColor(prefs.accent_color || 'emerald');
      setDashboardLayout(prefs.dashboard_layout || 'default');
      setShowStreakAnimation(prefs.show_streak_animation ?? true);
      setShowHeatmap(prefs.show_heatmap ?? true);
      setWeeklyGoal(prefs.weekly_goal || 5);
    }
  }, [prefs]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
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
    } catch {
      // error handling
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-10 w-48" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl space-y-8 animate-slide-up">
        {/* Page Header */}
        <div className="flex items-center gap-4">
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
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
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
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
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
        <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
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
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
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

        {/* Save Button */}
        <div className="animate-slide-up sticky bottom-6 pt-2" style={{ animationDelay: '250ms' }}>
          <div className="glass-strong rounded-2xl border border-zinc-800/50 p-4 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              {saved ? 'Preferences saved successfully.' : 'Save your changes to apply them.'}
            </p>
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
    </AppShell>
  );
}
