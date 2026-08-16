import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCreateDatabase } from "@/lib/api/databases";
import { getErrorMessage } from "@/lib/api/client";
import { FormShell } from "@/components/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const Route = createFileRoute("/projects/$projectId/databases/new")({
  component: NewDatabasePage,
});

function NewDatabasePage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const createDatabase = useCreateDatabase(projectId);

  const [name, setName] = useState("");
  const [engine, setEngine] = useState("postgres");
  const [storageGB, setStorageGB] = useState("5");

  return (
    <FormShell
      backTo="/projects/$projectId"
      backLabel="Back to project"
      title="New database"
      description="Provision a managed database for this project."
      onSubmit={(e) => {
        e.preventDefault();
        createDatabase.mutate(
          { name, engine, storage_gb: Number(storageGB) },
          { onSuccess: () => navigate({ to: "/projects/$projectId", params: { projectId } }) },
        );
      }}
      error={createDatabase.error ? getErrorMessage(createDatabase.error) : undefined}
      pending={createDatabase.isPending}
      submitLabel="Create database"
      pendingLabel="Provisioning…"
      cancelTo="/projects/$projectId"
    >
      <div>
        <Label htmlFor="name">Database name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="primary"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="engine">Engine</Label>
        <Select id="engine" value={engine} onChange={(e) => setEngine(e.target.value)} className="mt-2">
          <option value="postgres">Postgres</option>
        </Select>
      </div>

      <div>
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
    </FormShell>
  );
}