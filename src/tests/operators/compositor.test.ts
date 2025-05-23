import { describe, it, expect } from 'vitest';
import { anyOf, sequence } from '../../operators/compositor';
import { letters, digits, literal } from '../../operators/character';
import { oneOrMore } from '../../operators/quantifier';
import { group } from '../../operators/group';

describe('Compositor Operators', () => {
  describe('anyOf', () => {
    it('should combine patterns with character class syntax', () => {
      expect(anyOf(letters, digits)('')).toBe('[a-zA-Z0-9]');
    });

    it('should handle literals correctly', () => {
      expect(anyOf(literal('abc'))('')).toBe('abc');
      expect(anyOf(literal('a'), literal('b'))('')).toBe('[ab]');
    });

    it('should append to existing pattern', () => {
      expect(anyOf(letters, digits)('xyz')).toBe('xyz[a-zA-Z0-9]');
    });

    it('should handle empty inputs', () => {
      expect(() => anyOf()).toThrow('At least one component is required');
    });

    it('should handle complex combinations', () => {
      expect(anyOf(letters, digits, literal('._-'))('')).toBe('[a-zA-Z0-9\\._-]');
    });
  });
});

describe('Sequence Operator', () => {
  describe('sequence', () => {
    it('should concatenate patterns in order', () => {
      expect(sequence(letters, digits)('')).toBe('[a-zA-Z][0-9]');
    });

    it('should append to existing pattern', () => {
      expect(sequence(letters, digits)('abc')).toBe('abc[a-zA-Z][0-9]');
    });

    it('should handle single pattern correctly', () => {
      expect(sequence(letters)('')).toBe('[a-zA-Z]');
    });

    it('should handle multiple patterns', () => {
      expect(sequence(letters, digits, literal('_'))('')).toBe('[a-zA-Z][0-9]_');
    });

    it('should work with complex patterns', () => {
      expect(sequence(oneOrMore(letters), group(digits))('')).toBe('[a-zA-Z]+([0-9])');
    });

    it('should handle empty input', () => {
      expect(() => sequence()).toThrow('At least one component is required');
    });
  });
});