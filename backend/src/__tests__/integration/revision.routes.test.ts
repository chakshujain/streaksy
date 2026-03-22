import request from 'supertest';
import app from '../../app';
import { revisionService } from '../../modules/revision/service/revision.service';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/revision/service/revision.service');
const mockedService = revisionService as jest.Mocked<typeof revisionService>;

describe('Revision Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  const mockNote = {
    id: 'note-1',
    user_id: 'user-1',
    problem_id: 'prob-1',
    key_takeaway: 'Use hash map for O(1) lookup',
    approach: 'Two pass approach',
    time_complexity: 'O(n)',
    space_complexity: 'O(n)',
    tags: ['hash-map', 'array'],
    difficulty_rating: 'easy',
    last_revised: new Date(),
    created_at: new Date(),
    problem_title: 'Two Sum',
    problem_slug: 'two-sum',
  };

  const mockQuizCard = {
    id: 'note-1',
    problem_title: 'Two Sum',
    key_takeaway: 'Use hash map',
    difficulty_rating: 'easy',
    tags: ['hash-map'],
  };

  const validUUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/revisions', () => {
    it('should return revision notes', async () => {
      mockedService.getRevisionCards.mockResolvedValue([mockNote]);

      const res = await request(app)
        .get('/api/revisions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(1);
      expect(res.body.notes[0].key_takeaway).toBe('Use hash map for O(1) lookup');
    });

    it('should return empty list when no notes', async () => {
      mockedService.getRevisionCards.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/revisions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.notes).toHaveLength(0);
    });

    it('should support filter params', async () => {
      mockedService.getRevisionCards.mockResolvedValue([]);

      await request(app)
        .get('/api/revisions?tag=hash-map&difficulty=easy&limit=10&offset=5')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedService.getRevisionCards).toHaveBeenCalledWith('user-1', {
        tag: 'hash-map',
        difficulty: 'easy',
        limit: 10,
        offset: 5,
      });
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/revisions');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/revisions/quiz', () => {
    it('should return quiz cards', async () => {
      mockedService.getRevisionQuiz.mockResolvedValue([mockQuizCard]);

      const res = await request(app)
        .get('/api/revisions/quiz')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.cards).toHaveLength(1);
    });

    it('should support count param', async () => {
      mockedService.getRevisionQuiz.mockResolvedValue([]);

      await request(app)
        .get('/api/revisions/quiz?count=5')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedService.getRevisionQuiz).toHaveBeenCalledWith('user-1', 5);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/revisions/quiz');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/revisions/:problemId', () => {
    it('should return note for a problem', async () => {
      mockedService.getByProblem.mockResolvedValue(mockNote);

      const res = await request(app)
        .get('/api/revisions/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.note.problem_id).toBe('prob-1');
    });

    it('should return null when no note exists', async () => {
      mockedService.getByProblem.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/revisions/prob-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.note).toBeNull();
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/revisions/prob-1');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/revisions', () => {
    const validBody = {
      problemId: validUUID,
      keyTakeaway: 'Use hash map for O(1) lookup',
      approach: 'Two pass approach',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      tags: ['hash-map'],
      difficultyRating: 'easy',
    };

    it('should create or update a revision note', async () => {
      mockedService.createOrUpdate.mockResolvedValue(mockNote);

      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send(validBody);

      expect(res.status).toBe(201);
      expect(res.body.note).toBeDefined();
    });

    it('should return 400 for missing problemId', async () => {
      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send({ keyTakeaway: 'Test' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing keyTakeaway', async () => {
      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: validUUID });

      expect(res.status).toBe(400);
    });

    it('should return 400 for empty keyTakeaway', async () => {
      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: validUUID, keyTakeaway: '' });

      expect(res.status).toBe(400);
    });

    it('should return 400 for non-uuid problemId', async () => {
      const res = await request(app)
        .post('/api/revisions')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: 'not-a-uuid', keyTakeaway: 'Test' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/revisions')
        .send(validBody);

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/revisions/generate', () => {
    it('should generate AI revision notes', async () => {
      mockedService.generateAI.mockResolvedValue({ key_takeaway: 'AI generated' });

      const res = await request(app)
        .post('/api/revisions/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: validUUID });

      expect(res.status).toBe(200);
      expect(res.body.notes).toBeDefined();
    });

    it('should return 400 for missing problemId', async () => {
      const res = await request(app)
        .post('/api/revisions/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 400 for non-uuid problemId', async () => {
      const res = await request(app)
        .post('/api/revisions/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: 'not-a-uuid' });

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/revisions/generate')
        .send({ problemId: validUUID });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/revisions/hints', () => {
    it('should return hints for a problem', async () => {
      mockedService.getHints.mockResolvedValue(['Hint 1', 'Hint 2']);

      const res = await request(app)
        .post('/api/revisions/hints')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: validUUID });

      expect(res.status).toBe(200);
      expect(res.body.hints).toBeDefined();
    });

    it('should return 400 for missing problemId', async () => {
      const res = await request(app)
        .post('/api/revisions/hints')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/revisions/hints')
        .send({ problemId: validUUID });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/revisions/explain', () => {
    it('should return explanation for a problem', async () => {
      mockedService.getExplanation.mockResolvedValue('Explanation text');

      const res = await request(app)
        .post('/api/revisions/explain')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: validUUID });

      expect(res.status).toBe(200);
      expect(res.body.explanation).toBeDefined();
    });

    it('should return 400 for missing problemId', async () => {
      const res = await request(app)
        .post('/api/revisions/explain')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/revisions/explain')
        .send({ problemId: validUUID });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/revisions/review', () => {
    it('should return code review for a problem', async () => {
      mockedService.getCodeReview.mockResolvedValue('Review text');

      const res = await request(app)
        .post('/api/revisions/review')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId: validUUID });

      expect(res.status).toBe(200);
      expect(res.body.review).toBeDefined();
    });

    it('should return 400 for missing problemId', async () => {
      const res = await request(app)
        .post('/api/revisions/review')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/revisions/review')
        .send({ problemId: validUUID });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/revisions/:id/revised', () => {
    it('should mark a note as revised', async () => {
      mockedService.markRevised.mockResolvedValue(undefined);

      const res = await request(app)
        .patch('/api/revisions/note-1/revised')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Marked as revised');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).patch('/api/revisions/note-1/revised');
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/revisions/:id', () => {
    it('should delete a revision note', async () => {
      mockedService.delete.mockResolvedValue(undefined);

      const res = await request(app)
        .delete('/api/revisions/note-1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Deleted');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).delete('/api/revisions/note-1');
      expect(res.status).toBe(401);
    });
  });
});
