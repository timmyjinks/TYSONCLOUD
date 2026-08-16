import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium font-mono transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)] outline-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
        outline:
          "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
        ghost: "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]",
        danger: "border border-[var(--color-bad)] text-[var(--color-bad)] hover:bg-[var(--color-bad)] hover:text-white",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";
