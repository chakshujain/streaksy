import { Router } from 'express';
import { pokeController } from '../controller/poke.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { pokeSchema } from '../validation/poke.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/', validate(pokeSchema), asyncHandler(pokeController.pokeFriend));
router.get('/received', asyncHandler(pokeController.getMyPokes));
router.get('/inactive/:groupId', asyncHandler(pokeController.getInactiveMembers));
router.get('/streak-risk', asyncHandler(pokeController.checkStreakRisk));
router.get('/challenge', asyncHandler(pokeController.getActiveChallenge));

export default router;
