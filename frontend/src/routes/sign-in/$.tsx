import { createFileRoute, Link } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";
import { safeRedirectTarget } from "@/lib/safe-redirect";

export const Route = createFileRoute("/sign-in/$")({
  component: SignInStepPage,
});

function SignInStepPage() {
  const { redirect } = Route.useSearch();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Link
        to="/"
        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
      >
        ← Back to home
      </Link>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl={safeRedirectTarget(redirect)}
      />
    </div>
  );
}
