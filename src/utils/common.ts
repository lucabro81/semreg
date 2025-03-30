import { regex } from "../core";
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

/**
 * Higher-order function that adds single component check to operators
 * @param operatorFn The operator function to apply for multiple components
 * @returns A new operator function that handles single component case separately
 */
export const withSingleComponentCheck = (operatorFn: (...components: RegexComposer[]) => RegexOperator) => {
  return (...components: RegexComposer[]): RegexOperator => {
    return (pattern: string) => {
      if (components.length === 1) {
        return pattern + regex(components[0]).source;
      }
      return operatorFn(...components)(pattern);
    };
  };
};

/**
 * Combines multiple checks (empty and single component) into one HOF
 * @param operatorFn The original operator function
 * @returns A new operator function with all checks applied
 */
export const withChecks = (operatorFn: (...components: RegexComposer[]) => RegexOperator) => {
  return withEmptyCheck(withSingleComponentCheck(operatorFn));
};

/**
 * Converts a component to a regex string
 * @param component The component to convert
 * @returns A regex string
 */
export const componentToRegex = (component: RegexComposer): string => {
  return regex(component).source;
};

/**
 * Converts an array of components to an array of regex strings
 * @param components The components to convert
 * @returns An array of regex strings
 */
export const componentsToRegex = (components: RegexComposer[]): string[] => {
  return components.map(componentToRegex);
};