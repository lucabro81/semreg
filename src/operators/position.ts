import { RegexOperator } from "../types";

/**
 * Matches the start of a line (^)
 */
export const startOfLine: RegexOperator = (pattern: string) => `^${pattern}`;

/**
 * Matches the end of a line ($)
 */
export const endOfLine: RegexOperator = (pattern: string) => `${pattern}$`;