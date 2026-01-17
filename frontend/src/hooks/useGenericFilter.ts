import { useMemo, useState, useCallback } from "react";

interface FilterConfig<T> {
  data: T[];
  searchKeys: (keyof T)[];
  // Filter functions map: key is the filter name, value is validation function
  filters?: Record<string, (item: T, filterValue: any) => boolean>;
}

interface FilterResult<T> {
  filteredData: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  setFilters: (filters: Record<string, any>) => void;
  resetFilters: () => void;
  resetAll: () => void;
  activeFilterCount: number;
  hasActiveFilters: boolean;
}

/**
 * Hook generik untuk filtering dan searching data.
 * Mendukung search multi-key dan custom filter functions.
 *
 * @param config - Konfigurasi filter
 * @returns Object dengan filtered data dan control functions
 *
 * @example
 * const { filteredData, searchQuery, setSearchQuery, setFilter } = useGenericFilter({
 *   data: assets,
 *   searchKeys: ['name', 'brand', 'serialNumber'],
 *   filters: {
 *     status: (item, value) => item.status === value,
 *     category: (item, value) => Array.isArray(value) ? value.includes(item.category) : item.category === value,
 *   }
 * });
 */
export const useGenericFilter = <T extends Record<string, any>>({
  data,
  searchKeys,
  filters: filterRules,
}: FilterConfig<T>): FilterResult<T> => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Search Logic - case insensitive, matches any key
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        searchLower === "" ||
        searchKeys.some((key) => {
          const val = item[key];
          if (val === null || val === undefined) return false;
          return String(val).toLowerCase().includes(searchLower);
        });

      if (!matchesSearch) return false;

      // 2. Custom Filters Logic
      if (filterRules) {
        for (const [key, validator] of Object.entries(filterRules)) {
          const filterValue = activeFilters[key];

          // Skip if filter value is empty/null/undefined
          if (
            filterValue === "" ||
            filterValue === null ||
            filterValue === undefined
          )
            continue;

          // Skip if filter value is empty array
          if (Array.isArray(filterValue) && filterValue.length === 0) continue;

          if (!validator(item, filterValue)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchQuery, activeFilters, searchKeys, filterRules]);

  const setFilter = useCallback((key: string, value: any) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFilters = useCallback((filters: Record<string, any>) => {
    setActiveFilters((prev) => ({ ...prev, ...filters }));
  }, []);

  const resetFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const resetAll = useCallback(() => {
    setSearchQuery("");
    setActiveFilters({});
  }, []);

  const activeFilterCount = useMemo(() => {
    return Object.entries(activeFilters).filter(([_, v]) => {
      if (v === "" || v === null || v === undefined) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }).length;
  }, [activeFilters]);

  const hasActiveFilters = activeFilterCount > 0 || searchQuery.trim() !== "";

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilter,
    setFilters,
    resetFilters,
    resetAll,
    activeFilterCount,
    hasActiveFilters,
  };
};
