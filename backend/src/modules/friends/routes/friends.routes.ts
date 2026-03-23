import { Router } from 'express';
import { friendsController } from '../controller/friends.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/enriched', asyncHandler(friendsController.getEnriched as any));
router.get('/ids', asyncHandler(friendsController.getFriendIds as any));
router.get('/', asyncHandler(friendsController.list as any));
router.get('/requests', asyncHandler(friendsController.requests as any));
router.get('/search', asyncHandler(friendsController.search as any));
router.post('/request', asyncHandler(friendsController.sendRequest as any));
router.patch('/:id/accept', asyncHandler(friendsController.accept as any));
router.delete('/:id', asyncHandler(friendsController.remove as any));

export default router;
