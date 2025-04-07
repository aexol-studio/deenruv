import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "text-muted-foreground focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground border-transparent",
        success: "border-transparent bg-green-500 text-white dark:bg-green-600",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  noHover?: boolean;
}

function Badge({ noHover, className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className,
        noHover
          ? ""
          : variant === "default"
            ? "hover:bg-primary/80"
            : variant === "secondary"
              ? "hover:bg-secondary/80"
              : variant === "destructive"
                ? "hover:bg-destructive/80"
                : "",
      )}
      {...props}
    />
  );
}

export { Badge };
