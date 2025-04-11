import { describe, it, expect } from 'vitest';
import { group, nonCapturingGroup, namedGroup, numberedBackreference, namedBackreference } from '../../operators/group';
import { letters, digits, literal, word } from '../../operators/character';
import { oneOrMore } from '../../operators/quantifier';
import { regex } from '../../core';
import { startOfLine, endOfLine } from '../../operators/position';

describe('Group Operators', () => {
  describe('group', () => {
    it('should wrap the pattern in capturing group parentheses', () => {
      expect(group(letters)('')).toBe('([a-zA-Z])');
      expect(group(digits)('')).toBe('([0-9])');
    });

    it('should append to existing pattern', () => {
      expect(group(letters)('abc')).toBe('abc([a-zA-Z])');
    });

    it('should work with complex patterns', () => {
      expect(group(oneOrMore(letters))('')).toBe('([a-zA-Z]+)');
    });

    it('should group multiple components', () => {
      expect(group(letters, digits)('')).toBe('([a-zA-Z][0-9])');
      expect(group(literal('abc'), digits)('')).toBe('(abc[0-9])');
    });

    it('should throw error if no components provided', () => {
      expect(() => group()).toThrow('At least one component is required');
    });
  });

  describe('nonCapturingGroup', () => {
    it('should wrap the pattern in non-capturing group parentheses', () => {
      expect(nonCapturingGroup(letters)('')).toBe('(?:[a-zA-Z])');
      expect(nonCapturingGroup(digits)('')).toBe('(?:[0-9])');
    });

    it('should append to existing pattern', () => {
      expect(nonCapturingGroup(letters)('abc')).toBe('abc(?:[a-zA-Z])');
    });

    it('should work with complex patterns', () => {
      expect(nonCapturingGroup(oneOrMore(letters))('')).toBe('(?:[a-zA-Z]+)');
    });

    it('should group multiple components', () => {
      expect(nonCapturingGroup(letters, digits)('')).toBe('(?:[a-zA-Z][0-9])');
      expect(nonCapturingGroup(literal('abc'), digits)('')).toBe('(?:abc[0-9])');
    });

    it('should throw error if no components provided', () => {
      expect(() => nonCapturingGroup()).toThrow('At least one component is required');
    });
  });

  describe('namedGroup', () => {
    it('should create a named capturing group', () => {
      expect(namedGroup('myGroup', letters)('')).toBe('(?<myGroup>[a-zA-Z])');
    });

    it('should append to existing pattern', () => {
      expect(namedGroup('num', digits)('abc')).toBe('abc(?<num>[0-9])');
    });

    it('should group multiple components', () => {
      expect(namedGroup('id', literal('ID-'), oneOrMore(digits))('')).toBe('(?<id>ID-[0-9]+)');
    });

    it('should throw error for invalid names', () => {
      expect(() => namedGroup('1invalid', letters)('')).toThrow(/Invalid group name/);
      expect(() => namedGroup('invalid-name', letters)('')).toThrow(/Invalid group name/);
      expect(() => namedGroup('', letters)('')).toThrow(/Invalid group name/);
    });

    it('should handle empty components gracefully (no group created)', () => {
      expect(namedGroup('emptyGroup')('abc')).toBe('abc');
    });
  });

  describe('numberedBackreference', () => {
    it('should create a numbered backreference', () => {
      expect(numberedBackreference(1)('')).toBe('\\1');
      expect(numberedBackreference(5)('abc')).toBe('abc\\5');
    });

    it('should throw error for invalid index', () => {
      expect(() => numberedBackreference(0)('')).toThrow(/Invalid backreference index/);
      expect(() => numberedBackreference(-1)('')).toThrow(/Invalid backreference index/);
      expect(() => numberedBackreference(1.5)('')).toThrow(/Invalid backreference index/);
    });

    it('should work with capturing groups for matching repeated words', () => {
      const findRepeatedWord = regex(
        startOfLine,
        group(oneOrMore(word)),
        literal(' '),
        numberedBackreference(1),
        endOfLine
      );
      expect(findRepeatedWord.test('hello hello')).toBe(true);
      expect(findRepeatedWord.test('test test1')).toBe(false);
      expect(findRepeatedWord.test('word word')).toBe(true);
      expect(findRepeatedWord.test(' test test')).toBe(false);
      expect(findRepeatedWord.test('test test ')).toBe(false);
    });
  });

  describe('namedBackreference', () => {
    it('should create a named backreference', () => {
      expect(namedBackreference('myGroup')('')).toBe('\\k<myGroup>');
      expect(namedBackreference('num')('abc')).toBe('abc\\k<num>');
    });

    it('should throw error for invalid name', () => {
      expect(() => namedBackreference('1invalid')('')).toThrow(/Invalid group name/);
      expect(() => namedBackreference('invalid-name')('')).toThrow(/Invalid group name/);
    });

    it('should work with named capturing groups for matching repeated words', () => {
      const wordPattern = namedGroup('word', oneOrMore(word));
      const findRepeatedNamedWord = regex(
        startOfLine,
        wordPattern,
        literal(' '),
        namedBackreference('word'),
        endOfLine
      );
      expect(findRepeatedNamedWord.test('hello hello')).toBe(true);
      expect(findRepeatedNamedWord.test('test test1')).toBe(false);
      expect(findRepeatedNamedWord.test('word word')).toBe(true);
      expect(findRepeatedNamedWord.test(' test test')).toBe(false);
      expect(findRepeatedNamedWord.test('test test ')).toBe(false);
    });
  });
});