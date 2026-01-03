import { motion } from "motion/react";
import AnimatedContent from "@/components/AnimatedContent";
import TiltedCard from "@/components/TiltedCard";
import GradientText from "@/components/GradientText";
import { REQUEST_FLOW, SAFEGUARDS } from "./content";

export function SafeguardsSection() {
  return (
    <section className="py-24 sm:py-32 border-y border-border/40 overflow-hidden bg-linear-to-b from-background via-muted/10 to-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 lg:items-center">
          {/* Left content */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatedContent
              distance={30}
              direction="horizontal"
              reverse={true}
              duration={0.8}
              threshold={0.2}
            >
              <div className="space-y-4">
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                  Safeguards that stick
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  Put security in the{" "}
                  <GradientText
                    colors={["#ef4444", "#f97316", "#ef4444"]}
                    animationSpeed={3}
                    showBorder={false}
                  >
                    critical path
                  </GradientText>
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Every request goes through the same checks: policies, rate
                  limits, and audit logging. No staged numbers—just the controls
                  you wire into code.
                </p>
              </div>
            </AnimatedContent>

            {/* Safeguards list */}
            <ul className="space-y-4 mt-8">
              {SAFEGUARDS.map((item, index) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm px-4 py-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <item.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right - Request flow visualization */}
          <div className="lg:col-span-6">
            <TiltedCard
              rotateAmplitude={8}
              scaleOnHover={1.02}
              showMagneticEffect={true}
              showTooltip={false}
              displayOverlayContent={false}
              className="w-full"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-primary/5 via-background to-purple-500/5 shadow-2xl p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold text-foreground">
                      Request path
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted/50">
                    Consistent flow
                  </span>
                </div>

                {/* Flow steps */}
                <div className="space-y-3">
                  {REQUEST_FLOW.map((step, idx) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/90 px-4 py-3 hover:border-primary/30 transition-colors">
                        <span className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {step}
                          </span>
                        </span>
                        <span className="text-xs text-green-500">✓</span>
                      </div>
                      {/* Connector line */}
                      {idx < REQUEST_FLOW.length - 1 && (
                        <div className="absolute left-5 top-full h-3 w-0.5 bg-linear-to-b from-primary/30 to-transparent" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total latency: &lt;10ms</span>
                    <span className="text-green-500 font-medium">
                      Request allowed
                    </span>
                  </div>
                </div>
              </div>
            </TiltedCard>
          </div>
        </div>
      </div>
    </section>
  );
}
