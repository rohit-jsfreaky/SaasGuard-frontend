import { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SplitText from "@/components/SplitText";
import ShinyText from "@/components/ShinyText";
import {
  HERO_HEADLINE,
  HERO_HEADLINE_ACCENT,
  HERO_DESCRIPTION,
  HERO_BULLETS,
} from "./content";

// Lazy load the 3D model to not block initial render
const ShieldModel = lazy(() =>
  import("./components/ShieldModel").then((m) => ({ default: m.ShieldModel }))
);
const ShieldModelFallback = lazy(() =>
  import("./components/ShieldModel").then((m) => ({
    default: m.ShieldModelFallback,
  }))
);

interface HeroSectionProps {
  isSignedIn: boolean | undefined;
}

export function HeroSection({ isSignedIn }: HeroSectionProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    const checkMotion = () =>
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );

    checkMobile();
    checkMotion();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll progress for 3D model rotation
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prefersReducedMotion]);

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

          {/* Right side - 3D Shield Model */}
          <div className="relative mt-16 lg:mt-0 lg:col-span-6 lg:h-150 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-full min-h-100 lg:min-h-150"
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  </div>
                }
              >
                {isMobile || prefersReducedMotion ? (
                  <ShieldModelFallback className="w-full h-full" />
                ) : (
                  <ShieldModel
                    scrollProgress={scrollProgress}
                    className="w-full h-full"
                  />
                )}
              </Suspense>
            </motion.div>

            {/* Decorative gradient blobs */}
            <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
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
