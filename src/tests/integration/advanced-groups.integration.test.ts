import { describe, it, expect } from 'vitest';
import { regex } from '../../core';
import {
  group,
  namedGroup,
  backreference,
  namedBackreference,
} from '../../operators/group';
import {
  literal,
  digits,
  letters,
  whitespace,
  word
} from '../../operators/character';
import { anyOf } from '../../operators/compositor';
import { oneOrMore } from '../../operators/quantifier';
import { startOfLine, endOfLine } from '../../operators/position';
import { or } from '../../operators/logic';

describe('Integration Test: Advanced Groups', () => {

  it('should match key-value pairs with potential quotes using named groups and backreferences', () => {
    // Define components first
    const key = namedGroup('key', oneOrMore(letters));
    const quote = namedGroup('quote', anyOf(literal('"'), literal("'")));
    const valueContent = oneOrMore(anyOf(letters, digits));

    // Define parts within the OR
    const quotedValuePart = regex(
      quote, // Capture the opening quote
      namedGroup('qValue', valueContent),
      namedBackreference('quote') // Ensure matching closing quote
    );
    const simpleValuePart = namedGroup('sValue', valueContent);

    // Assemble final regex: key=(quotedValue|simpleValue)
    const pairRegex = regex(
      startOfLine,
      key,
      literal('='),
      or(quotedValuePart, simpleValuePart),
      endOfLine
    );

    // Test cases
    expect(pairRegex.test('name="John1"')).toBe(true);
    expect(pairRegex.test("id='Doe2'")).toBe(true);
    expect(pairRegex.test('key=value3')).toBe(true);

    // Mismatched quotes
    expect(pairRegex.test('name="John1\'')).toBe(false);
    // Missing closing quote
    expect(pairRegex.test('name="John1')).toBe(false);
    // Missing opening quote
    expect(pairRegex.test('name=John1"')).toBe(false);
    // Invalid key
    expect(pairRegex.test('1key="value"')).toBe(false);
    // Extra chars
    expect(pairRegex.test('key="value" extra')).toBe(false);
  });

  it('should match repeated sequences using numbered backreferences', () => {
    // Pattern: Match two identical consecutive words separated by space
    const wordGroup = group(oneOrMore(letters)); // Capturing Group 1
    const repeatedWordRegex = regex(
      startOfLine,
      wordGroup,
      whitespace,
      backreference(1), // Match the content of Group 1
      endOfLine
    );

    expect(repeatedWordRegex.test('hello hello')).toBe(true);
    expect(repeatedWordRegex.test('test test')).toBe(true);
    expect(repeatedWordRegex.test('word Word')).toBe(false); // Case-sensitive
    expect(repeatedWordRegex.test('hello world')).toBe(false);
    expect(repeatedWordRegex.test('hellohello')).toBe(false); // Missing space
    expect(repeatedWordRegex.test(' hello hello')).toBe(false); // Starts with space
  });

}); 