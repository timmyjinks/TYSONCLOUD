import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";
import { AuthLayout } from "@/components/auth-layout";
import { safeRedirectTarget } from "@/lib/safe-redirect";

export const Route = createFileRoute("/sign-in/")({
  component: SignInPage,
});

function SignInPage() {
  const { redirect } = Route.useSearch();
  return (
    <AuthLayout backTo="/">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl={safeRedirectTarget(redirect)}
      />
    </AuthLayout>
  );
}