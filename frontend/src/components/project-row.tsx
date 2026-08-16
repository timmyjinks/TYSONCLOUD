import { Link } from "@tanstack/react-router";
import { Folder, Trash2 } from "lucide-react";

type ProjectRowProps = {
  name: string;
  id: string;
  href: string;
  onDelete: () => void;
};

export function ProjectRow({ name, id, href, onDelete }: ProjectRowProps) {
  return (
    <div className="group flex items-center gap-5 border-t border-[var(--color-border)] px-5 py-5 first:border-t-0 hover:bg-[var(--color-surface-hover)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
        <Folder className="h-5 w-5" />
      </span>

      <Link to={href} className="min-w-0 flex-1 truncate font-sans text-lg font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]">
        {name}
      </Link>

      <span className="shrink-0 truncate font-mono text-base text-[var(--color-text-faint)]">
        {id}
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