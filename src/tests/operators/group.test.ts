import { describe, it, expect } from 'vitest';
import { group } from '../../operators/group';
import { letters, digits, literal } from '../../operators/character';
import { oneOrMore } from '../../operators/quantifier';

describe('Group Operators', () => {
  describe('group', () => {
    it('should wrap the pattern in capturing group parentheses', () => {
      expect(group(letters())('')).toBe('([a-zA-Z])');
      expect(group(digits())('')).toBe('([0-9])');
    });

    it('should append to existing pattern', () => {
      expect(group(letters())('abc')).toBe('abc([a-zA-Z])');
    });

    it('should work with complex patterns', () => {
      expect(group(oneOrMore(letters()))('')).toBe('([a-zA-Z]+)');
    });

    it('should group multiple components', () => {
      expect(group(letters(), digits())('')).toBe('([a-zA-Z][0-9])');
      expect(group(literal('abc'), digits())('')).toBe('(abc[0-9])');
    });
  });
});