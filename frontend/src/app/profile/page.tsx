'use client';

import { useState, useRef } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAsync } from '@/hooks/useAsync';
import { authApi, badgesApi } from '@/lib/api';
import { Camera, Save, Github, Linkedin, MapPin } from 'lucide-react';
import type { User, UserBadge } from '@/lib/types';

export default function ProfilePage() {
  const { data: profile, loading, refetch } = useAsync<User>(
    () => authApi.getProfile().then((r) => r.data.profile),
    []
  );
  const { data: badges } = useAsync<UserBadge[]>(
    () => badgesApi.mine().then((r) => r.data.badges),
    []
  );

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [initialized, setInitialized] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (profile && !initialized) {
    setDisplayName(profile.displayName || '');
    setBio(profile.bio || '');
    setLocation(profile.location || '');
    setGithubUrl(profile.githubUrl || '');
    setLinkedinUrl(profile.linkedinUrl || '');
    setInitialized(true);
  }

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await authApi.updateProfile({ displayName, bio, location, githubUrl, linkedinUrl });
      setMessage('Profile updated!');
      refetch();
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await authApi.uploadAvatar(file);
      refetch();
    } catch {
      setMessage('Failed to upload avatar');
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64" />
        </div>
      </AppShell>
    );
  }

  const initials = profile?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  return (
    <AppShell>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-zinc-100">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar + Badge Section */}
          <Card className="flex flex-col items-center gap-4 py-8">
            <div className="relative group">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover border-2 border-emerald-500/20"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/20 text-2xl font-bold text-emerald-400">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-zinc-100">{profile?.displayName}</p>
              <p className="text-sm text-zinc-500">{profile?.email}</p>
            </div>

            {/* Badges */}
            {badges && badges.length > 0 && (
              <div className="mt-4 w-full px-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Badges</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {badges.map((b) => (
                    <div
                      key={b.badge_id}
                      className="flex items-center gap-1.5 rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1"
                      title={b.description}
                    >
                      <span className="text-xs text-zinc-300">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Edit form */}
          <Card className="lg:col-span-2 space-y-5">
            <h2 className="text-lg font-semibold text-zinc-200">Edit Profile</h2>

            {message && (
              <div className={`rounded-lg px-4 py-3 text-sm ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                {message}
              </div>
            )}

            <Input id="displayName" label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px] resize-none"
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
              <Input id="location" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="pl-10" />
            </div>

            <div className="relative">
              <Github className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
              <Input id="github" label="GitHub URL" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username" className="pl-10" />
            </div>

            <div className="relative">
              <Linkedin className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-zinc-500" />
              <Input id="linkedin" label="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/username" className="pl-10" />
            </div>

            <Button onClick={handleSave} loading={saving} className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
