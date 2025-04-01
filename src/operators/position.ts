import { RegexOperator } from "../types";

/**
 * @description Matches the start of a line (^)
 * @param pattern - The pattern to match
 * @returns The regex operator
 */
export const startOfLine: RegexOperator = (pattern: string) => `^${pattern}`;

/**
 * @description Matches the end of a line ($)
 * @param pattern - The pattern to match
 * @returns The regex operator
 */
export const endOfLine: RegexOperator = (pattern: string) => `${pattern}$`;

/**
 * @description Matches a word boundary
 * @param pattern - The pattern to match
 * @returns The regex operator
 */
export const wordBoundary: RegexOperator = (pattern: string) => `${pattern}\\b`;

/**
 * @description Matches a non-word boundary
 * @param pattern - The pattern to match
 * @returns The regex operator
 */
export const nonWordBoundary: RegexOperator = (pattern: string) => `${pattern}\\B`;

/**
 * @description Matches the start of the input, ignoring newlines
 * @param pattern - The pattern to match
 * @returns The regex operator
 */
export const startOfInput: RegexOperator = (pattern: string) => `\\A${pattern}`;

/**
 * @description Matches the end of the input, ignoring newlines
 * @param pattern - The pattern to match
 * @returns The regex operator
 */
export const endOfInput: RegexOperator = (pattern: string) => `${pattern}\\Z`;