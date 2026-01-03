import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import Aurora from "@/components/Aurora";
import AnimatedContent from "@/components/AnimatedContent";
import ShinyText from "@/components/ShinyText";
import { CTA_HEADLINE, CTA_SUBHEADLINE } from "./content";

export function CTASection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative isolate px-6 py-24 sm:py-32 lg:px-8 overflow-hidden">
      {/* Aurora background */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={["#3b82f6", "#8b5cf6", "#06b6d4"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-3xl text-center relative z-10">
        <AnimatedContent
          distance={40}
          direction="vertical"
          reverse={false}
          duration={0.8}
          threshold={0.2}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm px-4 py-1.5 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Free tier available
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            {CTA_HEADLINE}
            <br />
            <ShinyText
              text={CTA_SUBHEADLINE}
              disabled={false}
              speed={3}
              className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500"
            />
          </h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            No credit card required. REST endpoints and webhooks you can ship
            today. Start building in minutes.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {isSignedIn ? (
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base shadow-xl shadow-primary/25 group"
              >
                <Link to="/dashboard">
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base shadow-xl shadow-primary/25 group"
              >
                <Link to="/login">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm"
            >
              <Link to="/docs">View API Docs</Link>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Instant setup
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Cancel anytime
            </span>
          </motion.div>
        </AnimatedContent>
      </div>
    </section>
  );
}
