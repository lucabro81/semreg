import { describe, it, expect } from 'vitest';
import { oneOrMore, zeroOrMore, repeat, between, atLeast, exactly } from '../../operators/quantifier';
import { letters, digits } from '../../operators/character';

describe('Quantifier Operators', () => {
  describe('oneOrMore', () => {
    it('should add + to the last pattern component', () => {
      expect(oneOrMore(letters())('')).toBe('[a-zA-Z]+');
      expect(oneOrMore(digits())('')).toBe('[0-9]+');
    });

    it('should append to existing pattern', () => {
      expect(oneOrMore(letters())('abc')).toBe('abc[a-zA-Z]+');
    });

    it('should work with nested patterns', () => {
      const nested = oneOrMore(oneOrMore(letters()));
      expect(nested('')).toBe('[a-zA-Z]++');
    });
  });

  describe('zeroOrMore', () => {
    it('should add * to the last pattern component', () => {
      expect(zeroOrMore(letters())('')).toBe('[a-zA-Z]*');
      expect(zeroOrMore(digits())('')).toBe('[0-9]*');
    });

    it('should append to existing pattern', () => {
      expect(zeroOrMore(letters())('abc')).toBe('abc[a-zA-Z]*');
    });

    it('should work with nested patterns', () => {
      const nested = zeroOrMore(zeroOrMore(letters()));
      expect(nested('')).toBe('[a-zA-Z]**');
    });
  });

  it('oneOrMore and zeroOrMore should work together', () => {
    const nested = zeroOrMore(oneOrMore(letters()));
    expect(nested('')).toBe('[a-zA-Z]+*');
  });

  describe('repeat', () => {
    it('should create an exact quantifier when only min is specified', () => {
      expect(repeat(letters(), { min: 3 })('')).toBe('[a-zA-Z]{3}');
    });

    it('should create a range quantifier when min and max are specified', () => {
      expect(repeat(letters(), { min: 3, max: 5 })('')).toBe('[a-zA-Z]{3,5}');
    });

    it('should create an at-least quantifier when only min is specified with no max', () => {
      expect(repeat(letters(), { min: 3, max: undefined })('')).toBe('[a-zA-Z]{3,}');
    });

    it('should append to existing pattern', () => {
      expect(repeat(letters(), { min: 2 })('abc')).toBe('abc[a-zA-Z]{2}');
    });
  });

  describe('exactly', () => {
    it('should create an exact quantifier', () => {
      expect(exactly(letters(), 3)('')).toBe('[a-zA-Z]{3}');
      expect(exactly(digits(), 5)('abc')).toBe('abc[0-9]{5}');
    });
  });

  describe('atLeast', () => {
    it('should create an at-least quantifier', () => {
      expect(atLeast(letters(), 2)('')).toBe('[a-zA-Z]{2,}');
      expect(atLeast(digits(), 4)('xyz')).toBe('xyz[0-9]{4,}');
    });
  });

  describe('between', () => {
    it('should create a range quantifier', () => {
      expect(between(letters(), 2, 5)('')).toBe('[a-zA-Z]{2,5}');
      expect(between(digits(), 1, 3)('xyz')).toBe('xyz[0-9]{1,3}');
    });
  });
});