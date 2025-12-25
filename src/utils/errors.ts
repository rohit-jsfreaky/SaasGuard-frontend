// import { AxiosError } from "axios";

/**
 * Format error message from various error types
 * @param error - The error object
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  // Handle Axios errors
  if (error?.isAxiosError && error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    // Handle specific array of errors if common in your backend
    if (Array.isArray(data.errors)) return data.errors.join(", ");
  }
  return "An unknown error occurred";
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return error instanceof Error && error.message === "Network Error";
}

/**
 * Check if error is 401 Unauthorized
 */
export function is401Error(error: any): boolean {
  return error?.response?.status === 401;
}

/**
 * Check if error is 403 Forbidden
 */
export function is403Error(error: any): boolean {
  return error?.response?.status === 403;
}

/**
 * Check if error is 404 Not Found
 */
export function is404Error(error: any): boolean {
  return error?.response?.status === 404;
}

/**
 * Check if error is 429 Too Many Requests
 */
export function is429Error(error: any): boolean {
  return error?.response?.status === 429;
}

/**
 * Check if error is 500 Server Error
 */
export function is500Error(error: any): boolean {
  return error?.response?.status && error.response.status >= 500;
}
