import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { ratingRepository } from '../../modules/rating/repository/rating.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/rating/repository/rating.repository');

const mockedRatingRepo = ratingRepository as jest.Mocked<typeof ratingRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Rating & Company Tags', () => {
  const userId = 'user-rating';
  const email = 'rating@test.com';
  const token = generateTestToken(userId, email);
  const problemId = '10000000-0000-4000-a000-000000000001';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Rate a problem', () => {
    it('should submit a difficulty rating for a problem', async () => {
      mockedRatingRepo.upsert.mockResolvedValue({
        user_id: userId, problem_id: problemId, difficulty_rating: 3, created_at: '2026-03-22', updated_at: '2026-03-22',
      });

      const res = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId, rating: 3 });

      expect(res.status).toBe(201);
    });

    it('should reject rating outside 1-5 range', async () => {
      const res = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId, rating: 6 });

      expect(res.status).toBe(400);
    });

    it('should reject rating of 0', async () => {
      const res = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId, rating: 0 });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 2: Update an existing rating', () => {
    it('should update the rating to a higher value', async () => {
      mockedRatingRepo.upsert.mockResolvedValue({
        user_id: userId, problem_id: problemId, difficulty_rating: 4, created_at: '2026-03-22', updated_at: '2026-03-22',
      });

      const res = await request(app)
        .post('/api/ratings')
        .set('Authorization', `Bearer ${token}`)
        .send({ problemId, rating: 4 });

      expect(res.status).toBe(201);
    });
  });

  describe('Step 3: View own rating for a problem', () => {
    it('should retrieve the user rating for the problem', async () => {
      mockedRatingRepo.getUserRating.mockResolvedValue({
        user_id: userId, problem_id: problemId, difficulty_rating: 4, created_at: '2026-03-22', updated_at: '2026-03-22',
      });

      const res = await request(app)
        .get(`/api/ratings/${problemId}/mine`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.rating.difficulty_rating).toBe(4);
    });

    it('should return null for unrated problem', async () => {
      mockedRatingRepo.getUserRating.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/ratings/unrated-prob/mine')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.rating).toBeNull();
    });
  });

  describe('Step 4: View aggregate rating stats', () => {
    it('should show aggregate rating statistics', async () => {
      mockedRatingRepo.getStats.mockResolvedValue({
        problem_id: problemId, avg_rating: 3.5, rating_count: 120,
      });

      const res = await request(app)
        .get(`/api/ratings/${problemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.avg_rating).toBe(3.5);
    });
  });

  describe('Step 5: Browse company tags', () => {
    it('should list all company tags', async () => {
      mockedRatingRepo.listCompanyTags.mockResolvedValue([
        { id: 'ct-1', name: 'Google' },
        { id: 'ct-2', name: 'Amazon' },
        { id: 'ct-3', name: 'Meta' },
        { id: 'ct-4', name: 'Microsoft' },
      ]);

      const res = await request(app)
        .get('/api/ratings/companies')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tags).toHaveLength(4);
      expect(res.body.tags[0].name).toBe('Google');
    });
  });

  describe('Step 6: View company tags for a problem', () => {
    it('should show which companies asked this problem', async () => {
      mockedRatingRepo.getCompanyTagsForProblem.mockResolvedValue([
        { problem_id: problemId, company_tag_id: 'ct-1', company_name: 'Google', report_count: 45 },
        { problem_id: problemId, company_tag_id: 'ct-2', company_name: 'Amazon', report_count: 32 },
      ]);

      const res = await request(app)
        .get(`/api/ratings/${problemId}/companies`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tags).toHaveLength(2);
      expect(res.body.tags[0].company_name).toBe('Google');
    });
  });

  describe('Step 7: Report a company tag for a problem', () => {
    it('should report that a company asked this problem', async () => {
      mockedRatingRepo.reportCompanyTag.mockResolvedValue();

      const res = await request(app)
        .post(`/api/ratings/${problemId}/companies`)
        .set('Authorization', `Bearer ${token}`)
        .send({ companyTagId: '10000000-0000-4000-a000-000000000003' });

      expect(res.status).toBe(201);
      expect(mockedRatingRepo.reportCompanyTag).toHaveBeenCalledWith(problemId, '10000000-0000-4000-a000-000000000003', userId);
    });
  });
});
