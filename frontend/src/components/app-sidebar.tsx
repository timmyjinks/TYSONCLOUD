import { Link } from "@tanstack/react-router";
import { UserButton } from "@clerk/clerk-react";
import { LayoutGrid, Plus } from "lucide-react";
import { useProjects } from "@/lib/api/projects";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  /** projectId of the project currently open, if any — highlights it in the list */
  activeProjectId?: string;
};

export function AppSidebar({ activeProjectId }: AppSidebarProps) {
  const { data: projects } = useProjects();

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] px-5 py-5">
        <Link to="/dashboard" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-[var(--color-text)]">
          <span className="h-2.5 w-2.5 shrink-0 bg-[var(--color-accent)]" aria-hidden="true" />
          TYSONCLOUD
        </Link>
      </div>

      <div className="px-4 pt-4">
        <Link
          to="/dashboard"
          aria-current={!activeProjectId ? "page" : undefined}
          className={cn(
            "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-base transition-colors",
            !activeProjectId
              ? "bg-[var(--color-surface-2)] text-[var(--color-text)]"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]",
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          All projects
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between px-5">
        <span className="font-mono text-xs font-medium tracking-wider text-[var(--color-text-faint)] uppercase">
          Projects
        </span>
        <Link
          to="/dashboard/new"
          aria-label="New project"
          className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-accent)]"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      <nav className="mt-3 flex-1 space-y-0.5 overflow-y-auto px-4 pb-4">
        {projects?.map((project) => (
          <Link
            key={project.id}
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            aria-current={activeProjectId === project.id ? "page" : undefined}
            className={cn(
              "flex cursor-pointer items-center gap-2 truncate rounded-md px-3 py-2 font-mono text-base transition-colors",
              activeProjectId === project.id
                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]",
            )}
          >
            <span className="truncate">{project.name}</span>
          </Link>
        ))}
        {projects && projects.length === 0 && (
          <p className="px-3 py-2 text-sm text-[var(--color-text-faint)]">No projects yet.</p>
        )}
      </nav>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-4">
        <UserButton />
        <span className="font-mono text-xs text-[var(--color-text-faint)]">v0.1</span>
      </div>
    </aside>
  );
}
