import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "focus:ring-ring inline-flex h-5 items-center border px-2 py-0 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary dark:bg-primary/15",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        success: "border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
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
            ? "hover:bg-primary/15"
            : variant === "secondary"
              ? "hover:bg-secondary/80"
            : variant === "destructive"
                ? "hover:bg-destructive/15"
                : "",
      )}
      {...props}
    />
  );
}

export { Badge };
