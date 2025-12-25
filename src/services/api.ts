/**
 * API Client
 * Centralized API communication layer with auth, error handling, and logging
 */

import type { ApiResponse, ApiError } from "@/types";

/**
 * API base URL from environment
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const isDevelopment = import.meta.env.DEV;

/**
 * Default request headers
 */
const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

/**
 * Request options
 */
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Error handler type
 */
type ErrorHandler = (error: ApiError, status: number) => void;

/**
 * API Client class
 */
class ApiClient {
  private baseUrl: string;
  private getToken: (() => Promise<string | null>) | null = null;
  private errorHandlers: Map<number, ErrorHandler> = new Map();

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Set auth token getter (call this after Clerk loads)
   */
  setTokenGetter(fn: () => Promise<string | null>) {
    this.getToken = fn;
  }

  /**
   * Register error handler for specific status code
   */
  onError(status: number, handler: ErrorHandler) {
    this.errorHandlers.set(status, handler);
  }

  /**
   * Build URL with query params
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Log request (development only)
   */
  private logRequest(method: string, endpoint: string) {
    if (isDevelopment) {
      console.log(`[API] ${method} ${endpoint}`);
    }
  }

  /**
   * Log response (development only)
   */
  private logResponse(
    method: string,
    endpoint: string,
    status: number,
    duration: number
  ) {
    if (isDevelopment) {
      const statusColor = status >= 400 ? "🔴" : status >= 300 ? "🟡" : "🟢";
      console.log(
        `[API] ${statusColor} ${method} ${endpoint} → ${status} (${duration}ms)`
      );
    }
  }

  /**
   * Log error
   */
  private logError(method: string, endpoint: string, error: unknown) {
    console.error(`[API] ❌ ${method} ${endpoint}`, error);
  }

  /**
   * Handle API errors
   */
  private handleError(error: ApiError, status: number): void {
    // Call registered error handler if exists
    const handler = this.errorHandlers.get(status);
    if (handler) {
      handler(error, status);
    }
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { body, headers: customHeaders, params, ...restOptions } = options;
    const method = restOptions.method || "GET";
    const startTime = Date.now();

    // Build headers
    const headers: Record<string, string> = Object.assign(
      {},
      defaultHeaders as Record<string, string>,
      customHeaders as Record<string, string> | undefined
    );

    // Add auth token if available
    if (this.getToken) {
      try {
        const token = await this.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn("[API] Failed to get auth token:", err);
      }
    }

    // Build URL with params
    const url = this.buildUrl(endpoint, params);

    // Log request
    this.logRequest(method, endpoint);

    try {
      // Make request
      const response = await fetch(url, {
        ...restOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Log response
      this.logResponse(
        method,
        endpoint,
        response.status,
        Date.now() - startTime
      );

      // Parse response
      const data = await response.json();

      // Handle errors
      if (!response.ok) {
        const error = data as ApiError;
        this.handleError(error, response.status);
        throw error;
      }

      return data as T;
    } catch (error) {
      this.logError(method, endpoint, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>(endpoint, { method: "GET", params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>(endpoint, { method: "POST", body });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>(endpoint, { method: "PUT", body });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>(endpoint, { method: "PATCH", body });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<ApiResponse<T>>(endpoint, { method: "DELETE" });
  }
}

/**
 * Default API client instance
 */
export const api = new ApiClient();

/**
 * Initialize API client with Clerk token getter
 * Call this in your app initialization
 */
export function initializeApi(getToken: () => Promise<string | null>) {
  api.setTokenGetter(getToken);
}

/**
 * Register global error handlers
 */
export function registerApiErrorHandlers(handlers: {
  onUnauthorized?: () => void;
  onForbidden?: (error: ApiError) => void;
  onRateLimited?: (error: ApiError) => void;
  onServerError?: (error: ApiError) => void;
}) {
  if (handlers.onUnauthorized) {
    api.onError(401, () => handlers.onUnauthorized?.());
  }
  if (handlers.onForbidden) {
    api.onError(403, (error) => handlers.onForbidden?.(error));
  }
  if (handlers.onRateLimited) {
    api.onError(429, (error) => handlers.onRateLimited?.(error));
  }
  if (handlers.onServerError) {
    api.onError(500, (error) => handlers.onServerError?.(error));
  }
}

export { ApiClient };
export default api;
