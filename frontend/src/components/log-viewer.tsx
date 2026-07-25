import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LogStreamStatus } from "@/lib/logs/use-log-stream";

type LogViewerProps = {
  lines: string[];
  status: LogStreamStatus;
  firstLineNumber: number;
  autoscroll: boolean;
  onAutoscrollChange: (value: boolean) => void;
  className?: string;
};

export function LogViewer({
  lines,
  status,
  firstLineNumber,
  autoscroll,
  onAutoscrollChange,
  className,
}: LogViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoscroll) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines, autoscroll]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 40;
    if (atBottom !== autoscroll) onAutoscrollChange(atBottom);
  }

  return (
    <div className={cn("relative flex min-h-0 flex-1 flex-col", className)}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto bg-[var(--color-bg)] px-4 py-3 font-mono text-xs leading-relaxed text-[var(--color-text-muted)]"
      >
        {lines.length === 0 ? (
          <p className="text-[var(--color-text-faint)]">
            {status === "connecting" ? "connecting to log stream…" : "no output yet"}
          </p>
        ) : (
          lines.map((line, i) => (
            <div key={firstLineNumber + i} className="whitespace-pre-wrap break-all">
              <span className="mr-3 select-none text-[var(--color-text-faint)]">
                {String(firstLineNumber + i).padStart(4, "0")}
              </span>
              {line || "\u00A0"}
            </div>
          ))
        )}
      </div>

      {!autoscroll && (
        <button
          onClick={() => onAutoscrollChange(true)}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-2)] px-3 py-1.5 text-xs font-mono text-[var(--color-text)] shadow-lg hover:bg-[var(--color-surface-hover)]"
        >
          <ArrowDown className="h-3 w-3" />
          Jump to latest
        </button>
      )}
    </div>
  );
}
