'use client';

import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GroupLeaderboard } from '@/components/groups/GroupLeaderboard';
import { MemberList } from '@/components/groups/MemberList';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { groupsApi, leaderboardApi, problemsApi, activityApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Copy, Check, Target, FileText, Calendar, Plus, X, BookOpen, LogOut, Trash2, Activity, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import type { Group, LeaderboardEntry, GroupSheet, Sheet } from '@/lib/types';

type SheetMemberProgress = { user_id: string; display_name: string; solved: number; total: number };

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const { user } = useAuthStore();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Plan editing state
  const [editingPlan, setEditingPlan] = useState(false);
  const [planForm, setPlanForm] = useState({ plan: '', objective: '', targetDate: '' });
  const [planSaving, setPlanSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  // Sheet assignment state
  const [showSheetSelector, setShowSheetSelector] = useState(false);
  const [assigningSheet, setAssigningSheet] = useState(false);

  // Sheet progress state
  const [sheetProgressMap, setSheetProgressMap] = useState<Record<string, SheetMemberProgress[]>>({});
  const [loadingProgress, setLoadingProgress] = useState<Record<string, boolean>>({});

  const toggleSheetProgress = async (sheetId: string) => {
    if (sheetProgressMap[sheetId]) {
      setSheetProgressMap((prev) => {
        const next = { ...prev };
        delete next[sheetId];
        return next;
      });
      return;
    }
    setLoadingProgress((prev) => ({ ...prev, [sheetId]: true }));
    try {
      const { data } = await groupsApi.getSheetProgress(groupId, sheetId);
      setSheetProgressMap((prev) => ({ ...prev, [sheetId]: data.progress }));
    } catch {
      // error handled by interceptor
    } finally {
      setLoadingProgress((prev) => ({ ...prev, [sheetId]: false }));
    }
  };

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

  const { data: activity } = useAsync<{ id: string; user_display_name: string; action: string; detail: string; created_at: string }[]>(
    () => group ? activityApi.getGroupActivity(group.id).then(r => r.data.activity ?? []) : Promise.resolve([]),
    [group?.id]
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
    setActionError('');
    try {
      await groupsApi.updatePlan(groupId, {
        plan: planForm.plan || undefined,
        objective: planForm.objective || undefined,
        targetDate: planForm.targetDate || undefined,
      });
      setEditingPlan(false);
      refetchGroup();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setActionError(e.response?.data?.error || 'Failed to save plan');
    } finally {
      setPlanSaving(false);
    }
  };

  const handleAssignSheet = async (sheetId: string) => {
    setAssigningSheet(true);
    setActionError('');
    try {
      await groupsApi.assignSheet(groupId, sheetId);
      setShowSheetSelector(false);
      refetchSheets();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setActionError(e.response?.data?.error || 'Failed to assign sheet');
    } finally {
      setAssigningSheet(false);
    }
  };

  const handleRemoveSheet = async (sheetId: string) => {
    if (!confirm('Remove this sheet from the group?')) return;
    setActionError('');
    try {
      await groupsApi.removeSheet(groupId, sheetId);
      refetchSheets();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setActionError(e.response?.data?.error || 'Failed to remove sheet');
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    setLeaving(true);
    setActionError('');
    try {
      await groupsApi.leave(groupId);
      router.push('/groups');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setActionError(e.response?.data?.error || 'Failed to leave group');
    } finally {
      setLeaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    setDeleting(true);
    try {
      await groupsApi.delete(groupId);
      router.push('/groups');
    } catch {
      // error handled by interceptor
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
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
          <div className="flex items-center gap-2">
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
            {!isAdmin && (
              <button
                onClick={handleLeaveGroup}
                disabled={leaving}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:border-red-800 transition-colors disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {leaving ? 'Leaving...' : 'Leave'}
              </button>
            )}
            {isAdmin && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteGroup}
                    disabled={deleting}
                    className="flex items-center gap-2 rounded-lg border border-red-700 bg-red-900/30 px-3 py-2 text-sm text-red-400 hover:bg-red-900/50 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:border-red-800 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              )
            )}
          </div>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-red-400">{actionError}</p>
            <button onClick={() => setActionError('')} className="text-red-400 hover:text-red-300 text-xs">Dismiss</button>
          </div>
        )}

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
                <div key={sheet.sheet_id} className="rounded-lg border border-zinc-800 bg-zinc-800/30">
                  <div className="flex items-center justify-between px-4 py-3">
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSheetProgress(sheet.sheet_id)}
                        disabled={loadingProgress[sheet.sheet_id]}
                        className="flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                        {loadingProgress[sheet.sheet_id] ? 'Loading...' : sheetProgressMap[sheet.sheet_id] ? 'Hide Progress' : 'View Progress'}
                      </button>
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
                  </div>
                  {sheetProgressMap[sheet.sheet_id] && (
                    <div className="border-t border-zinc-800/50 px-4 py-3 space-y-2.5">
                      {sheetProgressMap[sheet.sheet_id].map((member) => {
                        const pct = member.total > 0 ? Math.round((member.solved / member.total) * 100) : 0;
                        return (
                          <div key={member.user_id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-zinc-300 font-medium">{member.display_name}</span>
                              <span className="text-zinc-500">{member.solved}/{member.total} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-zinc-700 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {sheetProgressMap[sheet.sheet_id].length === 0 && (
                        <p className="text-xs text-zinc-600">No progress data available.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Activity Feed */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-zinc-100">Recent Activity</h2>
          </div>
          {activity && activity.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-2 border-b border-zinc-800/30 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300">
                      <span className="font-medium text-zinc-200">{item.user_display_name}</span>{' '}
                      {item.action}
                    </p>
                    {item.detail && (
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.detail}</p>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-600 shrink-0">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600">No recent activity in this group.</p>
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
                groupId={groupId}
              />
            )}
          </div>

          {/* Members (1 col) */}
          <div>
            {group.members ? (
              <MemberList members={group.members} groupId={groupId} />
            ) : (
              <Skeleton className="h-40" />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
