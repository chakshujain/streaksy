process.env.NVIDIA_API_KEY = 'test-key';

import request from 'supertest';
import app from '../../app';
import { generateTestToken } from '../helpers';
import { answerLessonQuestion } from '../../modules/ai/service/ai.service';

jest.mock('../../modules/ai/service/ai.service', () => ({
  answerLessonQuestion: jest.fn().mockResolvedValue({
    answer: 'A hash table provides O(1) average-case lookup by using a hash function to map keys to array indices.',
    codeExample: null,
    relatedConcepts: ['hash functions', 'collision resolution'],
  }),
  generateRevisionNotes: jest.fn(),
  generateHints: jest.fn(),
  generateExplanation: jest.fn(),
  reviewCode: jest.fn(),
  generateDailyBrief: jest.fn(),
  generateDashboardInsight: jest.fn(),
}));
jest.mock('../../common/utils/aiRateLimit', () => ({
  checkAIRateLimit: jest.fn().mockResolvedValue(undefined),
}));

const mockedAnswerLessonQuestion = answerLessonQuestion as jest.MockedFunction<typeof answerLessonQuestion>;

describe('E2E Journey: Learn AI Assistance', () => {
  const userId = '60000000-0000-4000-a000-000000000001';
  const email = 'learner@test.com';
  const token = generateTestToken(userId, email);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAnswerLessonQuestion.mockResolvedValue({
      answer: 'A hash table provides O(1) average-case lookup by using a hash function to map keys to array indices.',
      codeExample: null,
      relatedConcepts: ['hash functions', 'collision resolution'],
    } as any);
  });

  describe('Step 1: Ask AI about a database lesson', () => {
    it('should return an AI answer for a lesson question', async () => {
      const res = await request(app)
        .post('/api/learn/ask-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic: 'databases',
          lesson: 'Hash Tables & Indexes',
          question: 'How does a hash table provide O(1) lookups?',
        });

      expect(res.status).toBe(200);
      expect(res.body.answer).toBeDefined();
      expect(res.body.answer.answer).toBeDefined();
      expect(mockedAnswerLessonQuestion).toHaveBeenCalledWith(
        'databases',
        'Hash Tables & Indexes',
        'How does a hash table provide O(1) lookups?',
      );
    });
  });

  describe('Step 2: Ask AI about system design', () => {
    it('should handle different topics', async () => {
      mockedAnswerLessonQuestion.mockResolvedValueOnce({
        answer: 'Load balancing distributes traffic across multiple servers using algorithms like round-robin, least connections, or consistent hashing.',
        codeExample: null,
        relatedConcepts: ['round-robin', 'least connections'],
      });

      const res = await request(app)
        .post('/api/learn/ask-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic: 'system-design',
          lesson: 'Load Balancing',
          question: 'What are the common load balancing algorithms?',
        });

      expect(res.status).toBe(200);
      expect(res.body.answer.answer).toContain('Load balancing');
    });
  });

  describe('Step 3: Validation checks', () => {
    it('should reject request without required fields', async () => {
      const res = await request(app)
        .post('/api/learn/ask-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ topic: 'databases' });

      expect(res.status).toBe(400);
    });

    it('should reject request with empty question', async () => {
      const res = await request(app)
        .post('/api/learn/ask-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ topic: 'databases', lesson: 'Indexes', question: '' });

      expect(res.status).toBe(400);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/learn/ask-ai')
        .send({
          topic: 'databases',
          lesson: 'Hash Tables',
          question: 'How do hash tables work?',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('Step 4: AI rate limiting', () => {
    it('should enforce daily AI generation limit', async () => {
      const { AppError } = require('../../common/errors/AppError');
      const { checkAIRateLimit } = require('../../common/utils/aiRateLimit');
      checkAIRateLimit.mockRejectedValueOnce(
        new AppError(429, 'AI generation limit reached. Maximum 30 generations per day.')
      );

      const res = await request(app)
        .post('/api/learn/ask-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic: 'databases',
          lesson: 'Indexes',
          question: 'How do indexes work?',
        });

      expect(res.status).toBe(429);
    });
  });

  describe('Step 5: Multiple topics supported', () => {
    it('should answer questions about DSA patterns', async () => {
      mockedAnswerLessonQuestion.mockResolvedValueOnce({
        answer: 'The sliding window pattern is used for problems involving contiguous subarrays or substrings.',
        codeExample: null,
        relatedConcepts: ['two pointers'],
      });

      const res = await request(app)
        .post('/api/learn/ask-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic: 'dsa-patterns',
          lesson: 'Sliding Window',
          question: 'When should I use the sliding window pattern?',
        });

      expect(res.status).toBe(200);
      expect(res.body.answer.answer).toContain('sliding window');
    });

    it('should answer questions about OOP', async () => {
      mockedAnswerLessonQuestion.mockResolvedValueOnce({
        answer: 'The SOLID principles are: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
        codeExample: null,
        relatedConcepts: ['design principles'],
      });

      const res = await request(app)
        .post('/api/learn/ask-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({
          topic: 'oops',
          lesson: 'SOLID Principles',
          question: 'What are the SOLID principles?',
        });

      expect(res.status).toBe(200);
      expect(res.body.answer.answer).toContain('SOLID');
    });
  });
});
