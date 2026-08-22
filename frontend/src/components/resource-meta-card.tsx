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
          <dt className="shrink-0 text-base text-[var(--color-text-faint)]">{row.label}</dt>
          <dd
            title={row.value}
            className={cn(
              "min-w-0 flex-1 truncate text-right text-base text-[var(--color-text)]",
              row.mono && "font-mono",
              row.danger && "text-[var(--color-accent)]",
            )}
          >
            {row.status ? (
              <span className="flex items-center justify-end gap-1.5 capitalize">
                <StatusDot status={row.value} />
                {row.value}
              </span>
            ) : row.href ? (
              <a
                href={row.href}
                target="_blank"
                rel="noreferrer"
                title={row.value}
                className="truncate text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              >
                {row.value}
              </a>
            ) : row.copyable ? (
              <span className="flex min-w-0 items-center justify-end gap-2">
                <span title={row.value} className="min-w-0 truncate text-right">
                  {row.value}
                </span>
                <CopyButton value={row.value} label={`Copy ${row.label}`} className="shrink-0" />
              </span>
            ) : (
              <span title={row.value} className="block truncate text-right">
                {row.value}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}