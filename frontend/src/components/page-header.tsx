import * as React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-2 text-lg text-[var(--color-text-muted)]">{description}</p>
          )}
        </div>
        {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
      </div>
    </div>
  );
}