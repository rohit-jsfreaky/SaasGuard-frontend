/**
 * Check if usage limit is exceeded
 */
export function isUsageLimitExceeded(
  currentUsage: number,
  limit: number | null
): boolean {
  if (limit === null || limit === 0) return false;
  return currentUsage >= limit;
}

/**
 * Get remaining usage
 */
export function getRemainingUsage(
  currentUsage: number,
  limit: number | null
): number {
  if (limit === null || limit === 0) return Infinity;
  return Math.max(0, limit - currentUsage);
}

/**
 * Get usage percentage
 */
export function getUsagePercentage(
  currentUsage: number,
  limit: number | null
): number {
  if (limit === null || limit === 0) return 0;
  return Math.min(100, (currentUsage / limit) * 100);
}

/**
 * Check if action can be performed with remaining usage
 */
export function canPerformAction(
  currentUsage: number,
  limit: number | null,
  amount: number = 1
): boolean {
  if (limit === null || limit === 0) return true;
  return currentUsage + amount <= limit;
}

/**
 * Get usage color based on percentage
 */
export function getUsageColor(percentage: number): "green" | "yellow" | "red" {
  if (percentage >= 90) return "red";
  if (percentage >= 70) return "yellow";
  return "green";
}

/**
 * Get usage status label
 */
export function getUsageStatusLabel(percentage: number): string {
  if (percentage >= 100) return "Limit reached";
  if (percentage >= 90) return "Critical";
  if (percentage >= 70) return "Warning";
  return "Normal";
}

/**
 * Format usage display
 */
export function formatUsageDisplay(
  current: number,
  max: number | null
): string {
  if (max === null || max === 0) return `${current.toLocaleString()} / ∞`;
  return `${current.toLocaleString()} / ${max.toLocaleString()}`;
}
