export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be less than 50 characters";
  return null;
};

export const validateSlug = (slug: string): string | null => {
  if (!slug) return "Slug is required";
  if (!/^[a-z0-9-]+$/.test(slug)) return "Slug must contain only lowercase letters, numbers, and hyphens";
  if (slug.length < 2) return "Slug must be at least 2 characters";
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
