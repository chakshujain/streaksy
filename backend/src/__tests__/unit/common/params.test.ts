import { param } from '../../../common/utils/params';
import { Request } from 'express';

describe('param utility', () => {
  it('should extract a string param', () => {
    const req = { params: { id: 'abc-123' } } as unknown as Request;
    expect(param(req, 'id')).toBe('abc-123');
  });

  it('should return first element when param is an array (Express v5)', () => {
    const req = { params: { slug: ['two-sum', 'extra'] } } as unknown as Request;
    expect(param(req, 'slug')).toBe('two-sum');
  });

  it('should return undefined for missing param', () => {
    const req = { params: {} } as unknown as Request;
    expect(param(req, 'missing')).toBeUndefined();
  });
});
