import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Database as DatabaseIcon, FileCode, Pencil, Plus, Server } from "lucide-react";
import { useProject } from "@/lib/api/projects";
import { useDeleteService, useServices } from "@/lib/api/services";
import { useDatabases, useDeleteDatabase } from "@/lib/api/databases";
import { getErrorMessage } from "@/lib/api/client";
import { ResourceRow } from "@/components/resource-row";
import { ResourceStatusBar } from "@/components/resource-status-bar";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ErrorBanner } from "@/components/error-banner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SERVICE_RESOURCE_LIMITS } from "@/lib/resource-limits";
import type { Service, Database } from "@/lib/api/types";

export const Route = createFileRoute("/projects/$projectId/")({
  component: ProjectDetail,
});

type Resource = { kind: "service"; data: Service } | { kind: "database"; data: Database };

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { data: project } = useProject(projectId);
  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
    refetch: refetchServices,
  } = useServices(projectId);
  const {
    data: databases,
    isLoading: databasesLoading,
    error: databasesError,
    refetch: refetchDatabases,
  } = useDatabases(projectId);

  const deleteService = useDeleteService(projectId);
  const deleteDatabase = useDeleteDatabase(projectId);
  const [pendingService, setPendingService] = useState<Service | null>(null);
  const [pendingDatabase, setPendingDatabase] = useState<Database | null>(null);

  const isLoading = servicesLoading || databasesLoading;

  const resources = useMemo<Resource[]>(() => {
    const items: Resource[] = [
      ...(services ?? []).map((s) => ({ kind: "service" as const, data: s })),
      ...(databases ?? []).map((d) => ({ kind: "database" as const, data: d })),
    ];
    return items.sort(
      (a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime(),
    );
  }, [services, databases]);

  const runningCount = (services ?? []).filter((s) => s.status === "running").length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader
        title={
          <span className="inline-flex items-center gap-3">
            {project?.name ?? projectId}
            <Link
              to="/projects/$projectId/edit"
              params={{ projectId }}
              aria-label="Rename project"
              className="text-[var(--color-text-faint)] transition-colors hover:text-[var(--color-accent)]"
            >
              <Pencil className="h-5 w-5" />
            </Link>
          </span>
        }
        description="Everything deployed in this project"
      >
        <Link to="/projects/$projectId/config" params={{ projectId }}>
          <Button variant="outline" size="sm">
            <FileCode className="h-4 w-4" />
            Config
          </Button>
        </Link>
      </PageHeader>

      <div className="mt-10 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-[var(--color-text-muted)]">
          Resources <span className="text-[var(--color-text-faint)]">· {resources.length} total</span>
        </h2>
        <div className="flex items-center gap-2">
          <Link to="/projects/$projectId/databases/new" params={{ projectId }}>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
              Database
            </Button>
          </Link>
          <Link to="/projects/$projectId/services/new" params={{ projectId }}>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Service
            </Button>
          </Link>
        </div>
      </div>

      {isLoading && (
        <p className="text-base text-[var(--color-text-faint)]">loading resources…</p>
      )}

      {servicesError && (
        <ErrorBanner
          className="mb-4"
          message={getErrorMessage(servicesError)}
          onRetry={() => refetchServices()}
          retryLabel="Retry"
        />
      )}

      {databasesError && (
        <ErrorBanner
          className="mb-4"
          message={getErrorMessage(databasesError)}
          onRetry={() => refetchDatabases()}
          retryLabel="Retry"
        />
      )}

      {!isLoading && resources.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--color-border-strong)] p-16 text-center text-base text-[var(--color-text-muted)]">
          Nothing deployed yet — spin up a service or provision a database to get started.
        </div>
      )}

      {resources.length > 0 && (
        <>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            {resources.map((resource) =>
              resource.kind === "service" ? (
                <ResourceRow
                  key={`svc-${resource.data.id}`}
                  icon={<Server className="h-5 w-5" />}
                  name={resource.data.name}
                  status={resource.data.status}
                  runtime={resource.data.image}
                  subtitle={`${SERVICE_RESOURCE_LIMITS.cpu} · ${SERVICE_RESOURCE_LIMITS.memory}`}
                  size={`:${resource.data.port}`}
                  domain={resource.data.public_domain}
                  domainHref={
                    resource.data.public_domain ? `https://${resource.data.public_domain}` : undefined
                  }
                  detailHref={`/projects/${projectId}/services/${resource.data.id}`}
                  onUpdate={() =>
                    navigate({
                      to: "/projects/$projectId/services/$serviceId/edit",
                      params: {
                        projectId,
                        serviceId: resource.data.id,
                      },
                    })
                  }
                  onDelete={() => setPendingService(resource.data)}
                />
              ) : (
                <ResourceRow
                  key={`db-${resource.data.id}`}
                  icon={<DatabaseIcon className="h-5 w-5" />}
                  name={resource.data.name}
                  runtime={resource.data.engine}
                  size={`${resource.data.storage} GB`}
                  domain={resource.data.internal_domain || "internal"}
                  detailHref={`/projects/${projectId}/databases/${resource.data.id}`}
                  onUpdate={() =>
                    navigate({
                      to: "/projects/$projectId/databases/$databaseId/edit",
                      params: {
                        projectId,
                        databaseId: resource.data.id,
                      },
                    })
                  }
                  onDelete={() => setPendingDatabase(resource.data)}
                />
              ),
            )}
          </div>

          <ResourceStatusBar
            serviceCount={services?.length ?? 0}
            databaseCount={databases?.length ?? 0}
            runningCount={runningCount}
            projectId={projectId}
          />
        </>
      )}

      <DeleteConfirmDialog
        open={!!pendingService}
        onOpenChange={(open) => !open && setPendingService(null)}
        resourceName={pendingService?.name ?? ""}
        resourceLabel="service"
        pending={deleteService.isPending}
        error={deleteService.error ? getErrorMessage(deleteService.error) : undefined}
        onConfirm={() => {
          if (!pendingService) return;
          deleteService.mutate(pendingService.id, {
            onSuccess: () => setPendingService(null),
          });
        }}
      />

      <DeleteConfirmDialog
        open={!!pendingDatabase}
        onOpenChange={(open) => !open && setPendingDatabase(null)}
        resourceName={pendingDatabase?.name ?? ""}
        resourceLabel="database"
        pending={deleteDatabase.isPending}
        error={deleteDatabase.error ? getErrorMessage(deleteDatabase.error) : undefined}
        onConfirm={() => {
          if (!pendingDatabase) return;
          deleteDatabase.mutate(pendingDatabase.id, {
            onSuccess: () => setPendingDatabase(null),
          });
        }}
      />
    </main>
  );
}
