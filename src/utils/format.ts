import { format } from "date-fns";

/**
 * Format a date object to a string
 * @param date - The date to format
 * @param formatStr - The format string (default: "PP") e.g. "Dec 25, 2025"
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = "PP"
): string {
  try {
    return format(new Date(date), formatStr);
  } catch (e) {
    return "Invalid Date";
  }
}

/**
 * Format a date object to a datetime string
 * @param date - The date to format
 * @param formatStr - The format string (default: "PP p") e.g. "Dec 25, 2025 15:32"
 */
export function formatDateTime(
  date: Date | string | number,
  formatStr: string = "PP p"
): string {
  try {
    return format(new Date(date), formatStr);
  } catch (e) {
    return "Invalid Date";
  }
}

/**
 * Format a number with commas
 * @param num - The number to format
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format bytes to human readable string
 * @param bytes - The number of bytes
 * @param decimals - Number of decimal places
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Format a number as a percentage
 * @param num - The number to format (0-1 or 0-100 depending on expectations, handling 0-1 here as fractional)
 */
export function formatPercent(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(num);
}
