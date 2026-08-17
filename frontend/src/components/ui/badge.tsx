import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border-strong)] px-2.5 py-0.5 font-mono text-xs text-[var(--color-text-muted)]",
        className,
      )}
      {...props}
    />
  );
}
