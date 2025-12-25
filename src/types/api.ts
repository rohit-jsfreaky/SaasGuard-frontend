/**
 * Base API Response Types
 * Common types for API communication
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
  };
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/**
 * Pagination request params
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/**
 * Sort order type
 */
export type SortOrder = "asc" | "desc";

/**
 * Common sort params
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: SortOrder;
}

/**
 * Combined query params
 */
export interface QueryParams extends PaginationParams, SortParams {
  search?: string;
  [key: string]: string | number | boolean | undefined;
}
