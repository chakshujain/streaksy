import request from 'supertest';
import app from '../../app';
import { sheetsService } from '../../modules/sheets/service/sheets.service';
import { generateTestToken } from '../helpers';

jest.mock('../../modules/sheets/service/sheets.service');
const mockedService = sheetsService as jest.Mocked<typeof sheetsService>;

describe('Sheets Routes', () => {
  const token = generateTestToken('user-1', 'user@test.com');
  const originalAdminSecret = process.env.ADMIN_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_SECRET = 'test-admin-secret';
  });

  afterEach(() => {
    process.env.ADMIN_SECRET = originalAdminSecret;
  });

  describe('POST /api/sheets/upload', () => {
    it('should return 403 without admin secret header', async () => {
      const res = await request(app)
        .post('/api/sheets/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'Test Sheet')
        .attach('file', Buffer.from('col1,col2\na,b'), {
          filename: 'test.csv',
          contentType: 'text/csv',
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin access required');
    });

    it('should return 403 with wrong admin secret', async () => {
      const res = await request(app)
        .post('/api/sheets/upload')
        .set('Authorization', `Bearer ${token}`)
        .set('x-admin-secret', 'wrong-secret')
        .field('name', 'Test Sheet')
        .attach('file', Buffer.from('col1,col2\na,b'), {
          filename: 'test.csv',
          contentType: 'text/csv',
        });

      expect(res.status).toBe(403);
    });

    it('should upload a CSV file with valid admin secret', async () => {
      mockedService.processUpload.mockResolvedValue({
        sheet: { id: 'sheet-1', name: 'Test Sheet' },
        problemsCreated: 5,
      });

      const res = await request(app)
        .post('/api/sheets/upload')
        .set('Authorization', `Bearer ${token}`)
        .set('x-admin-secret', 'test-admin-secret')
        .field('name', 'Test Sheet')
        .attach('file', Buffer.from('col1,col2\na,b'), {
          filename: 'test.csv',
          contentType: 'text/csv',
        });

      expect(res.status).toBe(201);
      expect(res.body.sheet).toBeDefined();
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/sheets/upload')
        .set('x-admin-secret', 'test-admin-secret')
        .field('name', 'Test Sheet')
        .attach('file', Buffer.from('col1,col2\na,b'), {
          filename: 'test.csv',
          contentType: 'text/csv',
        });

      expect(res.status).toBe(401);
    });
  });
});
