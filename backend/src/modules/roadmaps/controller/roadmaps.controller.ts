import { Request, Response } from 'express';
import { roadmapsService } from '../service/roadmaps.service';
import { AuthRequest } from '../../../common/types';
import { param } from '../../../common/utils/params';

export const roadmapsController = {
  async getCategories(_req: Request, res: Response) {
    const categories = await roadmapsService.getCategories();
    res.json({ categories });
  },

  async getTemplates(req: Request, res: Response) {
    const category = req.query.category as string | undefined;
    const templates = await roadmapsService.getTemplates(category);
    res.json({ templates });
  },

  async getTemplateBySlug(req: Request, res: Response) {
    const slug = param(req, 'slug');
    const template = await roadmapsService.getTemplateBySlug(slug);
    res.json({ template });
  },

  async getFeaturedTemplates(_req: Request, res: Response) {
    const templates = await roadmapsService.getFeaturedTemplates();
    res.json({ templates });
  },

  async createUserRoadmap(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const { templateId, groupId, name, categoryId, durationDays, startDate, customTasks } = req.body;
    const roadmap = await roadmapsService.createUserRoadmap(user!.userId, {
      templateId,
      groupId,
      name,
      categoryId,
      durationDays,
      startDate,
      customTasks,
    });
    res.status(201).json({ roadmap });
  },

  async getActiveRoadmaps(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roadmaps = await roadmapsService.getActiveRoadmaps(user!.userId);
    res.json({ roadmaps });
  },

  async getAllRoadmaps(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const roadmaps = await roadmapsService.getAllRoadmaps(user!.userId);
    res.json({ roadmaps });
  },

  async getRoadmapById(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const data = await roadmapsService.getRoadmapById(id, user!.userId);
    res.json(data);
  },

  async updateRoadmap(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const { status, name } = req.body;
    const roadmap = await roadmapsService.updateRoadmap(id, user!.userId, { status, name });
    res.json({ roadmap });
  },

  async deleteRoadmap(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    await roadmapsService.deleteRoadmap(id, user!.userId);
    res.json({ message: 'Roadmap deleted' });
  },

  async updateDayProgress(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const { day, completed } = req.body;
    const result = await roadmapsService.updateDayProgress(id, user!.userId, day, completed);
    res.json(result);
  },

  async getDayProgress(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const progress = await roadmapsService.getDayProgress(id, user!.userId);
    res.json({ progress });
  },

  async getStreak(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const streak = await roadmapsService.getStreak(id, user!.userId);
    res.json({ streak });
  },

  async getLeaderboard(req: Request, res: Response) {
    const id = param(req, 'id');
    const leaderboard = await roadmapsService.getLeaderboard(id);
    res.json({ leaderboard });
  },

  async getByShareCode(req: Request, res: Response) {
    const code = param(req, 'code');
    const roadmap = await roadmapsService.getByShareCode(code);
    res.json({ roadmap });
  },

  async linkGroup(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const { groupId } = req.body;
    await roadmapsService.linkGroup(id, user!.userId, groupId);
    res.json({ message: 'Group linked' });
  },

  async getTodayTasks(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const tasks = await roadmapsService.getTodayTasks(user!.userId);
    res.json({ tasks });
  },

  async getGlobalLeaderboard(_req: Request, res: Response) {
    const leaderboard = await roadmapsService.getGlobalLeaderboard();
    res.json({ leaderboard });
  },

  async getTemplateParticipants(req: Request, res: Response) {
    const slug = param(req, 'slug');
    const participants = await roadmapsService.getParticipants(slug);
    res.json({ participants });
  },

  async getTemplateDiscussions(req: Request, res: Response) {
    const slug = param(req, 'slug');
    const rawLimit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const rawOffset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
    const limit = rawLimit && Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 100) : undefined;
    const offset = rawOffset && Number.isFinite(rawOffset) && rawOffset >= 0 ? rawOffset : undefined;
    const discussions = await roadmapsService.getDiscussions(slug, limit, offset);
    res.json({ discussions });
  },

  async createTemplateDiscussion(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const slug = param(req, 'slug');
    const { content, parentId } = req.body;
    const discussion = await roadmapsService.createDiscussion(slug, user!.userId, content, parentId);
    res.status(201).json({ discussion });
  },

  async getAIGuidance(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const guidance = await roadmapsService.getAIGuidance(id, user!.userId);
    res.json({ guidance });
  },

  async inviteFriends(req: Request, res: Response) {
    const { user } = req as AuthRequest;
    const id = param(req, 'id');
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'userIds must be a non-empty array' });
    }
    await roadmapsService.inviteFriends(id, user!.userId, userIds);
    res.json({ message: 'Invitations sent' });
  },
};
