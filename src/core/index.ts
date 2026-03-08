import { RegexComposer, RegexOperator, RegexFlags } from "../types";

/**
 * @description Compose a regex from an array of components with optional flags
 * @param {RegexComposer[]} components The components to compose the regex from
 * @returns {RegExp} A new RegExp object
 * @example
 * // Without flags
 * regex(literal('hello'))
 *
 * // With flags
 * regex(literal('hello'), { caseInsensitive: true, global: true })
 */
export function regex(...args: Array<RegexComposer | RegexFlags>): RegExp {
  // Separate components from flags
  const lastArg = args[args.length - 1];
  const hasFlags = typeof lastArg === 'object' &&
                   lastArg !== null &&
                   !(lastArg instanceof RegExp) &&
                   typeof lastArg !== 'function';

  const components = hasFlags ? args.slice(0, -1) as RegexComposer[] : args as RegexComposer[];
  const flags = hasFlags ? lastArg as RegexFlags : {};

  let pattern = "";

  for (const component of components) {
    if (typeof component === 'function') {
      pattern = (component as RegexOperator)(pattern);
    } else if (component instanceof RegExp) {
      pattern += component.source;
    } else {
      pattern += component;
    }
  }

  // Build flags string
  let flagsString = '';
  if (flags.caseInsensitive) flagsString += 'i';
  if (flags.global) flagsString += 'g';
  if (flags.multiline) flagsString += 'm';

  return new RegExp(pattern, flagsString);
}

/**
 * @description Preset flag configuration for case-insensitive matching
 */
export const caseInsensitive: RegexFlags = { caseInsensitive: true };

/**
 * @description Preset flag configuration for global matching
 */
export const global: RegexFlags = { global: true };

/**
 * @description Preset flag configuration for multiline matching
 */
export const multiline: RegexFlags = { multiline: true };