import { describe, it, expect } from 'vitest';
import { oneOrMore, zeroOrMore } from '../../operators/quantifier';
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
});