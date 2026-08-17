const faqs = [
  {
    question: "What is TYSONCLOUD?",
    answer:
      "TYSONCLOUD is a deploy platform. Push a Docker image and get a running service, a public domain with automatic TLS, and a managed Postgres database if you need one — no servers to babysit.",
  },
  {
    question: "How do I deploy a service?",
    answer:
      "Create a project, add a service with a Docker image and a port, optionally set environment variables, and TYSONCLOUD builds, runs, and exposes it on a tysoncloud.dev domain.",
  },
  {
    question: "What databases are supported?",
    answer:
      "Managed Postgres today. Each database gets an internal hostname and storage you can scale from the dashboard.",
  },
  {
    question: "Can I attach persistent storage?",
    answer:
      "Yes. Attach a volume to any service with a mount path and storage size, and it survives redeploys.",
  },
  {
    question: "How do I define infrastructure without clicking forms?",
    answer:
      "Use config as code: declare services, databases, and volumes in TOML and apply them to a project in one shot.",
  },
];

export function LandingFaq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8"
    >
      <h2
        id="faq-heading"
        className="text-center font-display text-4xl font-semibold tracking-tight"
      >
        Frequently asked questions
      </h2>
      <div className="mt-12">
        {faqs.map(({ question, answer }) => (
          <details key={question} className="group border-b border-[var(--color-border)] py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-base font-medium">
              {question}
            </summary>
            <p className="mt-3 text-base text-[var(--color-text-muted)]">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}