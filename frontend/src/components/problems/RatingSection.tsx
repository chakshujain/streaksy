'use client';

import { useState, useEffect } from 'react';
import { Star, Building2, Plus, Check } from 'lucide-react';
import { useAsync } from '@/hooks/useAsync';
import { ratingsApi } from '@/lib/api';
import { cn } from '@/lib/cn';
import type { CompanyTag, ProblemCompanyTag, RatingDistribution } from '@/lib/types';

interface Props {
  problemId: string;
}

export function RatingSection({ problemId }: Props) {
  const [myRating, setMyRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

  const { data: statsData, refetch: refetchStats } = useAsync(
    () => ratingsApi.getStats(problemId).then(r => r.data),
    [problemId]
  );

  const { data: myRatingData } = useAsync(
    () => ratingsApi.getMine(problemId).then(r => r.data),
    [problemId]
  );

  const { data: companyData, refetch: refetchCompanies } = useAsync(
    () => ratingsApi.getCompanyTags(problemId).then(r => r.data),
    [problemId]
  );

  const { data: allCompanies } = useAsync(
    () => showCompanyPicker ? ratingsApi.listCompanyTags().then(r => r.data.tags as CompanyTag[]) : Promise.resolve(null),
    [showCompanyPicker]
  );

  useEffect(() => {
    if (myRatingData?.rating) {
      setMyRating(myRatingData.rating.difficulty_rating);
    }
  }, [myRatingData]);

  const handleRate = async (rating: number) => {
    setMyRating(rating);
    setSubmitting(true);
    try {
      await ratingsApi.rate(problemId, rating);
      refetchStats();
    } catch {
      // handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportCompany = async (companyTagId: string) => {
    try {
      await ratingsApi.reportCompanyTag(problemId, companyTagId);
      refetchCompanies();
      setShowCompanyPicker(false);
    } catch {
      // handled
    }
  };

  const stats = statsData?.stats;
  const distribution = (statsData?.distribution ?? []) as RatingDistribution[];
  const companyTags = (companyData?.tags ?? []) as ProblemCompanyTag[];
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  const difficultyLabel = (avg: number) => {
    if (avg <= 1.5) return 'Very Easy';
    if (avg <= 2.5) return 'Easy';
    if (avg <= 3.5) return 'Medium';
    if (avg <= 4.5) return 'Hard';
    return 'Very Hard';
  };

  const difficultyColor = (avg: number) => {
    if (avg <= 2) return 'text-emerald-400';
    if (avg <= 3.5) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-5">
      {/* Difficulty Rating */}
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Community Difficulty
          </h3>
          {stats && (
            <div className="flex items-center gap-2">
              <span className={cn('text-2xl font-bold', difficultyColor(stats.avg_rating))}>
                {Number(stats.avg_rating).toFixed(1)}
              </span>
              <div className="text-right">
                <p className={cn('text-xs font-medium', difficultyColor(stats.avg_rating))}>
                  {difficultyLabel(stats.avg_rating)}
                </p>
                <p className="text-[10px] text-zinc-500">{stats.rating_count} rating{stats.rating_count !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )}
        </div>

        {/* Star rating input */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-xs text-zinc-500 mr-2">Your rating:</span>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              disabled={submitting}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => handleRate(star)}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors',
                  (hoveredStar || myRating) >= star
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-zinc-600'
                )}
              />
            </button>
          ))}
          {myRating > 0 && (
            <span className="text-xs text-zinc-500 ml-2 flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-400" /> Rated
            </span>
          )}
        </div>

        {/* Distribution bars */}
        {distribution.length > 0 && (
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map(r => {
              const d = distribution.find(x => x.rating === r);
              const count = d?.count ?? 0;
              const pct = (count / maxCount) * 100;
              return (
                <div key={r} className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500 w-3 text-right">{r}</span>
                  <Star className="h-3 w-3 text-zinc-600" />
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-zinc-600 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Company Tags */}
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-400" />
            Asked at Companies
          </h3>
          <button
            onClick={() => setShowCompanyPicker(!showCompanyPicker)}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Report
          </button>
        </div>

        {companyTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {companyTags.map(ct => (
              <span
                key={ct.company_tag_id}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-3 py-1 text-xs"
              >
                <Building2 className="h-3 w-3 text-zinc-500" />
                <span className="text-zinc-300">{ct.company_name}</span>
                <span className="text-zinc-600">&times;{ct.report_count}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No company reports yet. Be the first to report!</p>
        )}

        {/* Company picker dropdown */}
        {showCompanyPicker && allCompanies && (
          <div className="mt-3 rounded-lg border border-zinc-700/50 bg-zinc-800/80 p-3 max-h-48 overflow-y-auto">
            <p className="text-xs text-zinc-400 mb-2">Select a company:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {allCompanies.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleReportCompany(c.id)}
                  className="text-left rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
