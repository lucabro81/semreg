import { RegexOperator } from "../types";

/**
 * @description Matches any alphabetic character (a-z, A-Z)
 * @returns RegexOperator for alphabetic characters
 */
export const letters: RegexOperator =
  (pattern: string) => `${pattern}[a-zA-Z]`;

/**
 * @description Matches any lowercase letter (a-z)
 * @returns RegexOperator for lowercase letters
 */
export const lowerLetters: RegexOperator =
  (pattern: string) => `${pattern}[a-z]`;

/**
 * @description Matches any uppercase letter (A-Z)
 * @returns RegexOperator for uppercase letters
 */
export const upperLetters: RegexOperator =
  (pattern: string) => `${pattern}[A-Z]`;

/**
 * @description Matches any numeric digit (0-9)
 * @returns RegexOperator for numeric digits
 */
export const digits: RegexOperator =
  (pattern: string) => `${pattern}[0-9]`;

/**
 * @description Escapes special regex characters in a string
 * @param str String to escape
 * @returns Escaped string
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

/**
 * @description Matches the literal string provided
 * @param str String to match literally
 * @returns RegexOperator for the literal string
 */
export const literal = (str: string): RegexOperator =>
  (pattern: string) => `${pattern}${escapeRegExp(str)}`;