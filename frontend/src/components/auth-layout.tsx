import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  backTo: string;
  backLabel?: string;
}

export function AuthLayout({ children, backTo, backLabel }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,68,51,0.10),transparent_70%)]"
      />
      <div className="relative w-full max-w-md py-12">
        <Link
          to={backTo}
          className="mb-6 inline-block text-base text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
        >
          ← {backLabel ?? "Back to home"}
        </Link>
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-4">
            <span className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
              <span className="h-2.5 w-2.5 bg-[var(--color-accent)]" aria-hidden="true" />
              TYSONCLOUD
            </span>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}