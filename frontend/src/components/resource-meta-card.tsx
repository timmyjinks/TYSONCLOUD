import { cn } from "@/lib/utils";
import { StatusDot } from "@/components/status-dot";
import { CopyButton } from "@/components/copy-button";

type MetaRow = {
  label: string;
  value: string;
  mono?: boolean;
  href?: string;
  status?: boolean;
  copyable?: boolean;
  danger?: boolean;
};

type ResourceMetaCardProps = {
  meta: MetaRow[];
};

export function ResourceMetaCard({ meta }: ResourceMetaCardProps) {
  return (
    <dl className="divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      {meta.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 px-5 py-3.5"
        >
          <dt className="text-base text-[var(--color-text-faint)]">{row.label}</dt>
          <dd
            className={cn(
              "min-w-0 truncate text-base text-[var(--color-text)]",
              row.mono && "font-mono",
              row.danger && "text-[var(--color-accent)]",
            )}
          >
            {row.status ? (
              <span className="flex items-center gap-1.5 capitalize">
                <StatusDot status={row.value} />
                {row.value}
              </span>
            ) : row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                {row.value}
              </a>
            ) : row.copyable ? (
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate">{row.value}</span>
                <CopyButton value={row.value} label={`Copy ${row.label}`} className="shrink-0" />
              </span>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}