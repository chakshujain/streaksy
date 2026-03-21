'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  Map,
  Clock,
  Users,
  AlertCircle,
  Loader2,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';

import { prepApi, roadmapsApi } from '@/lib/api';
import { templatesBySlug } from '@/lib/roadmap-templates';
import { useAuthStore } from '@/lib/store';
import type { UserRoadmap } from '@/lib/types';

interface SharedRoadmap {
  id?: string;
  name: string;
  templateSlug?: string;
  icon: string;
  category: string;
  durationDays: number;
  description?: string;
  creatorName?: string;
}

export default function JoinRoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const { user } = useAuthStore();

  const [roadmapData, setRoadmapData] = useState<SharedRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRoadmap() {
      setLoading(true);
      setError('');

      try {
        // Try fetching from prep API first (share codes)
        const { data } = await prepApi.getByShareCode(code);
        const rm = data.roadmap || data.prep || data;
        setRoadmapData({
          id: rm.id,
          name: rm.name || rm.title || 'Shared Roadmap',
          templateSlug: rm.templateSlug || rm.template_slug,
          icon: rm.icon || '\u{1F680}',
          category: rm.category || 'General',
          durationDays: rm.durationDays || rm.duration_days || rm.totalDays || rm.total_days || 30,
          description: rm.description,
          creatorName: rm.creatorName || rm.creator_name || rm.display_name,
        });
      } catch {
        // Try to decode the code as a template-based share
        // Check localStorage for matching share codes
        try {
          const stored = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]') as UserRoadmap[];
          const found = stored.find((r) => r.shareCode === code);
          if (found) {
            const template = found.templateSlug ? templatesBySlug[found.templateSlug] : null;
            setRoadmapData({
              id: found.id,
              name: found.name,
              templateSlug: found.templateSlug,
              icon: found.icon,
              category: found.category,
              durationDays: found.durationDays,
              description: template?.description,
            });
          } else {
            setError('This roadmap link is invalid or has expired.');
          }
        } catch {
          setError('This roadmap link is invalid or has expired.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, [code]);

  const handleJoin = async () => {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/auth/login?redirect=/roadmaps/join/${code}`);
      return;
    }

    setJoining(true);
    setError('');

    try {
      // Create a copy of the roadmap for this user via backend
      const createPayload = {
        templateSlug: roadmapData?.templateSlug || undefined,
        name: roadmapData?.name || 'Joined Roadmap',
        category: roadmapData?.category || 'General',
        icon: roadmapData?.icon || '\u{1F680}',
        durationDays: roadmapData?.durationDays || 30,
        startDate: new Date().toISOString().split('T')[0],
        joinedFromCode: code,
      };

      let roadmapId: string;
      let shareCode: string;

      try {
        const { data } = await roadmapsApi.create(createPayload);
        roadmapId = data.roadmap?.id || data.id || `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        shareCode = data.roadmap?.shareCode || data.shareCode || Math.random().toString(36).slice(2, 8).toUpperCase();
      } catch {
        // Fallback to local-only creation
        roadmapId = `rm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        shareCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      }

      // Save to localStorage
      const newRoadmap: UserRoadmap = {
        id: roadmapId,
        name: roadmapData?.name || 'Joined Roadmap',
        templateSlug: roadmapData?.templateSlug,
        category: roadmapData?.category || 'General',
        icon: roadmapData?.icon || '\u{1F680}',
        durationDays: roadmapData?.durationDays || 30,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active',
        completedDays: 0,
        currentStreak: 0,
        shareCode,
      };

      try {
        const existing = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]');
        existing.push(newRoadmap);
        localStorage.setItem('streaksy_active_roadmaps', JSON.stringify(existing));
      } catch { /* localStorage unavailable */ }

      router.push('/roadmaps');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error || e.message || 'Failed to join roadmap. Please try again.');
      setJoining(false);
    }
  };

  return (
    <AppShell>
      <PageTransition>
        <div className="max-w-lg mx-auto py-12 space-y-6">
          {loading ? (
            <Card className="text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-zinc-500 mx-auto mb-4" />
              <p className="text-sm text-zinc-400">Loading roadmap details...</p>
            </Card>
          ) : error && !roadmapData ? (
            <Card className="text-center py-16">
              <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-zinc-300 mb-2">Invalid Link</h2>
              <p className="text-sm text-zinc-500 mb-6">{error}</p>
              <Link href="/roadmaps">
                <Button variant="primary" size="md">
                  Browse Roadmaps
                </Button>
              </Link>
            </Card>
          ) : roadmapData ? (
            <>
              {/* Roadmap Details */}
              <Card className="border-zinc-800">
                <div className="text-center mb-6">
                  <span className="text-6xl block mb-4">{roadmapData.icon}</span>
                  <h1 className="text-2xl font-bold text-white">{roadmapData.name}</h1>
                  {roadmapData.creatorName && (
                    <p className="text-sm text-zinc-500 mt-1">
                      Shared by <span className="text-zinc-300">{roadmapData.creatorName}</span>
                    </p>
                  )}
                  {roadmapData.description && (
                    <p className="text-sm text-zinc-400 mt-3">{roadmapData.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
                    <Clock className="h-3 w-3" />
                    {roadmapData.durationDays} days
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
                    <Map className="h-3 w-3" />
                    {roadmapData.category}
                  </span>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 mb-4 flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {!user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-400 text-center">You need to be logged in to join this roadmap.</p>
                    <Link href={`/auth/login?redirect=/roadmaps/join/${code}`} className="block">
                      <Button variant="gradient" size="lg" className="w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        Log in to Join
                      </Button>
                    </Link>
                    <Link href={`/auth/signup?redirect=/roadmaps/join/${code}`} className="block">
                      <Button variant="primary" size="lg" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    onClick={handleJoin}
                    loading={joining}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Join This Roadmap
                  </Button>
                )}
              </Card>
            </>
          ) : null}
        </div>
      </PageTransition>
    </AppShell>
  );
}
