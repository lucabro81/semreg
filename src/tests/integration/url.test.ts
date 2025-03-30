import { describe, it, expect } from "vitest";
import { regex } from "../../core";
import { letters, digits, literal } from "../../operators/character";
import { anyOf } from "../../operators/compositor";
import { startOfLine, endOfLine } from "../../operators/position";
import { oneOrMore, optional, zeroOrMore, repeatBetween } from "../../operators/quantifier";
import { nonCapturingGroup } from "../../operators/group";
import { or } from "../../operators/logic";

const urlRegex = regex(
  startOfLine,
  or(literal('http'), literal('https')),
  literal('://'),
  optional(nonCapturingGroup(literal('www.'))),
  oneOrMore(
    anyOf(
      letters(),
      digits(),
      literal('.-')
    )
  ),
  literal('.'),
  repeatBetween(letters(), 2, 6),
  optional(
    nonCapturingGroup(
      literal('/'),
      zeroOrMore(
        anyOf(
          letters(),
          digits(),
          literal('/._-')
        )
      )
    )
  ),
  endOfLine
);

describe('URL Regex Integration Test', () => {
  it('should build a working URL validation regex', () => {
    // Costruiamo la regex per l'URL come nell'esempio del documento di design

    // Test con URL validi
    expect(urlRegex.test('http://example.com')).toBe(true);
    expect(urlRegex.test('https://www.google.com')).toBe(true);
    expect(urlRegex.test('https://dev.to/path/to/resource')).toBe(true);
    expect(urlRegex.test('http://sub-domain.example.co.uk')).toBe(true);
    expect(urlRegex.test('https://example.com/')).toBe(true);

    // Test con URL non validi
    expect(urlRegex.test('ftp://example.com')).toBe(false);
    expect(urlRegex.test('http:/example.com')).toBe(false);
    expect(urlRegex.test('http://example')).toBe(false);
    expect(urlRegex.test('example.com')).toBe(false);
    expect(urlRegex.test('http://example.toolong')).toBe(false);
  });

  it('should match the expected regex pattern', () => {
    expect(urlRegex.source).toBe(
      '^(?:http|https):\\/\\/(?:www\\.)?[a-zA-Z0-9\\.-]+\\.[a-zA-Z]{2,6}(?:\\/[a-zA-Z0-9\\/\\._-]*)?$'
    );
  });
});