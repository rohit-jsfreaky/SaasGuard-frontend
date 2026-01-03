import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SplitText from "@/components/SplitText";
import ShinyText from "@/components/ShinyText";
import {
  HERO_HEADLINE,
  HERO_HEADLINE_ACCENT,
  HERO_DESCRIPTION,
  HERO_BULLETS,
} from "./content";

interface HeroSectionProps {
  isSignedIn: boolean | undefined;
}

export function HeroSection({ isSignedIn }: HeroSectionProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative px-4 pt-24 sm:pt-32 pb-16 lg:pb-24 overflow-hidden min-h-[90vh] flex items-center">
      <div className="mx-auto max-w-7xl w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 items-center">
          {/* Left content */}
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-6 lg:max-w-none">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-6 sm:space-y-8"
            >
              {/* Badge */}
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
              >
                <span className="mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                API-First Permission Engine
              </motion.div>

              {/* Headlines */}
              <motion.div variants={fadeIn} className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  <SplitText
                    text={HERO_HEADLINE}
                    className="inline-block"
                    delay={50}
                    from={{
                      opacity: 0,
                      y: 20,
                    }}
                    to={{ opacity: 1, y: 0 }}
                    ease="power3.out"
                    threshold={0.1}
                    textAlign="left"
                  />
                </h1>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                  <ShinyText
                    text={HERO_HEADLINE_ACCENT}
                    disabled={false}
                    speed={3}
                    className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-purple-500 to-blue-500"
                  />
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={fadeIn}
                className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                {HERO_DESCRIPTION}
              </motion.p>

              {/* Bullet points */}
              <motion.ul variants={fadeIn} className="space-y-3">
                {HERO_BULLETS.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTAs */}
              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base shadow-xl shadow-primary/20 group"
                >
                  <Link to={isSignedIn ? "/dashboard" : "/login"}>
                    {isSignedIn ? "Open Dashboard" : "Get Started Free"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm"
                >
                  <Link to="/docs">View API Docs</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right side - Product snapshot */}
          <div className="relative mt-16 lg:mt-0 lg:col-span-6 lg:h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="relative w-full max-w-2xl"
            >
              <div className="absolute -inset-x-6 -inset-y-8 bg-linear-to-br from-primary/15 via-sky-500/10 to-purple-500/15 blur-3xl" />

              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 backdrop-blur-xl shadow-2xl shadow-primary/15">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-linear-to-r from-background/80 via-primary/5 to-background/80">
                  <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Product Snapshot
                  </div>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1 text-xs font-medium">
                    In-app today
                  </span>
                </div>

                <div className="grid gap-4 p-6 lg:grid-cols-5">
                  <div className="lg:col-span-3 space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-inner">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>feature.access</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary font-medium">
                          org-scoped
                        </span>
                      </div>
                      <div className="mt-3 space-y-2 font-mono text-sm">
                        <div className="flex items-center justify-between rounded-lg bg-background/80 px-3 py-2">
                          <span className="text-muted-foreground">features.table</span>
                          <span className="text-emerald-500 font-semibold">uses orgId</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-background/80 px-3 py-2">
                          <span className="text-muted-foreground">permissions.fetch</span>
                          <span className="text-emerald-500 font-semibold">plan + role</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-background/80 px-3 py-2">
                          <span className="text-muted-foreground">overrides.tab</span>
                          <span className="text-amber-500 font-semibold">per user</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 flex items-center gap-3 shadow-inner">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">What’s built right now</p>
                        <p className="text-sm text-muted-foreground">
                          Clerk auth + protected routes, org switcher, plans & roles UI, overrides management, and permissions resolver.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <div className="rounded-2xl border border-border/60 bg-linear-to-b from-primary/10 via-background to-background p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Auth & org</p>
                      <p className="text-sm font-semibold text-foreground">Clerk sign-in + ProtectedRoute</p>
                      <p className="text-sm text-muted-foreground">Organization switcher with delete flow.</p>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Plans & roles</p>
                      <p className="text-sm font-semibold text-foreground">Plan + role assignment UI</p>
                      <p className="text-sm text-muted-foreground">Permissions API sends planId + orgId.</p>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Overrides & usage</p>
                      <p className="text-sm font-semibold text-foreground">Per-user overrides and usage limits view</p>
                      <p className="text-sm text-muted-foreground">Feature table gated by organization selection.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-125 bg-linear-to-b from-primary/5 via-primary/2 to-transparent" />
      </div>
    </section>
  );
}
