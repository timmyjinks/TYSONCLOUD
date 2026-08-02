import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider, ClerkLoaded, ClerkLoading, useAuth } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./app.css";

declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

const PUBLISHABLE_KEY =
  window.__ENV__?.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY — copy .env.example to .env.local");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const router = createRouter({
  routeTree,
  context: { auth: undefined! }, // populated by InnerApp below, once Clerk has loaded
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function FullPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <p className="font-mono text-sm text-[var(--color-text-faint)]">loading…</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
      routerPush={(to) => router.navigate({ to: to as any, replace: false })}
      routerReplace={(to) => router.navigate({ to: to as any, replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        {/*
        */}
        <ClerkLoading>
          <FullPageLoading />
        </ClerkLoading>
        <ClerkLoaded>
          <InnerApp />
        </ClerkLoaded>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
