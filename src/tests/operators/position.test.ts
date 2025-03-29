import { describe, it, expect } from 'vitest';
import { startOfLine, endOfLine, wordBoundary, nonWordBoundary, startOfInput, endOfInput } from '../../operators/position';

describe('Position Operators', () => {
  describe('startOfLine', () => {
    it('should add ^ at the end of the pattern', () => {
      expect(startOfLine('')).toBe('^');
      expect(startOfLine('abc')).toBe('^abc');
    });
  });

  describe('endOfLine', () => {
    it('should add $ at the end of the pattern', () => {
      expect(endOfLine('')).toBe('$');
      expect(endOfLine('abc')).toBe('abc$');
    });
  });

  describe('wordBoundary', () => {
    it('should add \\b at the end of the pattern', () => {
      expect(wordBoundary('')).toBe('\\b');
      expect(wordBoundary('abc')).toBe('abc\\b');
    });
  });

  describe('nonWordBoundary', () => {
    it('should add \\B at the end of the pattern', () => {
      expect(nonWordBoundary('')).toBe('\\B');
      expect(nonWordBoundary('abc')).toBe('abc\\B');
    });
  });

  describe('startOfInput', () => {
    it('should add \\A at the beginning of the pattern', () => {
      expect(startOfInput('')).toBe('\\A');
      expect(startOfInput('abc')).toBe('\\Aabc');
    });
  });

  describe('endOfInput', () => {
    it('should add \\Z at the end of the pattern', () => {
      expect(endOfInput('')).toBe('\\Z');
      expect(endOfInput('abc')).toBe('abc\\Z');
    });
  });

});