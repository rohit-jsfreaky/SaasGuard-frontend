import { FEATURE_CARDS } from "./content";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-28 bg-muted/40 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <p className="text-sm font-semibold text-primary">API-first security</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Build least-privilege into every feature
          </h2>
          <p className="text-lg leading-8 text-muted-foreground">
            Pair your auth provider with policy decisions, audit trails, and guardrails that ship with your product—not after an incident.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {FEATURE_CARDS.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <dt className="text-lg font-semibold text-foreground">
                  {feature.title}
                </dt>
                <dd className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
