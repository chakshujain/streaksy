import { discussionRepository } from '../repository/discussion.repository';
import { AppError } from '../../../common/errors/AppError';
import { summarizeDiscussion } from '../../ai/service/ai.service';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { env } from '../../../config/env';
import { queryOne } from '../../../config/database';

export const discussionService = {
  async getComments(problemSlug: string, limit?: number, offset?: number) {
    const problemId = await discussionRepository.getProblemIdFromSlug(problemSlug);
    if (!problemId) throw AppError.notFound('Problem not found');
    return discussionRepository.getForProblem(problemId, limit, offset);
  },

  async createComment(problemSlug: string, userId: string, content: string, parentId?: string) {
    const problemId = await discussionRepository.getProblemIdFromSlug(problemSlug);
    if (!problemId) throw AppError.notFound('Problem not found');

    if (parentId) {
      const parent = await discussionRepository.findById(parentId);
      if (!parent) throw AppError.notFound('Parent comment not found');
    }

    return discussionRepository.create(problemId, userId, content, parentId);
  },

  async getReplies(commentId: string) {
    return discussionRepository.getReplies(commentId);
  },

  async updateComment(commentId: string, userId: string, content: string) {
    const comment = await discussionRepository.findById(commentId);
    if (!comment) throw AppError.notFound('Comment not found');
    if (comment.user_id !== userId) throw AppError.forbidden('Not your comment');
    await discussionRepository.update(commentId, content);
  },

  async deleteComment(commentId: string, userId: string) {
    const comment = await discussionRepository.findById(commentId);
    if (!comment) throw AppError.notFound('Comment not found');
    if (comment.user_id !== userId) throw AppError.forbidden('Not your comment');
    await discussionRepository.delete(commentId);
  },

  async getAISummary(userId: string, problemSlug: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const problemId = await discussionRepository.getProblemIdFromSlug(problemSlug);
    if (!problemId) throw AppError.notFound('Problem not found');

    // Get problem title
    const problem = await queryOne<{ title: string }>('SELECT title FROM problems WHERE id = $1', [problemId]);
    if (!problem) throw AppError.notFound('Problem not found');

    // Get comments
    const comments = await discussionRepository.getForProblem(problemId, 30, 0);
    if (!comments || comments.length === 0) {
      throw AppError.badRequest('No discussion comments to summarize.');
    }

    const commentTexts = comments.map((c: any) => c.content || '');

    const summary = await summarizeDiscussion(problem.title, commentTexts);

    if (!summary) {
      throw new AppError(502, 'AI service failed to summarize discussion. Please try again later.');
    }

    return summary;
  },
};
