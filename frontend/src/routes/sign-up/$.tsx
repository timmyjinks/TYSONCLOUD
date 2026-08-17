import { createFileRoute, Link } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";
import { safeRedirectTarget } from "@/lib/safe-redirect";

// Same reasoning as sign-in/$.tsx — catches Clerk's sub-steps under
// /sign-up/* (e.g. /sign-up/verify-email-address, /sign-up/continue).
export const Route = createFileRoute("/sign-up/$")({
  component: SignUpStepPage,
});

function SignUpStepPage() {
  const { redirect } = Route.useSearch();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <Link
        to="/"
        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
      >
        ← Back to home
      </Link>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl={safeRedirectTarget(redirect)}
      />
    </div>
  );
}