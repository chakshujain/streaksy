import { transaction } from '../../../config/database';
import { problemRepository } from '../../problem/repository/problem.repository';
import { progressRepository } from '../../progress/repository/progress.repository';
import { streakService } from '../../streak/service/streak.service';
import { leaderboardService } from '../../leaderboard/service/leaderboard.service';
import { groupRepository } from '../../group/repository/group.repository';
import { authRepository } from '../../auth/repository/auth.repository';
import { AppError } from '../../../common/errors/AppError';
import { ProblemStatus } from '../../../common/types';

export const syncService = {
  /**
   * Core sync endpoint called by the browser extension.
   * Steps:
   * 1. Validate user exists
   * 2. Map problemSlug → problem
   * 3. Update progress
   * 4. Update streak (if solved)
   * 5. Update leaderboard for all user's groups
   */
  async syncLeetcode(userId: string, problemSlug: string, status: ProblemStatus) {
    // 1. Validate user
    const user = await authRepository.findById(userId);
    if (!user) throw AppError.notFound('User not found');

    // 2. Map slug to problem
    const problem = await problemRepository.findBySlug(problemSlug);
    if (!problem) throw AppError.notFound(`Problem not found: ${problemSlug}`);

    // 3. Update progress
    const progress = await progressRepository.upsert(userId, problem.id, status);

    // 4. Update streak if solved
    let streak = null;
    if (status === 'solved') {
      streak = await streakService.recordSolve(userId);
    }

    // 5. Update leaderboards for all groups the user is in
    const groups = await groupRepository.getUserGroups(userId);
    await Promise.all(
      groups.map((g) => leaderboardService.updateUserScore(userId, g.id))
    );

    return {
      progress: {
        problemId: problem.id,
        problemSlug: problem.slug,
        status: progress.status,
        solvedAt: progress.solved_at,
      },
      streak,
    };
  },
};
