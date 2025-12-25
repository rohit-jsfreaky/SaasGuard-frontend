/**
 * Error Utilities
 * Error handling and formatting
 */

import type { ApiError } from "@/types";

/**
 * Application error class
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = "APP_ERROR",
    details?: Record<string, unknown>
  ) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "AppError";
  }
}

/**
 * Extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (isApiError(error)) {
    return error.error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

/**
 * Check if error is an API error response
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
 * Format API error for display
 */
export function formatApiError(error: ApiError): string {
  const { code, message } = error.error;
  return `[${code}] ${message}`;
}

/**
 * Handle async errors in components
 */
export function handleError(
  error: unknown,
  fallbackMessage = "An error occurred"
): string {
  console.error("Error:", error);
  return getErrorMessage(error) || fallbackMessage;
}
