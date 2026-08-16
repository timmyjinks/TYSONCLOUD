import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useDeleteService, useService } from "@/lib/api/services";
import { useAttachVolume, useDetachVolume, useVolume } from "@/lib/api/volumes";
import { getErrorMessage } from "@/lib/api/client";
import { StatusDot } from "@/components/status-dot";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ServiceLogsDrawer } from "@/components/service-logs-drawer";
import { ErrorBanner } from "@/components/error-banner";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/projects/$projectId/services/$serviceId/")({
  component: ServiceDetail,
});

function ServiceDetail() {
  const { projectId, serviceId } = Route.useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, error, refetch } = useService(serviceId);
  const {
    data: volume,
    error: volumeError,
    refetch: refetchVolume,
  } = useVolume(serviceId);
  const attachVolume = useAttachVolume(projectId, serviceId);
  const detachVolume = useDetachVolume(projectId, serviceId);
  const deleteService = useDeleteService(projectId);

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [mountPath, setMountPath] = useState("");
  const [storageGB, setStorageGB] = useState("5");
  const [logsOpen, setLogsOpen] = useState(false);

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-[var(--color-text-faint)]">loading service…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/projects/$projectId"
        params={{ projectId }}
        className="text-base text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
      >
        ← Back to project
      </Link>

      <div className="mt-5">
        <PageHeader title={service.name}>
          <div className="flex items-center gap-2">
            <StatusDot status={service.status} />
            <span className="text-base capitalize text-[var(--color-text-muted)]">
              {service.status}
            </span>
          </div>
        </PageHeader>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Service ID</p>
            <p className="mt-1.5 font-mono text-base">{service.id}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Public domain</p>
            <a
              href={`https://${service.public_domain}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 block font-mono text-base text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              {service.public_domain}
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Image</p>
            <p className="mt-1.5 font-mono text-base">{service.image}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Port</p>
            <p className="mt-1.5 font-mono text-base">{service.port}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-display text-xl font-semibold">Environment variables</h2>
        <Card>
          <CardContent className="pt-6">
            {Object.keys(service.env ?? {}).length > 0 ? (
              <dl className="space-y-2">
                {Object.entries(service.env).map(([key, value]) => (
                  <div key={key} className="break-all font-mono text-base">
                    <dt className="inline text-[var(--color-text)]">{key}</dt>
                    <dd className="inline text-[var(--color-text-faint)]">={value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-base text-[var(--color-text-faint)]">No environment variables set.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-display text-xl font-semibold">Volume</h2>
        <Card>
          <CardContent className="pt-6">
            {volumeError && (
              <ErrorBanner
                className="mb-3"
                message={getErrorMessage(volumeError)}
                onRetry={() => refetchVolume()}
                retryLabel="Retry"
              />
            )}
            {volume ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-base">{volume.mount_path}</p>
                  <p className="mt-1 text-base text-[var(--color-text-faint)]">
                    {volume.storage_gb} GB
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={detachVolume.isPending}
                  onClick={() => detachVolume.mutate()}
                >
                  {detachVolume.isPending ? "Detaching…" : "Detach"}
                </Button>
              </div>
            ) : (
              <>
                <form
                  className="flex flex-wrap items-end gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    attachVolume.mutate({ mount_path: mountPath, storage_gb: Number(storageGB) });
                  }}
                >
                  <div className="flex-1 min-w-[180px]">
                    <Label htmlFor="mount_path">Mount path</Label>
                    <Input
                      id="mount_path"
                      required
                      value={mountPath}
                      onChange={(e) => setMountPath(e.target.value)}
                      placeholder="/app/data"
                      className="mt-2 font-mono"
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor="storage_gb">Storage (GB)</Label>
                    <Input
                      id="storage_gb"
                      type="number"
                      required
                      value={storageGB}
                      onChange={(e) => setStorageGB(e.target.value)}
                      className="mt-2 font-mono"
                    />
                  </div>
                  <Button type="submit" size="sm" disabled={attachVolume.isPending}>
                    {attachVolume.isPending ? "Attaching…" : "Attach volume"}
                  </Button>
                </form>
                {attachVolume.error && (
                  <ErrorBanner className="mt-3" message={getErrorMessage(attachVolume.error)} />
                )}
              </>
            )}
            {detachVolume.error && (
              <ErrorBanner className="mt-3" message={getErrorMessage(detachVolume.error)} />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="flex gap-4">
        <Link
          to="/projects/$projectId/services/$serviceId/edit"
          params={{ projectId, serviceId }}
        >
          <Button>Update service</Button>
        </Link>
        <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
          Delete service
        </Button>
        <Button variant="outline" onClick={() => setLogsOpen(true)}>
          View logs
        </Button>
      </section>

      <DeleteConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        resourceName={service.name}
        resourceLabel="service"
        pending={deleteService.isPending}
        error={deleteService.error ? getErrorMessage(deleteService.error) : undefined}
        onConfirm={() =>
          deleteService.mutate(service.id, {
            onSuccess: () => navigate({ to: "/projects/$projectId", params: { projectId } }),
          })
        }
      />

      <ServiceLogsDrawer
        open={logsOpen}
        onOpenChange={setLogsOpen}
        projectId={projectId}
        serviceId={service.id}
        serviceName={service.name}
      />
    </main>
  );
}