'use client';

import { useState, useRef } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { PageTransition } from '@/components/ui/PageTransition';
import { useAsync } from '@/hooks/useAsync';
import { authApi, badgesApi } from '@/lib/api';
import { Camera, Save, Github, Linkedin, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { User as UserType, UserBadge } from '@/lib/types';

export default function ProfilePage() {
  const { data: profile, loading, refetch } = useAsync<UserType>(
    () => authApi.getProfile().then((r) => r.data.profile),
    []
  );
  const { data: myBadges } = useAsync<UserBadge[]>(
    () => badgesApi.mine().then((r) => r.data.badges),
    []
  );
  const { data: allBadges } = useAsync<{ id: string; name: string; description: string; icon: string; category: string }[]>(
    () => badgesApi.list().then((r) => r.data.badges),
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
        <PageTransition>
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-72 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
            </div>
          </div>
        </PageTransition>
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
      <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0ms', animationFillMode: 'both' }}>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/10 glow-sm">
            <User className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Profile</h1>
            <p className="mt-0.5 text-sm text-zinc-500">Manage your personal information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar + Badge Section */}
          <div className="animate-slide-up" style={{ animationDelay: '75ms', animationFillMode: 'both' }}>
            <Card className="flex flex-col items-center gap-4 py-8">
              <div className="relative group transition-transform duration-300 hover:scale-105">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full object-cover border-2 border-emerald-500/20 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/10"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-500/20 text-2xl font-bold text-emerald-400 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                    {initials}
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-zinc-100">{profile?.displayName}</p>
                <p className="text-sm text-zinc-500">{profile?.email}</p>
              </div>

              {/* Badges Grid — all badges, earned highlighted */}
              {allBadges && allBadges.length > 0 && (
                <div className="mt-4 w-full px-4">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
                    Badges ({myBadges?.length || 0}/{allBadges.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {allBadges.map((b) => {
                      const earned = myBadges?.some((mb) => mb.name === b.name);
                      return (
                        <div
                          key={b.id}
                          className={cn(
                            'flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all duration-200',
                            earned
                              ? 'border-emerald-500/30 bg-emerald-500/10 hover:scale-105'
                              : 'border-zinc-800 bg-zinc-900/30 opacity-40'
                          )}
                          title={b.description}
                        >
                          <span className="text-lg">{
                            b.icon === 'trophy' ? '🏆' :
                            b.icon === 'star' ? '⭐' :
                            b.icon === 'award' ? '🎖️' :
                            b.icon === 'crown' ? '👑' :
                            b.icon === 'flame' ? '🔥' :
                            b.icon === 'zap' ? '⚡' :
                            b.icon === 'target' ? '🎯' :
                            b.icon === 'shield' ? '🛡️' :
                            b.icon === 'users' ? '👥' :
                            b.icon === 'book-open' ? '📖' : '🏅'
                          }</span>
                          <span className={cn('text-[10px] font-medium leading-tight', earned ? 'text-zinc-200' : 'text-zinc-500')}>
                            {b.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Edit form */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
            <Card className="space-y-5">
              <h2 className="text-lg font-semibold text-zinc-200">Edit Profile</h2>

              {message && (
                <div className={`rounded-lg px-4 py-3 text-sm animate-fade-in ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                  {message}
                </div>
              )}

              <Input id="displayName" label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[80px] resize-none transition-all duration-200"
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
      </div>
      </PageTransition>
    </AppShell>
  );
}
