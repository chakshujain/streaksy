import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { problemRepository } from '../../modules/problem/repository/problem.repository';
import { progressRepository } from '../../modules/progress/repository/progress.repository';
import { notesRepository } from '../../modules/notes/repository/notes.repository';
import { discussionRepository } from '../../modules/discussion/repository/discussion.repository';
import { revisionRepository } from '../../modules/revision/repository/revision.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/problem/repository/problem.repository');
jest.mock('../../modules/progress/repository/progress.repository');
jest.mock('../../modules/notes/repository/notes.repository');
jest.mock('../../modules/discussion/repository/discussion.repository');
jest.mock('../../modules/revision/repository/revision.repository');

const mockedProblemRepo = problemRepository as jest.Mocked<typeof problemRepository>;
const mockedProgressRepo = progressRepository as jest.Mocked<typeof progressRepository>;
const mockedNotesRepo = notesRepository as jest.Mocked<typeof notesRepository>;
const mockedDiscussionRepo = discussionRepository as jest.Mocked<typeof discussionRepository>;
const mockedRevisionRepo = revisionRepository as jest.Mocked<typeof revisionRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: Content Engagement', () => {
  const userId = 'user-engaged';
  const email = 'engaged@test.com';
  const token = generateTestToken(userId, email);

  const mockProblem = {
    id: 'prob-1', title: 'Two Sum', slug: 'two-sum',
    difficulty: 'easy', url: 'https://leetcode.com/problems/two-sum/',
    youtube_url: null, video_title: null, created_at: new Date(),
  };

  const mockProblem2 = {
    id: 'prob-2', title: 'Valid Parentheses', slug: 'valid-parentheses',
    difficulty: 'easy', url: 'https://leetcode.com/problems/valid-parentheses/',
    youtube_url: null, video_title: null, created_at: new Date(),
  };

  const mockProblem3 = {
    id: 'prob-3', title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists',
    difficulty: 'easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
    youtube_url: null, video_title: null, created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: Browse problems', () => {
    it('should list problems with pagination', async () => {
      mockedProblemRepo.list.mockResolvedValue([mockProblem, mockProblem2, mockProblem3]);
      mockedProblemRepo.count.mockResolvedValue(3);

      const res = await request(app)
        .get('/api/problems?limit=10&offset=0')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(3);
      expect(res.body.total).toBe(3);
    });

    it('should filter problems by difficulty', async () => {
      mockedProblemRepo.list.mockResolvedValue([mockProblem, mockProblem2]);
      mockedProblemRepo.count.mockResolvedValue(2);

      const res = await request(app)
        .get('/api/problems?difficulty=easy')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems.every((p: any) => p.difficulty === 'easy')).toBe(true);
    });

    it('should search problems by keyword', async () => {
      mockedProblemRepo.search.mockResolvedValue([mockProblem]);

      const res = await request(app)
        .get('/api/problems/search?q=two+sum')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(1);
      expect(res.body.problems[0].title).toBe('Two Sum');
    });
  });

  describe('Step 2: Filter by sheet', () => {
    it('should list available sheets', async () => {
      mockedProblemRepo.getSheets.mockResolvedValue([
        { id: 'sheet-1', name: 'Blind 75', slug: 'blind-75', description: 'Must-do 75 problems' },
        { id: 'sheet-2', name: 'Neetcode 150', slug: 'neetcode-150', description: 'Expanded set' },
      ]);

      const res = await request(app)
        .get('/api/sheets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.sheets).toHaveLength(2);
    });

    it('should get problems from a specific sheet', async () => {
      mockedProblemRepo.getSheetProblems.mockResolvedValue([mockProblem, mockProblem2]);

      const res = await request(app)
        .get('/api/sheets/blind-75/problems')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toHaveLength(2);
    });
  });

  describe('Step 3: Toggle problem status', () => {
    it('should mark a problem as solved', async () => {
      mockedProgressRepo.upsert.mockResolvedValue({
        user_id: userId, problem_id: 'prob-1',
        status: 'solved', solved_at: new Date(), updated_at: new Date(),
      });
      mockedProgressRepo.getSolvedCountToday.mockResolvedValue(1);
      mockedQueryOne.mockResolvedValue({ current_streak: 1, longest_streak: 1, last_solve_date: '2026-03-22' });

      const res = await request(app)
        .put('/api/progress/prob-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'solved' });

      expect(res.status).toBe(200);
    });

    it('should mark another problem as attempted', async () => {
      mockedProgressRepo.upsert.mockResolvedValue({
        user_id: userId, problem_id: 'prob-2',
        status: 'attempted', solved_at: null, updated_at: new Date(),
      });
      mockedProgressRepo.getSolvedCountToday.mockResolvedValue(1);

      const res = await request(app)
        .put('/api/progress/prob-2')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'attempted' });

      expect(res.status).toBe(200);
    });

    it('should show user progress for problems', async () => {
      mockedProgressRepo.getUserProgress.mockResolvedValue([
        { user_id: userId, problem_id: 'prob-1', status: 'solved', solved_at: new Date(), updated_at: new Date() },
        { user_id: userId, problem_id: 'prob-2', status: 'attempted', solved_at: null, updated_at: new Date() },
      ]);

      const res = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(2);
    });
  });

  describe('Step 4: Add notes to a problem', () => {
    it('should add a personal note', async () => {
      mockedNotesRepo.create.mockResolvedValue({
        id: 'note-1', user_id: userId, problem_id: 'prob-1',
        group_id: null, content: 'HashMap approach: store complement and check on each iteration.',
        visibility: 'personal', created_at: new Date(), updated_at: new Date(),
      });

      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problemId: 'prob-1',
          content: 'HashMap approach: store complement and check on each iteration.',
          visibility: 'personal',
        });

      expect(res.status).toBe(201);
      expect(res.body.note.content).toContain('HashMap');
    });

    it('should update an existing note', async () => {
      mockedNotesRepo.update.mockResolvedValue({
        id: 'note-1', user_id: userId, problem_id: 'prob-1',
        group_id: null, content: 'Updated: Use enumerate() in Python for cleaner code.',
        visibility: 'personal', created_at: new Date(), updated_at: new Date(),
      });

      const res = await request(app)
        .put('/api/notes/note-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Updated: Use enumerate() in Python for cleaner code.' });

      expect(res.status).toBe(200);
      expect(res.body.note.content).toContain('enumerate');
    });
  });

  describe('Step 5: Start a discussion on a problem', () => {
    it('should create a discussion comment', async () => {
      mockedDiscussionRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedDiscussionRepo.create.mockResolvedValue({
        id: 'comment-1', problem_id: 'prob-1', user_id: userId,
        parent_id: null, content: 'Is it possible to solve this without extra space?',
        created_at: new Date(), updated_at: new Date(),
      });

      const res = await request(app)
        .post('/api/discussions/two-sum')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Is it possible to solve this without extra space?' });

      expect(res.status).toBe(201);
      expect(res.body.comment.content).toContain('extra space');
    });

    it('should reply to a discussion comment', async () => {
      mockedDiscussionRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedDiscussionRepo.findById.mockResolvedValue({
        id: 'comment-1', problem_id: 'prob-1', user_id: userId,
        parent_id: null, content: 'Is it possible to solve this without extra space?',
        created_at: new Date(), updated_at: new Date(),
      });
      mockedDiscussionRepo.create.mockResolvedValue({
        id: 'comment-2', problem_id: 'prob-1', user_id: 'other-user',
        parent_id: 'comment-1', content: 'Yes, sort the array first and use two pointers!',
        created_at: new Date(), updated_at: new Date(),
      });

      const otherToken = generateTestToken('other-user', 'other@test.com');

      const res = await request(app)
        .post('/api/discussions/two-sum')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          content: 'Yes, sort the array first and use two pointers!',
          parentId: 'comment-1',
        });

      expect(res.status).toBe(201);
      expect(res.body.comment.parent_id).toBe('comment-1');
    });

    it('should list discussion comments for a problem', async () => {
      mockedDiscussionRepo.getProblemIdFromSlug.mockResolvedValue('prob-1');
      mockedDiscussionRepo.getForProblem.mockResolvedValue([
        {
          id: 'comment-1', problem_id: 'prob-1', user_id: userId,
          parent_id: null, content: 'Is it possible to solve this without extra space?',
          created_at: new Date(), updated_at: new Date(),
          display_name: 'Engaged User',
        },
      ]);

      const res = await request(app)
        .get('/api/discussions/two-sum')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.comments).toHaveLength(1);
    });
  });

  describe('Step 6: Check daily challenge', () => {
    it('should return daily challenge problems', async () => {
      // Daily service uses raw query
      mockedQuery
        .mockResolvedValueOnce([mockProblem]) // group problems
        .mockResolvedValueOnce([]); // popular problems

      const res = await request(app)
        .get('/api/daily')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.problems).toBeDefined();
      expect(res.body.date).toBeDefined();
    });
  });

  describe('Step 7: Complete a revision quiz', () => {
    it('should get random problems for revision', async () => {
      mockedRevisionRepo.getRandomForRevision.mockResolvedValue([
        {
          id: 'rev-1', user_id: userId, problem_id: 'prob-1',
          key_takeaway: 'Use hash map for complement lookup',
          approach: 'Single pass hash map', time_complexity: 'O(n)',
          space_complexity: 'O(n)', tags: ['hash-map', 'array'],
          difficulty_rating: 'easy', intuition: null,
          points_to_remember: null, ai_generated: false,
          last_revised_at: null, revision_count: 0,
          created_at: new Date(), updated_at: new Date(),
          problem_title: 'Two Sum', problem_slug: 'two-sum', problem_difficulty: 'easy',
        },
      ]);

      const res = await request(app)
        .get('/api/revisions/quiz?count=5')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.revisions).toHaveLength(1);
      expect(res.body.revisions[0].problem_title).toBe('Two Sum');
    });

    it('should mark a revision as completed', async () => {
      mockedRevisionRepo.findById.mockResolvedValue({
        id: 'rev-1', user_id: userId, problem_id: 'prob-1',
        key_takeaway: 'Use hash map', approach: null,
        time_complexity: null, space_complexity: null,
        tags: [], difficulty_rating: null, intuition: null,
        points_to_remember: null, ai_generated: false,
        last_revised_at: null, revision_count: 0,
        created_at: new Date(), updated_at: new Date(),
      });
      mockedRevisionRepo.markRevised.mockResolvedValue();

      const res = await request(app)
        .patch('/api/revisions/rev-1/revise')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Marked as revised');
      expect(mockedRevisionRepo.markRevised).toHaveBeenCalledWith('rev-1', userId);
    });
  });

  describe('Step 8: View sheet progress after solving problems', () => {
    it('should show progress within a sheet', async () => {
      mockedProgressRepo.getUserProgressForSheet.mockResolvedValue([
        { slug: 'two-sum', title: 'Two Sum', difficulty: 'easy', status: 'solved', solved_at: new Date() },
        { slug: 'valid-parentheses', title: 'Valid Parentheses', difficulty: 'easy', status: 'attempted', solved_at: null },
        { slug: 'merge-two-sorted-lists', title: 'Merge Two Sorted Lists', difficulty: 'easy', status: 'not_started', solved_at: null },
      ]);

      const res = await request(app)
        .get('/api/progress/sheet/blind-75')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.progress).toHaveLength(3);
      expect(res.body.progress.filter((p: any) => p.status === 'solved')).toHaveLength(1);
      expect(res.body.progress.filter((p: any) => p.status === 'attempted')).toHaveLength(1);
      expect(res.body.progress.filter((p: any) => p.status === 'not_started')).toHaveLength(1);
    });
  });
});
