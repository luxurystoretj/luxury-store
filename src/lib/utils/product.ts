export type SizeInput = { size: string; quantity: number };

/**
 * Validates an optional `sizes` payload into a typed array.
 *
 * Returns `null` when the field is absent, or throws an Error with a
 * descriptive message when the shape is invalid. Callers should surface
 * `error instanceof Error ? error.message : "Invalid sizes"`.
 */
export function parseSizes(sizes: unknown): SizeInput[] | null {
  if (sizes === undefined) return null;
  if (!Array.isArray(sizes)) {
    throw new Error("Field 'sizes' must be an array.");
  }
  return sizes.map((entry) => {
    const { size, quantity } = (entry ?? {}) as {
      size?: unknown;
      quantity?: unknown;
    };
    if (typeof size !== "string" || !size.trim()) {
      throw new Error("Each size requires a non-empty 'size' string.");
    }
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 0) {
      throw new Error("Each size requires a non-negative integer 'quantity'.");
    }
    return { size: size.trim(), quantity };
  });
}
