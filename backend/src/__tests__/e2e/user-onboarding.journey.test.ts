import request from 'supertest';
import app from '../../app';
import { generateTestToken, mockUserRow } from '../helpers';
import { authRepository } from '../../modules/auth/repository/auth.repository';
import { preferencesRepository } from '../../modules/preferences/repository/preferences.repository';
import { roadmapsRepository } from '../../modules/roadmaps/repository/roadmaps.repository';
import { streakRepository } from '../../modules/streak/repository/streak.repository';
import { query, queryOne } from '../../config/database';

jest.mock('../../modules/auth/repository/auth.repository');
jest.mock('../../modules/preferences/repository/preferences.repository');
jest.mock('../../modules/roadmaps/repository/roadmaps.repository');
jest.mock('../../modules/streak/repository/streak.repository');
jest.mock('../../modules/streak/service/streaks-engine', () => ({
  streaksEngine: {
    calculatePoints: jest.fn().mockResolvedValue({ totalPoints: 15, basePoints: 10, streakBonus: 5, multipliers: [] }),
    calculateCompletionBonus: jest.fn().mockReturnValue({ bonus: 100 }),
    cacheMultiplierPreview: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../config/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

const mockedAuthRepo = authRepository as jest.Mocked<typeof authRepository>;
const mockedPrefsRepo = preferencesRepository as jest.Mocked<typeof preferencesRepository>;
const mockedRoadmapsRepo = roadmapsRepository as jest.Mocked<typeof roadmapsRepository>;
const mockedStreakRepo = streakRepository as jest.Mocked<typeof streakRepository>;
const mockedQuery = query as jest.MockedFunction<typeof query>;
const mockedQueryOne = queryOne as jest.MockedFunction<typeof queryOne>;

describe('E2E Journey: User Onboarding', () => {
  const userId = 'new-user-id';
  const email = 'newuser@example.com';
  const password = 'SecurePass123!';
  const displayName = 'New User';

  let authToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Step 1: User signs up', () => {
    it('should create a new account and return a token', async () => {
      const createdUser = mockUserRow({
        id: userId,
        email,
        display_name: displayName,
        email_verified: false,
      });

      mockedAuthRepo.findByEmail.mockResolvedValue(null);
      mockedAuthRepo.create.mockResolvedValue(createdUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email, password, displayName });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe(email);
      expect(res.body.user.displayName).toBe(displayName);
      expect(res.body.user.emailVerified).toBe(false);
      expect(res.body.token).toBeDefined();

      authToken = res.body.token;
    });

    it('should reject duplicate email signup', async () => {
      mockedAuthRepo.findByEmail.mockResolvedValue(mockUserRow({ email }));

      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email, password, displayName });

      expect(res.status).toBe(409);
    });
  });

  describe('Step 2: Verify email', () => {
    it('should verify the user email with a valid token', async () => {
      const verificationToken = 'valid-verification-token';
      mockedAuthRepo.findByVerificationToken.mockResolvedValue(
        mockUserRow({ id: userId, email, email_verification_token: verificationToken })
      );
      mockedAuthRepo.markEmailVerified.mockResolvedValue();

      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: verificationToken });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Email verified successfully');
      expect(mockedAuthRepo.markEmailVerified).toHaveBeenCalledWith(userId);
    });

    it('should reject an invalid verification token', async () => {
      mockedAuthRepo.findByVerificationToken.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'invalid-token' });

      expect(res.status).toBe(400);
    });
  });

  describe('Step 3: Login with verified account', () => {
    it('should login and return user data with token', async () => {
      const verifiedUser = mockUserRow({
        id: userId,
        email,
        display_name: displayName,
        email_verified: true,
      });

      mockedAuthRepo.findByEmail.mockResolvedValue(verifiedUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password });

      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(userId);
      expect(res.body.user.emailVerified).toBe(true);
      expect(res.body.token).toBeDefined();

      // Store the token for subsequent steps
      authToken = res.body.token;
    });

    it('should reject login with wrong password', async () => {
      mockedAuthRepo.findByEmail.mockResolvedValue(mockUserRow({ id: userId, email }));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'WrongPassword!' });

      expect(res.status).toBe(401);
    });
  });

  describe('Step 4: Set user preferences', () => {
    it('should update preferences after login', async () => {
      const token = generateTestToken(userId, email);

      mockedPrefsRepo.upsert.mockResolvedValue({
        user_id: userId,
        theme: 'dark',
        accent_color: '#10b981',
        dashboard_layout: 'compact',
        show_streak_animation: true,
        show_heatmap: true,
        weekly_goal: 5,
        updated_at: new Date(),
      });

      const res = await request(app)
        .put('/api/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({ theme: 'dark', dashboard_layout: 'compact', weekly_goal: 5 });

      expect(res.status).toBe(200);
      expect(res.body.preferences.theme).toBe('dark');
      expect(res.body.preferences.weekly_goal).toBe(5);
    });

    it('should retrieve saved preferences', async () => {
      const token = generateTestToken(userId, email);

      mockedPrefsRepo.get.mockResolvedValue({
        user_id: userId,
        theme: 'dark',
        accent_color: '#10b981',
        dashboard_layout: 'compact',
        show_streak_animation: true,
        show_heatmap: true,
        weekly_goal: 5,
        updated_at: new Date(),
      });

      const res = await request(app)
        .get('/api/preferences')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.preferences.theme).toBe('dark');
    });
  });

  describe('Step 5: Browse available roadmaps', () => {
    it('should list roadmap categories', async () => {
      const token = generateTestToken(userId, email);

      mockedRoadmapsRepo.getCategories.mockResolvedValue([
        { id: 'cat-1', name: 'Coding & Tech', slug: 'coding-tech', icon: 'Code', color: '#4F46E5', position: 1 },
        { id: 'cat-2', name: 'Fitness & Health', slug: 'fitness-health', icon: 'Dumbbell', color: '#EF4444', position: 2 },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.categories).toHaveLength(2);
      expect(res.body.categories[0].slug).toBe('coding-tech');
    });

    it('should list templates in a category', async () => {
      const token = generateTestToken(userId, email);

      mockedRoadmapsRepo.getTemplates.mockResolvedValue([
        {
          id: 'tmpl-1', category_id: 'cat-1', name: 'Crack the Job Together',
          slug: 'crack-the-job-together', description: '90-day coding roadmap',
          icon: 'Rocket', color: '#4F46E5', duration_days: 90,
          difficulty: 'intermediate', is_featured: true, participant_count: 50,
          created_at: new Date(), task_count: 90,
          category_slug: 'coding-tech', category_name: 'Coding & Tech',
        },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/templates?category=coding-tech')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.templates).toHaveLength(1);
      expect(res.body.templates[0].slug).toBe('crack-the-job-together');
    });

    it('should view template details', async () => {
      const token = generateTestToken(userId, email);

      mockedRoadmapsRepo.getTemplateBySlug.mockResolvedValue({
        id: 'tmpl-1', category_id: 'cat-1', name: 'Crack the Job Together',
        slug: 'crack-the-job-together', description: '90-day coding roadmap',
        icon: 'Rocket', color: '#4F46E5', duration_days: 90,
        difficulty: 'intermediate', is_featured: true, participant_count: 50,
        created_at: new Date(), task_count: 90,
        category_slug: 'coding-tech', category_name: 'Coding & Tech',
        tasks: [
          { id: 'task-1', day_number: 1, title: 'Arrays & Hashing', description: 'Learn basics', task_type: 'study', link: null },
        ],
      });

      const res = await request(app)
        .get('/api/roadmaps/templates/crack-the-job-together')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.template.name).toBe('Crack the Job Together');
      expect(res.body.template.tasks).toHaveLength(1);
    });
  });

  describe('Step 6: Start a roadmap', () => {
    it('should create a user roadmap from a template', async () => {
      const token = generateTestToken(userId, email);

      const mockRoadmap = {
        id: 'roadmap-1', user_id: userId, template_id: 'tmpl-1',
        group_id: null, name: 'My DSA Journey', category_id: 'cat-1',
        duration_days: 90, start_date: '2026-03-22', status: 'active',
        custom_tasks: null, share_code: 'xyz789', created_at: new Date(),
        updated_at: new Date(), completed_days: 0,
        template_slug: 'crack-the-job-together',
        category_slug: 'coding-tech', category_icon: 'Code',
      };

      mockedRoadmapsRepo.createUserRoadmap.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.addParticipant.mockResolvedValue();

      const res = await request(app)
        .post('/api/roadmaps')
        .set('Authorization', `Bearer ${token}`)
        .send({
          templateId: 'tmpl-1',
          name: 'My DSA Journey',
          durationDays: 90,
        });

      expect(res.status).toBe(201);
      expect(res.body.roadmap.name).toBe('My DSA Journey');
      expect(res.body.roadmap.status).toBe('active');
      expect(res.body.roadmap.share_code).toBeDefined();
    });

    it('should see the new roadmap in active roadmaps list', async () => {
      const token = generateTestToken(userId, email);

      mockedRoadmapsRepo.getActiveRoadmaps.mockResolvedValue([
        {
          id: 'roadmap-1', user_id: userId, template_id: 'tmpl-1',
          group_id: null, name: 'My DSA Journey', category_id: 'cat-1',
          duration_days: 90, start_date: '2026-03-22', status: 'active',
          custom_tasks: null, share_code: 'xyz789', created_at: new Date(),
          updated_at: new Date(), completed_days: 0,
          template_slug: 'crack-the-job-together',
          category_slug: 'coding-tech', category_icon: 'Code',
        },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/active')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.roadmaps).toHaveLength(1);
      expect(res.body.roadmaps[0].name).toBe('My DSA Journey');
    });
  });

  describe('Step 7: Complete first day task', () => {
    it('should mark day 1 as completed and earn streak points', async () => {
      const token = generateTestToken(userId, email);

      const mockRoadmap = {
        id: 'roadmap-1', user_id: userId, template_id: 'tmpl-1',
        group_id: null, name: 'My DSA Journey', category_id: 'cat-1',
        duration_days: 90, start_date: '2026-03-22', status: 'active',
        custom_tasks: null, share_code: 'xyz789', created_at: new Date(),
        updated_at: new Date(), completed_days: 0,
        template_slug: 'crack-the-job-together',
        category_slug: 'coding-tech', category_icon: 'Code',
      };

      const mockDayProgress = {
        roadmap_id: 'roadmap-1', user_id: userId,
        day_number: 1, completed: true, completed_at: new Date(), notes: null,
      };

      const mockStreak = {
        id: 'streak-1', roadmap_id: 'roadmap-1', user_id: userId,
        current_streak: 1, longest_streak: 1, last_activity_date: '2026-03-22',
      };

      mockedRoadmapsRepo.getRoadmapById.mockResolvedValue(mockRoadmap);
      mockedRoadmapsRepo.updateDayProgress.mockResolvedValue(mockDayProgress);
      mockedRoadmapsRepo.updateStreak.mockResolvedValue(mockStreak);
      mockedRoadmapsRepo.getDayProgress.mockResolvedValue([mockDayProgress]);
      mockedRoadmapsRepo.addPoints.mockResolvedValue();

      const res = await request(app)
        .put('/api/roadmaps/roadmap-1/progress')
        .set('Authorization', `Bearer ${token}`)
        .send({ day: 1, completed: true });

      expect(res.status).toBe(200);
      expect(res.body.progress).toBeDefined();
      expect(mockedRoadmapsRepo.updateDayProgress).toHaveBeenCalled();
      expect(mockedRoadmapsRepo.updateStreak).toHaveBeenCalled();
    });
  });

  describe('Step 8: Check streak after first task completion', () => {
    it('should show current streak of 1 day', async () => {
      const token = generateTestToken(userId, email);

      mockedRoadmapsRepo.getStreak.mockResolvedValue({
        id: 'streak-1', roadmap_id: 'roadmap-1', user_id: userId,
        current_streak: 1, longest_streak: 1, last_activity_date: '2026-03-22',
      });

      const res = await request(app)
        .get('/api/roadmaps/roadmap-1/streak')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.streak.current_streak).toBe(1);
      expect(res.body.streak.longest_streak).toBe(1);
    });

    it('should show today tasks as completed', async () => {
      const token = generateTestToken(userId, email);

      mockedRoadmapsRepo.getTodayTasks.mockResolvedValue([
        {
          roadmap_id: 'roadmap-1', roadmap_name: 'My DSA Journey',
          day_number: 1, title: 'Arrays & Hashing',
          description: null, task_type: 'study', link: null, completed: true,
        },
      ]);

      const res = await request(app)
        .get('/api/roadmaps/today')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.tasks).toHaveLength(1);
      expect(res.body.tasks[0].completed).toBe(true);
    });
  });
});
