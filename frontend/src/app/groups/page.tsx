'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GroupCard } from '@/components/groups/GroupCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAsync } from '@/hooks/useAsync';
import { groupsApi } from '@/lib/api';
import { Users, Plus, LogIn } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Groups</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Collaborate with friends and track progress together.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowJoin(true)}>
              <LogIn className="mr-1.5 h-4 w-4" />
              Join
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create
            </Button>
          </div>
        </div>

        {/* Create / Join modals inline */}
        {showCreate && (
          <CreateGroupForm onDone={() => { setShowCreate(false); refetch(); }} onCancel={() => setShowCreate(false)} />
        )}
        {showJoin && (
          <JoinGroupForm onDone={() => { setShowJoin(false); refetch(); }} onCancel={() => setShowJoin(false)} />
        )}

        {/* Group list */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No groups yet"
            description="Create a group or join one with an invite code."
          />
        )}
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
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-300">Create a new group</h3>
        <Input id="group-name" label="Group Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input id="group-desc" label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" type="button" onClick={onCancel}>Cancel</Button>
          <Button size="sm" type="submit" loading={loading}>Create</Button>
        </div>
      </form>
    </Card>
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
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-300">Join a group</h3>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Input id="invite-code" label="Invite Code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. a1b2c3d4e5f6" required />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" type="button" onClick={onCancel}>Cancel</Button>
          <Button size="sm" type="submit" loading={loading}>Join</Button>
        </div>
      </form>
    </Card>
  );
}
