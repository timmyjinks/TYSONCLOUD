import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/error-banner";

type BulkDeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Names of the resources being deleted. */
  resourceNames: string[];
  resourceLabel?: string; // e.g. "resource", "service", "database"
  onConfirm: () => void;
  pending?: boolean;
  error?: string | null;
};

export function BulkDeleteConfirmDialog({
  open,
  onOpenChange,
  resourceNames,
  resourceLabel = "resource",
  onConfirm,
  pending,
  error,
}: BulkDeleteConfirmDialogProps) {
  const count = resourceNames.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <h3 className="font-display text-2xl font-semibold text-[var(--color-text)]">
          Delete {count} {resourceLabel}
          {count === 1 ? "" : "s"}
        </h3>
        <p className="mt-3 text-base text-[var(--color-text-muted)]">
          Are you sure you want to delete these {count} {resourceLabel}
          {count === 1 ? "" : "s"}? This can't be undone.
        </p>

        <ul className="mt-4 max-h-40 space-y-1 overflow-y-auto rounded-md bg-[var(--color-surface-2)] p-3">
          {resourceNames.map((name) => (
            <li key={name} className="truncate font-mono text-sm text-[var(--color-text)]">
              {name}
            </li>
          ))}
        </ul>

        {error && <ErrorBanner message={error} className="mt-4" />}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} disabled={pending}>
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}