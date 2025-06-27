import { regex } from "../core";
import { RegexComposer, RegexOperator } from "../types";
import { withChecks, componentsToRegex } from "../utils/common";

/**
 * @description Creates an alternation between the specified patterns
 * @param components Patterns to create alternatives between
 * @returns RegexOperator for alternation
 */
export const or = withChecks((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {
    const alternatives = componentsToRegex(components);
    return `${pattern}(?:${alternatives.join('|')})`;
  };
});

/**
 * @description Creates a negated character set for the given component
 * @param component The component to negate
 * @returns RegexOperator for negation
 */
export const not = (component: RegexComposer): RegexOperator => {
  return (pattern: string) => {
    let source = regex(component).source;

    // Check if the source is a character class (e.g., [abc] or [^abc])
    if (source.startsWith('[') && source.endsWith(']')) {
      // It's a character class. Now check if it's negated.
      if (source.startsWith('[^')) {
        // It's already a negated character class (e.g., [^a-z]).
        // Applying "not" to it should return the positive class.
        const inner = source.substring(2, source.length - 1);
        return `${pattern}[${inner}]`;
      } else {
        // It's a positive character class (e.g., [a-z]).
        // Negate it by extracting the content and wrapping in [^...].
        const inner = source.substring(1, source.length - 1);
        return `${pattern}[^${inner}]`;
      }
    }

    // For anything else (e.g., a single character 'a', or a sequence 'abc'),
    // wrap it in a negated character set.
    return `${pattern}[^${source}]`;
  };
};