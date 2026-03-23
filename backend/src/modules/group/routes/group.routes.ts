import { Router } from 'express';
import { groupController } from '../controller/group.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createGroupSchema, joinGroupSchema, updatePlanSchema, assignSheetSchema } from '../validation/group.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/', validate(createGroupSchema), asyncHandler(groupController.create as any));
router.post('/join', validate(joinGroupSchema), asyncHandler(groupController.join as any));
router.get('/', asyncHandler(groupController.getUserGroups as any));
router.get('/:id/roadmaps', asyncHandler(groupController.getGroupRoadmaps as any));
router.get('/:id', asyncHandler(groupController.getDetails as any));
router.put('/:id/plan', validate(updatePlanSchema), asyncHandler(groupController.updatePlan as any));
router.post('/:id/sheets', validate(assignSheetSchema), asyncHandler(groupController.assignSheet as any));
router.get('/:id/sheets/:sheetId/progress', asyncHandler(groupController.getMemberSheetProgress as any));
router.delete('/:id/sheets/:sheetId', asyncHandler(groupController.removeSheet as any));
router.get('/:id/sheets', asyncHandler(groupController.getGroupSheets as any));
router.post('/:id/leave', asyncHandler(groupController.leaveGroup as any));
router.delete('/:id', asyncHandler(groupController.deleteGroup as any));
router.post('/:id/invite-friends', asyncHandler(groupController.inviteFriends));

export default router;
