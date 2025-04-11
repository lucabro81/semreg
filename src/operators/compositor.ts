import { regex } from "../core";
import { RegexComposer, RegexOperator } from "../types"
import { componentsToRegex, withChecks } from "../utils/common";

const isACharacterClass = (pattern: string) =>
  pattern.startsWith('[') && pattern.endsWith(']');

/**
 * @description Extract character class content from patterns like [a-z], [0-9], etc.
 * @param components Components to extract from
 * @returns Array of character class contents
 */
const extractCharacterClassContent = (components: RegexComposer[]) => {
  const parts: string[] = [];

  for (const component of components) {
    const componentPattern = regex(component).source;

    if (isACharacterClass(componentPattern)) {
      parts.push(componentPattern.slice(1, -1));
    } else {
      parts.push(componentPattern);
    }
  }

  return parts;
}

/**
 * @description Creates a pattern that matches any of the given components
 * @param components Components to match
 * @returns RegexOperator for matching any of the components
 */
export const anyOf = withChecks((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {

    const parts: string[] = extractCharacterClassContent(components);

    return `${pattern}[${parts.join('')}]`;
  }
});

/**
 * @description Creates a pattern that matches a sequence of components in order
 * @param components Components to match in sequence
 * @returns RegexOperator for matching the sequence
 */
export const sequence = withChecks((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {
    // Convert each component to its regex representation
    const sequenceParts = componentsToRegex(components);

    // Join the sequence parts without any separator
    return `${pattern}${sequenceParts.join('')}`;
  };
});