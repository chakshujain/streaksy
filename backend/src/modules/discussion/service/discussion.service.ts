import { discussionRepository } from '../repository/discussion.repository';
import { AppError } from '../../../common/errors/AppError';

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
};
