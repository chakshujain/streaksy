import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import { sheetsController } from '../controller/sheets.controller';
import { authenticate } from '../../../middleware/auth';
import { asyncHandler } from '../../../common/utils/asyncHandler';
import { AppError } from '../../../common/errors/AppError';

const upload = multer({
  dest: path.join(os.tmpdir(), 'streaksy-uploads'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls|csv)$/i)) {
      cb(null, true);
    } else {
      cb(AppError.badRequest('Only xlsx, xls, and csv files are allowed'));
    }
  },
});

const router = Router();

router.use(authenticate);

router.post('/upload', upload.single('file'), asyncHandler(sheetsController.upload as any));

export default router;
