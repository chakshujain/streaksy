'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Map,
  Clock,
  Users,
  AlertCircle,
  Loader2,
  LogIn,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

import { roadmapsApi, prepApi } from '@/lib/api';
import { templatesBySlug } from '@/lib/roadmap-templates';
import { useAuthStore } from '@/lib/store';
import type { UserRoadmap } from '@/lib/types';

interface SharedRoadmap {
  id?: string;
  name: string;
  templateSlug?: string;
  templateId?: string;
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
  const { user, loading: authLoading, hydrate } = useAuthStore();

  const [roadmapData, setRoadmapData] = useState<SharedRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    async function fetchRoadmap() {
      setLoading(true);
      setError('');

      // Try roadmaps API first (primary)
      try {
        const { data } = await roadmapsApi.getByShareCode(code);
        const rm = data.roadmap || data;
        const template = rm.template_slug ? templatesBySlug[rm.template_slug] : null;
        setRoadmapData({
          id: rm.id,
          name: rm.name || 'Shared Roadmap',
          templateSlug: rm.template_slug,
          templateId: rm.template_id,
          icon: rm.category_icon || template?.icon || '\u{1F680}',
          category: rm.category_slug || template?.category || 'General',
          durationDays: rm.duration_days || 30,
          description: template?.description,
          creatorName: rm.creator_name,
        });
        setLoading(false);
        return;
      } catch { /* try next */ }

      // Fallback: try legacy prep API
      try {
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
        setLoading(false);
        return;
      } catch { /* try next */ }

      // Fallback: check localStorage
      try {
        const parsed = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]');
        const stored = Array.isArray(parsed) ? parsed as UserRoadmap[] : [];
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
          setLoading(false);
          return;
        }
      } catch { /* empty */ }

      setError('This roadmap link is invalid or has expired.');
      setLoading(false);
    }

    fetchRoadmap();
  }, [code]);

  const handleJoin = async () => {
    if (joining) return;
    setJoining(true);
    setError('');

    try {
      const createPayload: Record<string, unknown> = {
        name: roadmapData?.name || 'Joined Roadmap',
        durationDays: roadmapData?.durationDays || 30,
        startDate: new Date().toISOString().split('T')[0],
      };
      if (roadmapData?.templateId) createPayload.templateId = roadmapData.templateId;
      if (roadmapData?.category) createPayload.categoryId = roadmapData.category;

      let roadmapId: string;
      let shareCode: string;

      try {
        const { data } = await roadmapsApi.create(createPayload);
        roadmapId = data.roadmap?.id || data.id;
        shareCode = data.roadmap?.share_code || data.share_code || Math.random().toString(36).slice(2, 8).toUpperCase();
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
        const parsed = JSON.parse(localStorage.getItem('streaksy_active_roadmaps') || '[]');
        const existing = Array.isArray(parsed) ? parsed : [];
        existing.push(newRoadmap);
        localStorage.setItem('streaksy_active_roadmaps', JSON.stringify(existing));
      } catch {
        localStorage.setItem('streaksy_active_roadmaps', JSON.stringify([newRoadmap]));
      }

      setJoined(true);
      setTimeout(() => router.push('/roadmaps'), 1000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error || e.message || 'Failed to join roadmap. Please try again.');
      setJoining(false);
    }
  };

  const handleAuthRedirect = (path: string) => {
    localStorage.setItem('streaksy_pending_invite', JSON.stringify({ type: 'roadmap', code }));
    router.push(`${path}?redirect=/roadmaps/join/${code}`);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error && !roadmapData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100 mb-2">Invalid Roadmap Link</h1>
          <p className="text-sm text-zinc-500 mb-6">{error}</p>
          <Link href="/roadmaps" className="text-sm text-emerald-400 hover:text-emerald-300">Browse Roadmaps</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="text-2xl">{'\u{1F525}'}</span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Streaksy</span>
          </Link>
        </div>

        {roadmapData && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-8">
            <div className="text-center mb-6">
              <span className="text-6xl block mb-4">{roadmapData.icon}</span>
              <p className="text-sm text-zinc-500 mb-1">You&apos;ve been invited to join</p>
              <h1 className="text-2xl font-bold text-zinc-100">{roadmapData.name}</h1>
              {roadmapData.creatorName && (
                <p className="text-sm text-zinc-500 mt-1">
                  Shared by <span className="text-zinc-300">{roadmapData.creatorName}</span>
                </p>
              )}
              {roadmapData.description && (
                <p className="text-sm text-zinc-400 mt-3">{roadmapData.description}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6 mb-6 py-4 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
              <div className="text-center flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-sm text-zinc-300">{roadmapData.durationDays} days</span>
              </div>
              <div className="text-center flex items-center gap-1.5">
                <Map className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-sm text-zinc-300 capitalize">{roadmapData.category}</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {joined ? (
              <div className="text-center py-4">
                <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-emerald-400">Joined! Redirecting...</p>
              </div>
            ) : user ? (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200 disabled:opacity-50"
              >
                {joining ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Join This Roadmap
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleAuthRedirect('/auth/login')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" />
                  Log in to Join
                </button>
                <button
                  onClick={() => handleAuthRedirect('/auth/signup')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-3 text-sm font-medium text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up to Join
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-zinc-600 mt-6">
          Streaksy — Crush Your Goals With Friends
        </p>
      </div>
    </div>
  );
}
