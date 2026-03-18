import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { transaction } from '../../../config/database';
import { AppError } from '../../../common/errors/AppError';

interface SheetProblemRow {
  title: string;
  slug: string;
  difficulty: string;
  url?: string;
  tags?: string;
}

interface UploadResult {
  sheet: { id: string; name: string; slug: string };
  problemCount: number;
  newProblems: number;
  existingProblems: number;
}

export const sheetsService = {
  async processUpload(name: string, filePath: string): Promise<UploadResult> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<SheetProblemRow>(worksheet);

      if (rows.length === 0) {
        throw AppError.badRequest('Uploaded file contains no data rows');
      }

      // Validate required columns
      for (const row of rows) {
        if (!row.title || !row.slug || !row.difficulty) {
          throw AppError.badRequest('Each row must have title, slug, and difficulty columns');
        }
        const difficulty = row.difficulty.toLowerCase();
        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
          throw AppError.badRequest(`Invalid difficulty "${row.difficulty}" for problem "${row.slug}"`);
        }
      }

      const sheetSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const result = await transaction(async (client) => {
        // Create sheet
        const sheetResult = await client.query(
          `INSERT INTO sheets (name, slug)
           VALUES ($1, $2)
           ON CONFLICT (slug) DO UPDATE SET name = $1
           RETURNING id, name, slug`,
          [name, sheetSlug]
        );
        const sheet = sheetResult.rows[0];

        let newProblems = 0;
        let existingProblems = 0;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const difficulty = row.difficulty.toLowerCase();

          // Upsert problem
          const problemResult = await client.query(
            `INSERT INTO problems (title, slug, difficulty, url)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (slug) DO UPDATE SET title = $1, difficulty = $3, url = COALESCE($4, problems.url)
             RETURNING id, (xmax = 0) AS is_new`,
            [row.title, row.slug, difficulty, row.url || null]
          );
          const problem = problemResult.rows[0];

          if (problem.is_new) {
            newProblems++;
          } else {
            existingProblems++;
          }

          // Link to sheet
          await client.query(
            `INSERT INTO sheet_problems (sheet_id, problem_id, position)
             VALUES ($1, $2, $3)
             ON CONFLICT (sheet_id, problem_id) DO UPDATE SET position = $3`,
            [sheet.id, problem.id, i]
          );

          // Handle tags
          if (row.tags) {
            const tagNames = row.tags.split(',').map((t) => t.trim()).filter(Boolean);
            for (const tagName of tagNames) {
              const tagResult = await client.query(
                `INSERT INTO tags (name) VALUES ($1)
                 ON CONFLICT (name) DO UPDATE SET name = $1
                 RETURNING id`,
                [tagName]
              );
              await client.query(
                `INSERT INTO problem_tags (problem_id, tag_id)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [problem.id, tagResult.rows[0].id]
              );
            }
          }
        }

        return {
          sheet: { id: sheet.id, name: sheet.name, slug: sheet.slug },
          problemCount: rows.length,
          newProblems,
          existingProblems,
        };
      });

      return result;
    } finally {
      // Clean up temp file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  },
};
