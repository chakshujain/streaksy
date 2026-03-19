'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GroupCard } from '@/components/groups/GroupCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { groupsApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import { Users, Plus, LogIn, Sparkles, UserPlus, ArrowRight } from 'lucide-react';
import type { Group } from '@/lib/types';

export default function GroupsPage() {
  const { data: groups, loading, refetch } = useAsync<Group[]>(
    () => groupsApi.list().then((r) => r.data.groups),
    []
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <AppShell>
      <div className="space-y-6 animate-slide-up">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/10 glow-sm">
              <Users className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Groups</h1>
              <p className="mt-0.5 text-sm text-zinc-500">
                Collaborate with friends and track progress together
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setShowJoin(true); setShowCreate(false); }}
              className={cn(
                'gap-1.5 rounded-xl border border-zinc-700/50 transition-all duration-200',
                showJoin && 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400'
              )}
            >
              <LogIn className="h-4 w-4" />
              Join
            </Button>
            <Button
              size="sm"
              onClick={() => { setShowCreate(true); setShowJoin(false); }}
              className={cn(
                'gap-1.5 rounded-xl transition-all duration-200',
                showCreate && 'glow-sm'
              )}
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
        </div>

        {/* Create / Join modals inline */}
        {showCreate && (
          <div className="animate-slide-up">
            <CreateGroupForm onDone={() => { setShowCreate(false); refetch(); }} onCancel={() => setShowCreate(false)} />
          </div>
        )}
        {showJoin && (
          <div className="animate-slide-up">
            <JoinGroupForm onDone={() => { setShowJoin(false); refetch(); }} onCancel={() => setShowJoin(false)} />
          </div>
        )}

        {/* Group list */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : groups && groups.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {groups.map((group, i) => (
                <div
                  key={group.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(i + 1) * 50}ms` }}
                >
                  <GroupCard group={group} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl border border-zinc-800/50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/10">
                <Users className="h-8 w-8 text-purple-400/60" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-300 mb-1">No groups yet</h3>
              <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
                Create a group to collaborate with friends, or join one with an invite code.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowJoin(true)}
                  className="gap-1.5 rounded-xl"
                >
                  <LogIn className="h-4 w-4" />
                  Join a Group
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowCreate(true)}
                  className="gap-1.5 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function CreateGroupForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await groupsApi.create({ name, description: description || undefined });
      onDone();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl border border-emerald-500/10 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Create a new group</h3>
        </div>
        <Input id="group-name" label="Group Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input id="group-desc" label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
          <Button size="sm" type="submit" loading={loading} className="gap-1.5 rounded-xl">
            <Plus className="h-3.5 w-3.5" />
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}

function JoinGroupForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await groupsApi.join(code);
      onDone();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl border border-cyan-500/10 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
            <UserPlus className="h-4 w-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Join a group</h3>
        </div>
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
        <Input id="invite-code" label="Invite Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. a1b2c3d4e5f6" required />
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" size="sm" type="button" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
          <Button size="sm" type="submit" loading={loading} className="gap-1.5 rounded-xl">
            <ArrowRight className="h-3.5 w-3.5" />
            Join
          </Button>
        </div>
      </form>
    </div>
  );
}
