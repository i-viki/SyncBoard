/**
 * Sanitize a string for use as a Cloudinary public ID (removes extensions and dots).
 * @param {string} str - The input string.
 * @returns {string} - The sanitized string.
 */
export function sanitizeString(str) {
  if (typeof str !== "string") return "";

  const hasFileExtension = str.lastIndexOf(".") > 0 && str.lastIndexOf(".") < str.length - 1;
  let baseName = str;
  if (hasFileExtension) {
    baseName = str.substring(0, str.lastIndexOf("."));
  }

  // Allow only alphanumeric and hyphens for public IDs
  let sanitized = baseName.replace(/[^a-zA-Z0-9-]/g, "");
  return sanitized || "unknown";
}

/**
 * Sanitize a filename for downloads (preserves the extension and dots).
 * @param {string} str - The input filename.
 * @returns {string} - The sanitized filename.
 */
export function sanitizeFileName(str) {
  if (typeof str !== "string") return "file";

  // Replace spaces with hyphens, remove illegal filename characters but keep dots and hyphens
  let sanitized = str.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "");
  
  return sanitized || "file";
}
