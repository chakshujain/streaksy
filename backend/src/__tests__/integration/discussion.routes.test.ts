import request from 'supertest';
import app from '../../app';
import { discussionService } from '../../modules/discussion/service/discussion.service';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/discussion/service/discussion.service');
const mockedService = discussionService as jest.Mocked<typeof discussionService>;

describe('Discussion Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockComment = {
    id: 'comment-1',
    problem_slug: 'two-sum',
    user_id: 'user-1',
    content: 'Great problem!',
    parent_id: null,
    created_at: new Date(),
    updated_at: new Date(),
    display_name: 'User One',
    avatar_url: null,
    reply_count: 0,
  };

  const mockReply = {
    id: 'reply-1',
    problem_slug: 'two-sum',
    user_id: 'user-2',
    content: 'I agree!',
    parent_id: 'comment-1',
    created_at: new Date(),
    updated_at: new Date(),
    display_name: 'User Two',
    avatar_url: null,
    reply_count: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Problem-scoped routes (mounted at /api/problems)
  describe('GET /api/problems/:slug/comments', () => {
    it('should return comments for a problem', async () => {
      mockedService.getComments.mockResolvedValue([mockComment]);

      const res = await request(app)
        .get('/api/problems/two-sum/comments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(1);
      expect(res.body.comments[0].content).toBe('Great problem!');
    });

    it('should return empty list when no comments', async () => {
      mockedService.getComments.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/problems/two-sum/comments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(0);
    });

    it('should support pagination params', async () => {
      mockedService.getComments.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/problems/two-sum/comments?limit=10&offset=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(mockedService.getComments).toHaveBeenCalledWith('two-sum', 10, 5);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/problems/two-sum/comments');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/problems/:slug/comments', () => {
    it('should create a comment', async () => {
      mockedService.createComment.mockResolvedValue(mockComment);

      const res = await request(app)
        .post('/api/problems/two-sum/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Great problem!' });

      expect(res.status).toBe(201);
      expect(res.body.comment.content).toBe('Great problem!');
    });

    it('should create a reply with parentId', async () => {
      mockedService.createComment.mockResolvedValue(mockReply);

      const res = await request(app)
        .post('/api/problems/two-sum/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'I agree!', parentId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' });

      expect(res.status).toBe(201);
      expect(res.body.comment.content).toBe('I agree!');
    });

    it('should return 400 for empty content', async () => {
      const res = await request(app)
        .post('/api/problems/two-sum/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing content', async () => {
      const res = await request(app)
        .post('/api/problems/two-sum/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid parentId', async () => {
      const res = await request(app)
        .post('/api/problems/two-sum/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Test', parentId: 'not-a-uuid' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/problems/two-sum/comments')
        .send({ content: 'Test' });

      expect(res.status).toBe(401);
    });
  });

  // Comment-scoped routes (mounted at /api/comments)
  describe('GET /api/comments/:id/replies', () => {
    it('should return replies for a comment', async () => {
      mockedService.getReplies.mockResolvedValue([mockReply]);

      const res = await request(app)
        .get('/api/comments/comment-1/replies')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.replies).toHaveLength(1);
      expect(res.body.replies[0].content).toBe('I agree!');
    });

    it('should return empty list when no replies', async () => {
      mockedService.getReplies.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/comments/comment-1/replies')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.replies).toHaveLength(0);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/comments/comment-1/replies');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should update a comment', async () => {
      mockedService.updateComment.mockResolvedValue(undefined);

      const res = await request(app)
        .put('/api/comments/comment-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Updated content' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Comment updated');
    });

    it('should return 400 for empty content', async () => {
      const res = await request(app)
        .put('/api/comments/comment-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing content', async () => {
      const res = await request(app)
        .put('/api/comments/comment-1')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .put('/api/comments/comment-1')
        .send({ content: 'Updated' });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should delete a comment', async () => {
      mockedService.deleteComment.mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/api/comments/comment-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Comment deleted');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).delete('/api/comments/comment-1');
      expect(res.status).toBe(401);
    });
  });
});
