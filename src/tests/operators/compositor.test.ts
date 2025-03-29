import { describe, it, expect } from 'vitest';
import { anyOf } from '../../operators/compositor';
import { letters, digits, literal } from '../../operators/character';

describe('Compositor Operators', () => {
  describe('anyOf', () => {
    it('should combine patterns with character class syntax', () => {
      expect(anyOf(letters(), digits())('')).toBe('[a-zA-Z0-9]');
    });

    it('should handle literals correctly', () => {
      expect(anyOf(literal('abc'))('')).toBe('abc');
      expect(anyOf(literal('a'), literal('b'))('')).toBe('[ab]');
    });

    it('should append to existing pattern', () => {
      expect(anyOf(letters(), digits())('xyz')).toBe('xyz[a-zA-Z0-9]');
    });

    it('should handle empty inputs', () => {
      expect(anyOf()('')).toBe('');
    });

    it('should handle complex combinations', () => {
      expect(anyOf(letters(), digits(), literal('._-'))('')).toBe('[a-zA-Z0-9._\\-]');
    });
  });
});