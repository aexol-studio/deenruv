import { cn } from "@/lib/utils.js";
import React from "react";

interface ErrorMessageProps {
  errors?: string[];
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  errors,
  className,
}) => {
  if (!errors?.length) return null;

  return (
    <p
      role="alert"
      className={cn(
        "text-destructive mb-2 mt-1 min-h-5 text-sm font-medium",
        className,
      )}
    >
      {errors.join(", ")}
    </p>
  );
};
