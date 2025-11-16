export const CATEGORIES = [
  "hoodies",
  "shirts",
  "caps",
  "stickers",
  "posters",
  "accessories",
] as const;

export const cleanNullValues = (obj: any): any => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map(cleanNullValues)
      .filter((val) => val !== undefined && val !== null);
  }

  const cleaned = {} as any;
  for (const key in obj) {
    const value = obj[key];
    let cleanedValue;

    if (value === null) {
      cleanedValue = undefined;
    } else if (typeof value === "object" && value !== null) {
      cleanedValue = cleanNullValues(value);
    } else {
      cleanedValue = value;
    }

    if (cleanedValue !== undefined) {
      cleaned[key] = cleanedValue;
    }
  }

  return cleaned;
};
