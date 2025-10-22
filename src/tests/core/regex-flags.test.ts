import { describe, it, expect } from 'vitest';
import { regex, caseInsensitive, global, multiline } from '../../core';
import { literal, letters, digits } from '../../operators/character';
import { oneOrMore } from '../../operators/quantifier';
import { startOfLine, endOfLine } from '../../operators/position';

describe('Regex Flags', () => {
  describe('caseInsensitive flag', () => {
    it('should create regex with case-insensitive flag', () => {
      const pattern = regex(literal('hello'), { caseInsensitive: true });
      expect(pattern.flags).toContain('i');
    });

    it('should match regardless of case', () => {
      const pattern = regex(literal('hello'), { caseInsensitive: true });
      expect(pattern.test('hello')).toBe(true);
      expect(pattern.test('Hello')).toBe(true);
      expect(pattern.test('HELLO')).toBe(true);
      expect(pattern.test('HeLLo')).toBe(true);
    });

    it('should work with caseInsensitive preset', () => {
      const pattern = regex(literal('test'), caseInsensitive);
      expect(pattern.flags).toContain('i');
      expect(pattern.test('TEST')).toBe(true);
      expect(pattern.test('test')).toBe(true);
    });

    it('should work with complex patterns', () => {
      const pattern = regex(
        startOfLine,
        oneOrMore(letters),
        endOfLine,
        { caseInsensitive: true }
      );
      expect(pattern.test('abc')).toBe(true);
      expect(pattern.test('ABC')).toBe(true);
      expect(pattern.test('AbC')).toBe(true);
    });
  });

  describe('global flag', () => {
    it('should create regex with global flag', () => {
      const pattern = regex(literal('test'), { global: true });
      expect(pattern.flags).toContain('g');
    });

    it('should find all matches in string', () => {
      const pattern = regex(literal('a'), { global: true });
      const matches = 'banana'.match(pattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(3);
    });

    it('should work with global preset', () => {
      const pattern = regex(oneOrMore(digits), global);
      expect(pattern.flags).toContain('g');
      const matches = 'a1b22c333'.match(pattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(3);
      expect(matches).toEqual(['1', '22', '333']);
    });

    it('should allow multiple exec calls', () => {
      const pattern = regex(oneOrMore(digits), { global: true });
      const testString = 'a1b2c3';

      const match1 = pattern.exec(testString);
      expect(match1).not.toBeNull();
      expect(match1![0]).toBe('1');

      const match2 = pattern.exec(testString);
      expect(match2).not.toBeNull();
      expect(match2![0]).toBe('2');

      const match3 = pattern.exec(testString);
      expect(match3).not.toBeNull();
      expect(match3![0]).toBe('3');
    });
  });

  describe('multiline flag', () => {
    it('should create regex with multiline flag', () => {
      const pattern = regex(startOfLine, literal('test'), { multiline: true });
      expect(pattern.flags).toContain('m');
    });

    it('should match start of line in multiline string', () => {
      const pattern = regex(startOfLine, literal('line'), { multiline: true });
      const multilineText = 'first line\nline two\nline three';
      const matches = multilineText.match(new RegExp(pattern.source, pattern.flags + 'g'));
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(2); // Matches 'line' at start of lines 2 and 3
    });

    it('should match end of line in multiline string', () => {
      const pattern = regex(literal('end'), endOfLine, { multiline: true });
      const multilineText = 'end\nmiddle\nend';
      const matches = multilineText.match(new RegExp(pattern.source, pattern.flags + 'g'));
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(2);
    });

    it('should work with multiline preset', () => {
      const pattern = regex(startOfLine, oneOrMore(letters), multiline);
      expect(pattern.flags).toContain('m');
    });
  });

  describe('combined flags', () => {
    it('should support multiple flags together', () => {
      const pattern = regex(
        literal('test'),
        {
          caseInsensitive: true,
          global: true,
          multiline: true
        }
      );
      expect(pattern.flags).toContain('i');
      expect(pattern.flags).toContain('g');
      expect(pattern.flags).toContain('m');
    });

    it('should work with case-insensitive and global', () => {
      const pattern = regex(
        literal('a'),
        { caseInsensitive: true, global: true }
      );
      const matches = 'aAbBaA'.match(pattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(4); // Matches all 'a' and 'A'
    });

    it('should work with all flags enabled', () => {
      const pattern = regex(
        startOfLine,
        literal('test'),
        {
          caseInsensitive: true,
          global: true,
          multiline: true
        }
      );
      const text = 'test\nTEST\nTest';
      const matches = text.match(pattern);
      expect(matches).not.toBeNull();
      expect(matches!.length).toBe(3);
    });
  });

  describe('no flags', () => {
    it('should work without any flags', () => {
      const pattern = regex(literal('test'));
      expect(pattern.flags).toBe('');
    });

    it('should work with empty flags object', () => {
      const pattern = regex(literal('test'), {});
      expect(pattern.flags).toBe('');
    });

    it('should work with false flags', () => {
      const pattern = regex(
        literal('test'),
        {
          caseInsensitive: false,
          global: false,
          multiline: false
        }
      );
      expect(pattern.flags).toBe('');
    });
  });

  describe('preset flag objects', () => {
    it('should have correct structure for caseInsensitive', () => {
      expect(caseInsensitive).toEqual({ caseInsensitive: true });
    });

    it('should have correct structure for global', () => {
      expect(global).toEqual({ global: true });
    });

    it('should have correct structure for multiline', () => {
      expect(multiline).toEqual({ multiline: true });
    });

    it('should work when spreading multiple presets', () => {
      const pattern = regex(
        literal('test'),
        { ...caseInsensitive, ...global }
      );
      expect(pattern.flags).toContain('i');
      expect(pattern.flags).toContain('g');
    });
  });
});
