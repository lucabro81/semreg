import { describe, it, expect } from 'vitest';
import { digits, literal, letters } from '../../operators/character';

describe('Character Generators', () => {
  describe('letters', () => {
    it('should generate pattern for alphabetic characters', () => {
      expect(letters()('')).toBe('[a-zA-Z]');
      expect(letters()('abc')).toBe('abc[a-zA-Z]');
    });
  });

  describe('digits', () => {
    it('should generate pattern for numeric characters', () => {
      expect(digits()('')).toBe('[0-9]');
      expect(digits()('abc')).toBe('abc[0-9]');
    });
  });

  describe('literal', () => {
    it('should escape special regex characters', () => {
      expect(literal('abc')('')).toBe('abc');
      expect(literal('a.b*c+')('')).toBe('a\\.b\\*c\\+');
      expect(literal('[abc]')('')).toBe('\\[abc\\]');
    });

    it('should append to existing pattern', () => {
      expect(literal('abc')('xyz')).toBe('xyzabc');
      expect(literal('a.b')('xyz')).toBe('xyza\\.b');
    });
  });
});