import { describe, it, expect } from "vitest";
import { regex } from "../../core";
import { letters, digits, literal } from "../../operators/character";
import { anyOf } from "../../operators/compositor";
import { startOfLine, endOfLine } from "../../operators/position";
import { oneOrMore, repeatAtLeast } from "../../operators/quantifier";

describe('Email Regex Integration Test', () => {
  it('should build a working email validation regex', () => {
    // Costruiamo la regex per l'email come nell'esempio del documento di design
    const emailRegex = regex(
      startOfLine,
      oneOrMore(
        anyOf(
          letters(),
          digits(),
          literal('._%+-')
        )
      ),
      literal('@'),
      oneOrMore(
        anyOf(
          letters(),
          digits(),
          literal('.-')
        )
      ),
      literal('.'),
      repeatAtLeast(letters(), 2),
      endOfLine
    );

    // Test con indirizzi email validi
    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('john.doe123@gmail.com')).toBe(true);
    expect(emailRegex.test('info+newsletter@company-name.co.uk')).toBe(true);

    // Test con indirizzi email non validi
    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('@missingusername.com')).toBe(false);
    expect(emailRegex.test('user@')).toBe(false);
    expect(emailRegex.test('user@domain')).toBe(false);
    expect(emailRegex.test('user@.com')).toBe(false);
    expect(emailRegex.test('user@domain.a')).toBe(false); // TLD troppo corto
  });

  it('should match the expected regex pattern', () => {
    const emailRegex = regex(
      startOfLine,
      oneOrMore(
        anyOf(
          letters(),
          digits(),
          literal('._%+-')
        )
      ),
      literal('@'),
      oneOrMore(
        anyOf(
          letters(),
          digits(),
          literal('.-')
        )
      ),
      literal('.'),
      repeatAtLeast(letters(), 2),
      endOfLine
    );

    // Verifichiamo che il pattern regex generato corrisponda a ciò che ci aspettiamo
    expect(emailRegex.source).toBe(
      '^[a-zA-Z0-9\\._%\\+-]+@[a-zA-Z0-9\\.-]+\\.[a-zA-Z]{2,}$'
    );
  });
});