import { QuantificationOptions, RegexComposer, RegexOperator } from "../types";
import { componentToRegex } from "../utils/common";

const isAtLeast = (options: QuantificationOptions) => {
  return 'max' in options && (options.max === undefined || options.max === null)
}

const isMinDifferentFromMax = (options: QuantificationOptions) => {
  return options.max !== undefined && options.min !== options.max
}

/**
 * Matches one or more occurrences of the pattern
 * @param component The pattern to repeat
 * @returns RegexOperator for one or more occorrenze
 */
export const oneOrMore = (component: RegexComposer): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = componentToRegex(component);
    return `${pattern}${componentPattern}+`;
  };
}

/**
 * Matches zero or more occurrences of the pattern
 * @param component The pattern to repeat
 * @returns RegexOperator for zero or more occurrences
 */
export const zeroOrMore = (component: RegexComposer): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = componentToRegex(component);
    return `${pattern}${componentPattern}*`;
  };
}

/**
 * Matches repeated occurrences of the pattern according to the specified options
 * @param component The pattern to repeat
 * @param options Quantification options: min (required) and max (optional)
 * @returns RegexOperator for the specified repetition
 */
export const repeat = (
  component: RegexComposer,
  options: QuantificationOptions
): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = componentToRegex(component);

    if (isAtLeast(options)) {
      return `${pattern}${componentPattern}{${options.min},}`;
    }
    else if (isMinDifferentFromMax(options)) {
      return `${pattern}${componentPattern}{${options.min},${options.max}}`;
    }
    else {
      return `${pattern}${componentPattern}{${options.min}}`;
    }
  };
};

/**
 * Matches exactly n occurrences of the pattern
 * @param component The pattern to repeat
 * @param count Exact number of repetitions
 * @returns RegexOperator for exactly count occurrences
 */
export const repeatExactly = (component: RegexComposer, count: number): RegexOperator =>
  repeat(component, { min: count });

/**
 * Matches at least n occurrences of the pattern
 * @param component The pattern to repeat
 * @param count Minimum number of repetitions
 * @returns RegexOperator for at least count occurrences
 */
export const repeatAtLeast = (component: RegexComposer, count: number): RegexOperator =>
  repeat(component, { min: count, max: undefined });

/**
 * Matches between min and max occurrences of the pattern
 * @param component The pattern to repeat
 * @param min Minimum number of repetitions
 * @param max Maximum number of repetitions
 * @returns RegexOperator for between min and max occurrences
 */
export const repeatBetween = (component: RegexComposer, min: number, max: number): RegexOperator =>
  repeat(component, { min, max });
