import { useState, useMemo } from "react";

export type SortDirection = "ascending" | "descending";

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

/**
 * Hook untuk sorting data tabel dengan dukungan multiple data types.
 * Mendukung: string, number, Date, null/undefined values.
 * @param items - Array data yang akan di-sort
 * @param initialConfig - Konfigurasi sort awal (opsional)
 */
export const useSortableData = <T extends object>(
  items: T[],
  initialConfig: SortConfig<T> | null = null,
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialConfig,
  );

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Null/undefined handling - push to end
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Number comparison
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Date comparison - handle ISO string dates
        const isDateString = (val: unknown): val is string => {
          if (typeof val !== "string") return false;
          // Check if it looks like an ISO date or common date format
          const datePattern = /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}/;
          return datePattern.test(val) && !isNaN(Date.parse(val));
        };

        if (isDateString(aValue) && isDateString(bValue)) {
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA;
        }

        // Date object comparison
        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === "ascending"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        // String comparison with locale support
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue, "id")
            : bValue.localeCompare(aValue, "id");
        }

        // Fallback for other types
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const resetSort = () => {
    setSortConfig(null);
  };

  return { items: sortedItems, requestSort, sortConfig, resetSort };
};
