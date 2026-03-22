import request from 'supertest';
import app from '../../app';
import { feedRepository } from '../../modules/feed/repository/feed.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/feed/repository/feed.repository');
const mockedRepo = feedRepository as jest.Mocked<typeof feedRepository>;

describe('Feed Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockFeedEvent = {
    id: 'event-1',
    user_id: 'user-1',
    event_type: 'post',
    title: 'Just solved Two Sum!',
    description: null as string | null,
    metadata: { type: 'user_post' } as Record<string, unknown>,
    created_at: new Date(),
    display_name: 'User One',
    avatar_url: undefined as string | undefined,
    like_count: 3,
    comment_count: 1,
    liked_by_me: false,
  };

  const mockComment = {
    id: 'comment-1',
    feed_event_id: 'event-1',
    user_id: 'user-1',
    content: 'Great job!',
    created_at: new Date(),
    display_name: 'User One',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/feed', () => {
    it('should return feed events', async () => {
      mockedRepo.getFeed.mockResolvedValue([mockFeedEvent]);

      const res = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(1);
      expect(res.body.events[0].title).toBe('Just solved Two Sum!');
    });

    it('should return empty feed', async () => {
      mockedRepo.getFeed.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(0);
    });

    it('should support pagination params', async () => {
      mockedRepo.getFeed.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/feed?limit=10&offset=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedRepo.getFeed).toHaveBeenCalledWith('user-1', 10, 5);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/feed');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/feed/user/:userId', () => {
    it('should return user-specific feed', async () => {
      mockedRepo.getUserFeed.mockResolvedValue([mockFeedEvent]);

      const res = await request(app)
        .get('/api/feed/user/user-2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.events).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/feed/user/user-2');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/feed/post', () => {
    it('should create a post', async () => {
      mockedRepo.createEvent.mockResolvedValue(mockFeedEvent);

      const res = await request(app)
        .post('/api/feed/post')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Just solved Two Sum!' });

      expect(res.status).toBe(201);
      expect(res.body.event).toBeDefined();
    });

    it('should return 400 for empty content', async () => {
      const res = await request(app)
        .post('/api/feed/post')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing content', async () => {
      const res = await request(app)
        .post('/api/feed/post')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/feed/post')
        .send({ content: 'Hello' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/feed/:id/like', () => {
    it('should toggle like on an event', async () => {
      mockedRepo.toggleLike.mockResolvedValue(true);
      mockedRepo.getLikeCount.mockResolvedValue(4);

      const res = await request(app)
        .post('/api/feed/event-1/like')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.liked).toBe(true);
      expect(res.body.count).toBe(4);
    });

    it('should toggle unlike', async () => {
      mockedRepo.toggleLike.mockResolvedValue(false);
      mockedRepo.getLikeCount.mockResolvedValue(2);

      const res = await request(app)
        .post('/api/feed/event-1/like')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.liked).toBe(false);
      expect(res.body.count).toBe(2);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).post('/api/feed/event-1/like');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/feed/:id/comments', () => {
    it('should add a comment', async () => {
      mockedRepo.addComment.mockResolvedValue(mockComment);

      const res = await request(app)
        .post('/api/feed/event-1/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Great job!' });

      expect(res.status).toBe(201);
      expect(res.body.comment.content).toBe('Great job!');
    });

    it('should return 400 for empty comment', async () => {
      const res = await request(app)
        .post('/api/feed/event-1/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/feed/event-1/comments')
        .send({ content: 'test' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/feed/:id/comments', () => {
    it('should return comments for an event', async () => {
      mockedRepo.getComments.mockResolvedValue([mockComment]);

      const res = await request(app)
        .get('/api/feed/event-1/comments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/feed/event-1/comments');
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/feed/comments/:id', () => {
    it('should delete a comment', async () => {
      mockedRepo.deleteComment.mockResolvedValue();

      const res = await request(app)
        .delete('/api/feed/comments/comment-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Deleted');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).delete('/api/feed/comments/comment-1');
      expect(res.status).toBe(401);
    });
  });
});
