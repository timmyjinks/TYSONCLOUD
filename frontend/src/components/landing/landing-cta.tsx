import { Link } from "@tanstack/react-router";

export function LandingCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8"
    >
      <h2
        id="cta-heading"
        className="font-display text-5xl font-semibold tracking-tight"
      >
        Ready to ship?
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-text-muted)]">
        Spin up a project and deploy your first service in minutes — no servers
        to manage.
      </p>
      <div className="mt-12 flex justify-center gap-4">
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
    </section>
  );
}