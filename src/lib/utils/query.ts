import queryString from "query-string";

export interface FilterParams {
  gender?: string; // Single select
  size?: string[];
  color?: string[];
  priceRange?: string;
  sort?: string;
  page?: string;
}

export interface ParsedFilters {
  gender: string | null; // Single select
  size: string[];
  color: string[];
  priceRange: string | null;
  sort: string;
  page: number;
}

/**
 * Parse URL search params into structured filter object
 */
export function parseFilters(searchParams: URLSearchParams): ParsedFilters {
  const parsed = queryString.parse(searchParams.toString(), {
    arrayFormat: "comma",
  });

  return {
    gender: typeof parsed.gender === "string" ? parsed.gender : null,
    size: Array.isArray(parsed.size)
      ? parsed.size.filter((s): s is string => typeof s === "string")
      : parsed.size
      ? [parsed.size].filter((s): s is string => typeof s === "string")
      : [],
    color: Array.isArray(parsed.color)
      ? parsed.color.filter((c): c is string => typeof c === "string")
      : parsed.color
      ? [parsed.color].filter((c): c is string => typeof c === "string")
      : [],
    priceRange:
      typeof parsed.priceRange === "string" ? parsed.priceRange : null,
    sort: typeof parsed.sort === "string" ? parsed.sort : "featured",
    page: typeof parsed.page === "string" ? parseInt(parsed.page, 10) || 1 : 1,
  };
}

/**
 * Convert filter object to URL search string
 */
export function stringifyFilters(filters: Partial<ParsedFilters>): string {
  const params: Record<string, string | string[]> = {};

  if (filters.gender) {
    params.gender = filters.gender;
  }
  if (filters.size && filters.size.length > 0) {
    params.size = filters.size;
  }
  if (filters.color && filters.color.length > 0) {
    params.color = filters.color;
  }
  if (filters.priceRange) {
    params.priceRange = filters.priceRange;
  }
  if (filters.sort && filters.sort !== "featured") {
    params.sort = filters.sort;
  }
  if (filters.page && filters.page > 1) {
    params.page = filters.page.toString();
  }

  return queryString.stringify(params, {
    arrayFormat: "comma",
    skipEmptyString: true,
    skipNull: true,
  });
}

/**
 * Create URL with filters - more reliable than stringifyFilters for avoiding duplicates
 */
export function createFilterURL(filters: Partial<ParsedFilters>): string {
  const params = new URLSearchParams();

  // Add filters to params only if they have values
  if (filters.gender) {
    params.set("gender", filters.gender);
  }
  if (filters.size && filters.size.length > 0) {
    params.set("size", filters.size.join(","));
  }
  if (filters.color && filters.color.length > 0) {
    params.set("color", filters.color.join(","));
  }
  if (filters.priceRange) {
    params.set("priceRange", filters.priceRange);
  }
  if (filters.sort && filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", filters.page.toString());
  }

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : "/products";
}

/**
 * Update single-select filter (gender)
 */
export function updateGenderFilter(
  currentFilters: ParsedFilters,
  value: string | null
): ParsedFilters {
  return {
    ...currentFilters,
    gender: value,
    page: 1, // Reset to page 1 when filters change
  };
}

/**
 * Add or update a multi-select filter value (size, color)
 */
export function addFilter(
  currentFilters: ParsedFilters,
  filterType: keyof Pick<ParsedFilters, "size" | "color">,
  value: string
): ParsedFilters {
  const newFilters = { ...currentFilters };
  const currentValues = newFilters[filterType];

  if (!currentValues.includes(value)) {
    newFilters[filterType] = [...currentValues, value];
  }

  // Reset to page 1 when filters change
  newFilters.page = 1;

  return newFilters;
}

/**
 * Remove a multi-select filter value (size, color)
 */
export function removeFilter(
  currentFilters: ParsedFilters,
  filterType: keyof Pick<ParsedFilters, "size" | "color">,
  value: string
): ParsedFilters {
  const newFilters = { ...currentFilters };
  newFilters[filterType] = newFilters[filterType].filter((v) => v !== value);

  // Reset to page 1 when filters change
  newFilters.page = 1;

  return newFilters;
}

/**
 * Update sort option
 */
export function updateSort(
  currentFilters: ParsedFilters,
  sort: string
): ParsedFilters {
  return {
    ...currentFilters,
    sort,
    page: 1, // Reset to page 1 when sort changes
  };
}

/**
 * Update price range
 */
export function updatePriceRange(
  currentFilters: ParsedFilters,
  priceRange: string | null
): ParsedFilters {
  return {
    ...currentFilters,
    priceRange,
    page: 1, // Reset to page 1 when price range changes
  };
}

/**
 * Clear all filters
 */
export function clearAllFilters(): ParsedFilters {
  return {
    gender: null,
    size: [],
    color: [],
    priceRange: null,
    sort: "featured",
    page: 1,
  };
}

/**
 * Clear specific filter type
 */
export function clearFilter(
  currentFilters: ParsedFilters,
  filterType: keyof Pick<
    ParsedFilters,
    "gender" | "size" | "color" | "priceRange"
  >
): ParsedFilters {
  const newFilters = { ...currentFilters };

  if (filterType === "priceRange") {
    newFilters.priceRange = null;
  } else if (filterType === "gender") {
    newFilters.gender = null;
  } else {
    newFilters[filterType] = [];
  }

  // Reset to page 1 when filters change
  newFilters.page = 1;

  return newFilters;
}
