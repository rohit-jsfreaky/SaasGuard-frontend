/**
 * Validators
 * Zod schemas and validation functions for forms
 */

import { z } from "zod";

/**
 * Feature validation schema
 */
export const featureSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase alphanumeric characters and hyphens"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

export type FeatureFormValues = z.infer<typeof featureSchema>;

/**
 * Plan validation schema
 */
export const planSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase alphanumeric characters and hyphens"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

export type PlanFormValues = z.infer<typeof planSchema>;

/**
 * Role validation schema
 */
export const roleSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase alphanumeric characters and hyphens"
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

/**
 * Helper to generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Validate name format
 */
export function validateName(name: string): string | null {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be less than 50 characters";
  return null;
}

/**
 * Validate slug format
 */
export function validateSlug(slug: string): string | null {
  if (!slug) return "Slug is required";
  if (!/^[a-z0-9-]+$/.test(slug))
    return "Slug must only contain lowercase alphanumeric characters and hyphens";
  if (slug.length < 2) return "Slug must be at least 2 characters";
  if (slug.length > 50) return "Slug must be less than 50 characters";
  return null;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email address";
  return null;
}

/**
 * Validate number
 */
export function validateNumber(value: any): string | null {
  if (value === null || value === undefined || value === "")
    return "Value is required";
  const num = Number(value);
  if (isNaN(num)) return "Must be a number";
  return null;
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): string | null {
  if (!url) return null; // Optional usually
  try {
    new URL(url);
    return null;
  } catch {
    return "Invalid URL";
  }
}
