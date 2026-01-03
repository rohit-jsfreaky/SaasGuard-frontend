import { motion } from "motion/react";
import SpotlightCard from "@/components/SpotlightCard";
import GradientText from "@/components/GradientText";
import AnimatedContent from "@/components/AnimatedContent";
import { FEATURE_CARDS } from "./content";

export function FeaturesSection() {
  // Bento grid layout - alternate between large and small cards
  const getBentoClass = (index: number) => {
    // Pattern: large, small, small, small, small, large
    const pattern = [
      "lg:col-span-2 lg:row-span-2", // large
      "lg:col-span-1 lg:row-span-1", // small
      "lg:col-span-1 lg:row-span-1", // small
      "lg:col-span-1 lg:row-span-1", // small
      "lg:col-span-1 lg:row-span-1", // small
      "lg:col-span-2 lg:row-span-1", // wide
    ];
    return pattern[index % pattern.length];
  };

  return (
    <section id="features" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] bg-size-[24px_24px] opacity-50" />
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Section header */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          reverse={false}
          duration={0.8}
          threshold={0.2}
        >
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16 lg:mb-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-primary uppercase tracking-wider"
            >
              API-first security
            </motion.p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Build least-privilege into{" "}
              <GradientText
                colors={["#3b82f6", "#8b5cf6", "#3b82f6"]}
                animationSpeed={3}
                showBorder={false}
              >
                every feature
              </GradientText>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Pair your auth provider with policy decisions, audit trails, and
              guardrails that ship with your product—not after an incident.
            </p>
          </div>
        </AnimatedContent>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[minmax(200px,auto)]">
          {FEATURE_CARDS.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`${getBentoClass(index)}`}
            >
              <SpotlightCard
                className="h-full w-full p-0!"
                spotlightColor="rgba(59, 130, 246, 0.20)"
              >
                <div className="h-full flex flex-col p-6 lg:p-8">
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 lg:mb-6">
                    <feature.icon
                      className="h-6 w-6"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed grow">
                    {feature.description}
                  </p>

                  {/* Feature badge for large cards */}
                  {(index === 0 || index === 5) && (
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Core feature</span>
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
