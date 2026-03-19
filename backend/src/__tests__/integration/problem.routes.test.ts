import request from 'supertest';
import app from '../../app';
import { problemRepository } from '../../modules/problem/repository/problem.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/problem/repository/problem.repository');
const mockedRepo = problemRepository as jest.Mocked<typeof problemRepository>;

describe('Problem Routes', () => {
  const token = generateTestToken();

  const mockProblem = {
    id: 'prob-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    url: 'https://leetcode.com/problems/two-sum/',
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/problems', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/problems');
      expect(res.status).toBe(401);
    });

    it('should return problems list when authenticated', async () => {
      mockedRepo.list.mockResolvedValue([mockProblem]);

      const res = await request(app)
        .get('/api/problems')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(1);
      expect(res.body.problems[0].title).toBe('Two Sum');
    });

    it('should pass query parameters for filtering', async () => {
      mockedRepo.list.mockResolvedValue([]);

      await request(app)
        .get('/api/problems?difficulty=hard&limit=10&offset=5')
        .set('Authorization', `Bearer ${token}`);

      expect(mockedRepo.list).toHaveBeenCalledWith('hard', 10, 5);
    });
  });

  describe('GET /api/problems/sheets', () => {
    it('should return sheets list', async () => {
      mockedRepo.getSheets.mockResolvedValue([
        { id: 's1', name: 'Blind 75', slug: 'blind-75', description: null },
      ]);

      const res = await request(app)
        .get('/api/problems/sheets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.sheets).toHaveLength(1);
      expect(res.body.sheets[0].name).toBe('Blind 75');
    });
  });

  describe('GET /api/problems/sheets/:slug', () => {
    it('should return problems for a sheet', async () => {
      mockedRepo.getSheetProblems.mockResolvedValue([mockProblem]);

      const res = await request(app)
        .get('/api/problems/sheets/blind-75')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(1);
    });
  });

  describe('GET /api/problems/:slug', () => {
    it('should return a problem with tags', async () => {
      mockedRepo.findBySlug.mockResolvedValue(mockProblem);
      mockedRepo.getTagsForProblem.mockResolvedValue([
        { id: 't1', name: 'Array' },
      ]);

      const res = await request(app)
        .get('/api/problems/two-sum')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problem.slug).toBe('two-sum');
      expect(res.body.problem.tags).toHaveLength(1);
    });

    it('should return 404 for nonexistent problem', async () => {
      mockedRepo.findBySlug.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/problems/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
