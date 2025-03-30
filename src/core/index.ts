import { RegexComposer, RegexOperator } from "../types";

export function regex(...components: RegexComposer[]): RegExp {
  let pattern = "";

  for (const component of components) {
    console.log(component);
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