import request from 'supertest';
import app from '../../app';

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.checks).toBeDefined();
    expect(res.body.checks.db).toBe('ok');
    expect(res.body.checks.redis).toBe('ok');
  });

  it('should return a valid ISO timestamp', async () => {
    const res = await request(app).get('/health');

    const parsed = new Date(res.body.timestamp);
    expect(parsed.toISOString()).toBe(res.body.timestamp);
  });
});
