import {
  createObject,
  flattenObjectToPairs,
  getField,
  setField,
} from './object';

describe('object utils', () => {
  describe('getField', () => {
    it('should return value for key', () => {
      const result = getField(
        {
          key1: 1,
        },
        'key1',
      );
      expect(result).toBe(1);
    });

    it('should return value for array key', () => {
      const result = getField([2, 3], 'a:1');
      expect(result).toBe(3);
    });
  });

  describe('setField', () => {
    it('should set value for key', () => {
      const obj = { key1: 1 };
      setField(obj, 'key1', 2);
      expect(obj.key1).toBe(2);
    });

    it('should add value for new key', () => {
      const obj = { key1: 1 };
      setField(obj, 'key2', 3);
      expect(obj['key2']).toBe(3);
    });
  });

  describe('createObject', () => {
    it('should create object', () => {
      const result = createObject({
        key1: 1,
        'key2.sub1': 2,
        'key2.str': 'Hello',
        'arr.a:0': 3,
        'arr.a:2': 'world',
      });

      expect(result).toEqual({
        key1: 1,
        key2: {
          sub1: 2,
          str: 'Hello',
        },
        arr: [3, , 'world'],
      });
    });
  });

  describe('flattenObjectToPairs', () => {
    it('should flatten object into key/value pairs', () => {
      const result = flattenObjectToPairs({
        key1: 1,
        key2: { sub1: 2, str: 'Hello' },
        arr: [2, 3],
      });
      expect(result).toEqual([
        ['key1', 1],
        ['key2.sub1', 2],
        ['key2.str', 'Hello'],
        ['arr.a:0', 2],
        ['arr.a:1', 3],
      ]);
    });

    it('should return empty array for non-object values', () => {
      expect(flattenObjectToPairs(1)).toEqual([]);
      expect(flattenObjectToPairs(true)).toEqual([]);
      expect(flattenObjectToPairs('hello')).toEqual([]);
    });
  });
});
