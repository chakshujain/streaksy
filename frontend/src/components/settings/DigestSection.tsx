'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock, Sun, Moon, BarChart3, Check } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { digestApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

export function DigestSection() {
  const { data: prefs } = useAsync(
    () => digestApi.getPreferences().then(r => r.data.preferences),
    []
  );

  const [digestEnabled, setDigestEnabled] = useState(true);
  const [digestTime, setDigestTime] = useState('08:00');
  const [digestFrequency, setDigestFrequency] = useState('daily');
  const [eveningReminder, setEveningReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefs) {
      setDigestEnabled(prefs.digest_enabled ?? true);
      setDigestTime(prefs.digest_time ?? '08:00');
      setDigestFrequency(prefs.digest_frequency ?? 'daily');
      setEveningReminder(prefs.evening_reminder ?? true);
      setWeeklyReport(prefs.weekly_report ?? true);
    }
  }, [prefs]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await digestApi.updatePreferences({
        digest_enabled: digestEnabled,
        digest_time: digestTime,
        digest_frequency: digestFrequency,
        evening_reminder: eveningReminder,
        weekly_report: weeklyReport,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error handled
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ enabled, onChange, label, description, icon: Icon }: {
    enabled: boolean; onChange: (v: boolean) => void; label: string; description?: string; icon: React.ElementType;
  }) => (
    <div className="flex items-center justify-between py-3.5 border-b border-zinc-800/30 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-zinc-500" />
        <div>
          <p className="text-sm font-medium text-zinc-200">{label}</p>
          {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative h-7 w-12 rounded-full transition-all duration-300',
          enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-zinc-700'
        )}
      >
        <span className={cn(
          'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300',
          enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  );

  return (
    <div className="glass rounded-2xl border border-zinc-800/50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30">
          <Mail className="h-4 w-4 text-white/80" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">Email Digest</h3>
      </div>

      <Toggle
        icon={Sun}
        label="Morning Digest"
        description="Daily summary with streak, stats, and friend activity"
        enabled={digestEnabled}
        onChange={setDigestEnabled}
      />

      {digestEnabled && (
        <div className="flex items-center gap-3 py-3.5 border-b border-zinc-800/30 pl-7">
          <Clock className="h-4 w-4 text-zinc-500" />
          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-400">Time:</label>
            <input
              type="time"
              value={digestTime}
              onChange={e => setDigestTime(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            />
            <select
              value={digestFrequency}
              onChange={e => setDigestFrequency(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-2 py-1 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="off">Off</option>
            </select>
          </div>
        </div>
      )}

      <Toggle
        icon={Moon}
        label="Evening Reminder"
        description="Remind me if I haven't solved anything by evening"
        enabled={eveningReminder}
        onChange={setEveningReminder}
      />

      <Toggle
        icon={BarChart3}
        label="Weekly Report"
        description="Detailed progress report every Monday"
        enabled={weeklyReport}
        onChange={setWeeklyReport}
      />

      <div className="flex justify-end mt-4">
        <Button variant="gradient" size="sm" loading={saving} onClick={handleSave} className="gap-2 rounded-xl">
          {saved ? <Check className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
          {saved ? 'Saved' : 'Save Digest Settings'}
        </Button>
      </div>
    </div>
  );
}
