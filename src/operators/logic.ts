import { regex } from "../core";
import { RegexComposer, RegexOperator } from "../types";
import { withEmptyCheck } from "../utils/common";
/**
 * Creates an alternation between the specified patterns
 * @param components Patterns to create alternatives between
 * @returns RegexOperator for alternation
 */
export const or = withEmptyCheck((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {

    if (components.length === 1) {
      return pattern + regex(components[0]).source;
    }

    // Convert each component to its regex representation
    const alternatives = components.map(comp => regex(comp).source);

    return `${pattern}(?:${alternatives.join('|')})`;
  };
});