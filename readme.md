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
- [Examples](#examples)
  - [Email Validation](#email-validation)
  - [URL Validation](#url-validation)
- [Custom Patterns](#custom-patterns)
- [TODO](#todo)
  - [Additional Character Classes](#1-additional-character-classes)
  - [Advanced Groups](#2-advanced-groups)
  - [Lookahead and Lookbehind](#3-lookahead-and-lookbehind)
  - [Negation](#4-negation)
  - [Flags and Options](#5-flags-and-options)
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

### Quantifiers

- `oneOrMore(component)`: Matches one or more occurrences (`+`)
- `zeroOrMore(component)`: Matches zero or more occurrences (`*`)
- `optional(component)`: Matches zero or one occurrence (`?`)
- `repeat(component, options)`: Generic quantification based on options
- `repeatExactly(component, count)`: Matches exactly n occurrences (`{n}`)
- `repeatAtLeast(component, count)`: Matches at least n occurrences (`{n,}`)
- `repeatBetween(component, min, max)`: Matches between min and max occurrences (`{min,max}`)

### Groups

- `group(...components)`: Creates a capturing group (`(...)`)
- `nonCapturingGroup(...components)`: Creates a non-capturing group (`(?:...)`)

### Compositors

- `anyOf(...components)`: Matches any of the specified patterns (`[...]`)
- `sequence(...components)`: Defines an explicit sequence of patterns

### Logical Operators

- `or(...components)`: Creates an alternation between patterns (`|`)

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
  repeatAtLeast,
} from "semreg";

const emailRegex = regex(
  startOfLine,
  oneOrMore(anyOf(letters, digits, literal("._%+-"))),
  literal("@"),
  oneOrMore(anyOf(letters, digits, literal(".-"))),
  literal("."),
  repeatAtLeast(letters, 2),
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
  repeatBetween,
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
  repeatBetween(letters, 2, 6),
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

## TODO

Operators that could be implemented soon

### 1. Additional Character Classes

- `upperLetters()`: For uppercase characters (`[A-Z]`)
- `whitespace()`: For whitespace characters (`\s`)
- `nonWhitespace()`: For non-whitespace characters (`\S`)
- `word()`: For word characters (`\w`)
- `nonWord()`: For non-word characters (`\W`)
- `any()`: For any character (`.`)
- `range(from, to)`: For custom character ranges

### 2. Advanced Groups

- `namedGroup(name, ...)`: Named group (`(?<name>...)`)
- `backreference(n)`: Backreference to previous group (`\n`)
- `namedBackreference(name)`: Named backreference to previous group (`\k<name>`)

### 3. Lookahead and Lookbehind

- `positiveLookahead(...)`: Positive lookahead (`(?=...)`)
- `negativeLookahead(...)`: Negative lookahead (`(?!...)`)
- `positiveLookbehind(...)`: Positive lookbehind (`(?<=...)`)
- `negativeLookbehind(...)`: Negative lookbehind (`(?<!...)`)

### 4. Negation

- `not(...)`: Negation of the specified characters (`[^...]`)

### 5. Flags and Options

- `caseInsensitive`: Enable case-insensitive matching (`i`)
- `global`: Enable global matching (`g`)
- `multiline`: Enable multiline matching (`m`)
- `dotAll`: Enable matching for all characters (`s`)
- `unicode`: Enable Unicode support (`u`)
- `sticky`: Enable sticky matching (`y`)

## License

MIT
