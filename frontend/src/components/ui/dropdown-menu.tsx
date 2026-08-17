import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type DropdownMenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
};

export function DropdownMenu({ trigger, children, align = "end", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <div onClick={() => setOpen((value) => !value)}>{trigger}</div>
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute z-50 mt-2 min-w-44 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-2xl",
            align === "end" ? "right-0" : "left-0",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

type DropdownMenuItemProps = {
  children: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  className?: string;
};

export function DropdownMenuItem({
  children,
  onClick,
  destructive,
  className,
}: DropdownMenuItemProps) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left font-mono text-sm transition-colors",
        destructive
          ? "text-[var(--color-bad)] hover:bg-[var(--color-bad-soft)]"
          : "text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
        className,
      )}
    >
      {children}
    </button>
  );
}
