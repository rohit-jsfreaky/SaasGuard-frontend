/**
 * Group array items by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Map<any, T[]> {
  const map = new Map();
  array.forEach((item) => {
    const groupKey = item[key];
    const collection = map.get(groupKey);
    if (!collection) {
      map.set(groupKey, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

/**
 * Sort array by a key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  desc: boolean = false
): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA < valueB) return desc ? 1 : -1;
    if (valueA > valueB) return desc ? -1 : 1;
    return 0;
  });
}

/**
 * Get unique items from array
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return Array.from(new Set(array));
  }
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
