import { z, type ZodRawShape, type ZodObject } from "zod";

/**
 * Creates a Zod schema for a Deenruv admin form.
 * This is a convenience wrapper around z.object() for consistent schema creation.
 *
 * @example
 * ```ts
 * const schema = createFormSchema({
 *   name: z.string().min(1, 'Name is required'),
 *   code: z.string().min(1, 'Code is required'),
 *   price: z.number().min(0),
 *   customFields: z.record(z.unknown()).optional(),
 * });
 * ```
 */
export function createFormSchema<T extends ZodRawShape>(
  shape: T,
): ZodObject<T> {
  return z.object(shape);
}
