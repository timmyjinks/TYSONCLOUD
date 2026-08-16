import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useDatabase, useDeleteDatabase } from "@/lib/api/databases";
import { getErrorMessage } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ErrorBanner } from "@/components/error-banner";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/projects/$projectId/databases/$databaseId/")({
  component: DatabaseDetail,
});

function DatabaseDetail() {
  const { projectId, databaseId } = Route.useParams();
  const navigate = useNavigate();
  const { data: database, isLoading, error, refetch } = useDatabase(databaseId);
  const deleteDatabase = useDeleteDatabase(projectId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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

  if (isLoading || !database) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-base text-[var(--color-text-faint)]">loading database…</p>
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
        <PageHeader title={database.name} />
      </div>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Database ID</p>
            <p className="mt-1.5 font-mono text-base">{database.id}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Engine</p>
            <p className="mt-1.5 font-mono text-base capitalize">{database.engine}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Internal host</p>
            <p className="mt-1.5 font-mono text-base">{database.internal_domain}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Port</p>
            <p className="mt-1.5 font-mono text-base">{database.port}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-base text-[var(--color-text-faint)]">Storage</p>
            <p className="mt-1.5 font-mono text-base">{database.storage} GB</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 font-display text-xl font-semibold">Environment variables</h2>
        <Card>
          <CardContent className="pt-6">
            {Object.keys(database.env ?? {}).length > 0 ? (
              <dl className="space-y-2">
                {Object.entries(database.env).map(([key, value]) => (
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

      <section className="flex gap-4">
        <Link
          to="/projects/$projectId/databases/$databaseId/edit"
          params={{ projectId, databaseId }}
        >
          <Button>Update database</Button>
        </Link>
        <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
          Delete database
        </Button>
      </section>

      <DeleteConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        resourceName={database.name}
        resourceLabel="database"
        pending={deleteDatabase.isPending}
        error={deleteDatabase.error ? getErrorMessage(deleteDatabase.error) : undefined}
        onConfirm={() =>
          deleteDatabase.mutate(database.id, {
            onSuccess: () => navigate({ to: "/projects/$projectId", params: { projectId } }),
          })
        }
      />
    </main>
  );
}