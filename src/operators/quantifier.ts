import { QuantificationOptions, RegexComposer, RegexOperator } from "../types";
import { componentToRegex } from "../utils/common";

/**
 * @description Specifies that the component should repeat at least n times.
 * @param count The minimum number of repetitions.
 * @returns QuantificationOptions object for use with repeat().
 */
export const atLeast = (count: number): QuantificationOptions => ({ min: count, max: undefined });

/**
 * @description Specifies that the component should repeat exactly n times.
 * @param count The exact number of repetitions.
 * @returns QuantificationOptions object for use with repeat().
 */
export const exactly = (count: number): QuantificationOptions => ({ min: count });

/**
 * @description Specifies that the component should repeat between min and max times (inclusive).
 * @param min The minimum number of repetitions.
 * @param max The maximum number of repetitions.
 * @returns QuantificationOptions object for use with repeat().
 */
export const between = (min: number, max: number): QuantificationOptions => ({ min, max });

// Existing helper functions used internally by repeat
const isAtLeast = (options: QuantificationOptions) => {
  // Check if max is explicitly undefined or null, allowing { min: 5, max: undefined }
  return 'max' in options && (options.max === undefined || options.max === null);
}

const isMinDifferentFromMax = (options: QuantificationOptions) => {
  // Check if max is defined and different from min
  return options.max !== undefined && options.max !== null && options.min !== options.max;
}

/**
 * @description Matches one or more occurrences of the pattern (equivalent to repeat(component, atLeast(1)))
 * @param component The pattern to repeat
 * @returns RegexOperator for one or more occurrences
 */
export const oneOrMore = (component: RegexComposer): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = componentToRegex(component);
    return `${pattern}${componentPattern}+`;
  };
}

/**
 * @description Matches zero or more occurrences of the pattern
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
 * @description Makes the pattern optional (matches zero or one occurrence, equivalent to repeat(component, between(0, 1)))
 * @param component The pattern to make optional
 * @returns RegexOperator for optional pattern
 */
export const optional = (component: RegexComposer): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = componentToRegex(component);
    return `${pattern}${componentPattern}?`;
  };
}

/**
 * @description Matches repeated occurrences of the pattern according to the specified options. Use with helper functions like atLeast(n), exactly(n), or between(min, max).
 * @param component The pattern to repeat
 * @param options Quantification options created by atLeast(), exactly(), or between().
 * @returns RegexOperator for the specified repetition
 */
export const repeat = (
  component: RegexComposer,
  options: QuantificationOptions
): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = componentToRegex(component);

    // Handles { min: n, max: undefined } -> {n,}
    if (isAtLeast(options)) {
      return `${pattern}${componentPattern}{${options.min},}`;
    }
    // Handles { min: n, max: m } where n !== m -> {n,m}
    else if (isMinDifferentFromMax(options)) {
      return `${pattern}${componentPattern}{${options.min},${options.max}}`;
    }
    // Handles { min: n } or { min: n, max: n } -> {n}
    else {
      return `${pattern}${componentPattern}{${options.min}}`;
    }
  };
};
