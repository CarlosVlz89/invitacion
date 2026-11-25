/**
 * Utilidades puras de sanitización anti-XSS y normalización de entradas RSVP.
 */

const HTML_TAGS_REGEX = /<[^>]*>/g;
const ANGLE_BRACKETS_REGEX = /[<>]/g;
const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF]/g;
const MULTI_SPACE_REGEX = /\s+/g;

export function sanitizeText(value: string, maxLength?: number): string {
  const cleaned = value
    .replace(HTML_TAGS_REGEX, ' ')
    .replace(ANGLE_BRACKETS_REGEX, '')
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(ZERO_WIDTH_REGEX, '')
    .replace(MULTI_SPACE_REGEX, ' ')
    .trim();

  if (typeof maxLength === 'number' && maxLength > 0) {
    return cleaned.slice(0, maxLength).trim();
  }

  return cleaned;
}

export function sanitizeMultilineText(value: string, maxLength?: number): string {
  const cleaned = value
    .replace(HTML_TAGS_REGEX, ' ')
    .replace(ANGLE_BRACKETS_REGEX, '')
    .replace(CONTROL_CHARS_REGEX, '')
    .replace(ZERO_WIDTH_REGEX, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (typeof maxLength === 'number' && maxLength > 0) {
    return cleaned.slice(0, maxLength).trim();
  }

  return cleaned;
}

export function normalizeForComparison(value: string): string {
  return sanitizeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
