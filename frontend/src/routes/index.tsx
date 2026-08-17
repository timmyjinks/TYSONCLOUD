import { createFileRoute, Link } from "@tanstack/react-router";
import { Database as DatabaseIcon, Server } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { TerminalStrip } from "@/components/terminal-strip";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingHowItWorks } from "@/components/landing/landing-how-it-works";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingCta } from "@/components/landing/landing-cta";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div>
      <Navbar />

      <main>
        <LandingHero />

        <section
          aria-labelledby="dashboard-heading"
          className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8"
        >
          <h2 id="dashboard-heading" className="sr-only">
            The TYSONCLOUD dashboard
          </h2>
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
            <TerminalStrip
              label="my-app · 2 resources"
              right={
                <span className="font-mono text-sm text-[var(--color-text-faint)]">
                  web-01.tysoncloud.dev
                </span>
              }
            />

            <div className="flex items-center gap-5 border-b border-[var(--color-border)] px-5 py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                <Server className="h-5 w-5" />
              </span>
              <span className="w-44 shrink-0 text-lg font-medium">svc-web-01</span>
              <span className="w-24 shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-good-soft)] px-3 py-1 text-sm font-medium text-[var(--color-good)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-good)]" />
                  Live
                </span>
              </span>
              <span className="flex-1 truncate font-mono text-base text-[var(--color-text-faint)]">
                nginx:latest
              </span>
              <span className="w-16 shrink-0 text-right font-mono text-base text-[var(--color-text-faint)]">
                :3000
              </span>
              <span className="w-52 shrink-0 truncate text-right font-mono text-base text-[var(--color-accent)]">
                web-01.tysoncloud.dev
              </span>
            </div>

            <div className="flex items-center gap-5 px-5 py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                <DatabaseIcon className="h-5 w-5" />
              </span>
              <span className="w-44 shrink-0 text-lg font-medium">db-postgres-01</span>
              <span className="w-24 shrink-0" />
              <span className="flex-1 truncate font-mono text-base text-[var(--color-text-faint)]">
                postgres 16
              </span>
              <span className="w-16 shrink-0 text-right font-mono text-base text-[var(--color-text-faint)]">
                12 GB
              </span>
              <span className="w-52 shrink-0 truncate text-right font-mono text-base text-[var(--color-text-faint)]">
                internal
              </span>
            </div>
          </div>
        </section>

        <LandingFeatures />
        <LandingHowItWorks />
        <LandingFaq />
        <LandingCta />
      </main>

      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 bg-[var(--color-accent)]" aria-hidden="true" />
                <span className="font-display text-xl font-semibold tracking-tight text-[var(--color-text)]">
                  TYSONCLOUD
                </span>
              </div>
              <p className="mt-3 max-w-xs text-base text-[var(--color-text-muted)]">
                Ship a service, get infrastructure that runs itself.
              </p>
            </div>
            <nav aria-label="Product">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)]">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/"
                    hash="features-heading"
                    className="text-base text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sign-in"
                    className="text-base text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sign-up"
                    className="text-base text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    Get started
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Platform">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)]">
                Platform
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-base text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/new"
                    className="text-base text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                  >
                    New project
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mt-12 border-t border-[var(--color-border)] pt-6">
            <p className="text-sm text-[var(--color-text-faint)]">
              © 2026 TYSONCLOUD, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}