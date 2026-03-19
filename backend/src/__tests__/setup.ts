/**
 * Global test setup.
 * Mocks external services (database, redis) so tests run without infrastructure.
 */

// Mock the database module
jest.mock('../config/database', () => ({
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
    connect: jest.fn(),
    on: jest.fn(),
  },
  query: jest.fn(),
  queryOne: jest.fn(),
  transaction: jest.fn(),
}));

// Mock the redis module
jest.mock('../config/redis', () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    zAdd: jest.fn(),
    zRangeWithScores: jest.fn(),
    expire: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    ping: jest.fn().mockResolvedValue('PONG'),
    scanIterator: jest.fn().mockReturnValue((async function* () {})()),
  },
  connectRedis: jest.fn(),
}));

// Mock the logger to avoid console output in tests
jest.mock('../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    fatal: jest.fn(),
    child: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    }),
  },
}));
