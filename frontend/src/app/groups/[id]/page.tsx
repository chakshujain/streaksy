'use client';

import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GroupLeaderboard } from '@/components/groups/GroupLeaderboard';
import { MemberList } from '@/components/groups/MemberList';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { groupsApi, leaderboardApi, problemsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Copy, Check, Target, FileText, Calendar, Plus, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import type { Group, LeaderboardEntry, GroupSheet, Sheet } from '@/lib/types';

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  // Plan editing state
  const [editingPlan, setEditingPlan] = useState(false);
  const [planForm, setPlanForm] = useState({ plan: '', objective: '', targetDate: '' });
  const [planSaving, setPlanSaving] = useState(false);

  // Sheet assignment state
  const [showSheetSelector, setShowSheetSelector] = useState(false);
  const [assigningSheet, setAssigningSheet] = useState(false);

  const { data: group, loading: groupLoading, refetch: refetchGroup } = useAsync<Group>(
    () => groupsApi.get(groupId).then((r) => r.data.group),
    [groupId]
  );

  const { data: leaderboard, loading: lbLoading } = useAsync<LeaderboardEntry[]>(
    () => leaderboardApi.getGroup(groupId).then((r) => r.data.leaderboard),
    [groupId]
  );

  const { data: groupSheets, loading: sheetsLoading, refetch: refetchSheets } = useAsync<GroupSheet[]>(
    () => groupsApi.getSheets(groupId).then((r) => r.data.sheets),
    [groupId]
  );

  const { data: allSheets } = useAsync<Sheet[]>(
    () => problemsApi.getSheets().then((r) => r.data.sheets || r.data),
    []
  );

  const isAdmin = group?.members?.some(
    (m) => m.user_id === user?.id && m.role === 'admin'
  );

  const copyCode = () => {
    if (!group) return;
    const text = group.invite_code;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startEditPlan = () => {
    setPlanForm({
      plan: group?.plan || '',
      objective: group?.objective || '',
      targetDate: group?.target_date ? group.target_date.split('T')[0] : '',
    });
    setEditingPlan(true);
  };

  const savePlan = async () => {
    setPlanSaving(true);
    try {
      await groupsApi.updatePlan(groupId, {
        plan: planForm.plan || undefined,
        objective: planForm.objective || undefined,
        targetDate: planForm.targetDate || undefined,
      });
      setEditingPlan(false);
      refetchGroup();
    } catch {
      // error handled by interceptor
    } finally {
      setPlanSaving(false);
    }
  };

  const handleAssignSheet = async (sheetId: string) => {
    setAssigningSheet(true);
    try {
      await groupsApi.assignSheet(groupId, sheetId);
      setShowSheetSelector(false);
      refetchSheets();
    } catch {
      // error handled by interceptor
    } finally {
      setAssigningSheet(false);
    }
  };

  const handleRemoveSheet = async (sheetId: string) => {
    try {
      await groupsApi.removeSheet(groupId, sheetId);
      refetchSheets();
    } catch {
      // error handled by interceptor
    }
  };

  // Sheets not yet assigned to this group
  const availableSheets = (allSheets || []).filter(
    (s) => !(groupSheets || []).some((gs) => gs.sheet_id === s.id)
  );

  if (groupLoading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64" />
        </div>
      </AppShell>
    );
  }

  if (!group) {
    return (
      <AppShell>
        <p className="text-zinc-500">Group not found.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{group.name}</h1>
            {group.description && (
              <p className="mt-1 text-sm text-zinc-500">{group.description}</p>
            )}
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            Invite: {group.invite_code}
          </button>
        </div>

        {/* Plan & Objective */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-400" />
              Plan &amp; Objective
            </h2>
            {isAdmin && !editingPlan && (
              <button
                onClick={startEditPlan}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {editingPlan ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Objective</label>
                <input
                  type="text"
                  value={planForm.objective}
                  onChange={(e) => setPlanForm({ ...planForm, objective: e.target.value })}
                  placeholder="e.g., Complete Blind 75 by end of month"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Target Date</label>
                <input
                  type="date"
                  value={planForm.targetDate}
                  onChange={(e) => setPlanForm({ ...planForm, targetDate: e.target.value })}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Plan Details</label>
                <textarea
                  value={planForm.plan}
                  onChange={(e) => setPlanForm({ ...planForm, plan: e.target.value })}
                  placeholder="Describe the study plan, milestones, schedule..."
                  rows={4}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  maxLength={2000}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingPlan(false)}
                  className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePlan}
                  disabled={planSaving}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors disabled:opacity-50"
                >
                  {planSaving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {group.objective ? (
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 mt-0.5 text-zinc-500" />
                  <div>
                    <p className="text-sm font-medium text-zinc-300">{group.objective}</p>
                    {group.target_date && (
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Target: {new Date(group.target_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-600">
                  {isAdmin ? 'No objective set yet. Click Edit to add one.' : 'No objective set for this group.'}
                </p>
              )}
              {group.plan && (
                <div className="mt-3 rounded-lg bg-zinc-800/50 p-4">
                  <p className="text-sm text-zinc-400 whitespace-pre-wrap">{group.plan}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Assigned Sheets */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              Assigned Sheets
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowSheetSelector(!showSheetSelector)}
                className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Assign Sheet
              </button>
            )}
          </div>

          {/* Sheet Selector Dropdown */}
          {showSheetSelector && (
            <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800/80 p-3">
              <p className="text-xs font-medium text-zinc-400 mb-2">Select a sheet to assign:</p>
              {availableSheets.length === 0 ? (
                <p className="text-xs text-zinc-600">No more sheets available to assign.</p>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {availableSheets.map((sheet) => (
                    <button
                      key={sheet.id}
                      onClick={() => handleAssignSheet(sheet.id)}
                      disabled={assigningSheet}
                      className="w-full text-left rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50 transition-colors disabled:opacity-50"
                    >
                      {sheet.name}
                      {sheet.description && (
                        <span className="ml-2 text-xs text-zinc-500">{sheet.description}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sheet List */}
          {sheetsLoading ? (
            <Skeleton className="h-20" />
          ) : !groupSheets || groupSheets.length === 0 ? (
            <p className="text-sm text-zinc-600">
              {isAdmin ? 'No sheets assigned yet. Click "Assign Sheet" to add one.' : 'No sheets assigned to this group yet.'}
            </p>
          ) : (
            <div className="space-y-2">
              {groupSheets.map((sheet) => (
                <div
                  key={sheet.sheet_id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/30 px-4 py-3"
                >
                  <div>
                    <a
                      href={`/problems?sheet=${sheet.slug}`}
                      className="text-sm font-medium text-zinc-200 hover:text-emerald-400 transition-colors"
                    >
                      {sheet.name}
                    </a>
                    {sheet.description && (
                      <p className="text-xs text-zinc-500 mt-0.5">{sheet.description}</p>
                    )}
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Assigned {new Date(sheet.assigned_at).toLocaleDateString()}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveSheet(sheet.sheet_id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                      title="Remove sheet"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Leaderboard (2 cols) */}
          <div className="lg:col-span-2">
            {lbLoading ? (
              <Skeleton className="h-80" />
            ) : (
              <GroupLeaderboard
                entries={leaderboard || []}
                currentUserId={user?.id}
              />
            )}
          </div>

          {/* Members (1 col) */}
          <div>
            {group.members ? (
              <MemberList members={group.members} />
            ) : (
              <Skeleton className="h-40" />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
