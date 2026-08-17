const steps = [
  {
    number: "01",
    title: "Create a project",
    description:
      "A project groups every service, database, and volume you deploy. Name it and go.",
  },
  {
    number: "02",
    title: "Add services and databases",
    description:
      "Pick a Docker image and a port, or provision Postgres. TYSONCLOUD does the rest.",
  },
  {
    number: "03",
    title: "Ship and scale",
    description:
      "Get a public domain with TLS, streaming logs, and storage you can grow as traffic grows.",
  },
];

export function LandingHowItWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <h2
        id="how-heading"
        className="text-center font-display text-4xl font-semibold tracking-tight"
      >
        Deploy in three steps
      </h2>
      <ol className="mt-14 space-y-8">
        {steps.map(({ number, title, description }) => (
          <li key={number} className="flex gap-6">
            <span className="shrink-0 font-mono text-base text-[var(--color-accent)]">
              {number}
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-2 text-lg text-[var(--color-text-muted)]">{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}