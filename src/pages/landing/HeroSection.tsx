import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { HERO_BULLETS, HERO_CODE_SNIPPET } from "./content";

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
    <section className="relative px-4 pt-20 sm:pt-4 pb-14 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:gap-y-16 items-center">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-5 lg:max-w-none lg:pt-4 flex flex-col justify-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-6 sm:space-y-8"
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
              >
                <span className="mr-2 flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                v2.0 is now live
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl max-w-xl leading-tight"
              >
                Secure your SaaS
                <br className="hidden sm:block" />
                infrastructure with{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600 dark:to-blue-400">
                  confidence
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xs sm:text-base leading-6 sm:leading-7 text-muted-foreground max-w-xl"
              >
                API-first access control with real-time decisions,
                policy-as-code, and audit-ready trails. Drop it between your
                auth provider and application logic.
              </motion.p>

              <motion.ul
                variants={fadeIn}
                className="grid grid-cols-1 gap-3 text-sm text-muted-foreground"
              >
                {HERO_BULLETS.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span className="leading-6 text-foreground">{item}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base shadow-xl shadow-primary/20"
                >
                  <Link to={isSignedIn ? "/dashboard" : "/login"}>
                    {isSignedIn ? "Open Dashboard" : "Sign in to build"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm"
                >
                  <Link to="/docs">View API docs</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Code Sample */}
          <div className="relative mt-12 lg:mt-0 lg:col-span-7 lg:h-full flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-160"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    API policy decision
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Deterministic
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                    Example request/response
                  </p>
                  <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                    <SyntaxHighlighter
                      language="http"
                      style={oneDark}
                      wrapLongLines
                      className="text-[11px] sm:text-xs"
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        lineHeight: "1.6",
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily:
                            "'Fira Code', 'JetBrains Mono', Consolas, monospace",
                        },
                      }}
                    >
                      {HERO_CODE_SNIPPET}
                    </SyntaxHighlighter>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-foreground">
                    <div className="rounded-lg border border-border/50 bg-background/60 p-3">
                      <p className="font-semibold">Policy-as-code</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        YAML/JSON policies synced via Git or API.
                      </p>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-background/60 p-3">
                      <p className="font-semibold">HTTP everywhere</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Call from edge, backend, or workers via HTTPS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
