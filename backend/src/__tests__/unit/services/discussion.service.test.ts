import { discussionService } from '../../../modules/discussion/service/discussion.service';
import { discussionRepository } from '../../../modules/discussion/repository/discussion.repository';

jest.mock('../../../modules/discussion/repository/discussion.repository');
const mockedRepo = discussionRepository as jest.Mocked<typeof discussionRepository>;

describe('discussionService', () => {
  const mockComment = {
    id: 'cmt-1',
    problem_id: 'prob-1',
    user_id: 'user-1',
    parent_id: null,
    content: 'Great problem!',
    created_at: new Date(),
    updated_at: new Date(),
    display_name: 'Test User',
  };

  const mockReply = {
    ...mockComment,
    id: 'cmt-2',
    parent_id: 'cmt-1',
    user_id: 'user-2',
    content: 'I agree!',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getComments', () => {
    it('should return comments for a problem slug', async () => {
      mockedRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedRepo.getForProblem.mockResolvedValue([mockComment]);

      const result = await discussionService.getComments('two-sum');

      expect(mockedRepo.getProblemIdFromSlug).toHaveBeenCalledWith('two-sum');
      expect(mockedRepo.getForProblem).toHaveBeenCalledWith('prob-1', undefined, undefined);
      expect(result).toEqual([mockComment]);
    });

    it('should pass limit and offset', async () => {
      mockedRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedRepo.getForProblem.mockResolvedValue([]);

      await discussionService.getComments('two-sum', 10, 5);

      expect(mockedRepo.getForProblem).toHaveBeenCalledWith('prob-1', 10, 5);
    });

    it('should throw notFound when problem slug is invalid', async () => {
      mockedRepo.getProblemIdFromSlug.mockResolvedValue(null);

      await expect(
        discussionService.getComments('non-existent')
      ).rejects.toThrow('Problem not found');
      await expect(
        discussionService.getComments('non-existent')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('createComment', () => {
    it('should create a top-level comment', async () => {
      mockedRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedRepo.create.mockResolvedValue(mockComment);

      const result = await discussionService.createComment('two-sum', 'user-1', 'Great problem!');

      expect(mockedRepo.create).toHaveBeenCalledWith('prob-1', 'user-1', 'Great problem!', undefined);
      expect(result).toEqual(mockComment);
    });

    it('should create a reply to an existing comment', async () => {
      mockedRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedRepo.findById.mockResolvedValue(mockComment);
      mockedRepo.create.mockResolvedValue(mockReply);

      const result = await discussionService.createComment('two-sum', 'user-2', 'I agree!', 'cmt-1');

      expect(mockedRepo.findById).toHaveBeenCalledWith('cmt-1');
      expect(mockedRepo.create).toHaveBeenCalledWith('prob-1', 'user-2', 'I agree!', 'cmt-1');
      expect(result).toEqual(mockReply);
    });

    it('should throw notFound when problem slug is invalid', async () => {
      mockedRepo.getProblemIdFromSlug.mockResolvedValue(null);

      await expect(
        discussionService.createComment('non-existent', 'user-1', 'test')
      ).rejects.toThrow('Problem not found');
      await expect(
        discussionService.createComment('non-existent', 'user-1', 'test')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw notFound when parent comment does not exist', async () => {
      mockedRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedRepo.findById.mockResolvedValue(null);

      await expect(
        discussionService.createComment('two-sum', 'user-1', 'test', 'bad-parent')
      ).rejects.toThrow('Parent comment not found');
      await expect(
        discussionService.createComment('two-sum', 'user-1', 'test', 'bad-parent')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('getReplies', () => {
    it('should return replies for a comment', async () => {
      mockedRepo.getReplies.mockResolvedValue([mockReply]);

      const result = await discussionService.getReplies('cmt-1');

      expect(mockedRepo.getReplies).toHaveBeenCalledWith('cmt-1');
      expect(result).toEqual([mockReply]);
    });

    it('should return empty array when no replies exist', async () => {
      mockedRepo.getReplies.mockResolvedValue([]);

      const result = await discussionService.getReplies('cmt-1');

      expect(result).toEqual([]);
    });
  });

  describe('updateComment', () => {
    it('should update a comment owned by the user', async () => {
      mockedRepo.findById.mockResolvedValue(mockComment);
      mockedRepo.update.mockResolvedValue();

      await discussionService.updateComment('cmt-1', 'user-1', 'Updated content');

      expect(mockedRepo.findById).toHaveBeenCalledWith('cmt-1');
      expect(mockedRepo.update).toHaveBeenCalledWith('cmt-1', 'Updated content');
    });

    it('should throw notFound when comment does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(
        discussionService.updateComment('bad-id', 'user-1', 'test')
      ).rejects.toThrow('Comment not found');
      await expect(
        discussionService.updateComment('bad-id', 'user-1', 'test')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw forbidden when user does not own the comment', async () => {
      mockedRepo.findById.mockResolvedValue(mockComment);

      await expect(
        discussionService.updateComment('cmt-1', 'user-999', 'test')
      ).rejects.toThrow('Not your comment');
      await expect(
        discussionService.updateComment('cmt-1', 'user-999', 'test')
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment owned by the user', async () => {
      mockedRepo.findById.mockResolvedValue(mockComment);
      mockedRepo.delete.mockResolvedValue();

      await discussionService.deleteComment('cmt-1', 'user-1');

      expect(mockedRepo.findById).toHaveBeenCalledWith('cmt-1');
      expect(mockedRepo.delete).toHaveBeenCalledWith('cmt-1');
    });

    it('should throw notFound when comment does not exist', async () => {
      mockedRepo.findById.mockResolvedValue(null);

      await expect(
        discussionService.deleteComment('bad-id', 'user-1')
      ).rejects.toThrow('Comment not found');
      await expect(
        discussionService.deleteComment('bad-id', 'user-1')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('should throw forbidden when user does not own the comment', async () => {
      mockedRepo.findById.mockResolvedValue(mockComment);

      await expect(
        discussionService.deleteComment('cmt-1', 'user-999')
      ).rejects.toThrow('Not your comment');
      await expect(
        discussionService.deleteComment('cmt-1', 'user-999')
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });
});
