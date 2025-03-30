import { regex } from "../core";
import { RegexComposer, RegexOperator } from "../types";

/**
 * Creates an alternation between the specified patterns
 * @param components Patterns to create alternatives between
 * @returns RegexOperator for alternation
 */
export const or = (...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {

    if (components.length === 0) {
      return pattern;
    }

    // If only one component, just return it without alternation
    if (components.length === 1) {
      return pattern + regex(components[0]).source;
    }

    // Convert each component to its regex representation
    const alternatives = components.map(comp => regex(comp).source);

    // Join with the alternation operator | and wrap in a non-capturing group
    return `${pattern}(?:${alternatives.join('|')})`;
  };
};