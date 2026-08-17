import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCreateService } from "@/lib/api/services";
import { getErrorMessage } from "@/lib/api/client";
import { FormShell } from "@/components/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/projects/$projectId/services/new")({
  component: NewServicePage,
});

function NewServicePage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const createService = useCreateService(projectId);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [port, setPort] = useState("3000");
  const [env, setEnv] = useState("");

  return (
    <FormShell
      backTo="/projects/$projectId"
      backLabel="Back to project"
      title="New service"
      description="Deploy a container to this project."
      onSubmit={(e) => {
        e.preventDefault();
        createService.mutate(
          { name, image, port: Number(port), env },
          { onSuccess: () => navigate({ to: "/projects/$projectId", params: { projectId } }) },
        );
      }}
      error={createService.error ? getErrorMessage(createService.error) : undefined}
      pending={createService.isPending}
      submitLabel="Deploy service"
      pendingLabel="Deploying…"
      cancelTo="/projects/$projectId"
    >
      <div>
        <Label htmlFor="name">Service name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="web"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="image">Docker image</Label>
        <Input
          id="image"
          required
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="nginx:latest"
          className="mt-2 font-mono"
        />
      </div>

      <div>
        <Label htmlFor="port">Port</Label>
        <Input
          id="port"
          type="number"
          required
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="mt-2 font-mono"
        />
      </div>

      <div>
        <Label htmlFor="env">Environment variables</Label>
        <Textarea
          id="env"
          value={env}
          onChange={(e) => setEnv(e.target.value)}
          placeholder={"KEY=value\nANOTHER_KEY=value"}
          rows={5}
          className="mt-2"
        />
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          One <code>KEY=value</code> pair per line. Optional.
        </p>
      </div>
    </FormShell>
  );
}