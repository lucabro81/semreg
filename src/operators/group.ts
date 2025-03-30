import { regex } from "../core";
import { RegexComposer, RegexOperator } from "../types";

/**
 * Creates a capturing group containing the specified components
 * @param components Components to include in the group
 * @returns RegexOperator for a capturing group
 */
export const group = (...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {

    if (components.length === 0) {
      return pattern;
    }

    const groupContent = regex(...components).source;

    return `${pattern}(${groupContent})`;
  };
};