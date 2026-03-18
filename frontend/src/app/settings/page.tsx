'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { preferencesApi } from '@/lib/api';
import type { UserPreferences } from '@/lib/types';

const accentSwatches = [
  { name: 'Emerald', value: 'emerald', color: 'bg-emerald-500' },
  { name: 'Cyan', value: 'cyan', color: 'bg-cyan-500' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
  { name: 'Amber', value: 'amber', color: 'bg-amber-500' },
  { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
];

function Toggle({ enabled, onChange, label, description }: {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
          enabled ? 'bg-emerald-500' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
            enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
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
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl space-y-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Customize your experience ⚙️
          </p>
        </div>

        {/* Accent Color */}
        <Card variant="glass">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Accent Color 🎨</h3>
          <div className="flex flex-wrap gap-3">
            {accentSwatches.map((swatch) => (
              <button
                key={swatch.value}
                onClick={() => setAccentColor(swatch.value)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border transition-all duration-200 ${
                  accentColor === swatch.value
                    ? 'border-zinc-500 bg-zinc-800/80'
                    : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
                }`}
              >
                <div className={`h-4 w-4 rounded-full ${swatch.color}`} />
                <span className="text-sm text-zinc-300">{swatch.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Dashboard Layout */}
        <Card variant="glass">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Dashboard Layout 📐</h3>
          <div className="flex gap-3">
            {['default', 'compact'].map((layout) => (
              <button
                key={layout}
                onClick={() => setDashboardLayout(layout)}
                className={`flex-1 rounded-xl py-3 text-sm font-medium border transition-all duration-200 capitalize ${
                  dashboardLayout === layout
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                {layout}
              </button>
            ))}
          </div>
        </Card>

        {/* Toggles */}
        <Card variant="glass">
          <h3 className="text-sm font-semibold text-zinc-300 mb-2">Display Options 👁️</h3>
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
        </Card>

        {/* Weekly Goal */}
        <Card variant="glass">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Weekly Goal 🎯</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Problems per week</span>
              <span className="text-lg font-bold text-emerald-400">{weeklyGoal}</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Number(e.target.value))}
              className="w-full h-2 rounded-full bg-zinc-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>1</span>
              <span>15</span>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button variant="gradient" size="lg" loading={saving} onClick={handleSave}>
            Save Preferences
          </Button>
          {saved && (
            <span className="text-sm text-emerald-400 animate-slide-up">Saved!</span>
          )}
        </div>
      </div>
    </AppShell>
  );
}
