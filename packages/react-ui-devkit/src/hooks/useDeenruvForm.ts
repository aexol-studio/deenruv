import { useCallback, useMemo } from "react";
import {
  useForm,
  type UseFormProps,
  type UseFormReturn,
  type FieldValues,
  type Path,
  type PathValue,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

/**
 * Schema type accepted by `useDeenruvForm`.
 *
 * Uses Zod v4's `z.ZodType` base class which all concrete schema types
 * (`ZodObject`, `ZodEffects`, etc.) extend. The two generics correspond
 * to the schema's `Output` and `Input` types respectively.
 *
 * We re-export this for consumers that need to type a schema variable
 * destined for `useDeenruvForm`.
 */
export type ZodSchema<T extends FieldValues = FieldValues> = z.ZodType<T>;

export interface UseDeenruvFormOptions<T extends FieldValues> {
  /** Zod schema for validation — pass `z.object({...})` or any concrete Zod type. */
  schema: ZodSchema<T>;
  defaultValues?: UseFormProps<T>["defaultValues"];
  mode?: UseFormProps<T>["mode"]; // default: 'onTouched'
}

export interface UseDeenruvFormReturn<
  T extends FieldValues,
> extends UseFormReturn<T> {
  /** Convenience alias for setValue with auto-validate and dirty marking */
  setField: <K extends Path<T>>(field: K, value: PathValue<T, K>) => void;
  /** Whether the form currently has any validation errors */
  hasErrors: boolean;
  /** Whether the form is currently valid (no errors) */
  isFormValid: boolean;
}

/**
 * Core form hook for Deenruv admin panel.
 *
 * Uses React Hook Form + Zod for type-safe form management with
 * schema-based validation.
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   name: z.string().min(1, 'Name is required'),
 *   code: z.string().min(1, 'Code is required'),
 *   price: z.number().min(0),
 * });
 *
 * const form = useDeenruvForm({
 *   schema,
 *   defaultValues: { name: '', code: '', price: 0 },
 * });
 *
 * // Use setField for convenient value setting (auto-validates + marks dirty)
 * form.setField('name', 'New Product');
 *
 * // Or use the full RHF API
 * form.watch('name');
 * form.handleSubmit(onSubmit);
 * ```
 */
export function useDeenruvForm<T extends FieldValues>(
  options: UseDeenruvFormOptions<T>,
): UseDeenruvFormReturn<T> {
  // @hookform/resolvers@5 exposes both Zod 3 and Zod 4 overloads.
  // With zod@4 the Zod 4 overload should match, but the generic
  // constraints can clash when `T` is loosely inferred (e.g. from
  // `z.record(z.unknown())`). The cast is safe — zodResolver handles
  // Zod 4 schemas natively at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolver = zodResolver(options.schema as any) as Resolver<T>;

  const form = useForm<T>({
    resolver,
    defaultValues: options.defaultValues,
    mode: options.mode ?? "onTouched",
  });

  // RHF's setValue is already referentially stable across renders.
  // Capture it once via ref-style to guarantee the useCallback never
  // gets a new dep and thus never produces a new function identity.
  const { setValue } = form;

  const setField = useCallback(
    <K extends Path<T>>(field: K, value: PathValue<T, K>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setValue(field, value as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue],
  );

  // Memoize the return object so consumers that destructure or pass the
  // whole form as a prop don't trigger unnecessary child re-renders.
  // `formState` is read via proxy (RHF tracks accessed fields), so we
  // derive hasErrors/isFormValid here — they update when formState does.
  const hasErrors = Object.keys(form.formState.errors).length > 0;
  const isFormValid = form.formState.isValid;

  return useMemo(
    () => ({
      ...form,
      setField,
      hasErrors,
      isFormValid,
    }),
    [form, setField, hasErrors, isFormValid],
  );
}

export { z } from "zod";
