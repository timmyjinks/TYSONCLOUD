import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "block w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3.5 py-2.5 text-base text-[var(--color-text)] placeholder-[var(--color-text-faint)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
