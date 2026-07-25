import { useCallback, useEffect, useRef, useState } from "react";
import { ingestLogChunk } from "./log-buffer";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const MAX_LINES = 5000;
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 15000;

export type LogStreamStatus = "connecting" | "open" | "closed" | "error";

function wsUrl(path: string) {
  const base = API_URL || window.location.origin;
  const url = new URL(path, base);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

export function useLogStream(projectId: string, serviceId: string, enabled: boolean) {
  const [lines, setLines] = useState<string[]>([]);
  const [dropped, setDropped] = useState(0);
  const [status, setStatus] = useState<LogStreamStatus>("connecting");
  const remainderRef = useRef("");
  const wsRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const stoppedRef = useRef(false);

  const clear = useCallback(() => {
    setLines([]);
    setDropped(0);
    remainderRef.current = "";
  }, []);

  useEffect(() => {
    if (!enabled || !serviceId) return;

    stoppedRef.current = false;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    async function connect() {
      setStatus("connecting");
      const url =
        wsUrl(`/projects/${projectId}/services/${serviceId}/logs`)
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        attemptRef.current = 0;
        setStatus("open");
      };

      ws.onmessage = (event) => {
        const chunk = typeof event.data === "string" ? event.data : "";
        if (!chunk) return;
        const { lines: newLines, remainder } = ingestLogChunk(remainderRef.current, chunk);
        remainderRef.current = remainder;
        if (newLines.length === 0) return;

        setLines((prev) => {
          const combined = prev.length ? [...prev, ...newLines] : newLines;
          if (combined.length > MAX_LINES) {
            const excess = combined.length - MAX_LINES;
            setDropped((d) => d + excess);
            return combined.slice(excess);
          }
          return combined;
        });
      };

      ws.onerror = () => setStatus("error");

      ws.onclose = () => {
        if (stoppedRef.current) return;
        setStatus("closed");
        const delay = Math.min(RECONNECT_BASE_MS * 2 ** attemptRef.current, RECONNECT_MAX_MS);
        attemptRef.current += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      stoppedRef.current = true;
      clearTimeout(reconnectTimer);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [projectId, serviceId, enabled]);

  return { lines, status, clear, firstLineNumber: dropped + 1 };
}
