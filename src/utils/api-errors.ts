/**
 * API Error Utilities
 * Helper functions for formatting and handling API errors
 */

import type { ApiError } from "@/types";

/**
 * User-friendly error messages by code
 */
const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Please sign in to continue",
  FORBIDDEN: "You don't have permission to perform this action",
  NOT_FOUND: "The requested resource was not found",
  VALIDATION_ERROR: "Please check your input and try again",
  LIMIT_EXCEEDED: "You've reached your usage limit for this feature",
  FEATURE_NOT_AVAILABLE: "This feature is not available in your current plan",
  CONFLICT: "This resource already exists",
  INTERNAL_ERROR: "Something went wrong. Please try again later",
  SERVICE_UNAVAILABLE: "The service is temporarily unavailable",
};

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "success" in error &&
    error.success === false &&
    "error" in error
  );
}

/**
 * Get user-friendly error message
 */
export function getApiErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    // Use custom message from API if provided
    if (error.error.message) {
      return error.error.message;
    }
    // Fall back to predefined messages
    const code = error.error.code;
    return ERROR_MESSAGES[code] || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Get error code from API error
 */
export function getApiErrorCode(error: unknown): string {
  if (isApiError(error)) {
    return error.error.code;
  }
  return "UNKNOWN_ERROR";
}

/**
 * Get error details from API error
 */
export function getApiErrorDetails(
  error: unknown
): Record<string, unknown> | undefined {
  if (isApiError(error)) {
    return error.error.details;
  }
  return undefined;
}

/**
 * Get request ID from API error (for debugging)
 */
export function getApiErrorRequestId(error: unknown): string | undefined {
  if (isApiError(error)) {
    return error.error.requestId;
  }
  return undefined;
}

/**
 * Format error for logging
 */
export function formatErrorForLogging(error: unknown): string {
  if (isApiError(error)) {
    const { code, message, requestId } = error.error;
    let log = `[${code}] ${message}`;
    if (requestId) {
      log += ` (Request ID: ${requestId})`;
    }
    return log;
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message === "Failed to fetch";
}

/**
 * Get error message for network errors
 */
export function getNetworkErrorMessage(): string {
  return "Unable to connect to the server. Please check your internet connection.";
}

/**
 * Handle error with appropriate message
 */
export function handleApiError(error: unknown): string {
  if (isNetworkError(error)) {
    return getNetworkErrorMessage();
  }
  return getApiErrorMessage(error);
}
