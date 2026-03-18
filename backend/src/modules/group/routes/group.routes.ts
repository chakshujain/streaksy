import { Router } from 'express';
import { groupController } from '../controller/group.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createGroupSchema, joinGroupSchema } from '../validation/group.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/', validate(createGroupSchema), asyncHandler(groupController.create as any));
router.post('/join', validate(joinGroupSchema), asyncHandler(groupController.join as any));
router.get('/', asyncHandler(groupController.getUserGroups as any));
router.get('/:id', asyncHandler(groupController.getDetails as any));

export default router;
