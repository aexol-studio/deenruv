import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

export const formSchema = z.object({
  file: z.union([z.file(), z.null()]),
  room_type_enum: z.string().min(1),
  room_style_enum: z.string().min(1),
  prompt: z.string().optional().nullable(),
});

export type FormValues = z.infer<typeof formSchema>;

export const useReplicateForm = () => {
  // With zod@4 + @hookform/resolvers@5, zodResolver expects the native
  // Zod 4 ZodType. Cast through unknown to satisfy both overload variants.
  const resolver = (
    zodResolver as unknown as (
      schema: typeof formSchema,
    ) => Resolver<FormValues>
  )(formSchema);
  return useForm<FormValues>({ resolver });
};

export interface CustomFileInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  className?: string;
}
