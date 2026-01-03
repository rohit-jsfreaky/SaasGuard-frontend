import { motion } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";
import AnimatedContent from "@/components/AnimatedContent";
import GradientText from "@/components/GradientText";
import CountUp from "@/components/CountUp";
import { HOW_IT_WORKS_STEPS } from "./content";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 relative overflow-hidden bg-muted/30"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl translate-x-1/2" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Section header */}
        <AnimatedContent
          distance={40}
          direction="vertical"
          reverse={false}
          duration={0.8}
          threshold={0.2}
        >
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16 lg:mb-24">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-primary uppercase tracking-wider"
            >
              Getting started
            </motion.p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Up and running in{" "}
              <GradientText
                colors={["#3b82f6", "#8b5cf6", "#3b82f6"]}
                animationSpeed={3}
                showBorder={false}
              >
                <CountUp
                  from={0}
                  to={3}
                  separator=""
                  direction="up"
                  duration={1}
                  className="inline-block"
                />{" "}
                steps
              </GradientText>
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Integrate SaasGuard with your existing auth provider in minutes.
              No complex migrations, no vendor lock-in.
            </p>
          </div>
        </AnimatedContent>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/20 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative"
              >
                {/* Step card */}
                <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="mt-4 mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-purple-500/10 text-primary">
                    <step.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Code hint */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <code className="text-xs font-mono text-primary/80 bg-primary/5 px-2 py-1 rounded">
                      {step.step === 1 && "Dashboard → Features"}
                      {step.step === 2 && "GET /api/v1/permissions"}
                      {step.step === 3 && "POST /api/v1/usage/record"}
                    </code>
                  </div>
                </div>

                {/* Arrow to next step */}
                {index < HOW_IT_WORKS_STEPS.length - 1 && (
                  <>
                    {/* Mobile arrow (down) */}
                    <div className="lg:hidden flex justify-center my-6">
                      <ArrowDown className="h-8 w-8 text-primary/40 animate-bounce" />
                    </div>
                    {/* Desktop arrow (right) - positioned between cards */}
                    <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-primary/40" />
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground">
            Average integration time:{" "}
            <span className="font-semibold text-foreground">
              <CountUp
                from={0}
                to={15}
                separator=""
                direction="up"
                duration={1.5}
                className="inline-block"
              />{" "}
              minutes
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
