import { Router } from 'express';
import { feedController } from '../controller/feed.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { feedCommentSchema, feedPostSchema } from '../validation/feed.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/post', validate(feedPostSchema), asyncHandler(feedController.createPost));
router.get('/', asyncHandler(feedController.getFeed));
router.get('/user/:userId', asyncHandler(feedController.getUserFeed));
router.post('/:id/like', asyncHandler(feedController.toggleLike));
router.post('/:id/comments', validate(feedCommentSchema), asyncHandler(feedController.addComment));
router.get('/:id/comments', asyncHandler(feedController.getComments));
router.delete('/comments/:id', asyncHandler(feedController.deleteComment));

export default router;
