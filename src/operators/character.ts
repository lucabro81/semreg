import { RegexOperator } from "../types";

/**
 * Matches any alphabetic character (a-z, A-Z)
 * @returns RegexOperator for alphabetic characters
 */
export const letters = (): RegexOperator =>
  (pattern: string) => `${pattern}[a-zA-Z]`;

/**
 * Corrisponde a qualsiasi lettera minuscola (a-z)
 * @example regex(lowerLetters())  // /[a-z]/
 */
export const lowerLetters = (): string => "[a-z]";

/**
 * Matches any numeric digit (0-9)
 * @returns RegexOperator for numeric digits
 */
export const digits = (): RegexOperator =>
  (pattern: string) => `${pattern}[0-9]`;

/**
 * Escapes special regex characters in a string
 * @param str String to escape
 * @returns Escaped string
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

/**
 * Matches the literal string provided
 * @param str String to match literally
 * @returns RegexOperator for the literal string
 */
export const literal = (str: string): RegexOperator =>
  (pattern: string) => `${pattern}${escapeRegExp(str)}`;