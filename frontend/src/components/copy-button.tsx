import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
  children?: ReactNode;
};

export function CopyButton({ value, label, className, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function copy() {
    const text = value.replace(/^[\r\n]+|[\r\n]+$/g, "");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.readOnly = true;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(textarea);
      }
    }
    setCopied(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
  }

  if (children !== undefined) {
    return (
      <button
        type="button"
        onClick={copy}
        aria-label={label ?? `Copy ${value}`}
        className={cn(
          "group/click flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-2.5 text-left font-mono text-base transition-colors hover:bg-[var(--color-surface-hover)]",
          className,
        )}
      >
        <span className="min-w-0 break-all">{children}</span>
        <span className="shrink-0 text-[var(--color-text-faint)] opacity-0 transition-opacity group-hover/click:opacity-100">
          {copied ? (
            <Check className="h-4 w-4 text-[var(--color-good)]" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ?? `Copy ${value}`}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-[var(--color-text-faint)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-good)]" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}