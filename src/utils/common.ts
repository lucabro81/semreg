import { RegexComposer, RegexOperator } from "../types";

/**
 * Higher-order function that adds empty components check to operators
 * @param operatorFn The original operator function
 * @returns A new operator function that handles empty components array
 */
export const withEmptyCheck = (operatorFn: (...components: RegexComposer[]) => RegexOperator) => {
  return (...components: RegexComposer[]): RegexOperator => {
    return (pattern: string) => {
      if (components.length === 0) {
        return pattern;
      }
      return operatorFn(...components)(pattern);
    };
  };
};