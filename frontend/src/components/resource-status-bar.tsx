type ResourceStatusBarProps = {
  serviceCount: number;
  databaseCount: number;
  runningCount: number;
  projectId: string;
};

export function ResourceStatusBar({
  serviceCount,
  databaseCount,
  runningCount,
  projectId,
}: ResourceStatusBarProps) {
  const notRunning = serviceCount - runningCount;

  return (
    <div className="mt-4 flex items-center gap-6 rounded-md bg-[var(--color-surface-2)] px-5 py-3 font-mono text-sm text-[var(--color-text-faint)]">
      <span className="flex shrink-0 items-center gap-6">
        <span>
          <span className="text-[var(--color-good)]">{runningCount}</span> running
        </span>
        {notRunning > 0 && (
          <span>
            <span className="text-[var(--color-warn)]">{notRunning}</span> deploying
          </span>
        )}
        <span>{databaseCount} database{databaseCount === 1 ? "" : "s"}</span>
      </span>
      <span className="min-w-0 flex-1 truncate text-right">{projectId}</span>
    </div>
  );
}