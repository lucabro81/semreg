import { describe, it, expect } from 'vitest';
import { startOfLine, endOfLine } from '../../operators/position';

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
});