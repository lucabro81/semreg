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
 * @description Escapes more special regex characters in a string
 * @param str String to escape
 * @returns Escaped string
 */
function escapeRegExpExtended(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
}

/**
 * @description Matches the literal string provided
 * @param str String to match literally
 * @returns RegexOperator for the literal string
 */
export const literal = (str: string): RegexOperator =>
  (pattern: string) => `${pattern}${escapeRegExp(str)}`;

/**
 * @description Matches any whitespace character (\s)
 * @returns RegexOperator for whitespace characters
 */
export const whitespace: RegexOperator =
  (pattern: string) => `${pattern}\\s`;

/**
 * @description Matches any non-whitespace character (\S)
 * @returns RegexOperator for non-whitespace characters
 */
export const nonWhitespace: RegexOperator =
  (pattern: string) => `${pattern}\\S`;

/**
 * @description Matches any word character (alphanumeric + underscore) (\w)
 * @returns RegexOperator for word characters
 */
export const word: RegexOperator =
  (pattern: string) => `${pattern}\\w`;

/**
 * @description Matches any non-word character (\W)
 * @returns RegexOperator for non-word characters
 */
export const nonWord: RegexOperator =
  (pattern: string) => `${pattern}\\W`;

/**
 * @description Matches any character except newline (.)
 * @returns RegexOperator for any character
 */
export const any: RegexOperator =
  (pattern: string) => `${pattern}.`;

/**
 * @description Matches any character within the specified range
 * @param from Start character of the range
 * @param to End character of the range
 * @returns RegexOperator for the character range
 */
export const range = (from: string, to: string): RegexOperator =>
  (pattern: string) => `${pattern}[${escapeRegExpExtended(from)}-${escapeRegExpExtended(to)}]`;