import type { ReactNode } from "react";

export function TerminalStrip({
  label,
  right,
  className,
}: {
  label: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-3.5 " +
        (className ?? "")
      }
    >
      <span className="font-mono text-base font-medium text-[var(--color-text-muted)]">{label}</span>
      {right}
    </div>
  );
}