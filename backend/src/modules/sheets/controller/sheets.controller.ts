import { Response } from 'express';
import { sheetsService } from '../service/sheets.service';
import { AuthRequest } from '../../../common/types';
import { AppError } from '../../../common/errors/AppError';

export const sheetsController = {
  async upload(req: AuthRequest, res: Response) {
    const file = req.file;
    if (!file) {
      throw AppError.badRequest('No file uploaded');
    }

    const name = req.body.name;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw AppError.badRequest('Sheet name is required');
    }

    const result = await sheetsService.processUpload(name.trim(), file.path);
    res.status(201).json(result);
  },
};
