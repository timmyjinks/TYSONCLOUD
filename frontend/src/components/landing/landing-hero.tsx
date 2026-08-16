import { Link } from "@tanstack/react-router";

export function LandingHero() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,68,51,0.12),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_40%_at_80%_20%,rgba(255,68,51,0.06),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-28 text-center sm:px-6 lg:px-8 md:py-36">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-balance md:text-7xl">
          Ship a service, get{" "}
          <span className="text-[var(--color-accent)]">infrastructure that runs itself</span>
        </h1>
        <p className="mx-auto mb-12 mt-8 max-w-2xl text-xl text-[var(--color-text-muted)] md:text-2xl">
          Push a Docker image, get a running service, a domain, and a database if
          you need one. No dashboards to babysit — just infrastructure that does
          what you told it to.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/sign-up"
            className="rounded-md bg-[var(--color-accent)] px-7 py-3.5 text-lg font-medium text-white hover:bg-[var(--color-accent-hover)]"
          >
            Start deploying
          </Link>
          <Link
            to="/sign-in"
            className="rounded-md border border-[var(--color-border-strong)] px-7 py-3.5 text-lg font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-12 font-mono text-sm text-[var(--color-text-faint)]">
          Docker images · Managed Postgres · Volumes · *.tysoncloud.dev
        </p>
      </div>
    </div>
  );
}