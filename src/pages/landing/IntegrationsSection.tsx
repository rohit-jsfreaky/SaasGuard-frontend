import { INTEGRATIONS } from "./content";

export function IntegrationsSection() {
  return (
    <section className="border-t border-border/40 bg-muted/20 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-sm font-medium text-muted-foreground mb-4">
          Seamlessly integrates with your stack
        </p>
        <div className="flex flex-wrap gap-6 text-sm font-semibold text-foreground/80">
          {INTEGRATIONS.map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 rounded-full border border-border/50 bg-background px-3 py-2 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
