import { regex } from '../core'; // Import regex core function
import { RegexComposer, RegexOperator } from "../types";
import { withEmptyCheck } from "../utils/common";
import { digits, letters, literal } from './character'; // Import character operators
import { anyOf } from './compositor'; // Import compositor operators
import { endOfLine, startOfLine } from './position'; // Import position operators
import { zeroOrMore } from './quantifier'; // Import quantifier operators

// Define the validator using semreg components
const validGroupNameRegex = regex(
  startOfLine,
  anyOf(letters, literal('_')), // Starts with letter or underscore
  zeroOrMore(anyOf(letters, digits, literal('_'))), // Followed by letters, digits, or underscores
  endOfLine
);


/**
 * @description Creates a capturing group for one or more components.
 * @param components The patterns to include in the group
 * @returns RegexOperator for the capturing group
 */
export const group: (...components: RegexComposer[]) => RegexOperator =
  withEmptyCheck((...components: RegexComposer[]) => {
    return (pattern: string) => {
      const innerPattern = regex(...components).source;
      return `${pattern}(${innerPattern})`;
    };
  });

/**
 * @description Creates a non-capturing group for one or more components.
 * @param components The patterns to include in the group
 * @returns RegexOperator for the non-capturing group
 */
export const nonCapturingGroup: (...components: RegexComposer[]) => RegexOperator =
  withEmptyCheck((...components: RegexComposer[]) => {
    return (pattern: string) => {
      const innerPattern = regex(...components).source;
      return `${pattern}(?:${innerPattern})`;
    };
  });

/**
 * @description Creates a named capturing group.
 * @param name The name for the group (must be valid JS identifier: start with letter or _, followed by letters, digits, or _)
 * @param components The patterns to include in the group
 * @returns RegexOperator for the named capturing group
 */
export const namedGroup = (
  name: string,
  ...components: RegexComposer[]
): RegexOperator => {
  // Validate group name using the semreg-defined regex
  if (!validGroupNameRegex.test(name)) {
    throw new Error(
      `Invalid group name: "${name}". Must start with a letter or underscore, followed by letters, digits, or underscores.`
    );
  }
  if (components.length === 0) {
    throw new Error('Named group cannot be empty.');
  }

  return (pattern: string) => {
    const innerPattern = regex(...components).source;
    return `${pattern}(?<${name}>${innerPattern})`;
  };
};

/**
 * @description Creates a numbered backreference (e.g., \1, \2).
 * @param index The index of the capturing group to reference (1-based)
 * @returns RegexOperator for the numbered backreference
 */
export const numberedBackreference = (index: number): RegexOperator => {
  if (index <= 0 || !Number.isInteger(index)) {
    throw new Error('Backreference index must be a positive integer.');
  }
  return (pattern: string) => {
    return `${pattern}\\${index}`;
  };
};

/**
 * @description Creates a named backreference (e.g., \k<name>).
 * @param name The name of the capturing group to reference
 * @returns RegexOperator for the named backreference
 */
export const namedBackreference = (name: string): RegexOperator => {
  // Validate group name using the semreg-defined regex
  if (!validGroupNameRegex.test(name)) {
    throw new Error(
      `Invalid group name for backreference: "${name}". Must start with a letter or underscore, followed by letters, digits, or underscores.`
    );
  }
  return (pattern: string) => {
    return `${pattern}\\k<${name}>`;
  };
};