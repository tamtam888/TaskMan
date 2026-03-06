import DOMPurify from 'dompurify';

export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  const cleaned = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
  return cleaned;
}

export function auditSanitize(field, original, cleaned) {
  if (original !== cleaned) {
    // eslint-disable-next-line no-console
    console.warn(`[sanitize] Field "${field}" cleaned: potentially unsafe input removed`);
  }
}
