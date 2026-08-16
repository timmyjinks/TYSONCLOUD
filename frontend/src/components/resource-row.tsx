import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { StatusPill } from "@/components/status-pill";
import { cn } from "@/lib/utils";

type ResourceRowProps = {
  icon: React.ReactNode;
  name: string;
  /** Only services have a status today — omit for databases. */
  status?: string;
  /** e.g. image tag or db engine version */
  runtime: string;
  /** e.g. ":3000" or "12 GB" */
  size: string;
  /** domain text — colored as a link when href is present, muted otherwise (e.g. "internal") */
  domain: string;
  domainHref?: string;
  detailHref: string;
  onDelete: () => void;
  className?: string;
};

export function ResourceRow({
  icon,
  name,
  status,
  runtime,
  size,
  domain,
  domainHref,
  detailHref,
  onDelete,
  className,
}: ResourceRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-5 border-t border-[var(--color-border)] px-5 py-5 first:border-t-0 hover:bg-[var(--color-surface-hover)]",
        className,
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
        {icon}
      </span>

      <Link
        to={detailHref}
        className="w-44 shrink-0 truncate font-sans text-lg font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
      >
        {name}
      </Link>

      <span className="w-24 shrink-0">{status && <StatusPill status={status} />}</span>

      <span className="flex-1 truncate font-mono text-base text-[var(--color-text-faint)]">
        {runtime}
      </span>

      <span className="w-16 shrink-0 text-right font-mono text-base text-[var(--color-text-faint)]">
        {size}
      </span>

      <span className="w-52 shrink-0 truncate text-right font-mono text-base">
        {domainHref ? (
          <a
            href={domainHref}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            {domain}
          </a>
        ) : (
          <span className="text-[var(--color-text-faint)]">{domain}</span>
        )}
      </span>

      <button
        onClick={onDelete}
        aria-label={`Delete ${name}`}
        className="shrink-0 cursor-pointer text-[var(--color-text-faint)] opacity-0 transition-opacity hover:text-[var(--color-bad)] focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}