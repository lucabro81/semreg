import { regex } from '../core';
import { RegexComposer, RegexOperator } from "../types";
import { withEmptyCheck } from "../utils/common";

/**
 * @description Creates a positive lookahead assertion. Matches if the pattern ahead matches, without consuming characters.
 * @param components The patterns to look ahead for
 * @returns RegexOperator for the positive lookahead assertion (?=...)
 * @example
 * // Match 'foo' only if followed by 'bar'
 * regex(literal('foo'), positiveLookahead(literal('bar')))
 */
export const positiveLookahead: (...components: RegexComposer[]) => RegexOperator =
  withEmptyCheck((...components: RegexComposer[]) => {
    return (pattern: string) => {
      const innerPattern = regex(...components).source;
      return `${pattern}(?=${innerPattern})`;
    };
  });

/**
 * @description Creates a negative lookahead assertion. Matches if the pattern ahead does NOT match, without consuming characters.
 * @param components The patterns to look ahead for (negated)
 * @returns RegexOperator for the negative lookahead assertion (?!...)
 * @example
 * // Match 'foo' only if NOT followed by 'bar'
 * regex(literal('foo'), negativeLookahead(literal('bar')))
 */
export const negativeLookahead: (...components: RegexComposer[]) => RegexOperator =
  withEmptyCheck((...components: RegexComposer[]) => {
    return (pattern: string) => {
      const innerPattern = regex(...components).source;
      return `${pattern}(?!${innerPattern})`;
    };
  });

/**
 * @description Creates a positive lookbehind assertion. Matches if the pattern behind matches, without consuming characters.
 * @param components The patterns to look behind for
 * @returns RegexOperator for the positive lookbehind assertion (?<=...)
 * @example
 * // Match 'bar' only if preceded by 'foo'
 * regex(positiveLookbehind(literal('foo')), literal('bar'))
 */
export const positiveLookbehind: (...components: RegexComposer[]) => RegexOperator =
  withEmptyCheck((...components: RegexComposer[]) => {
    return (pattern: string) => {
      const innerPattern = regex(...components).source;
      return `${pattern}(?<=${innerPattern})`;
    };
  });

/**
 * @description Creates a negative lookbehind assertion. Matches if the pattern behind does NOT match, without consuming characters.
 * @param components The patterns to look behind for (negated)
 * @returns RegexOperator for the negative lookbehind assertion (?<!...)
 * @example
 * // Match 'bar' only if NOT preceded by 'foo'
 * regex(negativeLookbehind(literal('foo')), literal('bar'))
 */
export const negativeLookbehind: (...components: RegexComposer[]) => RegexOperator =
  withEmptyCheck((...components: RegexComposer[]) => {
    return (pattern: string) => {
      const innerPattern = regex(...components).source;
      return `${pattern}(?<!${innerPattern})`;
    };
  });
