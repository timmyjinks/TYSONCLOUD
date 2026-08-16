import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";
import { AuthLayout } from "@/components/auth-layout";
import { safeRedirectTarget } from "@/lib/safe-redirect";

export const Route = createFileRoute("/sign-up/")({
  component: SignUpPage,
});

function SignUpPage() {
  const { redirect } = Route.useSearch();
  return (
    <AuthLayout backTo="/">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl={safeRedirectTarget(redirect)}
      />
    </AuthLayout>
  );
}