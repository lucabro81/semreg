# SemReg: Semantic Regular Expressions

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Installation](#installation)
- [Key Features](#key-features)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
  - [Core Function](#core-function)
  - [Position Operators](#position-operators)
  - [Character Generators](#character-generators)
  - [Quantifiers](#quantifiers)
  - [Groups](#groups)
  - [Compositors](#compositors)
  - [Logical Operators](#logical-operators)
  - [Assertions](#assertions)
  - [Flags and Options](#flags-and-options)
- [Examples](#examples)
  - [Email Validation](#email-validation)
  - [URL Validation](#url-validation)
  - [Password Validation with Lookahead](#password-validation-with-lookahead)
  - [Price Extraction with Lookbehind](#price-extraction-with-lookbehind)
- [Custom Patterns](#custom-patterns)
- [License](#license)

SemReg is a TypeScript library for building regular expressions in a readable, maintainable way. It uses a functional, pipe-based approach that allows developers to compose regex patterns with a clear and expressive syntax.

## Installation

```bash
npm install semreg
# or
yarn add semreg
# or
pnpm add semreg
```

## Key Features

- 🔍 **Readable Syntax**: Replace cryptic regex patterns with a clear, expressive API
- 🧩 **Composable**: Build complex patterns by combining simple, reusable components
- 🛠️ **Fully Typed**: Complete TypeScript support with helpful type definitions
- 🧪 **Well Tested**: Comprehensive test suite ensures reliability

## Basic Usage

```typescript
import {
  regex,
  startOfLine,
  endOfLine,
  letters,
  digits,
  oneOrMore,
  literal,
} from "semreg";

// Create a simple regex for validating usernames (letters, digits, and underscores)
const usernameRegex = regex(
  startOfLine,
  oneOrMore(anyOf(letters, digits, literal("_"))),
  endOfLine
);

// Test the regex
usernameRegex.test("john_doe123"); // true
usernameRegex.test("invalid-username"); // false
```

## API Reference

### Core Function

- `regex(...components)`: Combines multiple components to produce a RegExp object

### Position Operators

- `startOfLine`: Matches the start of a line (`^`)
- `endOfLine`: Matches the end of a line (`$`)
- `wordBoundary`: Matches a word boundary (`\b`)
- `nonWordBoundary`: Matches a non-word boundary (`\B`)
- `startOfInput`: Matches the start of the input (`\A`)
- `endOfInput`: Matches the end of the input (`\Z`)

### Character Generators

- `letters`: Matches any alphabetic character (`[a-zA-Z]`)
- `lowerLetters`: Matches lowercase letters (`[a-z]`)
- `upperLetters`: Matches uppercase letters (`[A-Z]`)
- `digits`: Matches any digit (`[0-9]`)
- `literal(str)`: Matches the literal string provided, with special characters escaped
- `whitespace()`: Matches any whitespace character (`\s`)
- `nonWhitespace()`: Matches any non-whitespace character (`\S`)
- `word()`: Matches any word character (alphanumeric + underscore) (`\w`)
- `nonWord()`: Matches any non-word character (`\W`)
- `any()`: Matches any character except newline (`.`)
- `range(from, to)`: Matches any character within the specified range (`[from-to]`)

### Quantifiers

- `oneOrMore(component)`: Matches one or more occurrences (`+`)
- `zeroOrMore(component)`: Matches zero or more occurrences (`*`)
- `optional(component)`: Matches zero or one occurrence (`?`)
- `repeat(component, options)`: Generic quantification. Use with `exactly(n)`, `atLeast(n)`, or `between(min, max)` to specify repetitions.
- `exactly(n)`: Helper for `repeat`. Specifies exactly n occurrences (`{n}`).
- `atLeast(n)`: Helper for `repeat`. Specifies at least n occurrences (`{n,}`).
- `between(min, max)`: Helper for `repeat`. Specifies between min and max occurrences (`{min,max}`).

### Groups

- `group(...components)`: Creates a capturing group (`(...)`)
- `nonCapturingGroup(...components)`: Creates a non-capturing group (`(?:...)`)
- `namedGroup(name, ...components)`: Creates a named capturing group (`(?<name>...)`)
- `numberedBackreference(n)`: Backreference to the nth capturing group (`\n`).
- `namedBackreference(name)`: Backreference to a named capturing group (`\k<name>`).

### Compositors

- `anyOf(...components)`: Matches any of the specified patterns (`[...]`)
- `sequence(...components)`: Defines an explicit sequence of patterns

### Logical Operators

- `or(...components)`: Creates an alternation between patterns (`|`)
- `not(component)`: Creates a negated character set for the given component (`[^...]`)

### Assertions

- `positiveLookahead(...components)`: Positive lookahead - matches if the pattern ahead matches, without consuming characters (`(?=...)`)
- `negativeLookahead(...components)`: Negative lookahead - matches if the pattern ahead does NOT match, without consuming characters (`(?!...)`)
- `positiveLookbehind(...components)`: Positive lookbehind - matches if the pattern behind matches, without consuming characters (`(?<=...)`)
- `negativeLookbehind(...components)`: Negative lookbehind - matches if the pattern behind does NOT match, without consuming characters (`(?<!...)`)

### Flags and Options

The `regex()` function accepts an optional flags object as the last parameter:

```typescript
regex(...components, { caseInsensitive?: boolean, global?: boolean, multiline?: boolean })
```

**Available Flags:**
- `caseInsensitive`: Enable case-insensitive matching (`i` flag)
- `global`: Enable global matching - find all matches rather than stopping after the first match (`g` flag)
- `multiline`: Enable multiline mode - `^` and `$` match start/end of line, not just start/end of string (`m` flag)

**Preset Flag Objects:**

For convenience, you can use these preset flag objects:
- `caseInsensitive`: Equivalent to `{ caseInsensitive: true }`
- `global`: Equivalent to `{ global: true }`
- `multiline`: Equivalent to `{ multiline: true }`

**Examples:**

```typescript
// Case-insensitive matching
const pattern1 = regex(literal('hello'), { caseInsensitive: true });
pattern1.test('HELLO'); // true

// Using preset
const pattern2 = regex(literal('test'), caseInsensitive);

// Multiple flags
const pattern3 = regex(
  literal('test'),
  { caseInsensitive: true, global: true }
);

// Combining presets
const pattern4 = regex(
  literal('test'),
  { ...caseInsensitive, ...global }
);
```

## Examples

### Email Validation

```typescript
import {
  regex,
  startOfLine,
  endOfLine,
  letters,
  digits,
  literal,
  anyOf,
  oneOrMore,
  repeat,
  exactly,
  atLeast,
  between,
} from "semreg";

const emailRegex = regex(
  startOfLine,
  oneOrMore(anyOf(letters, digits, literal("._%+-"))),
  literal("@"),
  oneOrMore(anyOf(letters, digits, literal(".-"))),
  literal("."),
  repeat(letters, atLeast(2)),
  endOfLine
);

// Testing valid emails
emailRegex.test("user@example.com"); // true
emailRegex.test("john.doe123@gmail.com"); // true
emailRegex.test("info+newsletter@company-name.co.uk"); // true

// Testing invalid emails
emailRegex.test("invalid-email"); // false
emailRegex.test("@missingusername.com"); // false
emailRegex.test("user@domain"); // false
```

### URL Validation

```typescript
import {
  regex,
  startOfLine,
  endOfLine,
  letters,
  digits,
  literal,
  anyOf,
  oneOrMore,
  optional,
  zeroOrMore,
  repeat,
  exactly,
  atLeast,
  between,
  nonCapturingGroup,
  or,
} from "semreg";

const urlRegex = regex(
  startOfLine,
  or(literal("http"), literal("https")),
  literal("://"),
  optional(nonCapturingGroup(literal("www."))),
  oneOrMore(anyOf(letters, digits, literal(".-"))),
  literal("."),
  repeat(letters, between(2, 6)),
  optional(
    nonCapturingGroup(
      literal("/"),
      zeroOrMore(anyOf(letters, digits, literal("/._-")))
    )
  ),
  endOfLine
);

// Testing valid URLs
urlRegex.test("http://example.com"); // true
urlRegex.test("https://www.google.com"); // true
urlRegex.test("https://dev.to/path/to/resource"); // true

// Testing invalid URLs
urlRegex.test("ftp://example.com"); // false
urlRegex.test("http:/example.com"); // false
urlRegex.test("example.com"); // false
```

### Password Validation with Lookahead

Using lookahead assertions to validate password requirements without consuming characters:

```typescript
import {
  regex,
  startOfLine,
  endOfLine,
  positiveLookahead,
  any,
  zeroOrMore,
  digits,
  upperLetters,
  lowerLetters,
  literal,
  anyOf,
} from "semreg";

// Password must contain:
// - At least one digit
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one special character
// - Minimum 8 characters
const passwordRegex = regex(
  startOfLine,
  // Lookahead for at least one digit
  positiveLookahead(zeroOrMore(any), digits),
  // Lookahead for at least one uppercase letter
  positiveLookahead(zeroOrMore(any), upperLetters),
  // Lookahead for at least one lowercase letter
  positiveLookahead(zeroOrMore(any), lowerLetters),
  // Lookahead for at least one special character
  positiveLookahead(zeroOrMore(any), anyOf(literal("!@#$%^&*"))),
  // Match at least 8 characters
  repeat(any, atLeast(8)),
  endOfLine
);

// Testing valid passwords
passwordRegex.test("Pass123!"); // true
passwordRegex.test("Secur3@Pass"); // true

// Testing invalid passwords
passwordRegex.test("password"); // false (no digit, uppercase, or special char)
passwordRegex.test("Pass123"); // false (no special character)
passwordRegex.test("Pass!"); // false (too short)
```

### Price Extraction with Lookbehind

Using lookbehind assertions to match numbers only when preceded by a currency symbol:

```typescript
import {
  regex,
  positiveLookbehind,
  negativeLookbehind,
  literal,
  digits,
  oneOrMore,
  optional,
  global,
} from "semreg";

// Match prices with dollar sign
const priceRegex = regex(
  positiveLookbehind(literal("$")),
  oneOrMore(digits),
  optional(literal("."), repeat(digits, exactly(2))),
  { global: true }
);

const text = "Items cost $10.99, $25.50, and $100. ID: 12345";
const prices = text.match(priceRegex);
console.log(prices); // ["10.99", "25.50", "100"]

// Match numbers NOT preceded by dollar sign
const nonPriceRegex = regex(
  negativeLookbehind(literal("$")),
  oneOrMore(digits),
  global
);

const numbers = text.match(nonPriceRegex);
console.log(numbers); // ["0", "99", "5", "50", "00", "12345"]
```

## Custom Patterns

You can create your own reusable patterns:

```typescript
import { regex, oneOrMore, letters, digits, literal, anyOf } from "semreg";

// Create a reusable pattern for alphanumeric strings
const alphanumeric = () => oneOrMore(anyOf(letters, digits));

// Use it in different contexts
const usernameRegex = regex(startOfLine, alphanumeric(), endOfLine);

const productCodeRegex = regex(
  startOfLine,
  literal("PROD-"),
  alphanumeric(),
  endOfLine
);
```

## License

MIT
