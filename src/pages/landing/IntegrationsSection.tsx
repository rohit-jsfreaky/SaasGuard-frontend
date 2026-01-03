import { motion } from "motion/react";
import { INTEGRATIONS } from "./content";

export function IntegrationsSection() {
  // Duplicate integrations for seamless loop
  const duplicatedIntegrations = [...INTEGRATIONS, ...INTEGRATIONS];

  return (
    <section className="border-t border-b border-border/40 bg-linear-to-b from-background to-muted/20 py-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-6">
        <p className="text-sm font-medium text-muted-foreground text-center">
          Seamlessly integrates with your stack
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Scrolling row */}
        <motion.div
          className="flex gap-6 py-4"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedIntegrations.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              className="shrink-0 group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm px-5 py-3 shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all duration-300">
                <span className="h-2 w-2 rounded-full bg-linear-to-r from-primary to-purple-500 group-hover:animate-pulse" />
                <span className="text-sm font-semibold text-foreground/90 whitespace-nowrap">
                  {item}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<10ms", label: "Response time" },
            { value: "SOC 2", label: "Compliant" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
