import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useProject, useUpdateProject } from "@/lib/api/projects";
import { getErrorMessage } from "@/lib/api/client";
import { ErrorBanner } from "@/components/error-banner";
import { FormShell } from "@/components/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/projects/$projectId/edit")({
  component: EditProjectPage,
});

function EditProjectPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error, refetch } = useProject(projectId);
  const updateProject = useUpdateProject(projectId);

  const [name, setName] = useState("");

  useEffect(() => {
    if (!project) return;
    setName(project.name);
  }, [project]);

  if (error) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
        <ErrorBanner
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
          retryLabel="Retry"
        />
      </main>
    );
  }

  if (isLoading || !project) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-[var(--color-text-faint)]">loading project…</p>
      </main>
    );
  }

  return (
    <FormShell
      backTo="/projects/$projectId"
      backLabel="Back to project"
      title="Rename project"
      onSubmit={(e) => {
        e.preventDefault();
        updateProject.mutate(
          { name },
          {
            onSuccess: () =>
              navigate({ to: "/projects/$projectId", params: { projectId } }),
          },
        );
      }}
      error={updateProject.error ? getErrorMessage(updateProject.error) : undefined}
      pending={updateProject.isPending}
      submitLabel="Save changes"
      pendingLabel="Saving…"
      cancelTo="/projects/$projectId"
    >
      <div>
        <Label htmlFor="name">Project name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2"
        />
      </div>
    </FormShell>
  );
}