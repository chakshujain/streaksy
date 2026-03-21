import { revisionRepository } from '../repository/revision.repository';
import { AppError } from '../../../common/errors/AppError';
import { submissionRepository } from '../../sync/repository/submission.repository';
import { generateRevisionNotes } from '../../ai/service/ai.service';
import { env } from '../../../config/env';
import { redis } from '../../../config/redis';
import { query, queryOne } from '../../../config/database';

export const revisionService = {
  async createOrUpdate(userId: string, problemId: string, data: {
    keyTakeaway: string;
    approach?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    tags?: string[];
    difficultyRating?: string;
    intuition?: string;
    pointsToRemember?: string[];
    aiGenerated?: boolean;
  }) {
    return revisionRepository.createOrUpdate(userId, problemId, data);
  },

  async generateAI(userId: string, problemId: string) {
    // Check if NVIDIA API key is configured
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    // Rate limit: max 10 generations per user per day
    const rateLimitKey = `ai_gen:${userId}:${new Date().toISOString().slice(0, 10)}`;
    const currentCount = await redis.incr(rateLimitKey);
    if (currentCount === 1) {
      await redis.expire(rateLimitKey, 86400); // expire in 24h
    }
    if (currentCount > 10) {
      throw new AppError(429, 'AI generation limit reached. Maximum 10 generations per day.');
    }

    // Get the problem details
    const problem = await queryOne<{ id: string; title: string; difficulty: string }>(
      'SELECT id, title, difficulty FROM problems WHERE id = $1',
      [problemId]
    );
    if (!problem) throw AppError.notFound('Problem not found');

    // Get problem tags
    const tags = await query<{ name: string }>(
      `SELECT t.name FROM tags t
       JOIN problem_tags pt ON pt.tag_id = t.id
       WHERE pt.problem_id = $1`,
      [problemId]
    );

    // Get latest accepted submission with code
    const submissions = await submissionRepository.getForProblem(userId, problemId);
    const accepted = submissions.find(s => s.status === 'Accepted' && s.code);
    if (!accepted || !accepted.code) {
      throw AppError.badRequest('No accepted submission with code found for this problem. Solve the problem first and ensure your code is synced.');
    }

    // Call AI service
    const notes = await generateRevisionNotes(
      problem.title,
      problem.difficulty,
      accepted.code,
      accepted.language,
      tags.map(t => t.name)
    );

    if (!notes) {
      throw new AppError(502, 'AI service failed to generate notes. Please try again later.');
    }

    return notes;
  },

  async getRevisionCards(userId: string, filters?: { tag?: string; difficulty?: string; limit?: number; offset?: number }) {
    return revisionRepository.getForUser(userId, filters);
  },

  async getRevisionQuiz(userId: string, count = 10) {
    return revisionRepository.getRandomForRevision(userId, count);
  },

  async getByProblem(userId: string, problemId: string) {
    return revisionRepository.getByProblem(userId, problemId);
  },

  async markRevised(id: string, userId: string) {
    const note = await revisionRepository.findById(id);
    if (!note) throw AppError.notFound('Revision note not found');
    if (note.user_id !== userId) throw AppError.forbidden('Not your revision note');
    await revisionRepository.markRevised(id, userId);
  },

  async delete(id: string, userId: string) {
    const note = await revisionRepository.findById(id);
    if (!note) throw AppError.notFound('Revision note not found');
    if (note.user_id !== userId) throw AppError.forbidden('Not your revision note');
    await revisionRepository.delete(id, userId);
  },
};
