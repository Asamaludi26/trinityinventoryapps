/**
 * Validation utilities to prevent null/undefined issues and ensure type safety
 */

/**
 * Safely gets a value from an object with a fallback
 */
export function safeGet<T>(
  obj: any,
  path: string | string[],
  fallback: T
): T {
  const keys = Array.isArray(path) ? path : path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return fallback;
    }
    result = result[key];
  }

  return result !== undefined && result !== null ? result : fallback;
}

/**
 * Safely parses JSON from localStorage with error handling
 */
export function safeParseJSON<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    
    const parsed = JSON.parse(stored);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    console.error(`Failed to parse ${key} from localStorage:`, error);
    // Clean up corrupted data
    localStorage.removeItem(key);
    return fallback;
  }
}

/**
 * Safely finds an item in an array, throws error if not found (for critical cases)
 */
export function safeFind<T>(
  array: T[],
  predicate: (item: T) => boolean,
  errorMessage?: string
): T {
  const found = array.find(predicate);
  if (!found) {
    const message = errorMessage || 'Item not found in array';
    console.error(message, { array, predicate });
    throw new Error(message);
  }
  return found;
}

/**
 * Safely finds an item in an array, returns null if not found (for non-critical cases)
 */
export function safeFindOrNull<T>(
  array: T[],
  predicate: (item: T) => boolean
): T | null {
  return array.find(predicate) || null;
}

/**
 * Validates that a value is not null or undefined
 */
export function assertNotNull<T>(
  value: T | null | undefined,
  errorMessage?: string
): asserts value is T {
  if (value === null || value === undefined) {
    const message = errorMessage || 'Value is null or undefined';
    console.error(message);
    throw new Error(message);
  }
}

/**
 * Safely calculates max ID from array, handles empty array case
 */
export function safeMaxId<T extends { id: number }>(
  items: T[],
  defaultId: number = 1
): number {
  if (items.length === 0) return defaultId;
  const maxId = Math.max(...items.map(item => item.id));
  return isFinite(maxId) ? maxId + 1 : defaultId;
}

/**
 * Validates array is not empty before finding
 */
export function safeArrayFind<T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  return array.find(predicate);
}

/**
 * Type guard to check if value is defined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if value is a valid number
 */
export function isValidNumber(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Safely accesses nested object properties
 */
export function safeAccess<T>(
  obj: any,
  ...keys: string[]
): T | undefined {
  let current: any = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }
  return current as T | undefined;
}




