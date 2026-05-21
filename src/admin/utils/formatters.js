/**
 * formatters.js — Shared display-formatting utilities for the admin panel.
 * All functions are pure and have no side effects.
 */

// ────────────────────────────────────────────────────────────────────────────
// Currency
// ────────────────────────────────────────────────────────────────────────────

/**
 * Format a numeric or string price into a USD currency string.
 * @param {string|number} price - Raw price value (commas are stripped automatically).
 * @returns {string} e.g. "$5,800" or "$0"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') return '$0';
  const num = parseFloat(String(price).replace(/,/g, ''));
  if (isNaN(num)) return `$${price}`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format a discount percentage or label for display.
 * @param {string|number} discount - e.g. 20 or "20%" or "CLEARANCE"
 * @returns {string}
 */
export const formatDiscount = (discount) => {
  if (!discount) return '';
  const num = parseFloat(String(discount));
  if (!isNaN(num)) return `${num}% OFF`;
  return String(discount);
};

// ────────────────────────────────────────────────────────────────────────────
// Dates
// ────────────────────────────────────────────────────────────────────────────

/**
 * Format an ISO date string into a human-readable date.
 * @param {string} dateStr - ISO 8601 date string.
 * @returns {string} e.g. "May 21, 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format an ISO date string into a relative time label.
 * @param {string} dateStr - ISO 8601 date string.
 * @returns {string} e.g. "just now", "3m ago", "2h ago", "5d ago"
 */
export const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return 'just now';
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

// ────────────────────────────────────────────────────────────────────────────
// Strings
// ────────────────────────────────────────────────────────────────────────────

/**
 * Truncate a string to n characters, appending "…" if needed.
 * @param {string|undefined|null} str
 * @param {number} n - Max characters (default 60)
 * @returns {string}
 */
export const truncate = (str, n = 60) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
};

/**
 * Derive display initials from a full name.
 * @param {string|undefined|null} name
 * @returns {string} e.g. "JC" from "James C."
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

/**
 * Capitalise the first letter of each word.
 * @param {string} str
 * @returns {string}
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

/**
 * Convert a camelCase or snake_case key to a human-readable label.
 * @param {string} key - e.g. "discountPrice" → "Discount Price"
 * @returns {string}
 */
export const keyToLabel = (key) => {
  if (!key) return '';
  return titleCase(
    key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Numbers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Format a raw number with thousands separators.
 * @param {number|string} n
 * @returns {string} e.g. "1,234,567"
 */
export const formatNumber = (n) => {
  const num = parseFloat(String(n).replace(/,/g, ''));
  if (isNaN(num)) return String(n ?? '');
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Clamp a number between min and max.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
