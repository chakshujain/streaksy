import { Router } from 'express';
import { roomController } from '../controller/room.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createRoomSchema, joinRoomSchema, solveRoomSchema } from '../validation/room.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/', validate(createRoomSchema), asyncHandler(roomController.create));
router.post('/join', validate(joinRoomSchema), asyncHandler(roomController.join));
router.get('/mine', asyncHandler(roomController.myRooms));
router.get('/active', asyncHandler(roomController.activeRooms));
router.get('/upcoming', asyncHandler(roomController.upcoming));
router.get('/leaderboard', asyncHandler(roomController.leaderboard));
router.get('/suggest', asyncHandler(roomController.suggestProblems));
router.get('/:id', asyncHandler(roomController.get));
router.get('/:id/problems', asyncHandler(roomController.getProblems));
router.post('/:id/start', asyncHandler(roomController.start));
router.post('/:id/end', asyncHandler(roomController.end));
router.post('/:id/solve', validate(solveRoomSchema), asyncHandler(roomController.solve));

export default router;
