import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  children?: ReactNode;
};

export function ErrorBanner({
  message,
  onRetry,
  retryLabel = "Try again",
  className,
  children,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-md border border-[var(--color-bad)] bg-[var(--color-bad-soft)] p-3",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-bad)]" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[var(--color-bad)]">{message}</p>
        {children && <div className="mt-2 text-xs text-[var(--color-bad)]">{children}</div>}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-md border border-[var(--color-bad)] px-2.5 py-1 font-mono text-xs text-[var(--color-bad)] transition-colors hover:bg-[var(--color-bad)] hover:text-white cursor-pointer"
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
