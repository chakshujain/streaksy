import { problemRepository } from '../../problem/repository/problem.repository';
import { progressRepository } from '../../progress/repository/progress.repository';
import { streakService } from '../../streak/service/streak.service';
import { leaderboardService } from '../../leaderboard/service/leaderboard.service';
import { groupRepository } from '../../group/repository/group.repository';
import { authRepository } from '../../auth/repository/auth.repository';
import { submissionRepository } from '../repository/submission.repository';
import { badgeService } from '../../badge/service/badge.service';
import { AppError } from '../../../common/errors/AppError';
import { ProblemStatus } from '../../../common/types';
import { invalidate } from '../../../common/utils/cache';
import { logger } from '../../../config/logger';

export const syncService = {
  async syncLeetcode(userId: string, problemSlug: string, status: ProblemStatus, extra?: {
    language?: string;
    code?: string;
    runtimeMs?: number;
    runtimePercentile?: number;
    memoryKb?: number;
    memoryPercentile?: number;
    timeSpentSeconds?: number;
    leetcodeSubmissionId?: string;
  }) {
    // 1. Validate user
    const user = await authRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    // 2. Map slug to problem
    const problem = await problemRepository.findBySlug(problemSlug);
    if (!problem) throw AppError.notFound(`Problem not found: ${problemSlug}`);

    // 3. Update progress
    const progress = await progressRepository.upsert(userId, problem.id, status);

    // 4. Save submission details (if language provided)
    let submission = null;
    if (extra?.language) {
      // Dedup by leetcode submission ID
      if (extra.leetcodeSubmissionId) {
        const existing = await submissionRepository.findByLeetcodeId(extra.leetcodeSubmissionId);
        if (existing) {
          submission = existing;
        }
      }
      if (!submission) {
        submission = await submissionRepository.create({
          userId,
          problemId: problem.id,
          status: status === 'solved' ? 'Accepted' : 'Attempted',
          language: extra.language,
          code: extra.code,
          runtimeMs: extra.runtimeMs,
          runtimePercentile: extra.runtimePercentile,
          memoryKb: extra.memoryKb,
          memoryPercentile: extra.memoryPercentile,
          timeSpentSeconds: extra.timeSpentSeconds,
          leetcodeSubmissionId: extra.leetcodeSubmissionId,
        });
      }
    }

    // 5. Update streak if solved
    let streak = null;
    if (status === 'solved') {
      streak = await streakService.recordSolve(userId);
      // Check badges async
      badgeService.checkAndAward(userId).catch(err => logger.error({ err, userId }, 'Failed to check and award badges'));
      // Progress recovery challenge if active
      import('../../poke/service/poke.service').then(m => m.pokeService.progressRecoveryChallenge(userId)).catch(err => logger.error({ err, userId }, 'Failed to progress recovery challenge'));
      // Post to social feed
      import('../../feed/service/feed.service').then(m => {
        m.feedService.postEvent(userId, 'solve', `Solved "${problem.title}"`, undefined, {
          problemSlug: problem.slug,
          problemTitle: problem.title,
          difficulty: problem.difficulty,
        });
      }).catch(err => logger.error({ err, userId }, 'Failed to post solve event to feed'));
    }

    // 6. Update leaderboards
    const groups = await groupRepository.getUserGroups(userId);
    await Promise.all(
      groups.map((g) => leaderboardService.updateUserScore(userId, g.id))
    );

    // Invalidate user caches
    invalidate(`insights:overview:${userId}`).catch(err => logger.error({ err, userId }, 'Failed to invalidate insights cache'));

    return {
      progress: {
        problemId: problem.id,
        problemSlug: problem.slug,
        status: progress.status,
        solvedAt: progress.solved_at,
      },
      submission: submission ? {
        id: submission.id,
        language: submission.language,
        runtimeMs: submission.runtime_ms,
        memoryKb: submission.memory_kb,
      } : null,
      streak,
    };
  },
};
