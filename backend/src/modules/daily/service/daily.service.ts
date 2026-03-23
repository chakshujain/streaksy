import { query } from '../../../config/database';
import crypto from 'crypto';
import { generateDailyBrief } from '../../ai/service/ai.service';
import { checkAIRateLimit } from '../../../common/utils/aiRateLimit';
import { env } from '../../../config/env';
import { AppError } from '../../../common/errors/AppError';

interface DailyProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  url: string | null;
  youtube_url: string | null;
  sheet_name: string | null;
}

export const dailyService = {
  async getDailyProblems(userId: string, count = 4): Promise<DailyProblem[]> {
    // Deterministic seed for today + user
    const today = new Date().toISOString().split('T')[0];
    const seed = crypto.createHash('md5').update(`${userId}-${today}`).digest('hex');
    const seedInt = parseInt(seed.substring(0, 8), 16);

    // Get unsolved problems from user's group sheets first
    const groupProblems = await query<DailyProblem>(
      `SELECT DISTINCT p.id, p.title, p.slug, p.difficulty, p.url, p.youtube_url, s.name as sheet_name
       FROM problems p
       JOIN sheet_problems sp ON sp.problem_id = p.id
       JOIN group_sheets gs ON gs.sheet_id = sp.sheet_id
       JOIN group_members gm ON gm.group_id = gs.group_id
       JOIN sheets s ON s.id = sp.sheet_id
       LEFT JOIN user_problem_status ups ON ups.problem_id = p.id AND ups.user_id = $1
       WHERE gm.user_id = $1 AND (ups.status IS NULL OR ups.status != 'solved')
       ORDER BY p.id`,
      [userId]
    );

    // Fall back to popular sheets if no group sheets
    let pool = groupProblems;
    if (pool.length < count) {
      const popularProblems = await query<DailyProblem>(
        `SELECT DISTINCT p.id, p.title, p.slug, p.difficulty, p.url, p.youtube_url, s.name as sheet_name
         FROM problems p
         JOIN sheet_problems sp ON sp.problem_id = p.id
         JOIN sheets s ON s.id = sp.sheet_id
         LEFT JOIN user_problem_status ups ON ups.problem_id = p.id AND ups.user_id = $1
         WHERE s.slug IN ('neetcode-150', 'blind-75', 'grind-75')
           AND (ups.status IS NULL OR ups.status != 'solved')
         ORDER BY p.id`,
        [userId]
      );
      // Combine, dedup by id
      const seen = new Set(pool.map(p => p.id));
      for (const p of popularProblems) {
        if (!seen.has(p.id)) { pool.push(p); seen.add(p.id); }
      }
    }

    if (pool.length === 0) return [];

    // Deterministically pick problems with difficulty mix
    const easy = pool.filter(p => p.difficulty === 'easy');
    const medium = pool.filter(p => p.difficulty === 'medium');
    const hard = pool.filter(p => p.difficulty === 'hard');

    const pick = (arr: DailyProblem[], offset: number): DailyProblem | null => {
      if (arr.length === 0) return null;
      return arr[(seedInt + offset) % arr.length];
    };

    const picks: DailyProblem[] = [];
    const used = new Set<string>();

    const add = (p: DailyProblem | null) => {
      if (p && !used.has(p.id)) { picks.push(p); used.add(p.id); }
    };

    // Target: 1 easy, 2 medium, 1 hard
    add(pick(easy, 0));
    add(pick(medium, 1));
    add(pick(medium, 2));
    add(pick(hard, 3));

    // Fill remaining slots if we don't have enough of each difficulty
    let fillOffset = 4;
    while (picks.length < count && fillOffset < count + 20) {
      add(pick(pool, fillOffset));
      fillOffset++;
    }

    return picks.slice(0, count);
  },

  async getAIBrief(userId: string) {
    if (!env.ai.apiKey) {
      throw new AppError(503, 'AI generation is not available. NVIDIA_API_KEY is not configured.');
    }

    await checkAIRateLimit(userId);

    const problems = await this.getDailyProblems(userId);
    if (problems.length === 0) {
      throw AppError.badRequest('No daily problems available.');
    }

    // Get tags for each problem
    const problemsWithTags = await Promise.all(
      problems.map(async (p) => {
        const tags = await query<{ name: string }>(
          'SELECT t.name FROM tags t JOIN problem_tags pt ON pt.tag_id = t.id WHERE pt.problem_id = $1',
          [p.id]
        );
        return {
          title: p.title,
          difficulty: p.difficulty,
          tags: tags.map(t => t.name),
        };
      })
    );

    const brief = await generateDailyBrief(problemsWithTags);

    if (!brief) {
      throw new AppError(502, 'AI service failed to generate daily brief. Please try again later.');
    }

    return brief;
  },
};
