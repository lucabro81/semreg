import { describe, it, expect } from 'vitest';
import { oneOrMore, zeroOrMore, repeat, optional, atLeast, exactly, between } from '../../operators/quantifier';
import { letters, digits, literal } from '../../operators/character';
import { group } from '../../operators/group';

describe('Quantifier Operators', () => {
  describe('oneOrMore', () => {
    it('should add + to the last pattern component', () => {
      expect(oneOrMore(letters)('')).toBe('[a-zA-Z]+');
      expect(oneOrMore(digits)('')).toBe('[0-9]+');
    });

    it('should append to existing pattern', () => {
      expect(oneOrMore(letters)('abc')).toBe('abc[a-zA-Z]+');
    });

    it('should work with nested patterns', () => {
      const nested = oneOrMore(oneOrMore(letters));
      expect(nested('')).toBe('[a-zA-Z]++');
    });
  });

  describe('zeroOrMore', () => {
    it('should add * to the last pattern component', () => {
      expect(zeroOrMore(letters)('')).toBe('[a-zA-Z]*');
      expect(zeroOrMore(digits)('')).toBe('[0-9]*');
    });

    it('should append to existing pattern', () => {
      expect(zeroOrMore(letters)('abc')).toBe('abc[a-zA-Z]*');
    });

    it('should work with nested patterns', () => {
      const nested = zeroOrMore(zeroOrMore(letters));
      expect(nested('')).toBe('[a-zA-Z]**');
    });
  });

  it('oneOrMore and zeroOrMore should work together', () => {
    const nested = zeroOrMore(oneOrMore(letters));
    expect(nested('')).toBe('[a-zA-Z]+*');
  });

  describe('repeat', () => {
    it('should create an exact quantifier using exactly()', () => {
      expect(repeat(letters, exactly(3))('')).toBe('[a-zA-Z]{3}');
    });

    it('should create a range quantifier using between()', () => {
      expect(repeat(letters, between(3, 5))('')).toBe('[a-zA-Z]{3,5}');
    });

    it('should create an at-least quantifier using atLeast()', () => {
      expect(repeat(letters, atLeast(3))('')).toBe('[a-zA-Z]{3,}');
    });

    it('should append to existing pattern', () => {
      expect(repeat(letters, exactly(2))('abc')).toBe('abc[a-zA-Z]{2}');
      expect(repeat(digits, atLeast(1))('xyz')).toBe('xyz[0-9]{1,}');
      expect(repeat(literal('.'), between(0, 2))('test')).toBe('test\\.{0,2}');
    });
  });

  describe('Optional Operator', () => {
    describe('optional', () => {
      it('should add ? quantifier to the pattern', () => {
        expect(optional(letters)('')).toBe('[a-zA-Z]?');
        expect(optional(digits)('')).toBe('[0-9]?');
      });

      it('should append to existing pattern', () => {
        expect(optional(letters)('abc')).toBe('abc[a-zA-Z]?');
      });

      it('should work with complex patterns (groups)', () => {
        expect(optional(group(letters, digits))('')).toBe('([a-zA-Z][0-9])?');
      });

      it('should work with literals (current behavior)', () => {
        expect(optional(literal('www.'))('')).toBe('www\\.?');
        expect(optional(literal('ab'))('')).toBe('ab?');
      });
    });
  });
});