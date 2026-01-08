import sanitizeHtml from 'sanitize-html';

/**
 * Sanitize HTML content for safe rendering
 */
export function sanitizeHtmlContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'h1',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
      'code',
      'pre',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  });
}

/**
 * Strip HTML tags from a string (for previews)
 */
export function stripHtmlTags(html: string): string {
  return sanitizeHtml(html, { allowedTags: [] }).replace(/\s+/g, ' ').trim();
}

/**
 * Truncate HTML content while preserving HTML structure
 * Note: This is a simple approach - for complex HTML, consider using a library
 */
export function truncateHtml(html: string, maxLength: number): string {
  const sanitized = sanitizeHtmlContent(html);
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  
  // Simple truncation - cut at maxLength and add ellipsis
  // This might break HTML tags, but it's acceptable for previews
  return sanitized.substring(0, maxLength) + '...';
}
