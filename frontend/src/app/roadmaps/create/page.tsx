'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Users,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { roadmapsApi } from '@/lib/api';

const categoryOptions = [
  { value: 'Coding & Tech', label: 'Coding & Tech', icon: '\u{1F4BB}', color: 'emerald' },
  { value: 'Fitness & Health', label: 'Fitness & Health', icon: '\u{1F4AA}', color: 'blue' },
  { value: 'Learning & Reading', label: 'Learning & Reading', icon: '\u{1F4D6}', color: 'amber' },
  { value: 'Custom', label: 'Custom', icon: '\u2728', color: 'purple' },
];

interface DayTask {
  day: number;
  title: string;
  link?: string;
}

export default function CreateRoadmapPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  // Step 2
  const [days, setDays] = useState(30);

  // Step 3
  const [taskMode, setTaskMode] = useState<'same' | 'daily'>('same');
  const [sameTask, setSameTask] = useState('');
  const [dailyTasks, setDailyTasks] = useState<DayTask[]>([]);

  // Step 4
  const [mode, setMode] = useState<'solo' | 'friends'>('solo');
  const [groupName, setGroupName] = useState('');

  const [loading, setLoading] = useState(false);

  const canNext = () => {
    if (step === 1) return name.trim().length > 0 && category.length > 0;
    if (step === 2) return days >= 7 && days <= 365;
    if (step === 3) return taskMode === 'same' ? sameTask.trim().length > 0 : dailyTasks.length > 0;
    return true;
  };

  const addDailyTask = () => {
    setDailyTasks((prev) => [...prev, { day: prev.length + 1, title: '', link: '' }]);
  };

  const updateDailyTask = (index: number, field: 'title' | 'link', value: string) => {
    setDailyTasks((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const removeDailyTask = (index: number) => {
    setDailyTasks((prev) => prev.filter((_, i) => i !== index).map((t, i) => ({ ...t, day: i + 1 })));
  };

  const handleCreate = async () => {
    if (loading) return;
    if (!name.trim()) return;
    setLoading(true);

    try {
      await roadmapsApi.create({
        name: name.trim(),
        durationDays: days,
        startDate: new Date().toISOString().split('T')[0],
        categoryId: category,
        groupId: mode === 'friends' ? `grp_${Date.now()}` : undefined,
      });
      router.push('/roadmaps');
    } catch {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageTransition>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Back */}
          <Link href="/roadmaps" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmaps
          </Link>

          {/* Progress */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">Create Custom Roadmap</h1>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-emerald-500' : 'bg-zinc-800'} transition-colors`} />
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-2">Step {step} of 4</p>
          </div>

          {/* Step 1: Name & Category */}
          {step === 1 && (
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">Name your roadmap</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Roadmap Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Master React in 30 Days"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Category</label>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                          category === cat.value
                            ? 'border-emerald-500/40 bg-emerald-500/5 text-white'
                            : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Duration */}
          {step === 2 && (
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">How many days?</h2>
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-emerald-400">{days}</span>
                  <span className="text-lg text-zinc-400 ml-2">days</span>
                </div>
                <input
                  type="range"
                  min={7}
                  max={365}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>7 days</span>
                  <span>365 days</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[7, 14, 21, 30, 60, 90, 100, 365].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        days === d
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Tasks */}
          {step === 3 && (
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">Add tasks</h2>
              <div className="space-y-5">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTaskMode('same')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      taskMode === 'same'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    Same task every day
                  </button>
                  <button
                    onClick={() => setTaskMode('daily')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      taskMode === 'daily'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800/50 text-zinc-400 border border-zinc-800'
                    }`}
                  >
                    Day-by-day
                  </button>
                </div>

                {taskMode === 'same' ? (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Daily task</label>
                    <input
                      type="text"
                      placeholder='e.g., "Go to gym" or "Read for 30 minutes"'
                      value={sameTask}
                      onChange={(e) => setSameTask(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <p className="text-xs text-zinc-500 mt-2">This task will repeat for all {days} days.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyTasks.map((task, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="flex-shrink-0 mt-2.5 text-xs text-zinc-500 w-8">D{task.day}</span>
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            placeholder="Task title"
                            value={task.title}
                            onChange={(e) => updateDailyTask(index, 'title', e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Link (optional)"
                            value={task.link}
                            onChange={(e) => updateDailyTask(index, 'link', e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => removeDailyTask(index)}
                          className="flex-shrink-0 mt-2 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addDailyTask}
                      className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add task
                    </button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Step 4: Solo or Group */}
          {step === 4 && (
            <Card>
              <h2 className="text-lg font-semibold text-white mb-6">Solo or with friends?</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('solo')}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      mode === 'solo'
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <div className="text-left">
                      <p className="text-sm font-medium">Solo</p>
                      <p className="text-[11px] text-zinc-500">Just me</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode('friends')}
                    className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                      mode === 'friends'
                        ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-800/30 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <div className="text-left">
                      <p className="text-sm font-medium">With Friends</p>
                      <p className="text-[11px] text-zinc-500">Study together</p>
                    </div>
                  </button>
                </div>

                {mode === 'friends' && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Group Name</label>
                    <input
                      type="text"
                      placeholder="Name your study group"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div className="flex-1" />
            {step < 4 ? (
              <Button
                variant="primary"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleCreate}
                loading={loading}
              >
                Create Roadmap
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
