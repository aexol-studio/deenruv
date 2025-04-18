import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const formSchema = z.object({
  file: z.instanceof(File).nullable(),
  room_type_enum: z.string().min(1),
  room_style_enum: z.string().min(1),
  prompt: z.string().optional().nullable(),
});

export const useReplicateForm = () => {
  return useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
};

export interface CustomFileInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  className?: string;
}
