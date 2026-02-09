import React from "react";
import type { FieldValues } from "react-hook-form";
import { Form } from "@/components/atoms/form";
import type { UseDeenruvFormReturn } from "@/hooks/useDeenruvForm";

export interface DeenruvFormProps<T extends FieldValues> {
  form: UseDeenruvFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component that provides form context and handles submission.
 * Works with `useDeenruvForm` hook and shadcn/ui FormField components.
 *
 * @example
 * ```tsx
 * const form = useDeenruvForm({ schema, defaultValues });
 *
 * <DeenruvForm form={form} onSubmit={handleSubmit}>
 *   <FormField control={form.control} name="name" render={...} />
 * </DeenruvForm>
 * ```
 */
export function DeenruvForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: DeenruvFormProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  );
}
