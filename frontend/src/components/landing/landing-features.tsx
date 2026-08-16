import {
  Server,
  Database,
  HardDrive,
  Globe,
  KeyRound,
  FileCode,
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Services",
    description:
      "Push a Docker image with a port and optional env vars — TYSONCLOUD builds, runs, and exposes it on a tysoncloud.dev domain with automatic TLS.",
  },
  {
    icon: Database,
    title: "Managed databases",
    description:
      "Provision Postgres in a click. Every database gets an internal hostname and storage you can scale.",
  },
  {
    icon: HardDrive,
    title: "Persistent volumes",
    description:
      "Attach a volume to any service with a mount path and size. It survives redeploys.",
  },
  {
    icon: Globe,
    title: "Domains & TLS",
    description:
      "Every service gets a public domain with automatic certificates. No DNS panels to fight with.",
  },
  {
    icon: KeyRound,
    title: "Environment variables",
    description: "Set KEY=value pairs per service. No secrets in your repo.",
  },
  {
    icon: FileCode,
    title: "Config as code",
    description:
      "Declare services, databases, and volumes in TOML and apply them to a project in one shot.",
  },
];

export function LandingFeatures() {
  return (
    <section
      aria-labelledby="features-heading"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <h2
        id="features-heading"
        className="text-center font-display text-4xl font-semibold tracking-tight"
      >
        Everything you need to run software
      </h2>
      <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-[var(--color-text-muted)]">
        One place for your services, databases, volumes, domains, and secrets —
        no glue code, no click-ops.
      </p>
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-colors hover:border-[var(--color-border-strong)]"
          >
            <Icon className="h-6 w-6 text-[var(--color-accent)]" />
            <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-base text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}