import { cached, invalidate } from '../../../common/utils/cache';
import { redis } from '../../../config/redis';

const mockRedis = redis as jest.Mocked<typeof redis>;

describe('cache utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cached()', () => {
    it('cache miss: calls fn, stores result in redis, returns result', async () => {
      mockRedis.get.mockResolvedValue(null);
      const fn = jest.fn().mockResolvedValue({ id: 1, name: 'test' });

      const result = await cached('my-key', 60, fn);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(mockRedis.set).toHaveBeenCalledWith(
        'my-key',
        JSON.stringify({ id: 1, name: 'test' }),
        { EX: 60 }
      );
      expect(result).toEqual({ id: 1, name: 'test' });
    });

    it('cache hit: returns cached value and does NOT call fn', async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ id: 2, name: 'cached' }));
      const fn = jest.fn().mockResolvedValue({ id: 99 });

      const result = await cached('hit-key', 120, fn);

      expect(fn).not.toHaveBeenCalled();
      expect(mockRedis.set).not.toHaveBeenCalled();
      expect(result).toEqual({ id: 2, name: 'cached' });
    });

    it('passes correct TTL to redis.set', async () => {
      mockRedis.get.mockResolvedValue(null);
      const fn = jest.fn().mockResolvedValue('value');

      await cached('ttl-key', 3600, fn);

      expect(mockRedis.set).toHaveBeenCalledWith(
        'ttl-key',
        JSON.stringify('value'),
        { EX: 3600 }
      );
    });

    it('handles complex objects (arrays, nested)', async () => {
      mockRedis.get.mockResolvedValue(null);
      const complexData = {
        users: [
          { id: 1, tags: ['a', 'b'], meta: { score: 42 } },
          { id: 2, tags: ['c'], meta: { score: 99 } },
        ],
        total: 2,
      };
      const fn = jest.fn().mockResolvedValue(complexData);

      const result = await cached('complex-key', 300, fn);

      expect(result).toEqual(complexData);
      expect(mockRedis.set).toHaveBeenCalledWith(
        'complex-key',
        JSON.stringify(complexData),
        { EX: 300 }
      );
    });
  });

  describe('invalidate()', () => {
    it('with empty scan iterator (no keys to delete)', async () => {
      mockRedis.scanIterator.mockReturnValue((async function* () {})());

      await invalidate('prefix:*');

      expect(mockRedis.scanIterator).toHaveBeenCalledWith({ MATCH: 'prefix:*', COUNT: 100 });
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('with keys returned as strings from scan', async () => {
      mockRedis.scanIterator.mockReturnValue(
        (async function* (): AsyncGenerator<any> {
          yield 'prefix:key1';
          yield 'prefix:key2';
          yield 'prefix:key3';
        })()
      );

      await invalidate('prefix:*');

      expect(mockRedis.del).toHaveBeenCalledTimes(3);
      expect(mockRedis.del).toHaveBeenCalledWith('prefix:key1');
      expect(mockRedis.del).toHaveBeenCalledWith('prefix:key2');
      expect(mockRedis.del).toHaveBeenCalledWith('prefix:key3');
    });

    it('with keys returned as arrays from scan', async () => {
      mockRedis.scanIterator.mockReturnValue(
        (async function* () {
          yield ['prefix:a', 'prefix:b'] as any;
          yield ['prefix:c'] as any;
        })()
      );

      await invalidate('prefix:*');

      expect(mockRedis.del).toHaveBeenCalledTimes(3);
      expect(mockRedis.del).toHaveBeenCalledWith('prefix:a');
      expect(mockRedis.del).toHaveBeenCalledWith('prefix:b');
      expect(mockRedis.del).toHaveBeenCalledWith('prefix:c');
    });
  });
});
