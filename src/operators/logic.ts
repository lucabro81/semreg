import { RegexComposer, RegexOperator } from "../types";
import { withChecks, componentsToRegex } from "../utils/common";

/**
 * Creates an alternation between the specified patterns
 * @param components Patterns to create alternatives between
 * @returns RegexOperator for alternation
 */
export const or = withChecks((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {
    const alternatives = componentsToRegex(components);
    return `${pattern}(?:${alternatives.join('|')})`;
  };
});