/**
 * Validation utilities
 */

export const validateName = (name: string): string | null => {
  if (!name || !name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.trim().length > 50) return "Name must be less than 50 characters";
  return null;
};

export const validateSlug = (slug: string): string | null => {
  if (!slug) return "Slug is required";
  if (!/^[a-z0-9-]+$/.test(slug))
    return "Slug must contain only lowercase letters, numbers, and hyphens";
  if (slug.length < 2) return "Slug must be at least 2 characters";
  if (slug.length > 50) return "Slug must be less than 50 characters";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim()))
    return "Please enter a valid email address";
  return null;
};

export const validateNumber = (
  value: string | number,
  options?: { min?: number; max?: number; required?: boolean }
): string | null => {
  const { min, max, required = true } = options || {};

  if (value === "" || value === null || value === undefined) {
    return required ? "This field is required" : null;
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "Please enter a valid number";
  if (min !== undefined && num < min) return `Value must be at least ${min}`;
  if (max !== undefined && num > max) return `Value must be at most ${max}`;

  return null;
};

export const validateUrl = (url: string, required = true): string | null => {
  if (!url || !url.trim()) {
    return required ? "URL is required" : null;
  }

  try {
    new URL(url);
    return null;
  } catch {
    return "Please enter a valid URL";
  }
};

export const validateRequired = (
  value: string | null | undefined,
  fieldName = "This field"
): string | null => {
  if (!value || !value.trim()) return `${fieldName} is required`;
  return null;
};

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};
