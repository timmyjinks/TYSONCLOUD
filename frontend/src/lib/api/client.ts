import type { ApiError } from "./types";

declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

// window.__ENV__ is written by env.js at container start (see Dockerfile
// CMD) from the pod's actual env — e.g. a k8s secret. import.meta.env is
// baked in at build time, so it's only used as a fallback for local dev
// (`pnpm dev`), where there's no container writing env.js.
const API_URL = window.__ENV__?.VITE_API_URL ?? import.meta.env.VITE_API_URL ?? "";

/**
 * Reads the Clerk session token off the global `window.Clerk` instance.
 * Works both inside React components and inside TanStack Router's
 * beforeLoad/loader, which run outside the React tree and can't call
 * useAuth().
 */
async function getToken(): Promise<string | null> {
  const clerk = (window as any).Clerk;
  if (!clerk?.session) return null;
  return clerk.session.getToken();
}

export class ApiRequestError extends Error {
  status: number;
  body: ApiError | null;

  constructor(status: number, body: ApiError | null, message: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    let body: ApiError | null = null;
    try {
      body = await res.json();
    } catch {
      // response wasn't JSON — leave body null
    }
    throw new ApiRequestError(
      res.status,
      body,
      body?.error ?? body?.message ?? `Request failed (${res.status})`,
    );
  }

  // Several endpoints (CreateService, CreateProject, CreateDatabase, CreateVolume,
  // and the Update* handlers) return a success status with no response body at all —
  // not just 204. Read as text first so an empty body never hits JSON.parse.
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
