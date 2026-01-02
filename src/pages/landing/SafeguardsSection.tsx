import { REQUEST_FLOW, SAFEGUARDS } from "./content";

export function SafeguardsSection() {
  return (
    <section className="py-24 sm:py-28 border-y border-border/40 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-sm font-semibold text-primary">Safeguards that stick</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Put security in the critical path, not in a backlog
            </h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Every request goes through the same checks: policies, rate limits, and audit logging. No staged numbers—just the controls you wire into code.
            </p>
            <ul className="space-y-3 text-sm text-foreground">
              {SAFEGUARDS.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 px-3 py-3"
                >
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary"></span>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">{item.title}</div>
                    <p className="text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-foreground">Request path</div>
                <span className="text-xs text-muted-foreground">Consistent flow</span>
              </div>
              <div className="space-y-3 text-sm text-foreground">
                {REQUEST_FLOW.map((step, idx) => (
                  <div
                    key={step}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-background/70 px-3 py-2"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {step}
                    </span>
                    <span className="text-xs text-muted-foreground">Step {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
