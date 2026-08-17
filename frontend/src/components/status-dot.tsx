import { cn } from "@/lib/utils";

function classify(status: string): "good" | "bad" | "warn" {
  const normalized = status.toLowerCase();
  if (normalized === "running") return "good";
  if (normalized.includes("fail") || normalized.includes("error")) return "bad";
  return "warn";
}

export function StatusDot({ status, className }: { status: string; className?: string }) {
  const tone = classify(status);
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        tone === "good" && "bg-[var(--color-good)]",
        tone === "bad" && "bg-[var(--color-bad)]",
        tone === "warn" && "bg-[var(--color-warn)]",
        className,
      )}
      aria-hidden
    />
  );
}