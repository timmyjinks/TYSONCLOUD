import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

interface FormShellProps {
  backTo: string;
  backLabel?: string;
  title: string;
  description?: string;
  onSubmit: React.FormEventHandler;
  children: React.ReactNode;
  error?: string | null;
  errorIssues?: { line?: number | null; message: string }[];
  pending?: boolean;
  submitLabel: string;
  pendingLabel: string;
  cancelTo: string;
}

export function FormShell({
  backTo,
  backLabel = "Back",
  title,
  description,
  onSubmit,
  children,
  error,
  errorIssues,
  pending = false,
  submitLabel,
  pendingLabel,
  cancelTo,
}: FormShellProps) {
  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to={backTo as never}
        className="font-sans text-base text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
      >
        ← {backLabel}
      </Link>
      <div className="mt-5">
        <PageHeader title={title} description={description} />
      </div>

      <form className="space-y-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-7" onSubmit={onSubmit}>
        {children}

        {error && (
          <div className="rounded-md border border-[var(--color-bad)] bg-[var(--color-bad-soft)] p-3">
            <p className="text-base text-[var(--color-bad)]">{error}</p>
            {errorIssues?.length ? (
              <ul className="mt-2 space-y-1 text-sm text-[var(--color-bad)]">
                {errorIssues.map((issue, i) => (
                  <li key={i}>
                    {issue.line != null && <span className="font-mono">line {issue.line}: </span>}
                    {issue.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}

        <div className="flex gap-3 border-t border-[var(--color-border)] pt-5">
          <Button type="submit" disabled={pending}>
            {pending ? pendingLabel : submitLabel}
          </Button>
          <Link to={cancelTo as never}>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </main>
  );
}