import { sheetsService } from '../../../modules/sheets/service/sheets.service';
import { transaction } from '../../../config/database';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

jest.mock('../../../config/database', () => ({
  pool: { query: jest.fn(), connect: jest.fn(), on: jest.fn() },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));
jest.mock('xlsx');
jest.mock('fs');

const mockedTransaction = transaction as jest.MockedFunction<typeof transaction>;
const mockedXLSX = XLSX as jest.Mocked<typeof XLSX>;
const mockedFs = fs as jest.Mocked<typeof fs>;

describe('sheetsService', () => {
  const mockRows = [
    { title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/', tags: 'array,hash-map' },
    { title: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'Medium', url: null, tags: 'linked-list' },
    { title: 'Longest Substring', slug: 'longest-substring', difficulty: 'Hard' },
  ];

  const mockWorkbook = {
    SheetNames: ['Sheet1'],
    Sheets: { Sheet1: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (mockedXLSX.readFile as jest.Mock).mockReturnValue(mockWorkbook);
    (mockedXLSX.utils as any) = {
      sheet_to_json: jest.fn().mockReturnValue(mockRows),
    };
    (mockedFs.existsSync as jest.Mock).mockReturnValue(true);
    (mockedFs.unlinkSync as jest.Mock).mockImplementation(() => {});
  });

  describe('processUpload', () => {
    it('should process an upload successfully', async () => {
      const mockClient = {
        query: jest.fn()
          // Sheet insert
          .mockResolvedValueOnce({ rows: [{ id: 'sheet-1', name: 'Striver SDE Sheet', slug: 'striver-sde-sheet' }] })
          // Problem 1 upsert
          .mockResolvedValueOnce({ rows: [{ id: 'prob-1', is_new: true }] })
          // Sheet link 1
          .mockResolvedValueOnce({ rows: [] })
          // Tag 1: 'array'
          .mockResolvedValueOnce({ rows: [{ id: 'tag-1' }] })
          // Problem-tag link 1
          .mockResolvedValueOnce({ rows: [] })
          // Tag 2: 'hash-map'
          .mockResolvedValueOnce({ rows: [{ id: 'tag-2' }] })
          // Problem-tag link 2
          .mockResolvedValueOnce({ rows: [] })
          // Problem 2 upsert
          .mockResolvedValueOnce({ rows: [{ id: 'prob-2', is_new: false }] })
          // Sheet link 2
          .mockResolvedValueOnce({ rows: [] })
          // Tag 3: 'linked-list'
          .mockResolvedValueOnce({ rows: [{ id: 'tag-3' }] })
          // Problem-tag link 3
          .mockResolvedValueOnce({ rows: [] })
          // Problem 3 upsert (no tags)
          .mockResolvedValueOnce({ rows: [{ id: 'prob-3', is_new: true }] })
          // Sheet link 3
          .mockResolvedValueOnce({ rows: [] }),
      };

      mockedTransaction.mockImplementation(async (fn: any) => fn(mockClient));

      const result = await sheetsService.processUpload('Striver SDE Sheet', '/tmp/upload.xlsx');

      expect(result).toEqual({
        sheet: { id: 'sheet-1', name: 'Striver SDE Sheet', slug: 'striver-sde-sheet' },
        problemCount: 3,
        newProblems: 2,
        existingProblems: 1,
      });
    });

    it('should throw badRequest when file contains no rows', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([]),
      };

      await expect(
        sheetsService.processUpload('Empty Sheet', '/tmp/empty.xlsx')
      ).rejects.toThrow('Uploaded file contains no data rows');
      await expect(
        sheetsService.processUpload('Empty Sheet', '/tmp/empty.xlsx')
      ).rejects.toMatchObject({ statusCode: 400 });
    });

    it('should throw badRequest when row is missing title', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([
          { slug: 'two-sum', difficulty: 'Easy' },
        ]),
      };

      await expect(
        sheetsService.processUpload('Bad Sheet', '/tmp/bad.xlsx')
      ).rejects.toThrow('Each row must have title, slug, and difficulty columns');
    });

    it('should throw badRequest when row is missing slug', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([
          { title: 'Two Sum', difficulty: 'Easy' },
        ]),
      };

      await expect(
        sheetsService.processUpload('Bad Sheet', '/tmp/bad.xlsx')
      ).rejects.toThrow('Each row must have title, slug, and difficulty columns');
    });

    it('should throw badRequest when row is missing difficulty', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([
          { title: 'Two Sum', slug: 'two-sum' },
        ]),
      };

      await expect(
        sheetsService.processUpload('Bad Sheet', '/tmp/bad.xlsx')
      ).rejects.toThrow('Each row must have title, slug, and difficulty columns');
    });

    it('should throw badRequest for invalid difficulty values', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([
          { title: 'Two Sum', slug: 'two-sum', difficulty: 'extreme' },
        ]),
      };

      await expect(
        sheetsService.processUpload('Bad Sheet', '/tmp/bad.xlsx')
      ).rejects.toThrow('Invalid difficulty "extreme"');
    });

    it('should accept case-insensitive difficulty values', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([
          { title: 'Two Sum', slug: 'two-sum', difficulty: 'EASY' },
        ]),
      };

      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [{ id: 'sheet-1', name: 'Test', slug: 'test' }] })
          .mockResolvedValueOnce({ rows: [{ id: 'prob-1', is_new: true }] })
          .mockResolvedValueOnce({ rows: [] }),
      };
      mockedTransaction.mockImplementation(async (fn: any) => fn(mockClient));

      const result = await sheetsService.processUpload('Test', '/tmp/test.xlsx');

      expect(result.problemCount).toBe(1);
    });

    it('should clean up temp file even when processing fails', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([]),
      };

      await expect(
        sheetsService.processUpload('Bad', '/tmp/bad.xlsx')
      ).rejects.toThrow();

      expect(mockedFs.existsSync).toHaveBeenCalledWith('/tmp/bad.xlsx');
      expect(mockedFs.unlinkSync).toHaveBeenCalledWith('/tmp/bad.xlsx');
    });

    it('should not throw if temp file does not exist during cleanup', async () => {
      (mockedFs.existsSync as jest.Mock).mockReturnValue(false);
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([]),
      };

      await expect(
        sheetsService.processUpload('Bad', '/tmp/missing.xlsx')
      ).rejects.toThrow();

      expect(mockedFs.unlinkSync).not.toHaveBeenCalled();
    });

    it('should generate correct slug from sheet name', async () => {
      (mockedXLSX.utils as any) = {
        sheet_to_json: jest.fn().mockReturnValue([
          { title: 'Two Sum', slug: 'two-sum', difficulty: 'Easy' },
        ]),
      };

      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [{ id: 'sheet-1', name: 'My Sheet!!! #1', slug: 'my-sheet-1' }] })
          .mockResolvedValueOnce({ rows: [{ id: 'prob-1', is_new: true }] })
          .mockResolvedValueOnce({ rows: [] }),
      };
      mockedTransaction.mockImplementation(async (fn: any) => fn(mockClient));

      await sheetsService.processUpload('My Sheet!!! #1', '/tmp/test.xlsx');

      // The slug generation: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.any(String),
        ['My Sheet!!! #1', 'my-sheet-1']
      );
    });
  });
});
