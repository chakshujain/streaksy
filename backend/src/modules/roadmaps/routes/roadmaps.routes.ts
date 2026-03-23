import { Router } from 'express';
import { roadmapsController } from '../controller/roadmaps.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

// Public endpoints — no auth required (for share link previews)
router.get('/share/:code', asyncHandler(roadmapsController.getByShareCode));

router.use(authenticate);

// Categories & templates (browsing)
router.get('/categories', asyncHandler(roadmapsController.getCategories));
router.get('/templates', asyncHandler(roadmapsController.getTemplates));
router.get('/templates/featured', asyncHandler(roadmapsController.getFeaturedTemplates));
router.get('/templates/:slug', asyncHandler(roadmapsController.getTemplateBySlug));
router.get('/templates/:slug/participants', asyncHandler(roadmapsController.getTemplateParticipants));
router.get('/templates/:slug/discussions', asyncHandler(roadmapsController.getTemplateDiscussions));
router.post('/templates/:slug/discussions', asyncHandler(roadmapsController.createTemplateDiscussion));

// Today's tasks across all active roadmaps
router.get('/today', asyncHandler(roadmapsController.getTodayTasks));

// User roadmaps
router.post('/', asyncHandler(roadmapsController.createUserRoadmap));
router.get('/active', asyncHandler(roadmapsController.getActiveRoadmaps));
router.get('/all', asyncHandler(roadmapsController.getAllRoadmaps));

// Single roadmap operations
router.get('/:id', asyncHandler(roadmapsController.getRoadmapById));
router.patch('/:id', asyncHandler(roadmapsController.updateRoadmap));
router.delete('/:id', asyncHandler(roadmapsController.deleteRoadmap));
router.put('/:id/progress', asyncHandler(roadmapsController.updateDayProgress));
router.get('/:id/progress', asyncHandler(roadmapsController.getDayProgress));
router.get('/:id/streak', asyncHandler(roadmapsController.getStreak));
router.get('/:id/leaderboard', asyncHandler(roadmapsController.getLeaderboard));
router.post('/:id/link-group', asyncHandler(roadmapsController.linkGroup));
router.post('/:id/ai-guidance', asyncHandler(roadmapsController.getAIGuidance));
router.post('/:id/invite-friends', asyncHandler(roadmapsController.inviteFriends));

export default router;
