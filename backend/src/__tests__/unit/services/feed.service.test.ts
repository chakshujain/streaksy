import { feedService } from '../../../modules/feed/service/feed.service';
import { feedRepository } from '../../../modules/feed/repository/feed.repository';

jest.mock('../../../modules/feed/repository/feed.repository');
const mockedRepo = feedRepository as jest.Mocked<typeof feedRepository>;

describe('feedService', () => {
  const mockEvent = {
    id: 'evt-1',
    user_id: 'user-1',
    event_type: 'problem_solved',
    title: 'Solved Two Sum',
    description: null,
    metadata: {},
    created_at: new Date(),
  };

  const mockComment = {
    id: 'cmt-1',
    feed_event_id: 'evt-1',
    user_id: 'user-2',
    content: 'Nice!',
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('postEvent', () => {
    it('should create a feed event', async () => {
      mockedRepo.createEvent.mockResolvedValue(mockEvent);

      const result = await feedService.postEvent('user-1', 'problem_solved', 'Solved Two Sum');

      expect(mockedRepo.createEvent).toHaveBeenCalledWith(
        'user-1', 'problem_solved', 'Solved Two Sum', undefined, undefined
      );
      expect(result).toEqual(mockEvent);
    });

    it('should not throw on repository error (fire-and-forget)', async () => {
      mockedRepo.createEvent.mockRejectedValue(new Error('DB error'));

      // Should not throw
      await expect(
        feedService.postEvent('user-1', 'problem_solved', 'Solved Two Sum')
      ).resolves.toBeUndefined();
    });
  });

  describe('getFeed', () => {
    it('should return the social feed for a user', async () => {
      mockedRepo.getFeed.mockResolvedValue([mockEvent]);

      const result = await feedService.getFeed('user-1', 20, 0);

      expect(mockedRepo.getFeed).toHaveBeenCalledWith('user-1', 20, 0);
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('getUserFeed', () => {
    it('should return feed for a specific user', async () => {
      mockedRepo.getUserFeed.mockResolvedValue([mockEvent]);

      const result = await feedService.getUserFeed('user-1', 'user-2', 10, 0);

      expect(mockedRepo.getUserFeed).toHaveBeenCalledWith('user-1', 'user-2', 10, 0);
      expect(result).toEqual([mockEvent]);
    });
  });

  describe('toggleLike', () => {
    it('should toggle like and return result', async () => {
      mockedRepo.toggleLike.mockResolvedValue(true);
      mockedRepo.getLikeCount.mockResolvedValue(5);

      const result = await feedService.toggleLike('evt-1', 'user-2');

      expect(mockedRepo.toggleLike).toHaveBeenCalledWith('evt-1', 'user-2');
      expect(mockedRepo.getLikeCount).toHaveBeenCalledWith('evt-1');
      expect(result).toEqual({ liked: true, count: 5 });
    });

    it('should return liked: false when unliking', async () => {
      mockedRepo.toggleLike.mockResolvedValue(false);
      mockedRepo.getLikeCount.mockResolvedValue(4);

      const result = await feedService.toggleLike('evt-1', 'user-2');

      expect(result).toEqual({ liked: false, count: 4 });
    });
  });

  describe('addComment', () => {
    it('should add a comment to a feed event', async () => {
      mockedRepo.addComment.mockResolvedValue(mockComment);

      const result = await feedService.addComment('evt-1', 'user-2', 'Nice!');

      expect(mockedRepo.addComment).toHaveBeenCalledWith('evt-1', 'user-2', 'Nice!');
      expect(result).toEqual(mockComment);
    });
  });

  describe('getComments', () => {
    it('should return comments for a feed event', async () => {
      mockedRepo.getComments.mockResolvedValue([mockComment]);

      const result = await feedService.getComments('evt-1');

      expect(mockedRepo.getComments).toHaveBeenCalledWith('evt-1');
      expect(result).toEqual([mockComment]);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      mockedRepo.deleteComment.mockResolvedValue();

      await feedService.deleteComment('cmt-1', 'user-2');

      expect(mockedRepo.deleteComment).toHaveBeenCalledWith('cmt-1', 'user-2');
    });
  });
});
