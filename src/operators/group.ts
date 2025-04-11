import { regex } from "../core";
import { RegexComposer, RegexOperator } from "../types";
import { withEmptyCheck } from "../utils/common";

/**
 * @description Creates a capturing group containing the specified components
 * @param components Components to include in the group
 * @returns RegexOperator for a capturing group
 */
export const group = withEmptyCheck((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {
    const groupContent = regex(...components).source;
    return `${pattern}(${groupContent})`;
  };
});

/**
 * @description Creates a non-capturing group containing the specified components
 * @param components Components to include in the group
 * @returns RegexOperator for a non-capturing group
 */
export const nonCapturingGroup = withEmptyCheck((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {
    const groupContent = regex(...components).source;
    return `${pattern}(?:${groupContent})`;
  };
});

/**
 * @description Creates a named capturing group.
 * @param name The name for the group (must be valid identifier).
 * @param components Components to include in the group.
 * @returns RegexOperator for a named capturing group.
 * @throws Error if the name is invalid.
 */
export const namedGroup = (name: string, ...components: RegexComposer[]): RegexOperator => {
  // Basic validation for group name (alphanumeric + underscore, not starting with digit)
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid group name: "${name}". Name must be alphanumeric and cannot start with a digit.`);
  }
  const groupContent = regex(...components).source;
  // Prevent applying to empty pattern or empty group content
  if (components.length === 0 || groupContent === '') {
    return (pattern: string) => pattern; // Or throw? Let's return pattern for consistency
  }
  return (pattern: string) => `${pattern}(?<${name}>${groupContent})`;
};

/**
 * @description Creates a numbered backreference to a previously defined capturing group by its index.
 * @param index The 1-based index of the capturing group.
 * @returns RegexOperator for a numbered backreference.
 * @throws Error if the index is not a positive integer.
 */
export const numberedBackreference = (index: number): RegexOperator => {
  if (!Number.isInteger(index) || index <= 0) {
    throw new Error(`Invalid backreference index: ${index}. Index must be a positive integer.`);
  }
  return (pattern: string) => `${pattern}\\${index}`;
};

/**
 * @description Creates a named backreference to a previously defined named capturing group.
 * @param name The name of the capturing group.
 * @returns RegexOperator for a named backreference.
 * @throws Error if the name is invalid.
 */
export const namedBackreference = (name: string): RegexOperator => {
  // Basic validation for group name
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid group name for backreference: "${name}".`);
  }
  return (pattern: string) => `${pattern}\\k<${name}>`;
};