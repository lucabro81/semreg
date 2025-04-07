import { describe, it, expect } from 'vitest';
import { digits, literal, letters, lowerLetters, upperLetters, whitespace, nonWhitespace, word, nonWord, any, range } from '../../operators/character';

describe('Character Generators', () => {
  describe('letters', () => {
    it('should generate pattern for alphabetic characters', () => {
      expect(letters('')).toBe('[a-zA-Z]');
      expect(letters('abc')).toBe('abc[a-zA-Z]');
    });
  });

  describe('lowerLetters', () => {
    it('should generate pattern for lowercase letters', () => {
      expect(lowerLetters('')).toBe('[a-z]');
      expect(lowerLetters('abc')).toBe('abc[a-z]');
    });
  });

  describe('upperLetters', () => {
    it('should generate pattern for uppercase letters', () => {
      expect(upperLetters('')).toBe('[A-Z]');
      expect(upperLetters('abc')).toBe('abc[A-Z]');
    });
  });

  describe('digits', () => {
    it('should generate pattern for numeric characters', () => {
      expect(digits('')).toBe('[0-9]');
      expect(digits('abc')).toBe('abc[0-9]');
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

  describe('whitespace', () => {
    it('should generate pattern for whitespace characters', () => {
      expect(whitespace('')).toBe('\\s');
      expect(whitespace('abc')).toBe('abc\\s');
    });
  });

  describe('nonWhitespace', () => {
    it('should generate pattern for non-whitespace characters', () => {
      expect(nonWhitespace('')).toBe('\\S');
      expect(nonWhitespace('abc')).toBe('abc\\S');
    });
  });

  describe('word', () => {
    it('should generate pattern for word characters', () => {
      expect(word('')).toBe('\\w');
      expect(word('abc')).toBe('abc\\w');
    });
  });

  describe('nonWord', () => {
    it('should generate pattern for non-word characters', () => {
      expect(nonWord('')).toBe('\\W');
      expect(nonWord('abc')).toBe('abc\\W');
    });
  });

  describe('any', () => {
    it('should generate pattern for any character', () => {
      expect(any('')).toBe('.');
      expect(any('abc')).toBe('abc.');
    });
  });

  describe('range', () => {
    it('should generate pattern for a character range', () => {
      expect(range('a', 'z')('')).toBe('[a-z]');
      expect(range('0', '9')('abc')).toBe('abc[0-9]');
    });

    it('should escape special characters in range', () => {
      expect(range('[', ']')('')).toBe('[\\[-\\]]');
      expect(range('-', 'a')('')).toBe('[\\--a]');
    });
  });
});