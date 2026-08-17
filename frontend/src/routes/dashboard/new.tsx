import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCreateProject } from "@/lib/api/projects";
import { getErrorMessage } from "@/lib/api/client";
import { FormShell } from "@/components/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const [name, setName] = useState("");

  return (
    <FormShell
      backTo="/dashboard"
      backLabel="Back to dashboard"
      title="New project"
      description="Create a project to deploy services and databases into."
      onSubmit={(e) => {
        e.preventDefault();
        createProject.mutate({ name }, { onSuccess: () => navigate({ to: "/dashboard" }) });
      }}
      error={createProject.error ? getErrorMessage(createProject.error) : undefined}
      pending={createProject.isPending}
      submitLabel="Create project"
      pendingLabel="Creating…"
      cancelTo="/dashboard"
    >
      <div>
        <Label htmlFor="name">Project name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="my-app"
          className="mt-2"
        />
      </div>
    </FormShell>
  );
}