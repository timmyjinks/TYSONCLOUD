import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useService, useUpdateService } from "@/lib/api/services";
import { getErrorMessage } from "@/lib/api/client";
import { ErrorBanner } from "@/components/error-banner";
import { FormShell } from "@/components/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/projects/$projectId/services/$serviceId/edit")({
  component: EditServicePage,
});

function EditServicePage() {
  const { projectId, serviceId } = Route.useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, error, refetch } = useService(serviceId);
  const updateService = useUpdateService(projectId, serviceId);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [port, setPort] = useState("");
  const [env, setEnv] = useState("");

  useEffect(() => {
    if (!service) return;
    setName(service.name);
    setImage(service.image);
    setPort(String(service.port));
    setEnv(
      Object.entries(service.env ?? {})
        .map(([key, value]) => `${key}=${value}`)
        .join("\n"),
    );
  }, [service]);

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

  if (isLoading || !service) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-[var(--color-text-faint)]">loading service…</p>
      </main>
    );
  }

  return (
    <FormShell
      backTo="/projects/$projectId/services/$serviceId"
      backLabel="Back to service"
      title="Update service"
      onSubmit={(e) => {
        e.preventDefault();
        updateService.mutate(
          { name, image, port: Number(port), env },
          {
            onSuccess: () =>
              navigate({
                to: "/projects/$projectId/services/$serviceId",
                params: { projectId, serviceId },
              }),
          },
        );
      }}
      error={updateService.error ? getErrorMessage(updateService.error) : undefined}
      pending={updateService.isPending}
      submitLabel="Save changes"
      pendingLabel="Saving…"
      cancelTo="/projects/$projectId/services/$serviceId"
    >
      <div>
        <Label htmlFor="name">Service name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          One <code>KEY=value</code> pair per line. Saving replaces the full set of environment
          variables with what's shown here.
        </p>
      </div>
    </FormShell>
  );
}