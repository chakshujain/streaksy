import { revisionRepository } from '../repository/revision.repository';
import { AppError } from '../../../common/errors/AppError';
import { submissionRepository } from '../../sync/repository/submission.repository';
import { generateRevisionNotes, generateHints, generateExplanation, reviewCode } from '../../ai/service/ai.service';
import { env } from '../../../config/env';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
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

    await checkAIRateLimit(userId);

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

  async getHints(userId: string, problemId: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const problem = await queryOne<{ id: string; title: string; difficulty: string }>(
      'SELECT id, title, difficulty FROM problems WHERE id = $1',
      [problemId]
    );
    if (!problem) throw AppError.notFound('Problem not found');

    const tags = await query<{ name: string }>(
      `SELECT t.name FROM tags t JOIN problem_tags pt ON pt.tag_id = t.id WHERE pt.problem_id = $1`,
      [problemId]
    );

    // Optionally include user's latest attempt for contextual hints
    const submissions = await submissionRepository.getForProblem(userId, problemId);
    const latest = submissions.find(s => s.code);

    const hints = await generateHints(
      problem.title,
      problem.difficulty,
      tags.map(t => t.name),
      latest?.code || undefined,
      latest?.language || undefined
    );

    if (!hints) {
      throw new AppError(502, 'AI service failed to generate hints. Please try again later.');
    }

    return hints;
  },

  async getExplanation(userId: string, problemId: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const problem = await queryOne<{ id: string; title: string; difficulty: string }>(
      'SELECT id, title, difficulty FROM problems WHERE id = $1',
      [problemId]
    );
    if (!problem) throw AppError.notFound('Problem not found');

    const tags = await query<{ name: string }>(
      `SELECT t.name FROM tags t JOIN problem_tags pt ON pt.tag_id = t.id WHERE pt.problem_id = $1`,
      [problemId]
    );

    const explanation = await generateExplanation(
      problem.title,
      problem.difficulty,
      tags.map(t => t.name)
    );

    if (!explanation) {
      throw new AppError(502, 'AI service failed to generate explanation. Please try again later.');
    }

    return explanation;
  },

  async getCodeReview(userId: string, problemId: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const problem = await queryOne<{ id: string; title: string; difficulty: string }>(
      'SELECT id, title, difficulty FROM problems WHERE id = $1',
      [problemId]
    );
    if (!problem) throw AppError.notFound('Problem not found');

    const tags = await query<{ name: string }>(
      `SELECT t.name FROM tags t JOIN problem_tags pt ON pt.tag_id = t.id WHERE pt.problem_id = $1`,
      [problemId]
    );

    const submissions = await submissionRepository.getForProblem(userId, problemId);
    const accepted = submissions.find(s => s.status === 'Accepted' && s.code);
    if (!accepted || !accepted.code) {
      throw AppError.badRequest('No accepted submission with code found. Solve the problem first and sync your code.');
    }

    const review = await reviewCode(
      problem.title,
      problem.difficulty,
      accepted.code,
      accepted.language,
      tags.map(t => t.name)
    );

    if (!review) {
      throw new AppError(502, 'AI service failed to review code. Please try again later.');
    }

    return review;
  },

};
