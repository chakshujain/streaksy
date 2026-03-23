'use client';

import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { GroupLeaderboard } from '@/components/groups/GroupLeaderboard';
import { MemberList } from '@/components/groups/MemberList';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { groupsApi, leaderboardApi, activityApi, roomsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Copy, Check, Target, FileText, Calendar, LogOut, Trash2, Activity, UserPlus, Share2, GraduationCap, ArrowRight, Users, Swords } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import type { Group, LeaderboardEntry } from '@/lib/types';
import type { UserRoadmap } from '@/lib/types';
import Link from 'next/link';
import { templatesBySlug } from '@/lib/roadmap-templates';
import { InviteFriendsModal } from '@/components/friends/InviteFriendsModal';

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
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Study plan state (from localStorage - active roadmaps for this group)
  const [groupRoadmaps, setGroupRoadmaps] = useState<UserRoadmap[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]') as UserRoadmap[];
      const filtered = stored.filter((r) => r.groupId === groupId);
      setGroupRoadmaps(filtered);
    } catch { /* empty */ }
  }, [groupId]);

  const { data: group, loading: groupLoading, refetch: refetchGroup } = useAsync<Group>(
    () => groupsApi.get(groupId).then((r) => r.data.group),
    [groupId]
  );

  const { data: leaderboard, loading: lbLoading } = useAsync<LeaderboardEntry[]>(
    () => leaderboardApi.getGroup(groupId).then((r) => r.data.leaderboard),
    [groupId]
  );

  const { data: activity } = useAsync<{ id: string; user_display_name: string; action: string; detail: string; created_at: string }[]>(
    () => group ? activityApi.getGroupActivity(group.id).then(r => r.data.activity ?? []) : Promise.resolve([]),
    [group?.id]
  );

  const { data: groupWarRooms, loading: roomsLoading } = useAsync<{ id: string; name: string; status: string; host_name?: string }[]>(
    () => group ? roomsApi.getByGroup(groupId).then(r => r.data.rooms || []) : Promise.resolve([]),
    [group?.id]
  );

  const isAdmin = group?.members?.some(
    (m) => m.user_id === user?.id && m.role === 'admin'
  );

  const copyInviteLink = () => {
    if (!group) return;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `${baseUrl}/invite/group/${group.invite_code}`;
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
              onClick={copyInviteLink}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Link Copied!' : 'Copy Invite Link'}
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

        {/* Invite Members Banner */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <UserPlus className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-300">Invite Members</h3>
                <p className="text-xs text-zinc-500">Share the link below to invite people to this group</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
              <div className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-400 font-mono truncate">
                {typeof window !== 'undefined' ? window.location.origin : ''}/invite/group/{group.invite_code}
              </div>
              <button
                onClick={copyInviteLink}
                className="shrink-0 flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                {copied ? (
                  <><Check className="h-4 w-4" /> Copied!</>
                ) : (
                  <><Share2 className="h-4 w-4" /> Copy Link</>
                )}
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="shrink-0 flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <Users className="h-4 w-4" /> Invite Friends
              </button>
            </div>
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

        {/* Group Roadmaps */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
              Group Roadmaps
            </h2>
          </div>
          {groupRoadmaps.length > 0 ? (
            <div className="space-y-4">
              {groupRoadmaps.map((rm) => {
                const pct = rm.durationDays > 0 ? Math.round((rm.completedDays / rm.durationDays) * 100) : 0;
                const template = rm.templateSlug ? templatesBySlug[rm.templateSlug] : null;
                const memberCount = group.members?.length || 0;
                return (
                  <div key={rm.id} className="space-y-3 rounded-lg border border-zinc-800/50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{rm.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-100">{rm.name}</p>
                          {template && (
                            <p className="text-xs text-zinc-500">{template.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-zinc-500">Day {rm.completedDays}/{rm.durationDays}</span>
                            <span className="text-xs text-zinc-500">{rm.durationDays} days total</span>
                            <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                              <Users className="h-3 w-3" /> {memberCount} members
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <Link
                      href={`/roadmaps/${rm.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
                    >
                      View Full Roadmap <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-zinc-800/30">
                <Link
                  href="/roadmaps"
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Start a New Roadmap <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="text-xs text-zinc-600 mt-1">Any member can start a roadmap for this group</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <GraduationCap className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-sm text-zinc-500 mb-3">No roadmaps for this group yet</p>
              <Link
                href="/roadmaps"
                className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Start a New Roadmap <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <p className="text-xs text-zinc-600 mt-2">Any member can start a roadmap for this group</p>
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

        {/* War Rooms */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Swords className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-zinc-300">War Rooms</h3>
            </div>
            <Link href="/rooms" className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1">
              All Rooms <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {roomsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : !groupWarRooms || groupWarRooms.length === 0 ? (
            <div className="text-center py-6">
              <Swords className="h-6 w-6 text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No war rooms yet</p>
              <Link href="/rooms" className="text-xs text-emerald-400 hover:text-emerald-300 mt-1 inline-block">
                Create one
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {groupWarRooms.slice(0, 5).map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 px-4 py-3 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      room.status === 'active' ? 'bg-green-400 animate-pulse' :
                      room.status === 'waiting' ? 'bg-amber-400' :
                      room.status === 'scheduled' ? 'bg-blue-400' : 'bg-zinc-600'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{room.name}</p>
                      <p className="text-[10px] text-zinc-500 capitalize">{room.status}{room.host_name ? ` · ${room.host_name}` : ''}</p>
                    </div>
                  </div>
                  {(room.status === 'active' || room.status === 'waiting') && (
                    <span className="text-xs font-medium text-emerald-400">Join</span>
                  )}
                </Link>
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
      <InviteFriendsModal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title={`Invite Friends to ${group?.name || 'Group'}`}
        excludeUserIds={group?.members?.map((m) => m.user_id) || []}
        onInvite={async (userIds) => {
          await groupsApi.inviteFriends(groupId, userIds);
        }}
      />
    </AppShell>
  );
}
