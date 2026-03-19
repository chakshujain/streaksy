import { Router } from 'express';
import { discussionController } from '../controller/discussion.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createCommentSchema, updateCommentSchema } from '../validation/discussion.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

// Problem-scoped comment routes
router.get('/:slug/comments', asyncHandler(discussionController.getComments));
router.post('/:slug/comments', validate(createCommentSchema), asyncHandler(discussionController.createComment));

// Comment-scoped routes
router.get('/:id/replies', asyncHandler(discussionController.getReplies));
router.put('/:id', validate(updateCommentSchema), asyncHandler(discussionController.updateComment));
router.delete('/:id', asyncHandler(discussionController.deleteComment));

export default router;
