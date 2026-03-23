import { Router } from 'express';
import { discussionController } from '../controller/discussion.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createCommentSchema, updateCommentSchema } from '../validation/discussion.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

// Problem-scoped routes (mounted at /api/problems)
const problemDiscussionRouter = Router();
problemDiscussionRouter.use(authenticate);
problemDiscussionRouter.get('/:slug/comments', asyncHandler(discussionController.getComments));
problemDiscussionRouter.post('/:slug/comments', validate(createCommentSchema), asyncHandler(discussionController.createComment));
problemDiscussionRouter.post('/:slug/ai-summary', asyncHandler(discussionController.getAISummary));

// Comment-scoped routes (mounted at /api/comments)
const commentRouter = Router();
commentRouter.use(authenticate);
commentRouter.get('/:id/replies', asyncHandler(discussionController.getReplies));
commentRouter.put('/:id', validate(updateCommentSchema), asyncHandler(discussionController.updateComment));
commentRouter.delete('/:id', asyncHandler(discussionController.deleteComment));

export default problemDiscussionRouter;
export { commentRouter };
