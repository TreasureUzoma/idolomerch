/**
 * Generate a unique SKU for a product
 * Format: CATEGORY-TIMESTAMP-RANDOM
 * Example: SHIRTS-1730000000-A3B2
 */
export function generateSKU(category: string): string {
  const categoryPrefix = category.toUpperCase().substring(0, 6);
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `${categoryPrefix}-${timestamp}-${random}`;
}

/**
 * Generate a short, readable SKU
 * Format: CAT-RANDOM8
 * Example: SHIRT-A3B2C4D5
 */
export function generateShortSKU(category: string): string {
  const categoryPrefix = category.toUpperCase().substring(0, 5);
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  return `${categoryPrefix}-${random}`;
}
