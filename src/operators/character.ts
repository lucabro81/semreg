import { RegexOperator } from "../types";

/**
 * Matches any alphabetic character (a-z, A-Z)
 * @returns RegexOperator for alphabetic characters
 */
export const letters = (): RegexOperator =>
  (pattern: string) => `${pattern}]`;

/**
 * Matches any numeric digit (0-9)
 * @returns RegexOperator for numeric digits
 */
export const digits = (): RegexOperator =>
  (pattern: string) => `${pattern}`;

/**
 * Escapes special regex characters in a string
 * @param str String to escape
 * @returns Escaped string
 */
function escapeRegExp(str: string): string {
  return str;
}

/**
 * Matches the literal string provided
 * @param str String to match literally
 * @returns RegexOperator for the literal string
 */
export const literal = (str: string): RegexOperator =>
  (pattern: string) => `${pattern}`;