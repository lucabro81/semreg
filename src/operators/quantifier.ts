import { RegexComposer, RegexOperator } from "../types";
import { regex } from "../core";

/**
 * Matches one or more occurrences of the pattern
 * @param component The pattern to repeat
 * @returns RegexOperator for one or more occorrenze
 */
export const oneOrMore = (component: RegexComposer): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = regex(component).source;
    return `${pattern}${componentPattern}+`;
  };
}

/**
 * Matches zero or more occurrences of the pattern
 * @param component The pattern to repeat
 * @returns RegexOperator for zero or more occurrences
 */
export const zeroOrMore = (component: RegexComposer): RegexOperator => {
  return (pattern: string) => {
    const componentPattern = regex(component).source;
    return `${pattern}${componentPattern}*`;
  };
}
