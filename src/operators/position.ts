import { RegexOperator } from "../types";

/**
 * Matches the start of a line (^)
 */
export const startOfLine: RegexOperator = (pattern: string) => `^${pattern}`;

/**
 * Matches the end of a line ($)
 */
export const endOfLine: RegexOperator = (pattern: string) => `${pattern}$`;

/**
 * Matches a word boundary
 * @example regex(wordBoundary, literal('word'), wordBoundary)  // /\bword\b/
 */
export const wordBoundary: RegexOperator = (pattern) => `${pattern}\\b`;

/**
 * Matches a non-word boundary
 * @example regex(nonWordBoundary, literal('word'))  // /\Bword/
 */
export const nonWordBoundary: RegexOperator = (pattern) => `${pattern}\\B`;

/**
 * Matches the start of the input, ignoring newlines
 * @example regex(startOfInput, literal('hello'))  // /\Ahello/
 */
export const startOfInput: RegexOperator = (pattern) => `\\A${pattern}`;

/**
 * Matches the end of the input, ignoring newlines
 * @example regex(literal('world'), endOfInput)  // /world\Z/
 */
export const endOfInput: RegexOperator = (pattern) => `${pattern}\\Z`;