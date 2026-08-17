import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useApplyProjectConfig } from "@/lib/api/project-config";
import { serviceKeys } from "@/lib/api/services";
import { databaseKeys } from "@/lib/api/databases";
import { ApiRequestError, getErrorMessage } from "@/lib/api/client";
import { FormShell } from "@/components/form-shell";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/projects/$projectId/config")({
  component: ProjectConfigPage,
});

const EXAMPLE_TOML = `[[services]]
name = "web"
image = "myorg/web:latest"
port = 3000

  [services.volume]
  mount_path = "/data"
  storage_gb = 10

[[services]]
name = "worker"
image = "myorg/worker:latest"
port = 8080

[[databases]]
name = "primary"
engine = "postgres"
storage_gb = 20
`;

function ProjectConfigPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const applyConfig = useApplyProjectConfig(projectId);

  const [content, setContent] = useState("");

  const issues =
    applyConfig.error instanceof ApiRequestError ? applyConfig.error.body?.issues : undefined;

  return (
    <FormShell
      backTo="/projects/$projectId"
      backLabel="Back to project"
      title="Apply config"
      description="Define services, databases, and volumes as TOML and apply them in one shot. This creates resources — it's a one-time action, not a saved file."
      onSubmit={(e) => {
        e.preventDefault();
        applyConfig.mutate(
          { content },
          {
            onSuccess: () => {
              qc.invalidateQueries({ queryKey: serviceKeys.byProject(projectId) });
              qc.invalidateQueries({ queryKey: databaseKeys.byProject(projectId) });
              navigate({ to: "/projects/$projectId", params: { projectId } });
            },
          },
        );
      }}
      error={applyConfig.error ? getErrorMessage(applyConfig.error) : undefined}
      errorIssues={issues}
      pending={applyConfig.isPending}
      submitLabel="Apply config"
      pendingLabel="Applying…"
      cancelTo="/projects/$projectId"
    >
      <Textarea
        id="config"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        spellCheck={false}
        rows={24}
        placeholder={EXAMPLE_TOML}
        className="text-sm leading-relaxed font-mono"
      />
    </FormShell>
  );
}