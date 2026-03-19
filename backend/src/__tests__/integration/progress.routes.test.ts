import request from 'supertest';
import app from '../../app';
import { progressRepository } from '../../modules/progress/repository/progress.repository';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/progress/repository/progress.repository');
const mockedRepo = progressRepository as jest.Mocked<typeof progressRepository>;

describe('Progress Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/progress', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/progress');
      expect(res.status).toBe(401);
    });

    it('should return user progress', async () => {
      mockedRepo.getUserProgress.mockResolvedValue([
        {
          user_id: 'user-1',
          problem_id: 'prob-1',
          status: 'solved',
          solved_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const res = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(1);
      expect(res.body.progress[0].status).toBe('solved');
    });

    it('should return empty array for new user', async () => {
      mockedRepo.getUserProgress.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toEqual([]);
    });
  });

  describe('GET /api/progress/sheet/:sheetSlug', () => {
    it('should return progress for a specific sheet', async () => {
      mockedRepo.getUserProgressForSheet.mockResolvedValue([
        { slug: 'two-sum', title: 'Two Sum', difficulty: 'easy', status: 'solved', solved_at: new Date() },
      ] as any);

      const res = await request(app)
        .get('/api/progress/sheet/blind-75')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(1);
    });
  });
});
