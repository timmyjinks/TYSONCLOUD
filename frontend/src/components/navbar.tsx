import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 bg-[var(--color-accent)]" aria-hidden="true" />
          <span className="font-display text-xl font-semibold tracking-tight text-[var(--color-text)]">
            TYSONCLOUD
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link
              to="/sign-in"
              className="text-base text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              Sign in
            </Link>
            <Link
              to="/sign-up"
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-base font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Get started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-base font-medium text-white hover:bg-[var(--color-accent-hover)]"
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}