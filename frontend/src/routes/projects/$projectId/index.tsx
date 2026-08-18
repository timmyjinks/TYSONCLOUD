import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Database as DatabaseIcon, FileCode, Pencil, Plus, Server, Trash2 } from "lucide-react";
import { useProject } from "@/lib/api/projects";
import { useDeleteService, useDeleteServices, useServices } from "@/lib/api/services";
import { useDatabases, useDeleteDatabase, useDeleteDatabases } from "@/lib/api/databases";
import { getErrorMessage } from "@/lib/api/client";
import { ResourceRow } from "@/components/resource-row";
import { ResourceStatusBar } from "@/components/resource-status-bar";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { BulkDeleteConfirmDialog } from "@/components/bulk-delete-confirm-dialog";
import { ErrorBanner } from "@/components/error-banner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SERVICE_RESOURCE_LIMITS } from "@/lib/resource-limits";
import { Checkbox } from "@/components/ui/checkbox";
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
  const deleteServices = useDeleteServices(projectId);
  const deleteDatabases = useDeleteDatabases(projectId);
  const [pendingService, setPendingService] = useState<Service | null>(null);
  const [pendingDatabase, setPendingDatabase] = useState<Database | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pendingBulk, setPendingBulk] = useState<Resource[] | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

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

  const allSelected = resources.length > 0 && selectedIds.size === resources.length;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? new Set() : new Set(resources.map((r) => r.data.id)));
  };

  const selectedResources = resources.filter((r) => selectedIds.has(r.data.id));
  const bulkPending = deleteServices.isPending || deleteDatabases.isPending;

  const onBulkConfirm = () => {
    if (!pendingBulk) return;
    const remaining = new Set(selectedIds);
    const serviceIds = pendingBulk
      .filter((r): r is Resource & { kind: "service" } => r.kind === "service")
      .map((r) => r.data.id);
    const databaseIds = pendingBulk
      .filter((r): r is Resource & { kind: "database" } => r.kind === "database")
      .map((r) => r.data.id);

    if (serviceIds.length > 0) {
      deleteServices.mutate(serviceIds, {
        onSuccess: (data) => {
          data.deleted.forEach((id) => remaining.delete(id));
          setSelectedIds(new Set(remaining));
          if (data.failed.length > 0) {
            setBulkError(
              `Couldn't delete ${data.failed.length} service${data.failed.length === 1 ? "" : "s"}.`,
            );
          } else if (remaining.size === 0) {
            setPendingBulk(null);
            setBulkError(null);
          }
        },
      });
    }

    if (databaseIds.length > 0) {
      deleteDatabases.mutate(databaseIds, {
        onSuccess: (data) => {
          data.deleted.forEach((id) => remaining.delete(id));
          setSelectedIds(new Set(remaining));
          if (data.failed.length > 0) {
            setBulkError(
              `Couldn't delete ${data.failed.length} database${data.failed.length === 1 ? "" : "s"}.`,
            );
          } else if (remaining.size === 0) {
            setPendingBulk(null);
            setBulkError(null);
          }
        },
      });
    }
  };

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
        <div className="flex items-center gap-3">
          {resources.length > 0 && (
            <Checkbox
              aria-label={allSelected ? "Deselect all resources" : "Select all resources"}
              checked={allSelected}
              onChange={toggleSelectAll}
            />
          )}
          <h2 className="text-lg font-medium text-[var(--color-text-muted)]">
            Resources{" "}
            <span className="text-[var(--color-text-faint)]">· {resources.length} total</span>
          </h2>
        </div>
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

      {selectedIds.size > 0 && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-md bg-[var(--color-surface-2)] px-5 py-3">
          <span className="font-mono text-sm text-[var(--color-text-muted)]">
            {selectedIds.size} selected
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setPendingBulk(selectedResources);
              setBulkError(null);
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete selected
          </Button>
        </div>
      )}

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
                  selected={selectedIds.has(resource.data.id)}
                  onToggleSelect={() => toggleSelect(resource.data.id)}
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
                  selected={selectedIds.has(resource.data.id)}
                  onToggleSelect={() => toggleSelect(resource.data.id)}
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

      <BulkDeleteConfirmDialog
        open={!!pendingBulk}
        onOpenChange={(open) => !open && setPendingBulk(null)}
        resourceNames={pendingBulk?.map((r) => r.data.name) ?? []}
        pending={bulkPending}
        error={bulkError}
        onConfirm={onBulkConfirm}
      />
    </main>
  );
}
