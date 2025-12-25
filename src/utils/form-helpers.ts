/**
 * Form Helpers
 * Utilities for handling form errors and states
 */

/**
 * Format validation errors into a string
 */
export function formatError(error: any): string {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  // Handle array of errors (e.g. from backend)
  if (Array.isArray(error)) return error.join(", ");
  return "An unknown error occurred";
}

/**
 * Get specific field error from a generic error object or form state
 */
export function getFieldError(
  errors: any,
  fieldName: string
): string | undefined {
  if (!errors) return undefined;
  // Handle nested errors like errors.name.message
  if (errors[fieldName]?.message) return errors[fieldName].message;
  // Handle flat errors
  if (errors[fieldName]) return errors[fieldName] as string;
  return undefined;
}
