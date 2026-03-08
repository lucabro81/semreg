/**
 * @description Options for regex flags
 */
export interface RegexFlags {
  /**
   * @description Case-insensitive matching (i flag)
   */
  caseInsensitive?: boolean;

  /**
   * @description Global matching - find all matches rather than stopping after the first match (g flag)
   */
  global?: boolean;

  /**
   * @description Multiline mode - ^ and $ match start/end of line, not just start/end of string (m flag)
   */
  multiline?: boolean;
}
