import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold tracking-[-0.01em] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring/40",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-2 focus:ring-destructive/40",
        action:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring/40",
        outline:
          "border border-border bg-card text-foreground hover:border-primary/30 hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-2 focus:ring-ring/20",
        ghost:
          "text-foreground hover:bg-muted/80 focus:ring-2 focus:ring-ring/20",
        "navigation-link":
          "text-navigation-link opacity-75 hover:bg-muted/70 hover:text-foreground hover:opacity-100 focus:opacity-100 focus:ring-2 focus:ring-navigation-link/40 dark:opacity-80 dark:hover:opacity-100",
        link: "text-primary underline-offset-4 hover:underline focus:ring-2 focus:ring-ring/30",
      },
      size: {
        default: "h-8 px-4 py-2",
        sm: "h-7 px-3",
        lg: "h-9 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
