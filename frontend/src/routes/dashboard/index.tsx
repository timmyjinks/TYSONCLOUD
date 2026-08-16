import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useDeleteProject, useProjects } from "@/lib/api/projects";
import { getErrorMessage } from "@/lib/api/client";
import { ProjectRow } from "@/components/project-row";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ErrorBanner } from "@/components/error-banner";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: projects, isLoading, error, refetch } = useProjects();
  const deleteProject = useDeleteProject();
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Projects</h1>
          <p className="mt-2 text-lg text-[var(--color-text-muted)]">
            Everything you're running on TYSONCLOUD
          </p>
        </div>
        <Link to="/dashboard/new" className="shrink-0">
          <Button>New project</Button>
        </Link>
      </div>

      {isLoading && (
        <p className="text-base text-[var(--color-text-faint)]">loading projects…</p>
      )}

      {error && (
        <ErrorBanner
          className="mb-4"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
          retryLabel="Retry"
        />
      )}

      {projects && projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--color-border-strong)] p-16 text-center">
          <p className="text-lg text-[var(--color-text-muted)]">No projects yet.</p>
          <Link
            to="/dashboard/new"
            className="mt-3 inline-block text-base font-mono text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            create your first one
          </Link>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              name={project.name}
              id={project.id}
              href={`/projects/${project.id}`}
              onDelete={() => setPendingDelete(project)}
            />
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        resourceName={pendingDelete?.name ?? ""}
        resourceLabel="project"
        pending={deleteProject.isPending}
        error={deleteProject.error ? getErrorMessage(deleteProject.error) : undefined}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteProject.mutate(pendingDelete.id, {
            onSuccess: () => setPendingDelete(null),
          });
        }}
      />
    </main>
  );
}
