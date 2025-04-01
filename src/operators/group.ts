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