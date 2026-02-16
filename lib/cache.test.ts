import { cacheGet, cacheSet, cacheGetStale } from './cache';

describe('Cache Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('cacheSet and cacheGet', () => {
    it('should store and retrieve a value', () => {
      const key = 'test-key';
      const value = { foo: 'bar' };

      cacheSet(key, value);
      const result = cacheGet(key);

      expect(result).toEqual(value);
    });

    it('should store and retrieve different data types', () => {
      cacheSet('string-key', 'hello');
      cacheSet('number-key', 42);
      cacheSet('object-key', { name: 'test' });
      cacheSet('array-key', [1, 2, 3]);
      cacheSet('boolean-key', true);

      expect(cacheGet('string-key')).toBe('hello');
      expect(cacheGet('number-key')).toBe(42);
      expect(cacheGet('object-key')).toEqual({ name: 'test' });
      expect(cacheGet('array-key')).toEqual([1, 2, 3]);
      expect(cacheGet('boolean-key')).toBe(true);
    });

    it('should return null for non-existent key', () => {
      const result = cacheGet('non-existent-key');
      expect(result).toBeNull();
    });

    it('should overwrite existing value with same key', () => {
      const key = 'overwrite-key';
      cacheSet(key, 'first-value');
      cacheSet(key, 'second-value');

      expect(cacheGet(key)).toBe('second-value');
    });

    it('should handle multiple keys independently', () => {
      cacheSet('key1', 'value1');
      cacheSet('key2', 'value2');
      cacheSet('key3', 'value3');

      expect(cacheGet('key1')).toBe('value1');
      expect(cacheGet('key2')).toBe('value2');
      expect(cacheGet('key3')).toBe('value3');
    });
  });

  describe('TTL (Time To Live)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should use default TTL of 5 minutes', () => {
      const key = 'ttl-key';
      const value = 'test-value';

      cacheSet(key, value);

      // Should still be available before 5 minutes
      jest.advanceTimersByTime(4 * 60 * 1000); // 4 minutes
      expect(cacheGet(key)).toBe(value);

      // Should be expired after 5 minutes
      jest.advanceTimersByTime(2 * 60 * 1000); // 2 more minutes (total 6)
      expect(cacheGet(key)).toBeNull();
    });

    it('should accept custom TTL', () => {
      const key = 'custom-ttl-key';
      const value = 'test-value';
      const customTTL = 10 * 1000; // 10 seconds

      cacheSet(key, value, customTTL);

      // Should still be available before TTL expires
      jest.advanceTimersByTime(9 * 1000);
      expect(cacheGet(key)).toBe(value);

      // Should be expired after TTL
      jest.advanceTimersByTime(2 * 1000);
      expect(cacheGet(key)).toBeNull();
    });

    it('should delete expired entries when accessed', () => {
      const key = 'expire-key';
      cacheSet(key, 'value', 1000); // 1 second TTL

      // Advance time to expire the entry
      jest.advanceTimersByTime(2000);

      // First access should return null and delete the entry
      expect(cacheGet(key)).toBeNull();

      // Subsequent access should also return null
      expect(cacheGet(key)).toBeNull();
    });

    it('should handle zero TTL correctly', () => {
      const key = 'zero-ttl-key';
      cacheSet(key, 'value', 0);

      // Should be immediately expired
      jest.advanceTimersByTime(1);
      expect(cacheGet(key)).toBeNull();
    });

    it('should handle very long TTL', () => {
      const key = 'long-ttl-key';
      const value = 'persistent-value';
      const longTTL = 24 * 60 * 60 * 1000; // 24 hours

      cacheSet(key, value, longTTL);

      // Should still be available after 1 hour
      jest.advanceTimersByTime(60 * 60 * 1000);
      expect(cacheGet(key)).toBe(value);

      // Should still be available after 23 hours
      jest.advanceTimersByTime(22 * 60 * 60 * 1000);
      expect(cacheGet(key)).toBe(value);

      // Should be expired after 24+ hours
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);
      expect(cacheGet(key)).toBeNull();
    });
  });

  describe('cacheGetStale', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return fresh data when not expired', () => {
      const key = 'fresh-key';
      const value = 'fresh-value';

      cacheSet(key, value);
      expect(cacheGetStale(key)).toBe(value);
    });

    it('should return stale data even after expiration', () => {
      const key = 'stale-key';
      const value = 'stale-value';

      cacheSet(key, value, 1000); // 1 second TTL

      // Advance time past expiration
      jest.advanceTimersByTime(2000);

      // cacheGetStale should still return the value even though it's expired
      expect(cacheGetStale(key)).toBe(value);

      // Now verify cacheGet returns null for expired entry
      expect(cacheGet(key)).toBeNull();
    });

    it('should return null for non-existent key', () => {
      expect(cacheGetStale('non-existent')).toBeNull();
    });

    it('should return stale data even after manual deletion via cacheGet', () => {
      const key = 'delete-test-key';
      const value = 'test-value';

      cacheSet(key, value, 100);

      // Expire and trigger deletion via cacheGet
      jest.advanceTimersByTime(200);
      expect(cacheGet(key)).toBeNull(); // This deletes the entry

      // cacheGetStale should now also return null since entry was deleted
      expect(cacheGetStale(key)).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as key', () => {
      cacheSet('', 'empty-key-value');
      expect(cacheGet('')).toBe('empty-key-value');
    });

    it('should handle null/undefined values', () => {
      cacheSet('null-key', null);
      cacheSet('undefined-key', undefined);

      expect(cacheGet('null-key')).toBeNull();
      expect(cacheGet('undefined-key')).toBeUndefined();
    });

    it('should handle complex nested objects', () => {
      const complexObject = {
        users: [
          { id: 1, name: 'Alice', roles: ['admin', 'user'] },
          { id: 2, name: 'Bob', roles: ['user'] },
        ],
        metadata: {
          count: 2,
          updated: '2026-02-16',
        },
      };

      cacheSet('complex', complexObject);
      expect(cacheGet('complex')).toEqual(complexObject);
    });

    it('should handle special characters in keys', () => {
      const specialKeys = [
        'key-with-dashes',
        'key_with_underscores',
        'key.with.dots',
        'key/with/slashes',
        'key:with:colons',
      ];

      specialKeys.forEach((key, index) => {
        cacheSet(key, `value-${index}`);
        expect(cacheGet(key)).toBe(`value-${index}`);
      });
    });
  });

  describe('Type Safety', () => {
    it('should maintain type information for typed data', () => {
      interface User {
        id: number;
        name: string;
      }

      const user: User = { id: 1, name: 'Test User' };
      cacheSet<User>('user', user);

      const retrieved = cacheGet<User>('user');
      expect(retrieved).toEqual(user);
      expect(retrieved?.id).toBe(1);
      expect(retrieved?.name).toBe('Test User');
    });

    it('should handle arrays with type safety', () => {
      const numbers: number[] = [1, 2, 3, 4, 5];
      cacheSet<number[]>('numbers', numbers);

      const retrieved = cacheGet<number[]>('numbers');
      expect(retrieved).toEqual(numbers);
      expect(Array.isArray(retrieved)).toBe(true);
    });
  });
});
