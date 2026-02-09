import { z } from "zod";
import { useTranslation } from "./useTranslation.js";

/**
 * Provides pre-built Zod schemas with localized error messages.
 * These are the Zod equivalents of the old useValidators hook.
 *
 * @example
 * ```ts
 * const { requiredString, email, positiveNumber } = useZodValidators();
 *
 * const schema = createFormSchema({
 *   name: requiredString(),
 *   email: email(),
 *   price: positiveNumber(),
 * });
 * ```
 */
export function useZodValidators() {
  const { t } = useTranslation("common");

  /** Non-empty string validator */
  const requiredString = (message?: string) =>
    z.string().min(1, message ?? t("validation.required", "Required"));

  /** Email validator */
  const email = (message?: string) =>
    z.string().email(message ?? t("validation.invalidEmail", "Invalid email"));

  /** Positive number validator */
  const positiveNumber = (message?: string) =>
    z
      .number()
      .min(0, message ?? t("validation.mustBePositive", "Must be positive"));

  /** Non-empty array validator */
  const nonEmptyArray = (message?: string) =>
    z
      .array(z.unknown())
      .min(1, message ?? t("validation.required", "Required"));

  /**
   * Translations array validator — checks first translation has a name.
   * For migration from translationsValidator.
   */
  const translationsWithName = z
    .array(
      z
        .object({
          name: z.string().min(1),
        })
        .passthrough(),
    )
    .min(1);

  /** Custom fields schema (permissive) */
  const customFields = z.record(z.string(), z.unknown()).optional().default({});

  return {
    requiredString,
    email,
    positiveNumber,
    nonEmptyArray,
    translationsWithName,
    customFields,
  };
}
