import { Link } from "@tanstack/react-router";
import { Folder, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type ProjectRowProps = {
  name: string;
  id: string;
  href: string;
  onUpdate: () => void;
  onDelete: () => void;
};

export function ProjectRow({ name, id, href, onUpdate, onDelete }: ProjectRowProps) {
  return (
    <div className="group flex items-center gap-5 border-t border-[var(--color-border)] px-5 py-5 first:border-t-0 first:rounded-t-lg last:rounded-b-lg hover:bg-[var(--color-surface-hover)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
        <Folder className="h-5 w-5" />
      </span>

      <Link to={href} className="min-w-0 flex-1 truncate font-sans text-lg font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]">
        {name}
      </Link>

      <span className="shrink-0 truncate font-mono text-base text-[var(--color-text-faint)]">
        {id}
      </span>

      <DropdownMenu
        trigger={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${name}`}
            className="h-9 w-9 shrink-0 text-[var(--color-text-faint)]"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        }
      >
        <DropdownMenuItem onClick={onUpdate}>
          <Pencil className="h-4 w-4" />
          Update
        </DropdownMenuItem>
        <div className="my-1 h-px bg-[var(--color-border)]" aria-hidden="true" />
        <DropdownMenuItem destructive onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}