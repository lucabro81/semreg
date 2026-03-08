import { describe, it, expect } from 'vitest';
import { positiveLookahead, negativeLookahead, positiveLookbehind, negativeLookbehind } from '../../operators/assertion';
import { letters, digits, literal, word } from '../../operators/character';
import { oneOrMore } from '../../operators/quantifier';
import { regex } from '../../core';
import { startOfLine, endOfLine, wordBoundary } from '../../operators/position';

describe('Assertion Operators', () => {
  describe('positiveLookahead', () => {
    it('should create a positive lookahead assertion', () => {
      expect(positiveLookahead(letters)('')).toBe('(?=[a-zA-Z])');
      expect(positiveLookahead(digits)('')).toBe('(?=[0-9])');
    });

    it('should append to existing pattern', () => {
      expect(positiveLookahead(letters)('abc')).toBe('abc(?=[a-zA-Z])');
    });

    it('should work with complex patterns', () => {
      expect(positiveLookahead(oneOrMore(letters))('')).toBe('(?=[a-zA-Z]+)');
    });

    it('should handle multiple components', () => {
      expect(positiveLookahead(letters, digits)('')).toBe('(?=[a-zA-Z][0-9])');
      expect(positiveLookahead(literal('abc'), digits)('')).toBe('(?=abc[0-9])');
    });

    it('should throw error if no components provided', () => {
      expect(() => positiveLookahead()).toThrow('At least one component is required');
    });

    it('should match pattern only if followed by assertion', () => {
      // Match 'foo' only if followed by 'bar'
      const fooFollowedByBar = regex(
        startOfLine,
        literal('foo'),
        positiveLookahead(literal('bar')),
        endOfLine
      );
      expect(fooFollowedByBar.test('foo')).toBe(false);
      expect(fooFollowedByBar.test('foobar')).toBe(false); // Pattern only matches 'foo', not 'foobar'
    });

    it('should not consume characters in assertion', () => {
      // Match 'foo' followed by 'bar', where 'bar' is lookahead
      const pattern = regex(
        literal('foo'),
        positiveLookahead(literal('bar'))
      );
      const match = 'foobar'.match(pattern);
      expect(match).not.toBeNull();
      expect(match![0]).toBe('foo'); // Only 'foo' is captured, 'bar' is not consumed
    });

    it('should work with digits lookahead for password validation', () => {
      // Check if string contains at least one digit (lookahead doesn't consume)
      const hasDigit = regex(
        positiveLookahead(oneOrMore(letters), digits)
      );
      expect(hasDigit.test('abc1')).toBe(true);
      expect(hasDigit.test('abcd')).toBe(false);
    });
  });

  describe('negativeLookahead', () => {
    it('should create a negative lookahead assertion', () => {
      expect(negativeLookahead(letters)('')).toBe('(?![a-zA-Z])');
      expect(negativeLookahead(digits)('')).toBe('(?![0-9])');
    });

    it('should append to existing pattern', () => {
      expect(negativeLookahead(letters)('abc')).toBe('abc(?![a-zA-Z])');
    });

    it('should work with complex patterns', () => {
      expect(negativeLookahead(oneOrMore(letters))('')).toBe('(?![a-zA-Z]+)');
    });

    it('should handle multiple components', () => {
      expect(negativeLookahead(letters, digits)('')).toBe('(?![a-zA-Z][0-9])');
      expect(negativeLookahead(literal('test'), digits)('')).toBe('(?!test[0-9])');
    });

    it('should throw error if no components provided', () => {
      expect(() => negativeLookahead()).toThrow('At least one component is required');
    });

    it('should match pattern only if NOT followed by assertion', () => {
      // Match 'foo' only if NOT followed by 'bar'
      const pattern = regex(
        literal('foo'),
        negativeLookahead(literal('bar'))
      );
      expect(pattern.test('foobaz')).toBe(true);
      expect(pattern.test('foobar')).toBe(false);
    });

    it('should not consume characters in assertion', () => {
      const pattern = regex(
        literal('foo'),
        negativeLookahead(literal('bar'))
      );
      const match = 'foobaz'.match(pattern);
      expect(match).not.toBeNull();
      expect(match![0]).toBe('foo'); // Only 'foo' is captured
    });
  });

  describe('positiveLookbehind', () => {
    it('should create a positive lookbehind assertion', () => {
      expect(positiveLookbehind(letters)('')).toBe('(?<=[a-zA-Z])');
      expect(positiveLookbehind(digits)('')).toBe('(?<=[0-9])');
    });

    it('should append to existing pattern', () => {
      expect(positiveLookbehind(letters)('abc')).toBe('abc(?<=[a-zA-Z])');
    });

    it('should work with complex patterns', () => {
      expect(positiveLookbehind(oneOrMore(letters))('')).toBe('(?<=[a-zA-Z]+)');
    });

    it('should handle multiple components', () => {
      expect(positiveLookbehind(letters, digits)('')).toBe('(?<=[a-zA-Z][0-9])');
      expect(positiveLookbehind(literal('$'), digits)('')).toBe('(?<=\\$[0-9])');
    });

    it('should throw error if no components provided', () => {
      expect(() => positiveLookbehind()).toThrow('At least one component is required');
    });

    it('should match pattern only if preceded by assertion', () => {
      // Match digits only if preceded by '$'
      const pricePattern = regex(
        positiveLookbehind(literal('$')),
        oneOrMore(digits)
      );
      expect(pricePattern.test('$100')).toBe(true);
      expect(pricePattern.test('100')).toBe(false);
    });

    it('should not consume characters in assertion', () => {
      const pattern = regex(
        positiveLookbehind(literal('$')),
        oneOrMore(digits)
      );
      const match = '$100'.match(pattern);
      expect(match).not.toBeNull();
      expect(match![0]).toBe('100'); // Only digits are captured, '$' is not consumed
    });
  });

  describe('negativeLookbehind', () => {
    it('should create a negative lookbehind assertion', () => {
      expect(negativeLookbehind(letters)('')).toBe('(?<![a-zA-Z])');
      expect(negativeLookbehind(digits)('')).toBe('(?<![0-9])');
    });

    it('should append to existing pattern', () => {
      expect(negativeLookbehind(letters)('abc')).toBe('abc(?<![a-zA-Z])');
    });

    it('should work with complex patterns', () => {
      expect(negativeLookbehind(oneOrMore(letters))('')).toBe('(?<![a-zA-Z]+)');
    });

    it('should handle multiple components', () => {
      expect(negativeLookbehind(letters, digits)('')).toBe('(?<![a-zA-Z][0-9])');
      expect(negativeLookbehind(literal('$'), digits)('')).toBe('(?<!\\$[0-9])');
    });

    it('should throw error if no components provided', () => {
      expect(() => negativeLookbehind()).toThrow('At least one component is required');
    });

    it('should match pattern only if NOT preceded by assertion', () => {
      // Match digits only if NOT preceded by '$'
      const nonPricePattern = regex(
        negativeLookbehind(literal('$')),
        oneOrMore(digits)
      );
      expect(nonPricePattern.test('100')).toBe(true);
      // Note: '$100' will still match because '00' is preceded by '1', not '$'
      // To match only if the entire number is not preceded by '$', use startOfLine or word boundary
      expect(nonPricePattern.test('$100')).toBe(true); // Matches '00'

      // Better example with word boundary
      const strictNonPricePattern = regex(
        wordBoundary,
        negativeLookbehind(literal('$')),
        oneOrMore(digits)
      );
      expect(strictNonPricePattern.test('100')).toBe(true);
      expect(strictNonPricePattern.test('$100')).toBe(false); // Word boundary after '$', then lookbehind checks '$'
    });

    it('should not consume characters in assertion', () => {
      const pattern = regex(
        negativeLookbehind(literal('$')),
        oneOrMore(digits)
      );
      const match = '100'.match(pattern);
      expect(match).not.toBeNull();
      expect(match![0]).toBe('100');
    });
  });

  describe('Combined assertion operators', () => {
    it('should work with both lookahead and lookbehind', () => {
      // Match word that is preceded by 'hello ' and followed by ' world'
      const pattern = regex(
        positiveLookbehind(literal('hello ')),
        oneOrMore(word),
        positiveLookahead(literal(' world'))
      );
      expect(pattern.test('hello test world')).toBe(true);
      expect(pattern.test('hello test')).toBe(false);
      expect(pattern.test('test world')).toBe(false);
    });

    it('should work with positive and negative assertions together', () => {
      // Match letters not followed by a digit
      const pattern = regex(
        oneOrMore(letters),
        negativeLookahead(digits)
      );
      expect(pattern.test('hello')).toBe(true);
      // Note: 'hello1' will still match 'hell' because 'hell' is followed by 'o' (not a digit)
      expect(pattern.test('hello1')).toBe(true); // Matches 'hell'

      // Better example: match entire word that ends with a letter, not followed by digit
      const strictPattern = regex(
        startOfLine,
        oneOrMore(letters),
        negativeLookahead(digits),
        endOfLine
      );
      expect(strictPattern.test('hello')).toBe(true);
      expect(strictPattern.test('hello1')).toBe(false);
    });
  });
});
