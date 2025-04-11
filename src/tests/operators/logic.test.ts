import { describe, it, expect } from 'vitest';
import { or } from '../../operators/logic';
import { letters, digits, literal } from '../../operators/character';
import { group } from '../../operators/group';

describe('Or Operator', () => {
  describe('or', () => {
    it('should create alternation between patterns', () => {
      expect(or(letters, digits)('')).toBe('(?:[a-zA-Z]|[0-9])');
    });

    it('should append to existing pattern', () => {
      expect(or(letters, digits)('abc')).toBe('abc(?:[a-zA-Z]|[0-9])');
    });

    it('should handle single pattern correctly', () => {
      expect(or(letters)('')).toBe('[a-zA-Z]');
    });

    it('should handle multiple patterns', () => {
      expect(or(letters, digits, literal('_'))('')).toBe('(?:[a-zA-Z]|[0-9]|_)');
    });

    it('should work with groups', () => {
      expect(or(group(letters), group(digits))('')).toBe('(?:([a-zA-Z])|([0-9]))');
    });

    it('should handle empty input', () => {
      expect(() => or()).toThrow('At least one component is required');
    });
  });
});