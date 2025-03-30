import { regex } from "../core";
import { RegexComposer, RegexOperator } from "../types"
import { withEmptyCheck } from "../utils/common";
const isACharacterClass = (pattern: string) =>
  pattern.startsWith('[') && pattern.endsWith(']');

/**
 * Extract character class content from patterns like [a-z], [0-9], etc.
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

const areThereComplexCharacterClasses = (parts: string[]) => {
  return parts.some(part => part.length > 1 || part.includes('-'))
}

/**
 * Creates a pattern that matches any of the given components
 * @param components Components to match
 * @returns RegexOperator for matching any of the components
 */
export const anyOf = withEmptyCheck((...components: RegexComposer[]): RegexOperator => {
  return (pattern: string) => {

    if (components.length === 1) {
      const singlePattern = regex(components[0]).source;
      return `${pattern}${singlePattern}`;
    }

    const parts: string[] = extractCharacterClassContent(components);

    if (areThereComplexCharacterClasses(parts)) {
      return `${pattern}[${parts.join('')}]`;
    } else {
      return `${pattern}[${parts.join('')}]`;
    }
  }
});