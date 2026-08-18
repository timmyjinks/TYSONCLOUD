import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <label className={cn("relative inline-flex h-5 w-5 shrink-0 cursor-pointer", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <span className="pointer-events-none flex h-5 w-5 items-center justify-center rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-transparent transition-colors peer-checked:border-[var(--color-accent)] peer-checked:bg-[var(--color-accent)] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-[var(--color-bg)] peer-disabled:opacity-50">
        <Check className="h-3.5 w-3.5" />
      </span>
    </label>
  ),
);
Checkbox.displayName = "Checkbox";