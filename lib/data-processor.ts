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

  const total = processedItems.reduce((sum, item) => sum + item.price, 0);

  return {
    id: data.id as string,
    items: processedItems,
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

