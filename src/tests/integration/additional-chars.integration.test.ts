import { describe, it, expect } from 'vitest';
import { regex } from '../../core';
import {
  any,
  digits,
  literal,
  nonWhitespace,
  nonWord,
  oneOrMore,
  range,
  startOfLine,
  whitespace,
  word,
  endOfLine
} from '../../operators';

describe('Integration Test: Additional Character Classes', () => {
  it('should correctly match a complex pattern using new character classes', () => {
    // Pattern: Match a line starting with a word character, followed by one or more non-whitespace chars,
    // then a whitespace, then any character, then a digit, then a range of A-C,
    // and finally a non-word character before the end of the line.
    const complexPattern = regex(
      startOfLine,
      word,                 // \w
      oneOrMore(nonWhitespace), // \S+
      whitespace,           // \s
      any,                  // .
      digits,               // [0-9]
      range('A', 'C'),      // [A-C]
      nonWord,              // \W
      endOfLine
    );

    // Example: wXyZ 1B! - Changed to fit pattern
    expect(complexPattern.test('wXyZ A1B!')).toBe(true);
    // Example: 5Test String 5A@ - Invalid: 'A' is not a digit where [0-9] is expected
    expect(complexPattern.test('5TestString 5A@')).toBe(false);

    // Invalid: String '_abc def 9C#' does not match: 'e' is not a digit where [0-9] is expected
    expect(complexPattern.test('_abc def 9C#')).toBe(false);
    // Invalid: Starts with non-word
    expect(complexPattern.test('@XyZ 1B!')).toBe(false);
    // Invalid: Contains whitespace where nonWhitespace is expected
    expect(complexPattern.test('wX yZ 1B!')).toBe(false);
    // Invalid: Missing whitespace
    expect(complexPattern.test('wXyZ1B!')).toBe(false);
    // Invalid: Missing 'any' character
    // This is tricky because '.' matches almost anything including digits.
    // Let's test boundary conditions.
    // Invalid: Digit missing
    expect(complexPattern.test('wXyZ A!')).toBe(false);
    // Invalid: Range character incorrect (D instead of A-C)
    expect(complexPattern.test('wXyZ 1D!')).toBe(false);
    // Invalid: Ends with word character
    expect(complexPattern.test('wXyZ 1Ba')).toBe(false);
    // Invalid: Missing non-word character at the end
    expect(complexPattern.test('wXyZ 1B')).toBe(false);
  });

  it('should match text separated by optional whitespace or non-word characters', () => {
    const sepPattern = regex(
      startOfLine,
      literal('START'),
      oneOrMore(
        nonWord // Use nonWord as a separator allowing symbols etc.
      ),
      literal('MIDDLE'),
      oneOrMore(
        whitespace // Use whitespace as separator
      ),
      literal('END'),
      endOfLine
    );

    console.log("sepPattern", sepPattern.toString());

    expect(sepPattern.test('START-MIDDLE END')).toBe(true);
    expect(sepPattern.test('START%%%MIDDLE  END')).toBe(true); // Multiple nonWord and whitespace
    expect(sepPattern.test('START_MIDDLE\tEND')).toBe(false);

    // Valid: Space is matched by \W+ between START and MIDDLE
    expect(sepPattern.test('START MIDDLE END')).toBe(true);
    expect(sepPattern.test('START-MIDDLE-END')).toBe(false); // Hyphen is not whitespace
    expect(sepPattern.test('STARTMIDDLE END')).toBe(false); // Missing nonWord separator
    expect(sepPattern.test('START-MIDDLEEND')).toBe(false); // Missing whitespace separator
  });
}); 