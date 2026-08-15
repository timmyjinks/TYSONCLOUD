import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/error-banner";

type DeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceName: string;
  resourceLabel?: string; // e.g. "project", "service", "database"
  onConfirm: () => void;
  pending?: boolean;
  error?: string | null;
};

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  resourceName,
  resourceLabel = "resource",
  onConfirm,
  pending,
  error,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          Delete {resourceLabel}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Are you sure you want to delete{" "}
          <span className="font-mono font-semibold text-[var(--color-text)]">
            {resourceName}
          </span>
          ? This can't be undone.
        </p>

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
