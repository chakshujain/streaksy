'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  ChevronLeft,
  ChevronRight,
  Rocket,
  Sparkles,
  Users,
  Plus,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import {
  type Role,
  type Level,
  type StudyMode,
  type FocusTopic,
  type PrepAnswers,
  roleOptions,
  levelOptions,
  focusTopicOptions,
  savePrepAnswers,
  saveRoadmap,
  generateRoadmap,
} from '@/lib/interview-planner';
import { groupsApi } from '@/lib/api';

type GroupAction = 'create' | 'existing' | 'join';

interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
}

const TOTAL_STEPS = 6;

export default function PreparePage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [totalDays, setTotalDays] = useState(30);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [level, setLevel] = useState<Level | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode | null>(null);
  const [focusTopics, setFocusTopics] = useState<FocusTopic[]>(['dsa']);
  const [isGenerating, setIsGenerating] = useState(false);

  // Group-related state
  const [groupAction, setGroupAction] = useState<GroupAction | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [existingGroups, setExistingGroups] = useState<GroupInfo[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Fetch groups when "existing" is selected
  useEffect(() => {
    if (groupAction === 'existing') {
      setLoadingGroups(true);
      groupsApi
        .list()
        .then(({ data }) => {
          const groups = (data.groups || data || []) as GroupInfo[];
          setExistingGroups(groups);
        })
        .catch(() => setExistingGroups([]))
        .finally(() => setLoadingGroups(false));
    }
  }, [groupAction]);

  const canNext = useCallback(() => {
    switch (step) {
      case 1:
        return role !== null;
      case 2:
        return totalDays >= 7 && totalDays <= 180;
      case 3:
        return hoursPerDay >= 1;
      case 4:
        return level !== null;
      case 5: {
        if (studyMode === 'solo') return true;
        if (studyMode === 'group') {
          if (groupAction === 'create') return newGroupName.trim().length > 0;
          if (groupAction === 'existing') return groupId !== null;
          if (groupAction === 'join') return inviteCode.trim().length > 0;
          return false;
        }
        return false;
      }
      case 6:
        return focusTopics.length > 0;
      default:
        return false;
    }
  }, [step, role, totalDays, hoursPerDay, level, studyMode, focusTopics, groupAction, newGroupName, groupId, inviteCode]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleFocusTopic = (t: FocusTopic) => {
    setFocusTopics(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t],
    );
  };

  const handleGenerate = async () => {
    if (!role || !level || !studyMode) return;
    setIsGenerating(true);

    await new Promise(r => setTimeout(r, 800));

    const answers: PrepAnswers = {
      role,
      totalDays,
      hoursPerDay,
      level,
      studyMode,
      focusTopics,
    };

    // Handle group actions
    let resolvedGroupId = groupId;

    if (studyMode === 'group' && groupAction === 'create' && newGroupName.trim()) {
      try {
        const { data } = await groupsApi.create({
          name: newGroupName.trim(),
          description: newGroupDesc.trim() || undefined,
        });
        resolvedGroupId = data.group?.id || data.id;
      } catch {
        // Continue without group
      }
    }

    if (studyMode === 'group' && groupAction === 'join' && inviteCode.trim()) {
      try {
        const { data } = await groupsApi.join(inviteCode.trim());
        resolvedGroupId = data.group?.id || data.id;
      } catch {
        // Continue without group
      }
    }

    // Store group info in localStorage for roadmap page
    if (resolvedGroupId) {
      localStorage.setItem('streaksy_prep_group_id', resolvedGroupId);
      localStorage.setItem('streaksy_prep_group_action', groupAction || '');
    } else {
      localStorage.removeItem('streaksy_prep_group_id');
      localStorage.removeItem('streaksy_prep_group_action');
    }

    savePrepAnswers(answers);
    const roadmap = generateRoadmap(answers);
    saveRoadmap(roadmap);

    router.push('/prepare/roadmap');
  };

  const hourOptions = [1, 2, 3, 4, 5];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto flex flex-col">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Rocket className="h-6 w-6 text-emerald-400" />
              Prepare for Interview
            </h1>
            <span className="text-sm text-zinc-500">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 px-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 w-2 rounded-full transition-all duration-300',
                  i + 1 <= step
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                    : 'bg-zinc-700',
                )}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1">
          {/* Step 1: Role */}
          {step === 1 && (
            <StepContainer
              title="What role are you preparing for?"
              subtitle="This helps us prioritize the right topics for your interview."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleOptions.map(opt => (
                  <SelectionCard
                    key={opt.value}
                    selected={role === opt.value}
                    onClick={() => setRole(opt.value)}
                    icon={opt.icon}
                    label={opt.label}
                    desc={opt.desc}
                  />
                ))}
              </div>
            </StepContainer>
          )}

          {/* Step 2: Days */}
          {step === 2 && (
            <StepContainer
              title="How many days do you have?"
              subtitle="We'll spread your study plan across this timeline."
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center">
                  <span className="text-6xl font-bold gradient-text">
                    {totalDays}
                  </span>
                  <span className="text-xl text-zinc-500 ml-2">days</span>
                </div>
                <input
                  type="range"
                  min={7}
                  max={180}
                  value={totalDays}
                  onChange={e => setTotalDays(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-800 accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.5)] [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>1 week</span>
                  <span>1 month</span>
                  <span>3 months</span>
                  <span>6 months</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  {[7, 14, 30, 60, 90, 120, 180].map(d => (
                    <button
                      key={d}
                      onClick={() => setTotalDays(d)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                        totalDays === d
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/50 hover:border-zinc-600',
                      )}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </StepContainer>
          )}

          {/* Step 3: Hours per day */}
          {step === 3 && (
            <StepContainer
              title="How many hours per day?"
              subtitle="Be realistic — consistency beats intensity."
            >
              <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
                {hourOptions.map(h => (
                  <button
                    key={h}
                    onClick={() => setHoursPerDay(h)}
                    className={cn(
                      'relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl border transition-all duration-300',
                      hoursPerDay === h
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_-4px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/60',
                    )}
                  >
                    <span className="text-2xl font-bold">
                      {h}
                      {h === 5 ? '+' : ''}
                    </span>
                    <span className="text-xs mt-1 text-zinc-500">
                      {h === 1 ? 'hour' : 'hours'}/day
                    </span>
                    {hoursPerDay === h && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-zinc-600 mt-6">
                Total study time:{' '}
                <span className="text-zinc-400 font-medium">
                  {totalDays * hoursPerDay} hours
                </span>{' '}
                over{' '}
                <span className="text-zinc-400 font-medium">
                  {totalDays} days
                </span>
              </p>
            </StepContainer>
          )}

          {/* Step 4: Level */}
          {step === 4 && (
            <StepContainer
              title="What's your current level?"
              subtitle="We'll adjust the starting point and difficulty curve."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {levelOptions.map(opt => (
                  <SelectionCard
                    key={opt.value}
                    selected={level === opt.value}
                    onClick={() => setLevel(opt.value)}
                    icon={opt.icon}
                    label={opt.label}
                    desc={opt.desc}
                  />
                ))}
              </div>
            </StepContainer>
          )}

          {/* Step 5: Solo or Group */}
          {step === 5 && (
            <StepContainer
              title="Study alone or with a group?"
              subtitle="Accountability partners can boost your consistency."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                <SelectionCard
                  selected={studyMode === 'solo'}
                  onClick={() => {
                    setStudyMode('solo');
                    setGroupAction(null);
                    setGroupId(null);
                  }}
                  icon="🎯"
                  label="Solo"
                  desc="I'll follow the plan myself"
                  large
                />
                <SelectionCard
                  selected={studyMode === 'group'}
                  onClick={() => setStudyMode('group')}
                  icon="👥"
                  label="With Friends"
                  desc="Create or join a study group"
                  large
                />
              </div>

              {/* Group sub-panel */}
              {studyMode === 'group' && (
                <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        setGroupAction('create');
                        setGroupId(null);
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-3 text-left transition-all duration-200',
                        groupAction === 'create'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600',
                      )}
                    >
                      <Plus className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">Create new group</span>
                    </button>
                    <button
                      onClick={() => {
                        setGroupAction('existing');
                        setGroupId(null);
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-3 text-left transition-all duration-200',
                        groupAction === 'existing'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600',
                      )}
                    >
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">Use existing</span>
                    </button>
                    <button
                      onClick={() => {
                        setGroupAction('join');
                        setGroupId(null);
                      }}
                      className={cn(
                        'flex items-center gap-2 rounded-xl border p-3 text-left transition-all duration-200',
                        groupAction === 'join'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600',
                      )}
                    >
                      <LinkIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">Join with code</span>
                    </button>
                  </div>

                  {/* Create new group form */}
                  {groupAction === 'create' && (
                    <Card className="animate-in fade-in duration-200 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-zinc-400 mb-1 block">
                          Group Name
                        </label>
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={e => setNewGroupName(e.target.value)}
                          placeholder="e.g. Interview Prep Squad"
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-emerald-500/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-zinc-400 mb-1 block">
                          Description{' '}
                          <span className="text-zinc-600">(optional)</span>
                        </label>
                        <textarea
                          value={newGroupDesc}
                          onChange={e => setNewGroupDesc(e.target.value)}
                          placeholder="What's the group about?"
                          rows={2}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-emerald-500/50 transition-colors resize-none"
                        />
                      </div>
                    </Card>
                  )}

                  {/* Existing groups */}
                  {groupAction === 'existing' && (
                    <Card className="animate-in fade-in duration-200">
                      {loadingGroups ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                        </div>
                      ) : existingGroups.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center py-4">
                          No groups found. Create one instead!
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {existingGroups.map(g => (
                            <button
                              key={g.id}
                              onClick={() => setGroupId(g.id)}
                              className={cn(
                                'w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200',
                                groupId === g.id
                                  ? 'bg-emerald-500/10 border-emerald-500/40'
                                  : 'border-zinc-800 hover:border-zinc-600',
                              )}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-sm">
                                <Users className="h-4 w-4 text-zinc-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    'text-sm font-medium truncate',
                                    groupId === g.id
                                      ? 'text-emerald-400'
                                      : 'text-zinc-200',
                                  )}
                                >
                                  {g.name}
                                </p>
                                {g.description && (
                                  <p className="text-xs text-zinc-500 truncate">
                                    {g.description}
                                  </p>
                                )}
                              </div>
                              {groupId === g.id && (
                                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Join with invite code */}
                  {groupAction === 'join' && (
                    <Card className="animate-in fade-in duration-200">
                      <label className="text-xs font-medium text-zinc-400 mb-1 block">
                        Invite Code
                      </label>
                      <input
                        type="text"
                        value={inviteCode}
                        onChange={e => setInviteCode(e.target.value)}
                        placeholder="Paste your invite code here"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </Card>
                  )}
                </div>
              )}
            </StepContainer>
          )}

          {/* Step 6: Focus Topics */}
          {step === 6 && (
            <StepContainer
              title="Which topics do you want to focus on?"
              subtitle="Select all that apply. DSA is recommended for everyone."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                {focusTopicOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => toggleFocusTopic(opt.value)}
                    className={cn(
                      'relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-300',
                      focusTopics.includes(opt.value)
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_-4px_rgba(16,185,129,0.3)]'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-all duration-200',
                        focusTopics.includes(opt.value)
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-zinc-600 bg-zinc-800',
                      )}
                    >
                      {focusTopics.includes(opt.value) && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <p
                        className={cn(
                          'font-medium text-sm',
                          focusTopics.includes(opt.value)
                            ? 'text-emerald-400'
                            : 'text-zinc-300',
                        )}
                      >
                        {opt.label}
                      </p>
                      {opt.value === 'dsa' && (
                        <span className="text-[10px] uppercase tracking-wider text-emerald-500/80 font-semibold">
                          Recommended
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </StepContainer>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800/40">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            variant="gradient"
            size="lg"
            onClick={handleNext}
            disabled={!canNext() || isGenerating}
            loading={isGenerating}
            className="gap-2 min-w-[160px]"
          >
            {step === TOTAL_STEPS ? (
              <>
                <Sparkles className="h-4 w-4" />
                Generate My Plan
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

// -- Reusable sub-components -------------------------------------------------

function StepContainer({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
        <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function SelectionCard({
  selected,
  onClick,
  icon,
  label,
  desc,
  large,
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  desc: string;
  large?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-start gap-3 rounded-2xl border text-left transition-all duration-300',
        large ? 'p-6' : 'p-4',
        selected
          ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_-4px_rgba(16,185,129,0.3)]'
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60',
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      )}
      <span className={cn('flex-shrink-0', large ? 'text-3xl' : 'text-2xl')}>
        {icon}
      </span>
      <div>
        <p
          className={cn(
            'font-medium',
            large ? 'text-base' : 'text-sm',
            selected ? 'text-emerald-400' : 'text-zinc-200',
          )}
        >
          {label}
        </p>
        <p className={cn('text-zinc-500 mt-0.5', large ? 'text-sm' : 'text-xs')}>
          {desc}
        </p>
      </div>
    </button>
  );
}
