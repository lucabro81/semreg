import { RegexComposer, RegexOperator } from "../types";

/**
 * @description Compose a regex from an array of components
 * @param {RegexComposer[]} components The components to compose the regex from
 * @returns {RegExp} A new RegExp object
 */
export function regex(...components: RegexComposer[]): RegExp {
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

  return new RegExp(pattern);
}