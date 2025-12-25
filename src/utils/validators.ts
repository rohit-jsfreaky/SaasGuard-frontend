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
 * Helper to generate slug from name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
