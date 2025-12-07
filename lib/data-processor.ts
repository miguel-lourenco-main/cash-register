/**
 * Processes raw order data to extract an object containing id, items, and total.
 * Returns null if the input is invalid.
 *
 * @param {any} rawData - The raw data to process.
 * @returns {Object|null} An object containing order details or null.
 */
export function processOrderData(rawData: unknown): {
  id: string;
  items: Array<{ name: string; price: number }>;
  total: number;
} | null {
  if (!rawData || typeof rawData !== 'object') {
    return null;
  }

  const data = rawData as Record<string, unknown>;
  
  if (!data.id || typeof data.id !== 'string') {
    return null;
  }

  if (!Array.isArray(data.items)) {
    return null;
  }

  const processedItems = data.items
    .filter((item: unknown) => {
      if (!item || typeof item !== 'object') return false;
      const itemObj = item as Record<string, unknown>;
      return (
        typeof itemObj.name === 'string' &&
        typeof itemObj.price === 'number' &&
        itemObj.price > 0
      );
    })
    .map((item: unknown) => {
      const itemObj = item as Record<string, unknown>;
      return {
        name: itemObj.name as string,
        price: itemObj.price as number,
      };
    });

  /**
 * Sanitizes a string input by trimming whitespace, removing special characters,
 /**
 * Sanitizes a string input by trimming whitespace, removing special characters, and limiting the length.
 * @param {string} input - The input string to be sanitized.
 * @returns {string} The sanitized string.
 */
 * and limiting the length to prevent injection attacks.
 *
 * @param {string} input - The input string to sanitize.
 * @returns {string} The sanitized string.
 */
  const total = processedItems.reduce((sum, item) => sum + item.price, 0);

  return {
    id: data.id as string,
    items: processedItems,
    /**
 * Parses a date string into a Date object.
 * Returns null if the date string is invalid or cannot be parsed.
 *
 * @param {string} dateString - The date string to parse.
 * @returns {Date|null} A Date object or null if parsing fails.
 */
    total: Math.round(total * 100) / 100,
  };
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .substring(0, 255);
}

export function parseDateString(dateStr: string): Date | null {
  const parsed = Date.parse(dateStr);
  if (isNaN(parsed)) {
    return null;
  }
  return new Date(parsed);
}

