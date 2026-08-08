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
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
      routerPush={(to) => router.navigate({ to: to as any, replace: false })}
      routerReplace={(to) => router.navigate({ to: to as any, replace: true })}
      appearance={{
        variables: {
          colorPrimary: "#ff4433",
          colorBackground: "#111214",
          colorInputBackground: "#17181b",
          colorInputText: "#f3f3f5",
          colorText: "#f3f3f5",
          colorTextSecondary: "#9a9aa4",
          colorDanger: "#ff4433",
          colorSuccess: "#35d68a",
          colorWarning: "#f2a93b",
          borderRadius: "0.375rem",
          fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif",
        },
        elements: {
          badge: {
            backgroundColor: "#17181b",
            color: "#9a9aa4",
            border: "1px solid #232428",
          },
          userButtonPopoverCard: {
            backgroundColor: "#111214",
            border: "1px solid #232428",
          },
          userButtonPopoverActionButton: {
            color: "#f3f3f5",
            "&:hover": {
              backgroundColor: "#1c1d21",
              color: "#f3f3f5",
            },
            "&:focus": {
              color: "#f3f3f5",
            },
          },
          userButtonPopoverActionButtonText: {
            color: "#f3f3f5",
            "&:hover": {
              color: "#f3f3f5",
            },
          },
          userButtonPopoverActionButtonIcon: {
            color: "#9a9aa4",
            "&:hover": {
              color: "#9a9aa4",
            },
          },
          userButtonPopoverFooter: {
            backgroundColor: "#17181b",
          },
          userButtonTrigger: {
            "&:hover": {
              backgroundColor: "#1c1d21",
            },
            "&:focus": {
              boxShadow: "none",
            },
          },
          formFieldInputShowPasswordButton: {
            color: "#9a9aa4",
            "&:hover": {
              backgroundColor: "#1c1d21",
              color: "#f3f3f5",
            },
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
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
