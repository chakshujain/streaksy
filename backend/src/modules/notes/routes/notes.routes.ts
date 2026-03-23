import { Router } from 'express';
import { notesController } from '../controller/notes.controller';
import { authenticate } from '../../../middleware/auth';
import { validate } from '../../../middleware/validate';
import { createNoteSchema, updateNoteSchema } from '../validation/notes.schema';
import { asyncHandler } from '../../../common/utils/asyncHandler';

const router = Router();

router.use(authenticate);

router.post('/', validate(createNoteSchema), asyncHandler(notesController.create as any));
router.put('/:id', validate(updateNoteSchema), asyncHandler(notesController.update as any));
router.delete('/:id', asyncHandler(notesController.delete as any));
router.get('/personal/:problemId', asyncHandler(notesController.getPersonalNotes as any));
router.get('/group/:groupId/:problemId', asyncHandler(notesController.getGroupNotes as any));
router.post('/:id/enhance', asyncHandler(notesController.enhanceWithAI as any));

export default router;
